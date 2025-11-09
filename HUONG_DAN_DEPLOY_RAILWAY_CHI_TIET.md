# Hướng Dẫn Deploy Backend Lên Railway (Chi Tiết Từng Bước)

## 🎯 Mục Tiêu

Deploy 2 services lên Railway:
1. **API Server** (Port 3000) - Xử lý HTTP requests
2. **WebSocket Server** (Port 3001) - Xử lý WebSocket connections

## 📋 Chuẩn Bị

- ✅ Đã có tài khoản Railway
- ✅ Code đã push lên GitHub (repository: `Website-tutor-student`)
- ✅ Đã biết URL Vercel frontend (sẽ cần sau)

## 🚀 Bước 1: Tạo Project trên Railway

### 1.1. Đăng Nhập Railway

1. Vào https://railway.app
2. Click **"Login"** (góc trên bên phải)
3. Chọn **"Login with GitHub"**
4. Authorize Railway để truy cập GitHub

### 1.2. Tạo Project Mới

1. Sau khi login, bạn sẽ thấy Dashboard
2. Click **"New Project"** (góc trên bên phải, nút màu tím)
3. Chọn **"Deploy from GitHub repo"**
4. Railway sẽ hiển thị danh sách repositories GitHub của bạn
5. Tìm và chọn repository: **`Website-tutor-student`**
6. Click vào repository đó

### 1.3. Railway Tự Động Detect

- Railway sẽ tự động detect đây là Node.js project
- Railway sẽ tự động chạy `npm install`
- Railway sẽ tự động detect start command (có thể sai, sẽ sửa sau)

**Lưu ý:** Railway có thể tự động deploy, nhưng chúng ta cần cấu hình đúng.

## 🔧 Bước 2: Cấu Hình Service 1 - API Server

### 2.1. Rename Service

1. Trong project vừa tạo, bạn sẽ thấy 1 service
2. Click vào service đó (hoặc click vào tên service)
3. Click vào icon **"Settings"** (bánh răng) hoặc tab **"Settings"**
4. Tìm mục **"Name"**
5. Đổi tên thành: **`tutor-api`**
6. Click **"Save"**

### 2.2. Cấu Hình Start Command

1. Vẫn trong tab **"Settings"**
2. Tìm mục **"Deploy"** hoặc **"Start Command"**
3. Tìm field **"Start Command"**
4. Xóa command hiện tại (nếu có)
5. Nhập: **`npm run api`**
6. Click **"Save"**

### 2.3. Cấu Hình Root Directory

1. Vẫn trong **"Settings"**
2. Tìm mục **"Root Directory"**
3. Để trống (hoặc nhập **`/`** nếu bắt buộc)
4. Click **"Save"**

### 2.4. Cấu Hình Port

1. Railway tự động detect port từ `process.env.PORT`
2. Code của bạn đã dùng `process.env.PORT || 3000`
3. **KHÔNG CẦN** cấu hình port trong Railway (Railway tự động assign)

### 2.5. Thêm Environment Variables

1. Vẫn trong **"Settings"**
2. Tìm tab **"Variables"** hoặc **"Environment Variables"**
3. Click **"New Variable"** hoặc **"Add Variable"**
4. Thêm từng variable sau:

#### Variable 1: PORT
- **Name:** `PORT`
- **Value:** `3000`
- Click **"Add"**

#### Variable 2: NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`
- Click **"Add"**

#### Variable 3: JWT_SECRET
- **Name:** `JWT_SECRET`
- **Value:** Tạo một secret key mạnh (ví dụ: `tutor-support-system-secret-key-2025-production`)
- **Lưu ý:** Secret key này phải MẠNH và BẢO MẬT
- Click **"Add"**

#### Variable 4: FRONTEND_URL
- **Name:** `FRONTEND_URL`
- **Value:** URL Vercel frontend của bạn (ví dụ: `https://website-tutor-student.vercel.app`)
- **Lưu ý:** Nếu chưa có URL Vercel, có thể để sau, nhưng nhớ cập nhật
- Click **"Add"**

### 2.6. Lấy Domain (Public URL)

1. Vẫn trong **"Settings"**
2. Tìm tab **"Networking"** hoặc **"Domains"**
3. Railway tự động tạo domain: `https://tutor-api-production.up.railway.app`
4. **Copy domain này** (sẽ cần sau)
5. Hoặc có thể tạo custom domain (tùy chọn)

### 2.7. Deploy

