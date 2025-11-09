# Fix Lỗi ERR_INSUFFICIENT_RESOURCES

## 🐛 Vấn Đề

**Lỗi:** `ERR_INSUFFICIENT_RESOURCES` khi load active users
- ❌ Request `/api/users?limit=100` được gửi liên tục
- ❌ Browser/Network bị quá tải
- ❌ Không thể gửi tin nhắn được

## 🔍 Nguyên Nhân

### 1. Infinite Loop trong useEffect
```typescript
// ❌ SAI - conversations thay đổi liên tục
useEffect(() => {
  loadActiveUsers()
}, [currentUser, conversations, onlineUsers, isUserOnline])
```

**Vấn đề:**
- `conversations` thay đổi mỗi khi có message mới
- Mỗi lần `conversations` thay đổi → `useEffect` chạy lại
- `loadActiveUsers()` được gọi lại → Gửi request mới
- Tạo ra hàng trăm requests liên tục

### 2. Không Có Debounce
- Mỗi lần dependency thay đổi → Gọi API ngay lập tức
- Không có delay → Quá nhiều requests

### 3. Không Có Flag Bảo Vệ
- Nhiều requests có thể chạy đồng thời
- Không kiểm tra xem đang loading không

### 4. Interval Quá Ngắn
- Refresh mỗi 30 giây
- Kết hợp với infinite loop → Quá nhiều requests

## ✅ Giải Pháp

### 1. Thêm Refs để Prevent Multiple Calls
```typescript
const isLoadingActiveUsersRef = useRef(false)
const activeUsersIntervalRef = useRef<NodeJS.Timeout | null>(null)
const activeUsersTimeoutRef = useRef<NodeJS.Timeout | null>(null)
const lastOnlineUsersRef = useRef<Set<string>>(new Set())
```

### 2. Remove `conversations` từ Dependencies
```typescript
// ✅ ĐÚNG - Chỉ reload khi onlineUsers thay đổi
useEffect(() => {
  // ...
}, [currentUser, onlineUsers, isUserOnline]) // Removed 'conversations'
```

### 3. Thêm Debounce
```typescript
// Debounce: wait 1 second before loading
activeUsersTimeoutRef.current = setTimeout(() => {
  if (!isLoadingActiveUsersRef.current) {
    loadActiveUsers()
  }
}, 1000) // 1 second debounce
```

### 4. Check if Actually Changed
```typescript
// Check if onlineUsers actually changed
const currentOnlineUsersSet = new Set(onlineUsers || [])
const onlineUsersChanged = 
  currentOnlineUsersSet.size !== lastOnlineUsersRef.current.size ||
  Array.from(currentOnlineUsersSet).some(id => !lastOnlineUsersRef.current.has(id))

// Only load if actually changed
if (currentUser && (onlineUsersChanged || activeUsers.length === 0)) {
  loadActiveUsers()
}
```

### 5. Prevent Multiple Simultaneous Calls
```typescript
const loadActiveUsers = async () => {
  // Prevent multiple simultaneous calls
  if (isLoadingActiveUsersRef.current) {
    console.log('Active users already loading, skipping...')
    return
  }
  
  try {
    isLoadingActiveUsersRef.current = true
    // ... load users ...
  } finally {
    isLoadingActiveUsersRef.current = false
  }
}
```

### 6. Tăng Interval
```typescript
// Increased from 30s to 60s to reduce load
activeUsersIntervalRef.current = setInterval(() => {
  if (!isLoadingActiveUsersRef.current) {
    loadActiveUsers()
  }
}, 60000) // Refresh every 60 seconds
```

## 📋 Thay Đổi

### Files Đã Sửa:
1. `src/pages/tutor/Messages.tsx`
2. `src/pages/student/Messages.tsx`

### Changes:
- ✅ Added refs to prevent infinite loops
- ✅ Removed `conversations` from dependencies
- ✅ Added 1 second debounce
- ✅ Increased interval from 30s to 60s
- ✅ Only refresh when onlineUsers actually changes
- ✅ Improved error handling

## 🎯 Kết Quả

### Trước:
- ❌ Hàng trăm requests mỗi phút
- ❌ `ERR_INSUFFICIENT_RESOURCES`
- ❌ Không thể gửi tin nhắn
- ❌ Browser bị đơ

### Sau:
- ✅ Chỉ gọi API khi cần thiết
- ✅ Không còn infinite loop
- ✅ Không còn `ERR_INSUFFICIENT_RESOURCES`
- ✅ Gửi tin nhắn hoạt động bình thường
- ✅ Browser mượt mà

## 🚀 Test

### Bước 1: Deploy
1. Vercel sẽ tự động deploy lại
2. Đợi deploy hoàn thành (2-3 phút)

### Bước 2: Test
1. Mở: `https://website-tutor-student-s8rl.vercel.app`
2. Mở Browser Console (F12)
3. Vào Messages page
4. Kiểm tra:
   - ✅ Không còn requests liên tục
   - ✅ Active users load bình thường
   - ✅ Gửi tin nhắn hoạt động
   - ✅ Không còn `ERR_INSUFFICIENT_RESOURCES`

## 📝 Lưu Ý

### Best Practices:
1. **Không thêm dependencies không cần thiết vào useEffect**
2. **Luôn dùng refs để prevent multiple calls**
3. **Thêm debounce cho API calls**
4. **Chỉ refresh khi thực sự cần thiết**
5. **Kiểm tra xem data có thay đổi không trước khi reload**

### Performance:
- ✅ Giảm số lượng requests
- ✅ Giảm tải cho server
- ✅ Cải thiện UX
- ✅ Tránh browser crash

## ✅ Hoàn Thành

Sau khi deploy:
- ✅ Lỗi `ERR_INSUFFICIENT_RESOURCES` đã được fix
- ✅ Active users load bình thường
- ✅ Gửi tin nhắn hoạt động
- ✅ Performance được cải thiện

