# Hướng Dẫn Deploy Backend Lên Render (Chi Tiết Từng Bước)

## 🎯 Mục Tiêu

Deploy 2 services lên Render:
1. **API Server** (Port 3000) - Xử lý HTTP requests
2. **WebSocket Server** (Port 3001) - Xử lý WebSocket connections

## 📋 Chuẩn Bị

- ✅ Đã có tài khoản Render
- ✅ Code đã push lên GitHub (repository: `Website-tutor-student`)
- ✅ Đã biết URL Vercel frontend (sẽ cần sau)

## 🚀 Bước 1: Deploy API Server

### 1.1. Tạo Web Service

1. Trong Render Dashboard, bạn đang ở trang "Create a new Service"
2. Click vào **"Web Services"** → **"New Web Service →"**
3. Render sẽ hỏi: "Connect a repository"

### 1.2. Connect GitHub Repository

1. Nếu chưa connect GitHub:
   - Click **"Connect GitHub"** hoặc **"Configure GitHub"**
   - Authorize Render để truy cập GitHub
   - Chọn repositories bạn muốn connect

2. Sau khi connect GitHub:
   - Render sẽ hiển thị danh sách repositories
   - Tìm và chọn: **`Website-tutor-student`**
   - Click vào repository đó

### 1.3. Cấu Hình Service

Sau khi chọn repository, Render sẽ hiển thị form cấu hình:

#### Basic Settings:

1. **Name:**
   - Nhập: `tutor-api`
   - Đây là tên service (có thể thay đổi sau)

2. **Region:**
   - Chọn region gần bạn nhất (ví dụ: `Singapore` hoặc `Oregon`)
   - Region ảnh hưởng đến latency

3. **Branch:**
   - Chọn branch: `main` (hoặc branch bạn muốn deploy)
   - Render sẽ deploy từ branch này

4. **Root Directory:**
   - Để trống (hoặc `/` nếu bắt buộc)
   - Render sẽ tìm files từ root directory

5. **Runtime:**
   - Render tự động detect: `Node`
   - Nếu không detect, chọn `Node`

6. **Build Command:**
   - Để trống hoặc: `npm install`
   - Render sẽ tự động chạy `npm install`

7. **Start Command:**
   - **QUAN TRỌNG:** Nhập: `npm run api`
   - Đây là command để start API server

#### Advanced Settings (Click "Advanced" để mở):

1. **Instance Type:**
   - Chọn: **"Free"** (miễn phí)
   - Hoặc "Starter" ($7/tháng) nếu cần performance tốt hơn

2. **Auto-Deploy:**
   - ✅ Tích vào "Auto-Deploy"
   - Render sẽ tự động deploy khi push code lên GitHub

3. **Health Check Path:**
   - Nhập: `/health`
   - Render sẽ check health endpoint này

4. **Environment Variables:**
   - Click **"Add Environment Variable"**
   - Thêm các variables sau:

#### Environment Variables:

Click **"Add Environment Variable"** và thêm từng variable:

##### Variable 1: PORT
- **Key:** `PORT`
- **Value:** `3000`
- Click **"Save"**

##### Variable 2: NODE_ENV
- **Key:** `NODE_ENV`
- **Value:** `production`
- Click **"Save"**

##### Variable 3: JWT_SECRET
- **Key:** `JWT_SECRET`
- **Value:** Tạo một secret key mạnh (ví dụ: `tutor-support-system-secret-key-2025-production`)
- **Lưu ý:** Secret key này phải MẠNH và BẢO MẬT
- Click **"Save"**

##### Variable 4: FRONTEND_URL
- **Key:** `FRONTEND_URL`
- **Value:** URL Vercel frontend của bạn (ví dụ: `https://website-tutor-student.vercel.app`)
- **Lưu ý:** Nếu chưa có URL Vercel, có thể để sau, nhưng nhớ cập nhật
- Click **"Save"**

### 1.4. Deploy

1. Sau khi cấu hình xong, scroll xuống cuối
2. Click **"Create Web Service"**
3. Render sẽ bắt đầu deploy
4. Đợi deploy hoàn thành (có thể mất 3-5 phút)

