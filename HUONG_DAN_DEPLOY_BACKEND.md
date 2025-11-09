# Hướng Dẫn Deploy Backend (API Server + WebSocket Server)

## 🚨 Vấn Đề

**Vercel KHÔNG hỗ trợ:**
- ❌ Express server (API server)
- ❌ WebSocket server (Socket.io)
- ❌ Long-running processes
- ❌ Background services

**Vercel chỉ hỗ trợ:**
- ✅ Frontend (React, Vue, etc.)
- ✅ Serverless Functions (serverless API)
- ✅ Static files

## 💡 Giải Pháp

Bạn cần deploy **backend riêng** trên các platform khác:

### Các Platform Đề Xuất:

1. **Railway** (Khuyến nghị) - Dễ dùng, miễn phí
2. **Render** - Miễn phí, dễ setup
3. **Fly.io** - Miễn phí, tốt cho WebSocket
4. **Heroku** - Có phí (không còn free tier)
5. **DigitalOcean App Platform** - Có phí
6. **AWS/GCP/Azure** - Phức tạp hơn

## 🚀 Option 1: Railway (Khuyến nghị)

### Ưu điểm:
- ✅ Miễn phí $5/tháng credit
- ✅ Dễ setup, tự động deploy từ GitHub
- ✅ Hỗ trợ cả API server và WebSocket server
- ✅ Tự động cung cấp domain
- ✅ Environment variables dễ quản lý

### Cách Deploy:

#### Bước 1: Tạo Account Railway
1. Vào https://railway.app
2. Đăng nhập bằng GitHub
3. Click "New Project"
4. Chọn "Deploy from GitHub repo"
5. Chọn repository: `Website-tutor-student`

#### Bước 2: Deploy API Server
1. Click "New Service"
2. Chọn "GitHub Repo"
3. Chọn repository
4. Railway sẽ tự detect và chạy
5. **Settings → Deploy:**
   - **Start Command:** `npm run api`
   - **Root Directory:** `/` (root)
   - **Port:** `3000`
6. **Settings → Variables:**
   - `PORT=3000`
   - `NODE_ENV=production`
   - `JWT_SECRET=your-production-secret-key-change-this`
   - `FRONTEND_URL=https://your-vercel-app.vercel.app`

#### Bước 3: Deploy WebSocket Server
1. Click "New Service" (thêm service thứ 2)
2. Chọn cùng repository
3. **Settings → Deploy:**
   - **Start Command:** `npm run ws`
   - **Root Directory:** `/` (root)
   - **Port:** `3001`
4. **Settings → Variables:**
   - `PORT=3001`
   - `NODE_ENV=production`
   - `JWT_SECRET=your-production-secret-key-change-this` (CÙNG với API server)
   - `FRONTEND_URL=https://your-vercel-app.vercel.app`
   - `API_URL=https://your-api-railway-app.railway.app`

#### Bước 4: Lấy Domain
- Railway tự động cung cấp domain: `https://your-app.railway.app`
- Có thể thêm custom domain trong Settings

### Cấu Hình Files:

#### `railway.json` (nếu cần)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run api",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### `Procfile` (cho Heroku/Railway)
```
web: npm run api
ws: npm run ws
```

## 🚀 Option 2: Render

### Ưu điểm:
- ✅ Miễn phí (với giới hạn)
- ✅ Dễ setup
- ✅ Tự động deploy từ GitHub

### Cách Deploy:

#### Bước 1: Tạo Account Render
1. Vào https://render.com
2. Đăng nhập bằng GitHub
3. Click "New +" → "Web Service"

#### Bước 2: Deploy API Server
1. Connect GitHub repository
2. **Settings:**
   - **Name:** `tutor-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run api`
   - **Instance Type:** Free
3. **Environment Variables:**
   - `PORT=3000`
   - `NODE_ENV=production`
   - `JWT_SECRET=your-production-secret-key`
   - `FRONTEND_URL=https://your-vercel-app.vercel.app`

#### Bước 3: Deploy WebSocket Server
1. Tạo service thứ 2 (tương tự)
2. **Start Command:** `npm run ws`
3. **Port:** `3001`

## 🚀 Option 3: Fly.io (Tốt cho WebSocket)

### Ưu điểm:
- ✅ Miễn phí
- ✅ Hỗ trợ WebSocket tốt
- ✅ Global edge network

### Cách Deploy:

#### Bước 1: Cài đặt Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

#### Bước 2: Login
```bash
fly auth login
```

#### Bước 3: Tạo App
```bash
# API Server
fly launch --name tutor-api
fly deploy

# WebSocket Server (tạo app riêng)
fly launch --name tutor-ws
fly deploy
```

#### Bước 4: Tạo `fly.toml`
```toml
app = "tutor-api"
primary_region = "iad"

[build]

[env]
  PORT = "3000"
  NODE_ENV = "production"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[services]]
  protocol = "tcp"
  internal_port = 3000
```

## 🔧 Cập Nhật Frontend (Vercel)

Sau khi deploy backend, cần cập nhật frontend để kết nối:

