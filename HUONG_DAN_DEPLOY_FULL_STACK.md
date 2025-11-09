# Hướng Dẫn Deploy Full Stack: Frontend (Vercel) + Backend (Railway)

## ✅ Kiến Trúc Đề Xuất

```
┌─────────────────────────────────────────┐
│         Frontend (React)                │
│         Deploy trên Vercel              │
│         https://your-app.vercel.app     │
└──────────────┬──────────────────────────┘
               │
               │ HTTP Requests
               │ WebSocket Connection
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌──────────────┐  ┌──────────────┐
│  API Server  │  │  WebSocket   │
│  (Railway)   │  │  Server      │
│  Port: 3000  │  │  (Railway)   │
│              │  │  Port: 3001  │
│  https://    │  │  https://    │
│  api.railway │  │  ws.railway  │
│  .app        │  │  .app        │
└──────────────┘  └──────────────┘
```

## 🎯 Tóm Tắt

**CÓ, hoàn toàn chạy được!**

Bạn chỉ cần:
1. ✅ Deploy **backend** lên Railway (API + WebSocket)
2. ✅ Deploy **frontend** lên Vercel
3. ✅ Cập nhật URLs trong frontend
4. ✅ Cấu hình CORS trên backend

## 📋 Checklist Deploy

### Bước 1: Deploy Backend lên Railway

#### 1.1. Deploy API Server

1. **Tạo Account Railway:**
   - Vào https://railway.app
   - Đăng nhập bằng GitHub
   - Click "New Project"
   - Chọn "Deploy from GitHub repo"
   - Chọn repository: `Website-tutor-student`

2. **Cấu hình Service:**
   - **Service Name:** `tutor-api`
   - **Start Command:** `npm run api`
   - **Root Directory:** `/` (root)
   - **Port:** Railway tự động detect (dùng `process.env.PORT`)

3. **Environment Variables:**
   ```
   PORT=3000
   NODE_ENV=production
   JWT_SECRET=your-strong-secret-key-here
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

4. **Lấy Domain:**
   - Railway tự động cung cấp domain: `https://tutor-api-production.up.railway.app`
   - Copy domain này để dùng sau

#### 1.2. Deploy WebSocket Server

1. **Tạo Service thứ 2:**
   - Trong cùng project Railway
   - Click "New Service" → "GitHub Repo"
   - Chọn cùng repository

2. **Cấu hình Service:**
   - **Service Name:** `tutor-websocket`
   - **Start Command:** `npm run ws`
   - **Root Directory:** `/` (root)
   - **Port:** Railway tự động detect

3. **Environment Variables:**
   ```
   PORT=3001
   NODE_ENV=production
   JWT_SECRET=your-strong-secret-key-here  # CÙNG với API server
   FRONTEND_URL=https://your-vercel-app.vercel.app
   API_URL=https://tutor-api-production.up.railway.app
   ```

4. **Lấy Domain:**
   - Railway tự động cung cấp domain: `https://tutor-websocket-production.up.railway.app`
   - Copy domain này để dùng sau

### Bước 2: Cập Nhật Backend Code

#### 2.1. Cập Nhật CORS trong `server.ts`

```typescript
// server.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || config.frontend.url || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### 2.2. Cập Nhật Port trong `server.ts`

```typescript
// server.ts
const PORT = process.env.PORT || 3000;
// Railway tự động assign PORT, không cần hardcode
```

#### 2.3. Cập Nhật WebSocket CORS trong `ws-server.ts`

```typescript
// ws-server.ts
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || config.frontend.url || '*',
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});
```

### Bước 3: Deploy Frontend lên Vercel

#### 3.1. Cập Nhật `src/env.ts`

```typescript
// src/env.ts
const isProduction = typeof window !== 'undefined' 
  ? window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  : false;

// Thay bằng URLs thực tế từ Railway
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (isProduction 
    ? 'https://tutor-api-production.up.railway.app/api'  // URL từ Railway
    : 'http://localhost:3000/api'
  );

export const WEBSOCKET_URL = 
  import.meta.env.VITE_WEBSOCKET_URL ||
  (isProduction
    ? 'https://tutor-websocket-production.up.railway.app'  // URL từ Railway
    : 'http://localhost:3001'
  );
```

#### 3.2. Cập Nhật `src/hooks/useOnlineStatus.ts`

```typescript
// src/hooks/useOnlineStatus.ts
import { WEBSOCKET_URL } from '../env';

const WEBSOCKET_URL_FINAL = (typeof window !== 'undefined' && (window as any).__WEBSOCKET_URL__) 
  || WEBSOCKET_URL
  || 'http://localhost:3001';
