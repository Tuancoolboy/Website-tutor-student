# 🔧 Fix Lỗi: "vite: command not found" trên Vercel

## ❌ Lỗi

```
sh: line 1: vite: command not found
Error: Command "npm ci && npm run build" exited with 127
```

## ✅ Giải Pháp

### Nguyên Nhân

- Vercel không tìm thấy lệnh `vite` trong PATH
- Có thể do cách Vercel xử lý build command
- Hoặc do `vite` nằm trong `devDependencies` và không được cài đặt đúng cách

### Cách Fix

1. **Sử dụng `npx vite build` thay vì `vite build`:**

   ```json
   "build": "tsc && npx vite build"
   ```

   `npx` sẽ tự động tìm `vite` trong `node_modules/.bin` hoặc cài đặt nó nếu cần.

2. **Sửa `buildCommand` trong `vercel.json`:**

   ```json
   "buildCommand": "npm run build",
   "installCommand": "npm ci --no-audit --prefer-offline=false"
   ```

   Tránh chạy `npm ci` hai lần (một lần trong `installCommand` và một lần trong `buildCommand`).

## ✅ Đã Fix

- ✅ Thay đổi build script từ `vite build` sang `npx vite build`
- ✅ Sửa buildCommand trong vercel.json
- ✅ Build local thành công
- ✅ Đã commit và push lên GitHub

## 📋 Kiểm Tra

### Kiểm Tra Build Local:

```bash
npm run build
```

Nên thành công và tạo folder `dist/`.

### Kiểm Tra trên Vercel:

Sau khi push code, Vercel sẽ tự động build lại. Kiểm tra logs để đảm bảo build thành công.

## 🎯 Kết Quả

Sau khi fix:
- ✅ Build thành công trên Vercel
- ✅ Ứng dụng sẽ được deploy và chạy online
- ✅ Không còn lỗi "vite: command not found"

## 📝 Lưu Ý

- ✅ `npx` sẽ tự động tìm và chạy các lệnh từ `node_modules/.bin`
- ✅ Đảm bảo `vite` được cài đặt trong `devDependencies`
- ✅ Vercel sẽ cài đặt cả `devDependencies` khi build