### 1.5. Lấy Domain

1. Sau khi deploy xong, Render sẽ hiển thị dashboard của service
2. Tìm mục **"URL"** hoặc **"Service URL"**
3. Render tự động tạo domain: `https://tutor-api.onrender.com`
4. **Copy domain này** (sẽ cần sau)

### 1.6. Test API Server

1. Sau khi deploy xong, đợi vài phút để service start
2. Test endpoint:
   ```bash
   curl https://tutor-api.onrender.com/health
   ```
3. Expected response:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "..."
   }
   ```
4. Nếu thấy response này → ✅ API Server đã chạy thành công!

### 1.7. Lưu Ý về Free Tier

- **Free tier tự động sleep** sau 15 phút không có traffic
- **Lần đầu truy cập** sau khi sleep sẽ mất ~30 giây để wake up
- **Đây là bình thường** với free tier
- **Production** nên upgrade lên Starter plan ($7/tháng) để tránh sleep

## 🚀 Bước 2: Deploy WebSocket Server

### 2.1. Tạo Web Service Thứ 2

1. Quay lại Render Dashboard
2. Click **"+ New"** → **"Web Service"**
3. Hoặc click **"New +"** → **"Web Service"**

### 2.2. Connect GitHub Repository

1. Chọn cùng repository: **`Website-tutor-student`**
2. Click vào repository đó

### 2.3. Cấu Hình Service

#### Basic Settings:

1. **Name:**
   - Nhập: `tutor-websocket`

2. **Region:**
   - Chọn cùng region với API Server (để giảm latency)

3. **Branch:**
   - Chọn: `main`

4. **Root Directory:**
   - Để trống

5. **Runtime:**
   - Chọn: `Node`

6. **Build Command:**
   - Để trống hoặc: `npm install`

7. **Start Command:**
   - **QUAN TRỌNG:** Nhập: `npm run ws`
   - Đây là command để start WebSocket server

#### Advanced Settings:

1. **Instance Type:**
   - Chọn: **"Free"** (miễn phí)

2. **Auto-Deploy:**
   - ✅ Tích vào "Auto-Deploy"

3. **Health Check Path:**
   - Nhập: `/health`

4. **Environment Variables:**
   - Click **"Add Environment Variable"**
   - Thêm các variables sau:

#### Environment Variables:

##### Variable 1: PORT
- **Key:** `PORT`
- **Value:** `3001`
- Click **"Save"**

##### Variable 2: NODE_ENV
- **Key:** `NODE_ENV`
- **Value:** `production`
- Click **"Save"**

##### Variable 3: JWT_SECRET
- **Key:** `JWT_SECRET`
- **Value:** **CÙNG GIÁ TRỊ** với API Server (quan trọng!)
- Click **"Save"**

##### Variable 4: FRONTEND_URL
- **Key:** `FRONTEND_URL`
- **Value:** **CÙNG GIÁ TRỊ** với API Server
- Click **"Save"**

##### Variable 5: API_URL
- **Key:** `API_URL`
- **Value:** Domain của API Server (ví dụ: `https://tutor-api.onrender.com`)
- Click **"Save"**

### 2.4. Deploy

1. Click **"Create Web Service"**
2. Đợi deploy hoàn thành (3-5 phút)

### 2.5. Lấy Domain

1. Sau khi deploy xong, tìm **"URL"** hoặc **"Service URL"**
2. Render tự động tạo domain: `https://tutor-websocket.onrender.com`
3. **Copy domain này** (sẽ cần sau)

### 2.6. Test WebSocket Server

1. Đợi vài phút để service start
2. Test endpoint:
   ```bash
   curl https://tutor-websocket.onrender.com/health
   ```
3. Expected response:
   ```json
   {
     "status": "ok",
     "service": "websocket-server",
     "timestamp": "..."
   }
   ```
4. Nếu thấy response này → ✅ WebSocket Server đã chạy thành công!

## 📝 Bước 3: Tổng Hợp Thông Tin

