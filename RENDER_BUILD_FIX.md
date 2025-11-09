# Sửa Lỗi Build trên Render

## 🐛 Vấn Đề

Render đang cố gắng build frontend khi deploy backend, gây ra lỗi:
```
error TS7016: Could not find a declaration file for module 'react-dom/client'
error TS2322: Type 'string' is not assignable to type '"student" | "tutor" | "management"'
==> Build failed 😞
```

**Nguyên nhân:** Render tự động detect và chạy `npm install; npm run build`, nhưng backend **KHÔNG CẦN** build frontend!

## ✅ Giải Pháp

### Bước 1: Sửa Build Command trên Render

**QUAN TRỌNG:** Backend **KHÔNG CẦN** build frontend!

1. Vào Render Dashboard
2. Chọn service (API Server hoặc WebSocket Server) đang bị lỗi
3. Click vào tab **"Settings"** (hoặc icon bánh răng ⚙️)
4. Scroll xuống tìm mục **"Build Command"**
5. **XÓA HẾT** nội dung trong Build Command (để **TRỐNG**)
   - Hoặc nếu bắt buộc phải có, chỉ để: `npm install`
   - **KHÔNG** dùng: `npm install; npm run build`
   - **KHÔNG** dùng: `npm run build`

### Bước 2: Đảm Bảo Start Command Đúng

1. Vào **"Settings"** tab
2. Tìm mục **"Start Command"**
3. Đảm bảo:
   - **API Server:** `npm run api`
   - **WebSocket Server:** `npm run ws`

### Bước 3: Kiểm Tra Environment Variables

Đảm bảo đã thêm đầy đủ environment variables (xem checklist).

## 🔧 Cấu Hình Đúng

### API Server:
```
Build Command: (ĐỂ TRỐNG - không điền gì cả)
Start Command: npm run api
```

### WebSocket Server:
```
Build Command: (ĐỂ TRỐNG - không điền gì cả)
Start Command: npm run ws
```

### Tại Sao Để Trống?

- Backend chỉ cần **install dependencies** và **chạy server**
- Render tự động chạy `npm install` trước khi start
- **KHÔNG CẦN** build TypeScript (tsx tự xử lý)
- **KHÔNG CẦN** build frontend (chỉ deploy trên Vercel)

## 📋 Checklist

- [ ] Build Command đã được xóa hoặc đổi thành `npm install`
- [ ] Start Command đúng (`npm run api` hoặc `npm run ws`)
- [ ] Environment variables đã cấu hình
- [ ] Deploy lại service

## 🎯 Sau Khi Sửa

1. **Save** settings
2. Render sẽ tự động **redeploy**
3. Kiểm tra logs để đảm bảo không còn lỗi
4. Test health endpoints

## 💡 Lý Do

- **Backend** chỉ cần install dependencies và chạy server
- **Frontend** build chỉ cần khi deploy frontend (trên Vercel)
- Render đang tự động detect và build frontend (sai)

## ✅ Kết Quả Mong Đợi

Sau khi sửa, logs sẽ hiển thị:
```
==> Installing dependencies
==> npm install
==> Starting service
==> npm run api (hoặc npm run ws)
==> Server is running on port 3000 (hoặc 3001)
✅ Running
```

**KHÔNG CÒN** lỗi TypeScript về frontend!

## 🎯 Hình Ảnh Minh Họa

### Trước Khi Sửa (SAI):
```
Build Command: npm install; npm run build  ❌
Start Command: npm run api
```

### Sau Khi Sửa (ĐÚNG):
```
Build Command: (để trống)  ✅
Start Command: npm run api
```

## ⚠️ Lưu Ý Quan Trọng

1. **Build Command:** Phải **TRỐNG** (không điền gì)
2. **Start Command:** Phải đúng (`npm run api` hoặc `npm run ws`)
3. **Sau khi sửa:** Click **"Save Changes"** và Render sẽ tự động **redeploy**
4. **Kiểm tra logs:** Đảm bảo không còn lỗi TypeScript

## 🐛 Nếu Vẫn Lỗi

1. **Kiểm tra lại Build Command:**
   - Đảm bảo đã xóa hết (để trống)
   - Không có khoảng trắng thừa

2. **Kiểm tra Start Command:**
   - API Server: `npm run api`
   - WebSocket Server: `npm run ws`

3. **Clear Build Cache:**
   - Vào Settings → Clear Build Cache
   - Redeploy lại

4. **Kiểm tra package.json:**
   - Đảm bảo scripts `api` và `ws` tồn tại
   - Đảm bảo dependencies đã được install

