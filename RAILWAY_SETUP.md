# Hướng dẫn Setup Railway cho WebSocket Server

## ⚠️ VẤN ĐỀ QUAN TRỌNG: JWT_SECRET phải giống nhau

Lỗi "invalid signature" xảy ra khi JWT_SECRET trên Railway **KHÁC** với JWT_SECRET trên Vercel (nơi tạo token).

## 🔧 Các bước setup:

### 1. Lấy JWT_SECRET từ Vercel

1. Vào Vercel Dashboard → Project của bạn
2. Settings → Environment Variables
3. Tìm biến `JWT_SECRET`
4. Copy giá trị của nó

### 2. Set JWT_SECRET trên Railway

1. Vào Railway Dashboard → Project `shimmering-adventure`
2. Chọn service `tutor-student-api`
3. Tab **Variables**
4. Tìm hoặc tạo biến `JWT_SECRET`
5. Paste giá trị từ Vercel vào
6. **QUAN TRỌNG**: Đảm bảo giá trị giống hệt với Vercel

### 3. Set FRONTEND_URL trên Railway

1. Vào Railway → service `tutor-student-api` → Variables
2. Thêm/sửa biến `FRONTEND_URL`:
   - Giá trị: `https://website-tutor-student-mu.vercel.app` (URL frontend của bạn)
   - Hoặc: `*` để cho phép tất cả origins (không khuyến khích cho production)

### 4. Các biến môi trường cần có trên Railway:

```
JWT_SECRET=<giá trị từ Vercel>
FRONTEND_URL=https://website-tutor-student-mu.vercel.app
NODE_ENV=production
USE_LOCAL_STORAGE=true
```

### 5. Restart service sau khi thay đổi biến

Railway sẽ tự động restart khi bạn thay đổi variables.

## ✅ Kiểm tra:

1. Vào Railway → Logs
2. Tìm dòng: `[Socket.io] JWT Secret: ...`
3. Đảm bảo secret này khớp với Vercel
4. Tìm dòng: `[Socket.io] CORS origin: ...`
5. Đảm bảo origin đúng với frontend URL

## 🐛 Troubleshooting:

### Lỗi "invalid signature"
- **Nguyên nhân**: JWT_SECRET không khớp
- **Giải pháp**: Copy JWT_SECRET từ Vercel sang Railway

### Lỗi CORS
- **Nguyên nhân**: FRONTEND_URL không đúng
- **Giải pháp**: Set FRONTEND_URL = URL frontend của bạn

### Tin nhắn bị delay
- **Nguyên nhân**: Socket.io không kết nối được → fallback về polling
- **Giải pháp**: 
  1. Fix JWT_SECRET để socket.io kết nối được
  2. Code đã có polling fallback mỗi 2 giây khi socket.io fail

## 📝 Notes:

- Code đã có **polling fallback** tự động mỗi 2 giây khi socket.io không kết nối được
- Polling sẽ tự động dừng khi socket.io kết nối thành công
- Tin nhắn sẽ real-time như Facebook khi socket.io hoạt động

