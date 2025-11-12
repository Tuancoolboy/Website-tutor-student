/**
 * Hook realtime cho chat sử dụng Socket.IO.
 * Giữ tên useLongPolling để tương thích với code cũ.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL, WEBSOCKET_URL } from '../env';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  read: boolean;
  createdAt: string;
}

interface UseLongPollingOptions {
  conversationId: string | null;
  enabled?: boolean;
  onMessage?: (message: Message) => void;
  onError?: (error: Error) => void;
}

const buildApiUrl = (path: string) => {
  if (typeof window === 'undefined') {
    return path;
  }

  const baseUrl = API_BASE_URL.startsWith('http')
    ? API_BASE_URL
    : `${window.location.origin}${API_BASE_URL}`;

  return `${baseUrl}${path}`;
};

const normaliseError = (error: unknown) => {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === 'string') {
    return new Error(error);
  }
  if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
    return new Error((error as any).message);
  }
  return new Error('Socket error');
};

export function useLongPolling({
  conversationId,
  enabled = true,
  onMessage,
  onError
}: UseLongPollingOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPolling, setIsPolling] = useState(false); // dùng làm trạng thái tải lịch sử
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const currentConversationRef = useRef<string | null>(null);
  const previousConversationRef = useRef<string | null>(null);
  const historyAbortControllerRef = useRef<AbortController | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const handleNewMessage = useCallback((message: Message) => {
    if (message.conversationId !== currentConversationRef.current) {
      return;
    }

    lastMessageIdRef.current = message.id;

    setMessages(prev => {
      // Kiểm tra xem đã có tin nhắn này chưa (theo ID hoặc content + time)
      const existingIndex = prev.findIndex(existing => 
        existing.id === message.id || 
        (existing.id.startsWith('temp_') && 
         existing.content === message.content && 
         Math.abs(new Date(existing.createdAt).getTime() - new Date(message.createdAt).getTime()) < 5000)
      );

      if (existingIndex >= 0) {
        // Thay thế optimistic message bằng tin nhắn thật
        const updated = [...prev];
        updated[existingIndex] = message;
        updated.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return updated;
      }

      // Thêm tin nhắn mới
      const updated = [...prev, message];
      updated.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return updated;
    });

    onMessageRef.current?.(message);
  }, []);

  useEffect(() => {
    if (!enabled) {
      disconnectSocket();
      setIsConnected(false);
      return;
    }

    if (socketRef.current) {
      // đã kết nối
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const token = window.localStorage.getItem('token');
    if (!token) {
      console.warn('[useLongPolling] Không tìm thấy token -> không kết nối Socket.IO');
      return;
    }

    const socket = io(WEBSOCKET_URL, {
      transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: false
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      if (currentConversationRef.current) {
        socket.emit('join-room', currentConversationRef.current);
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      const normalised = normaliseError(err);
      console.error('[useLongPolling] Socket connect error:', normalised);
      console.error('[useLongPolling] Error details:', {
        message: err.message,
        ...(err as any).type && { type: (err as any).type },
        ...(err as any).description && { description: (err as any).description }
      });
      
      // Nếu lỗi authentication, thử refresh token
      if (err.message?.includes('Authentication failed') || err.message?.includes('invalid signature')) {
        console.warn('[useLongPolling] JWT authentication failed - token có thể không khớp với JWT_SECRET trên server');
        console.warn('[useLongPolling] Đảm bảo JWT_SECRET trên Railway giống với JWT_SECRET trên Vercel/API server');
      }
      
      setIsConnected(false);
      onErrorRef.current?.(normalised);
    });

    socket.on('error', (err) => {
      const normalised = normaliseError(err);
      console.error('[useLongPolling] Socket error:', normalised);
      onErrorRef.current?.(normalised);
    });

    socket.on('new-message', handleNewMessage);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('error');
      socket.off('new-message', handleNewMessage);
      disconnectSocket();
    };
  }, [disconnectSocket, enabled, handleNewMessage]);

  // Polling function để check tin nhắn mới (fallback khi socket.io không hoạt động)
  const pollNewMessages = useCallback(async () => {
    if (!conversationId || !lastMessageIdRef.current) {
      return;
    }

    if (socketRef.current?.connected) {
      // Nếu socket.io đã kết nối, không cần polling
      return;
    }

    try {
      const token = typeof window !== 'undefined'
        ? window.localStorage.getItem('token')
        : null;

      if (!token) {
        return;
      }

      // Lấy tất cả tin nhắn và filter tin nhắn mới
      const url = buildApiUrl(`/conversations/${conversationId}/messages?page=1&limit=100`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const allMessages: Message[] = Array.isArray(data?.data) ? data.data : [];

      if (allMessages.length > 0) {
        // Tìm tin nhắn mới hơn lastMessageId
        const lastMessageIndex = allMessages.findIndex(msg => msg.id === lastMessageIdRef.current);
        const newMessages = lastMessageIndex >= 0 
          ? allMessages.slice(lastMessageIndex + 1)
          : allMessages.filter(msg => {
              if (!lastMessageIdRef.current) return true;
              // So sánh theo thời gian nếu không tìm thấy ID
              return new Date(msg.createdAt).getTime() > Date.now() - 10000; // Tin nhắn trong 10 giây gần đây
            });

        if (newMessages.length > 0) {
          newMessages.forEach(msg => {
            handleNewMessage(msg);
          });
          // Cập nhật lastMessageId
          const sorted = [...allMessages].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          if (sorted.length > 0) {
            lastMessageIdRef.current = sorted[sorted.length - 1].id;
          }
        }
      }
    } catch (error) {
      // Silent fail cho polling - không log error để tránh spam
    }
  }, [conversationId, handleNewMessage]);

  const loadHistory = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      lastMessageIdRef.current = null;
      return;
    }

    if (historyAbortControllerRef.current) {
      historyAbortControllerRef.current.abort();
    }

    const controller = new AbortController();
    historyAbortControllerRef.current = controller;

    try {
      setIsPolling(true);

      const token = typeof window !== 'undefined'
        ? window.localStorage.getItem('token')
        : null;

      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const url = buildApiUrl(`/conversations/${conversationId}/messages?page=1&limit=100`);
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Không thể tải lịch sử tin nhắn (${response.status}): ${errorText || response.statusText}`
        );
      }

      const data = await response.json();
      const messagesData: Message[] = Array.isArray(data?.data) ? data.data : [];

      const sorted = messagesData
        .filter(Boolean)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      setMessages(sorted);
      if (sorted.length > 0) {
        lastMessageIdRef.current = sorted[sorted.length - 1].id;
      } else {
        lastMessageIdRef.current = null;
      }
    } catch (error) {
      // Không log error nếu là AbortError (bình thường khi conversationId thay đổi)
      if (error instanceof Error && error.name === 'AbortError') {
        // Abort là behavior bình thường, không cần log
        return;
      }
      
      const normalised = normaliseError(error);
      console.error('[useLongPolling] Load history error:', normalised);
      onErrorRef.current?.(normalised);
      setMessages([]);
      lastMessageIdRef.current = null;
    } finally {
      setIsPolling(false);
      historyAbortControllerRef.current = null;
    }
  }, [conversationId]);

  // Polling fallback khi socket.io không kết nối được
  useEffect(() => {
    if (!enabled || !conversationId) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Nếu socket.io đã kết nối, không cần polling
    if (socketRef.current?.connected) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Bắt đầu polling mỗi 2 giây khi socket.io không kết nối được
    if (!pollingIntervalRef.current) {
      pollingIntervalRef.current = setInterval(() => {
        void pollNewMessages();
      }, 2000); // Poll mỗi 2 giây để real-time như Facebook
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [enabled, conversationId, isConnected, pollNewMessages]);

  useEffect(() => {
    currentConversationRef.current = conversationId;

    if (!enabled) {
      setMessages([]);
      lastMessageIdRef.current = null;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    if (!conversationId) {
      if (previousConversationRef.current && socketRef.current?.connected) {
        socketRef.current.emit('leave-room', previousConversationRef.current);
      }
      previousConversationRef.current = null;
      setMessages([]);
      lastMessageIdRef.current = null;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    void loadHistory();

    if (socketRef.current?.connected) {
      if (previousConversationRef.current && previousConversationRef.current !== conversationId) {
        socketRef.current.emit('leave-room', previousConversationRef.current);
      }
      socketRef.current.emit('join-room', conversationId);
    }

    previousConversationRef.current = conversationId;

    return () => {
      if (socketRef.current?.connected && conversationId) {
        socketRef.current.emit('leave-room', conversationId);
      }
    };
  }, [conversationId, enabled, loadHistory]);

  const sendMessage = useCallback(async (
    content: string,
    type: 'text' | 'file' | 'image' = 'text',
    fileUrl?: string
  ) => {
    if (!conversationId) {
      throw new Error('Chưa chọn cuộc trò chuyện');
    }

    const trimmed = content?.trim();
    if (!trimmed) {
      throw new Error('Nội dung tin nhắn không được để trống');
    }

    const token = typeof window !== 'undefined'
      ? window.localStorage.getItem('token')
      : null;

    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }

    // Decode token để lấy userId
    let userId: string | null = null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.userId;
    } catch (e) {
      console.error('[useLongPolling] Cannot decode token:', e);
    }

    const payload = {
      conversationId,
      content: trimmed,
      type,
      fileUrl
    };

    // Optimistic update: Hiển thị tin nhắn ngay lập tức
    const optimisticMessage: Message = {
      id: `temp_${Date.now()}_${Math.random()}`,
      conversationId,
      senderId: userId || 'unknown',
      receiverId: '', // Sẽ được cập nhật khi nhận từ server
      content: trimmed,
      type,
      fileUrl,
      read: false,
      createdAt: new Date().toISOString()
    };

    // Thêm tin nhắn optimistic vào UI ngay lập tức (TRƯỚC KHI gửi)
    // Đảm bảo tin nhắn hiển thị ngay, không đợi server
    setMessages(prev => {
      // Kiểm tra xem đã có tin nhắn này chưa
      if (prev.some(existing => existing.id === optimisticMessage.id)) {
        return prev;
      }
      const updated = [...prev, optimisticMessage];
      updated.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return updated;
    });
    
    // Trigger callback để UI cập nhật ngay
    onMessageRef.current?.(optimisticMessage);

    // Ưu tiên dùng Socket.io nếu đã kết nối
    if (socketRef.current?.connected) {
      try {
        // Đảm bảo đã join room trước khi gửi
        socketRef.current.emit('join-room', conversationId);
        socketRef.current.emit('send-message', payload);
        console.log('[useLongPolling] ✅ Tin nhắn đã gửi qua Socket.io, optimistic message đã hiển thị');
        // Tin nhắn thật sẽ được nhận qua event 'new-message' và thay thế optimistic message
        return { success: true };
      } catch (error) {
        console.error('[useLongPolling] Socket emit error:', error);
        // Fallback to REST API nếu socket emit thất bại
      }
    }

    // Fallback: gọi API REST để đảm bảo tin nhắn được gửi
    const url = buildApiUrl(`/conversations/${conversationId}/messages`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token!}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // Xóa optimistic message nếu gửi thất bại
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      const errorText = await response.text();
      throw new Error(
        `Gửi tin nhắn thất bại (${response.status}): ${errorText || response.statusText}`
      );
    }

    const data = await response.json();
    if (data?.success && data?.data) {
      // Xóa optimistic message và thay thế bằng tin nhắn thật từ server
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== optimisticMessage.id);
        const updated = [...filtered, data.data];
        updated.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return updated;
      });
      handleNewMessage(data.data);
    }

    return data;
  }, [conversationId, handleNewMessage]);

  return {
    messages,
    isPolling,
    isConnected,
    sendMessage,
    loadHistory
  };
}