1. Railway tự động deploy khi bạn push code lên GitHub
2. Hoặc click **"Deploy"** hoặc **"Redeploy"** trong tab **"Deployments"**
3. Đợi deploy hoàn thành (có thể mất 2-5 phút)
4. Kiểm tra logs trong tab **"Logs"** để xem có lỗi không

### 2.8. Test API Server

1. Sau khi deploy xong, copy domain từ bước 2.6
2. Mở browser hoặc terminal
3. Test endpoint:
   ```bash
   curl https://tutor-api-production.up.railway.app/health
   ```
4. Expected response:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "..."
   }
   ```
5. Nếu thấy response này → ✅ API Server đã chạy thành công!

## 🔧 Bước 3: Tạo Service 2 - WebSocket Server

### 3.1. Tạo Service Mới

1. Trong project Railway, click **"New Service"** (góc trên bên phải)
2. Chọn **"GitHub Repo"**
3. Chọn cùng repository: **`Website-tutor-student`**
4. Railway sẽ tạo service mới

### 3.2. Rename Service

1. Click vào service mới vừa tạo
2. Vào **"Settings"**
3. Đổi tên thành: **`tutor-websocket`**
4. Click **"Save"**

### 3.3. Cấu Hình Start Command

1. Vào **"Settings"**
2. Tìm **"Start Command"**
3. Nhập: **`npm run ws`**
4. Click **"Save"**

### 3.4. Cấu Hình Root Directory

1. Vẫn trong **"Settings"**
2. Tìm **"Root Directory"**
3. Để trống (hoặc `/`)
4. Click **"Save"**

### 3.5. Thêm Environment Variables

1. Vào **"Settings"** → **"Variables"**
2. Thêm các variables sau:

#### Variable 1: PORT
- **Name:** `PORT`
- **Value:** `3001`
- Click **"Add"**

#### Variable 2: NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`
- Click **"Add"`

#### Variable 3: JWT_SECRET
- **Name:** `JWT_SECRET`
- **Value:** **CÙNG GIÁ TRỊ** với API Server (quan trọng!)
- Click **"Add"**

#### Variable 4: FRONTEND_URL
- **Name:** `FRONTEND_URL`
- **Value:** **CÙNG GIÁ TRỊ** với API Server
- Click **"Add"**

#### Variable 5: API_URL
- **Name:** `API_URL`
- **Value:** Domain của API Server (ví dụ: `https://tutor-api-production.up.railway.app`)
- Click **"Add"**

### 3.6. Lấy Domain

1. Vào **"Settings"** → **"Networking"**
2. Copy domain: `https://tutor-websocket-production.up.railway.app`
3. **Lưu domain này** (sẽ cần sau)

### 3.7. Deploy

1. Railway tự động deploy
2. Đợi deploy hoàn thành
3. Kiểm tra logs

### 3.8. Test WebSocket Server

1. Test health endpoint:
   ```bash
   curl https://tutor-websocket-production.up.railway.app/health
   ```
2. Expected response:
   ```json
   {
     "status": "ok",
     "service": "websocket-server",
     "timestamp": "..."
   }
   ```
3. Nếu thấy response này → ✅ WebSocket Server đã chạy thành công!

## 📝 Bước 4: Tổng Hợp Thông Tin

Sau khi deploy xong, bạn cần lưu lại các thông tin sau:

### 4.1. API Server
- **Domain:** `https://tutor-api-production.up.railway.app`
- **Health Check:** `https://tutor-api-production.up.railway.app/health`
- **API Base URL:** `https://tutor-api-production.up.railway.app/api`

### 4.2. WebSocket Server
- **Domain:** `https://tutor-websocket-production.up.railway.app`
- **Health Check:** `https://tutor-websocket-production.up.railway.app/health`
- **WebSocket URL:** `https://tutor-websocket-production.up.railway.app`

### 4.3. Environment Variables Đã Cấu Hình

#### API Server:
- `PORT=3000`
- `NODE_ENV=production`
- `JWT_SECRET=your-secret-key`
- `FRONTEND_URL=https://your-vercel-app.vercel.app`

#### WebSocket Server:
- `PORT=3001`
- `NODE_ENV=production`
- `JWT_SECRET=your-secret-key` (cùng với API Server)
- `FRONTEND_URL=https://your-vercel-app.vercel.app`
- `API_URL=https://tutor-api-production.up.railway.app`

## ✅ Bước 5: Kiểm Tra

### 5.1. Kiểm Tra Logs