```

#### 3.3. Deploy lên Vercel

1. **Push code lên GitHub:**
   ```bash
   git add .
   git commit -m "Update API URLs for production"
   git push
   ```

2. **Deploy trên Vercel:**
   - Vercel tự động deploy khi push code
   - Hoặc vào Vercel Dashboard → Deploy

3. **Thêm Environment Variables trên Vercel:**
   - Vào Vercel Dashboard → Project → Settings → Environment Variables
   - Thêm:
     ```
     VITE_API_URL=https://tutor-api-production.up.railway.app/api
     VITE_WEBSOCKET_URL=https://tutor-websocket-production.up.railway.app
     ```

### Bước 4: Test

#### 4.1. Test API Server
```bash
curl https://tutor-api-production.up.railway.app/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "..."
}
```

#### 4.2. Test WebSocket Server
```bash
curl https://tutor-websocket-production.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "websocket-server",
  "timestamp": "..."
}
```

#### 4.3. Test Frontend
1. Mở frontend: `https://your-app.vercel.app`
2. Mở Browser Console (F12)
3. Kiểm tra:
   - API calls thành công
   - WebSocket connection thành công
   - Login/Register hoạt động
   - Messaging hoạt động
   - Active Now hoạt động

## 🔧 Cấu Hình Chi Tiết

### Railway Environment Variables

#### API Server:
```env
PORT=3000
NODE_ENV=production
JWT_SECRET=your-strong-secret-key-change-this
FRONTEND_URL=https://your-vercel-app.vercel.app
```

#### WebSocket Server:
```env
PORT=3001
NODE_ENV=production
JWT_SECRET=your-strong-secret-key-change-this
FRONTEND_URL=https://your-vercel-app.vercel.app
API_URL=https://tutor-api-production.up.railway.app
```

### Vercel Environment Variables

```env
VITE_API_URL=https://tutor-api-production.up.railway.app/api
VITE_WEBSOCKET_URL=https://tutor-websocket-production.up.railway.app
```

## 🐛 Troubleshooting

### Lỗi: CORS Error

**Nguyên nhân:** Backend không cho phép frontend domain

**Giải pháp:**
1. Kiểm tra `FRONTEND_URL` trong Railway environment variables
2. Kiểm tra CORS settings trong `server.ts` và `ws-server.ts`
3. Đảm bảo `FRONTEND_URL` khớp với Vercel domain

### Lỗi: WebSocket Connection Failed

**Nguyên nhân:**
1. WebSocket server không accessible
2. CORS settings sai
3. URL không đúng

**Giải pháp:**
1. Kiểm tra WebSocket server đang chạy trên Railway
2. Kiểm tra `WEBSOCKET_URL` trong frontend
3. Kiểm tra CORS settings trong `ws-server.ts`
4. Kiểm tra browser console để xem lỗi chi tiết

### Lỗi: API Calls Failed

**Nguyên nhân:**
1. API server không accessible
2. URL không đúng
3. CORS settings sai

**Giải pháp:**
1. Kiểm tra API server đang chạy trên Railway
2. Kiểm tra `API_BASE_URL` trong frontend
3. Kiểm tra CORS settings trong `server.ts`
4. Test API endpoint trực tiếp: `curl https://your-api-url/health`

### Lỗi: JWT Token Invalid

**Nguyên nhân:** JWT_SECRET không khớp giữa API và WebSocket server

**Giải pháp:**
1. Đảm bảo cả 2 servers dùng CÙNG `JWT_SECRET`
2. Kiểm tra environment variables trên Railway
3. Restart cả 2 servers sau khi thay đổi

## ✅ Sau Khi Deploy

### Checklist:

- [ ] API Server chạy trên Railway
- [ ] WebSocket Server chạy trên Railway
- [ ] Frontend chạy trên Vercel
- [ ] Environment variables đã cấu hình đúng
- [ ] CORS settings đã cấu hình đúng
- [ ] Test API endpoint thành công
- [ ] Test WebSocket connection thành công
- [ ] Test login/register thành công
- [ ] Test messaging thành công
- [ ] Test Active Now thành công

## 💡 Tips

1. **Custom Domain:**
   - Railway: Hỗ trợ custom domain miễn phí
   - Vercel: Hỗ trợ custom domain miễn phí
   - Có thể dùng domain riêng cho cả 2

2. **Monitoring:**
   - Railway: Có built-in logs và metrics
   - Vercel: Có built-in logs và analytics
   - Có thể thêm monitoring tools (Sentry, etc.)

3. **Database:**
   - Hiện tại dùng JSON files
   - Có thể migrate sang PostgreSQL trên Railway sau

4. **Cost:**
   - Railway: $5 credit/tháng (free tier)
   - Vercel: Free tier (hobby plan)
   - **Total: $0** (nếu dùng free tier)

## 🎯 Kết Luận

**CÓ, hoàn toàn chạy được!**

Với kiến trúc này:
- ✅ Frontend trên Vercel (miễn phí, tốt cho React)
- ✅ Backend trên Railway (miễn phí, hỗ trợ WebSocket)
- ✅ Dễ maintain và scale
- ✅ Cost: $0 (free tier)

Chỉ cần follow các bước trên là được!

## 📚 Tài Liệu Tham Khảo

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [WebSocket Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