### 1. Cập Nhật `src/env.ts`:
```typescript
// Environment detection
const isProduction = typeof window !== 'undefined' 
  ? window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  : false;

// Backend URLs (thay bằng URL thực tế từ Railway/Render/Fly.io)
export const API_BASE_URL = isProduction 
  ? 'https://your-api-railway.railway.app/api'  // Thay bằng URL thực tế
  : 'http://localhost:3000/api';

export const WEBSOCKET_URL = isProduction
  ? 'https://your-ws-railway.railway.app'  // Thay bằng URL thực tế
  : 'http://localhost:3001';
```

### 2. Cập Nhật Environment Variables trên Vercel:
- Vào Vercel Dashboard → Project → Settings → Environment Variables
- Thêm:
  - `VITE_API_URL=https://your-api-railway.railway.app/api`
  - `VITE_WEBSOCKET_URL=https://your-ws-railway.railway.app`

### 3. Cập Nhật `src/env.ts` để dùng Environment Variables:
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (isProduction ? 'https://your-api-railway.railway.app/api' : 'http://localhost:3000/api');

export const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL ||
  (isProduction ? 'https://your-ws-railway.railway.app' : 'http://localhost:3001');
```

## 🔒 Security & Environment Variables

### Variables Cần Thiết:

#### API Server:
- `PORT=3000`
- `NODE_ENV=production`
- `JWT_SECRET=your-strong-secret-key-here` (tạo random string mạnh)
- `FRONTEND_URL=https://your-vercel-app.vercel.app`
- `BLOB_READ_WRITE_TOKEN` (nếu dùng Vercel Blob Storage)

#### WebSocket Server:
- `PORT=3001`
- `NODE_ENV=production`
- `JWT_SECRET=your-strong-secret-key-here` (CÙNG với API server)
- `FRONTEND_URL=https://your-vercel-app.vercel.app`
- `API_URL=https://your-api-railway.railway.app`

### Tạo JWT Secret Mạnh:
```bash
# Trên terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📋 Checklist Deploy

### Backend (Railway/Render/Fly.io):
- [ ] Deploy API server
- [ ] Deploy WebSocket server
- [ ] Cấu hình environment variables
- [ ] Test API endpoint: `https://your-api-url/health`
- [ ] Test WebSocket: `https://your-ws-url/health`
- [ ] Kiểm tra CORS settings
- [ ] Kiểm tra JWT_SECRET khớp giữa 2 servers

### Frontend (Vercel):
- [ ] Deploy frontend
- [ ] Cập nhật `API_BASE_URL` trong code
- [ ] Cập nhật `WEBSOCKET_URL` trong code
- [ ] Thêm environment variables trên Vercel
- [ ] Test kết nối API
- [ ] Test kết nối WebSocket
- [ ] Test login/register
- [ ] Test messaging

## 🐛 Troubleshooting

### Lỗi: CORS Error
**Nguyên nhân:** Backend không cho phép frontend domain
**Giải pháp:** Cập nhật CORS trong `server.ts`:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-vercel-app.vercel.app',
  credentials: true
}));
```

### Lỗi: WebSocket Connection Failed
**Nguyên nhân:** WebSocket server không accessible
**Giải pháp:**
1. Kiểm tra WebSocket server đang chạy
2. Kiểm tra CORS settings
3. Kiểm tra firewall/network settings
4. Kiểm tra URL trong frontend

### Lỗi: JWT Token Invalid
**Nguyên nhân:** JWT_SECRET không khớp giữa API và WebSocket server
**Giải pháp:** Đảm bảo cả 2 servers dùng CÙNG JWT_SECRET

### Lỗi: Port Already in Use
**Nguyên nhân:** Port đã được sử dụng
**Giải pháp:** Railway/Render tự động assign port, dùng `process.env.PORT`

## 📚 Tài Liệu Tham Khảo

- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [Fly.io Documentation](https://fly.io/docs/)
- [Vercel Documentation](https://vercel.com/docs)

## 💡 Tips

1. **Free Tier Limits:**
   - Railway: $5 credit/tháng
   - Render: 750 giờ/tháng (có thể sleep sau 15 phút không dùng)
   - Fly.io: 3 shared-cpu VMs

2. **Database:**
   - Railway: Có thể dùng PostgreSQL addon
   - Render: Có thể dùng PostgreSQL
   - Hiện tại project dùng JSON files, có thể migrate sang database sau

3. **Monitoring:**
   - Railway: Có built-in logs
   - Render: Có logs và metrics
   - Fly.io: Có logs và metrics

4. **Custom Domain:**
   - Railway: Hỗ trợ custom domain miễn phí
   - Render: Hỗ trợ custom domain
   - Fly.io: Hỗ trợ custom domain

## 🎯 Recommended Setup

**Best Practice:**
1. **Frontend:** Vercel (miễn phí, tốt cho React)
2. **API Server:** Railway (dễ setup, miễn phí)
3. **WebSocket Server:** Railway (cùng platform, dễ quản lý)
4. **Database:** Railway PostgreSQL (nếu cần sau này)

**Cost:** $0 (nếu dùng free tier)

## ✅ Sau Khi Deploy

1. **Test API:**
   ```bash
   curl https://your-api-url/health
   ```

2. **Test WebSocket:**
   - Mở browser console
   - Kiểm tra WebSocket connection

3. **Test Frontend:**
   - Login/Register
   - Messaging
   - Active Now (WebSocket)

4. **Monitor:**
   - Kiểm tra logs trên Railway/Render
   - Kiểm tra errors trên Vercel
   - Test các tính năng chính

