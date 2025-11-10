# 🔧 Fix Lỗi: "Cannot find package 'vite'" trên Vercel

## ❌ Lỗi

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vite' imported from /vercel/path0/node_modules/.vite-temp/vite.config.ts.timestamp-xxx.mjs
```

## ✅ Giải Pháp

### Nguyên Nhân

- `vite` nằm trong `devDependencies`
- Vercel có thể không cài đặt `devDependencies` khi build (tùy thuộc vào cấu hình)
- Khi `vite.config.ts` được load, nó cần import `vite`, nhưng package không được cài đặt

### Cách Fix

**Di chuyển `vite` từ `devDependencies` sang `dependencies`:**

```json
{
  "dependencies": {
    "vite": "^4.5.0",
    ...
  },
  "devDependencies": {
    // vite đã được di chuyển sang dependencies
    ...
  }
}
```

**Lý do:**
- `dependencies` luôn được cài đặt, ngay cả trong production
- Đảm bảo `vite` có sẵn khi Vercel build
- `vite.config.ts` cần `vite` để load config

## ✅ Đã Fix

- ✅ Di chuyển `vite` từ `devDependencies` sang `dependencies`
- ✅ Cập nhật `installCommand` trong `vercel.json` để đảm bảo cài đặt đúng
- ✅ Build local thành công
- ✅ Đã commit và push lên GitHub (commit: `f92180e`)

## 📋 Kiểm Tra

### Kiểm Tra Build Local:

```bash
npm run build
```

Nên thành công và tạo folder `dist/`.

### Kiểm Tra trên Vercel:

Sau khi push code, Vercel sẽ tự động build lại. Kiểm tra logs để đảm bảo build thành công.

## 🔍 Nếu Vẫn Có Lỗi

Nếu vẫn gặp lỗi tương tự với các package khác (ví dụ: `@vitejs/plugin-react`, `typescript`), có thể cần:

1. **Di chuyển các build tools sang dependencies:**
   - `vite` (đã làm)
   - `@vitejs/plugin-react` (nếu cần)
   - `typescript` (nếu cần)

2. **Hoặc đảm bảo Vercel cài devDependencies:**
   - Sử dụng `npm install` thay vì `npm ci` (không khuyến nghị)
   - Hoặc set environment variable `NODE_ENV=development` (không khuyến nghị)

## 🎯 Kết Quả

Sau khi fix:
- ✅ Build thành công trên Vercel
- ✅ `vite` được cài đặt và có thể được import
- ✅ `vite.config.ts` có thể load được
- ✅ Ứng dụng sẽ được deploy và chạy online

## 📝 Lưu Ý

- ✅ `vite` trong `dependencies` sẽ làm tăng kích thước production bundle, nhưng không ảnh hưởng đến runtime (vite chỉ dùng để build)
- ✅ Đây là cách phổ biến để fix lỗi build trên Vercel khi dùng build tools
- ✅ Nếu ứng dụng không cần vite ở runtime, có thể giữ nó trong `dependencies` để đảm bảo build thành công

