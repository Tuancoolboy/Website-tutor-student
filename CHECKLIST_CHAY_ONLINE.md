# ✅ Checklist: Chạy Online trên Vercel

## 🎯 Mục Tiêu

Sau khi build thành công, ứng dụng sẽ chạy online tại:
**https://website-tutor-student-mu.vercel.app/**

## 📋 Checklist

### ✅ Đã Hoàn Thành
- [x] Fix lỗi TypeScript (react-dom/client)
- [x] Fix lỗi package-lock.json
- [x] Build thành công trên Vercel
- [x] Code đã được push lên GitHub
- [x] `BLOB_READ_WRITE_TOKEN` đã được set trên Vercel

### ⏳ Cần Làm (3 Bước)

#### Bước 1: Set Environment Variables

Vào **Vercel Dashboard** → **Settings** → **Environment Variables**, thêm:

1. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: `tutor-support-system-secret-key-2025-min-32-chars`
   - Environment: **All Environments**

2. **FRONTEND_URL**
   - Key: `FRONTEND_URL`
   - Value: `https://website-tutor-student-mu.vercel.app`
   - Environment: **All Environments**

3. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`
   - Environment: **Production only**

#### Bước 2: Redeploy Vercel

1. Vào **Deployments** tab
2. Click **Redeploy** trên deployment mới nhất
3. Đợi deploy hoàn thành (2-5 phút)

#### Bước 3: Test

**Test API:**
```bash
curl https://website-tutor-student-mu.vercel.app/api/health
```

**Test Frontend:**
1. Mở: https://website-tutor-student-mu.vercel.app/
2. Kiểm tra trang chủ có load được không

## ✅ Sau Khi Hoàn Thành

Ứng dụng sẽ:
- ✅ Chạy online tại: https://website-tutor-student-mu.vercel.app/
- ✅ Backend API hoạt động: https://website-tutor-student-mu.vercel.app/api
- ✅ Frontend hoạt động: https://website-tutor-student-mu.vercel.app/
- ✅ Blob Storage hoạt động (lưu dữ liệu)
- ✅ Đăng nhập hoạt động

## 🔍 Kiểm Tra

### Kiểm Tra Logs:
1. Vào **Deployments** → Chọn deployment mới nhất → **Logs**
2. Tìm: `[Storage] Using Vercel Blob Storage (BLOB_READ_WRITE_TOKEN found)`
3. ✅ Nếu thấy → Backend đang hoạt động đúng!

### Kiểm Tra API:
```bash
# Health check
curl https://website-tutor-student-mu.vercel.app/api/health

# Nên trả về:
# {"success":true,"message":"Server is running","timestamp":"2024-..."}
```

### Kiểm Tra Frontend:
1. Mở: https://website-tutor-student-mu.vercel.app/
2. Kiểm tra trang chủ có load được không
3. Kiểm tra browser console (F12) xem có lỗi không

## 🚨 Nếu Có Lỗi

### Lỗi: "BLOB_READ_WRITE_TOKEN is not set"
- **Giải pháp**: Set `BLOB_READ_WRITE_TOKEN` trong Vercel environment variables và redeploy

### Lỗi: "No blob found for users.json"
- **Giải pháp**: Upload files lên Blob Storage hoặc tạo tài khoản mới

### Lỗi: "403 Forbidden"
- **Giải pháp**: 
  1. Kiểm tra token có đúng không
  2. Redeploy Vercel

### Frontend không load
- **Giải pháp**: 
  1. Kiểm tra build có thành công không
  2. Kiểm tra logs trên Vercel
  3. Kiểm tra browser console (F12)

## 🎉 Kết Luận

**Sau khi hoàn thành 3 bước trên, ứng dụng sẽ chạy online và có thể sử dụng được!**

## 📝 Lưu Ý

- ✅ Mỗi khi push code lên GitHub, Vercel sẽ tự động deploy
- ✅ Environment variables được set trên Vercel sẽ áp dụng cho tất cả deployments
- ✅ Blob Storage lưu dữ liệu (users, sessions, etc.)
- ✅ Frontend và backend chạy trên cùng domain (Vercel)

## 🎯 Bắt Đầu Ngay!

**Bước tiếp theo**: Set 3 environment variables trên Vercel Dashboard và redeploy!