1. Vào mỗi service
2. Click tab **"Logs"**
3. Kiểm tra có lỗi không
4. Tìm dòng: `✅ Running` hoặc `Server is running`

### 5.2. Test Endpoints

#### Test API Server:
```bash
# Health check
curl https://tutor-api-production.up.railway.app/health

# Expected: {"success":true,"message":"Server is running",...}
```

#### Test WebSocket Server:
```bash
# Health check
curl https://tutor-websocket-production.up.railway.app/health

# Expected: {"status":"ok","service":"websocket-server",...}
```

### 5.3. Kiểm Tra CORS

1. Mở Browser Console (F12)
2. Thử gọi API từ frontend
3. Kiểm tra có lỗi CORS không
4. Nếu có lỗi CORS → Kiểm tra lại `FRONTEND_URL` trong environment variables

## 🐛 Troubleshooting

### Lỗi: "Build failed"

**Nguyên nhân:**
- Dependencies không install được
- Build command sai

**Giải pháp:**
1. Kiểm tra logs trong Railway
2. Kiểm tra `package.json` có đúng không
3. Kiểm tra Start Command có đúng không (`npm run api` hoặc `npm run ws`)

### Lỗi: "Port already in use"

**Nguyên nhân:**
- Port đã được sử dụng

**Giải pháp:**
1. Railway tự động assign port, không cần cấu hình
2. Đảm bảo code dùng `process.env.PORT` (đã có sẵn trong code)

### Lỗi: "Connection timeout"

**Nguyên nhân:**
- Server chưa start
- Port chưa được expose

**Giải pháp:**
1. Kiểm tra logs
2. Kiểm tra Start Command
3. Kiểm tra server có start thành công không

### Lỗi: "CORS error"

**Nguyên nhân:**
- `FRONTEND_URL` không đúng
- CORS chưa được cấu hình đúng

**Giải pháp:**
1. Kiểm tra `FRONTEND_URL` trong environment variables
2. Đảm bảo `FRONTEND_URL` khớp với Vercel domain
3. Kiểm tra CORS settings trong `server.ts` và `ws-server.ts`

### Lỗi: "JWT token invalid"

**Nguyên nhân:**
- `JWT_SECRET` không khớp giữa API và WebSocket server

**Giải pháp:**
1. Đảm bảo cả 2 servers dùng **CÙNG** `JWT_SECRET`
2. Kiểm tra environment variables
3. Restart cả 2 servers sau khi thay đổi

## 📋 Checklist

Sau khi hoàn thành, kiểm tra:

- [ ] API Server đã deploy thành công
- [ ] WebSocket Server đã deploy thành công
- [ ] Environment variables đã cấu hình đúng
- [ ] Health check endpoints hoạt động
- [ ] Đã copy domains (API và WebSocket)
- [ ] Đã test endpoints
- [ ] Logs không có lỗi
- [ ] CORS đã được cấu hình đúng

## 🎯 Next Steps

Sau khi deploy backend lên Railway:

1. **Cập nhật Frontend:**
   - Cập nhật `src/env.ts` với Railway URLs
   - Thêm environment variables trên Vercel
   - Deploy frontend lên Vercel

2. **Test Integration:**
   - Test API calls từ frontend
   - Test WebSocket connection
   - Test login/register
   - Test messaging
   - Test Active Now

3. **Monitor:**
   - Kiểm tra logs trên Railway
   - Kiểm tra errors
   - Monitor performance

## 💡 Tips

1. **Custom Domain:**
   - Railway hỗ trợ custom domain miễn phí
   - Có thể dùng domain riêng cho API và WebSocket

2. **Monitoring:**
   - Railway có built-in logs
   - Có thể xem metrics và usage

3. **Cost:**
   - Railway free tier: $5 credit/tháng
   - Đủ cho development và testing
   - Có thể upgrade nếu cần

4. **Auto Deploy:**
   - Railway tự động deploy khi push code lên GitHub
   - Có thể disable auto deploy nếu cần

## 📚 Tài Liệu Tham Khảo

- [Railway Documentation](https://docs.railway.app/)
- [Railway Getting Started](https://docs.railway.app/getting-started)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)

## ✅ Hoàn Thành

Sau khi hoàn thành các bước trên, bạn đã:
- ✅ Deploy API Server lên Railway
- ✅ Deploy WebSocket Server lên Railway
- ✅ Cấu hình environment variables
- ✅ Test endpoints
- ✅ Sẵn sàng kết nối với frontend trên Vercel

**Tiếp theo:** Cập nhật frontend để kết nối với Railway backend!