Sau khi deploy xong, bạn cần lưu lại các thông tin sau:

### 3.1. API Server
- **Domain:** `https://tutor-api.onrender.com`
- **Health Check:** `https://tutor-api.onrender.com/health`
- **API Base URL:** `https://tutor-api.onrender.com/api`

### 3.2. WebSocket Server
- **Domain:** `https://tutor-websocket.onrender.com`
- **Health Check:** `https://tutor-websocket.onrender.com/health`
- **WebSocket URL:** `https://tutor-websocket.onrender.com`

### 3.3. Environment Variables Đã Cấu Hình

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
- `API_URL=https://tutor-api.onrender.com`

## ✅ Bước 4: Kiểm Tra

### 4.1. Kiểm Tra Logs

1. Vào mỗi service trong Render Dashboard
2. Click tab **"Logs"**
3. Kiểm tra có lỗi không
4. Tìm dòng: `✅ Running` hoặc `Server is running`

### 4.2. Test Endpoints

#### Test API Server:
```bash
# Health check
curl https://tutor-api.onrender.com/health

# Expected: {"success":true,"message":"Server is running",...}
```

#### Test WebSocket Server:
```bash
# Health check
curl https://tutor-websocket.onrender.com/health

# Expected: {"status":"ok","service":"websocket-server",...}
```

### 4.3. Kiểm Tra CORS

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
1. Kiểm tra logs trong Render
2. Kiểm tra `package.json` có đúng không
3. Kiểm tra Start Command có đúng không (`npm run api` hoặc `npm run ws`)

### Lỗi: "Service sleep"

**Nguyên nhân:**
- Free tier tự động sleep sau 15 phút không có traffic

**Giải pháp:**
1. Đây là bình thường với free tier
2. Lần đầu truy cập sau khi sleep sẽ mất ~30 giây để wake up
3. Nếu cần tránh sleep → Upgrade lên Starter plan ($7/tháng)

### Lỗi: "Connection timeout"

**Nguyên nhân:**
- Service đang sleep
- Server chưa start

**Giải pháp:**
1. Đợi vài phút để service wake up
2. Kiểm tra logs
3. Kiểm tra Start Command

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
3. Restart cả 2 services sau khi thay đổi

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

Sau khi deploy backend lên Render:

1. **Cập nhật Frontend:**
   - Cập nhật `src/env.ts` với Render URLs
   - Thêm environment variables trên Vercel
   - Deploy frontend lên Vercel

2. **Test Integration:**
   - Test API calls từ frontend
   - Test WebSocket connection
   - Test login/register
   - Test messaging
   - Test Active Now

3. **Monitor:**
   - Kiểm tra logs trên Render
   - Kiểm tra errors
   - Monitor performance

## 💡 Tips

1. **Free Tier:**
   - Tự động sleep sau 15 phút không có traffic
   - Lần đầu truy cập sau khi sleep sẽ mất ~30 giây để wake up
   - Đủ cho development và testing

2. **Starter Plan ($7/tháng):**
   - Không sleep
   - Performance tốt hơn
   - Tốt cho production

3. **Custom Domain:**
   - Render hỗ trợ custom domain miễn phí
   - Có thể dùng domain riêng cho API và WebSocket

4. **Monitoring:**
   - Render có built-in logs
   - Có thể xem metrics và usage

5. **Auto Deploy:**
   - Render tự động deploy khi push code lên GitHub
   - Có thể disable auto deploy nếu cần

## 📚 Tài Liệu Tham Khảo

- [Render Documentation](https://render.com/docs)
- [Render Getting Started](https://render.com/docs/getting-started)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Render Free Tier](https://render.com/docs/free)

## ✅ Hoàn Thành

Sau khi hoàn thành các bước trên, bạn đã:
- ✅ Deploy API Server lên Render
- ✅ Deploy WebSocket Server lên Render
- ✅ Cấu hình environment variables
- ✅ Test endpoints
- ✅ Sẵn sàng kết nối với frontend trên Vercel

**Tiếp theo:** Cập nhật frontend để kết nối với Render backend!

