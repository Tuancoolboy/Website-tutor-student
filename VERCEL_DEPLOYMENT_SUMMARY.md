# Tóm Tắt Deploy Lên Vercel - API và WebSocket

## ✅ Vercel CÓ THỂ Chạy API Server

### Cách Hoạt Động:

1. **API Server trên Vercel:**
   - ✅ File `api/index.ts` export Express app
   - ✅ Vercel tự động convert thành serverless function
   - ✅ Tất cả routes trong `server.ts` hoạt động
   - ✅ Miễn phí trên Vercel free tier

2. **Cấu Hình:**
   - File `vercel.json` đã cấu hình rewrite `/api/*` → `api/index.ts`
   - Express app được export từ `server.ts`
   - `server.ts` không gọi `app.listen()` trên Vercel (check `process.env.VERCEL`)

## ❌ Vercel KHÔNG THỂ Chạy WebSocket

### WebSocket Server:

- ❌ Vercel serverless functions KHÔNG hỗ trợ WebSocket
- ❌ WebSocket cần persistent connection
- ❌ Serverless functions chỉ chạy khi có request

### Giải Pháp:

- ✅ Deploy WebSocket server riêng trên Render/Railway
- ✅ Frontend kết nối đến WebSocket server trên Render/Railway

## 🎯 Kiến Trúc Cuối Cùng

```
┌─────────────────────────────────────┐
│         Vercel Deployment           │
│  https://your-app.vercel.app        │
│  ├── Frontend (React)               │
│  │   └── src/                       │
│  └── API (Serverless Functions)     │
│      └── api/index.ts               │
│          └── Express App (server.ts)│
│              ├── /api/users         │
│              ├── /api/conversations │
│              ├── /api/messages      │
│              └── /api/*             │
└──────────────┬──────────────────────┘
               │
               │ WebSocket Connection
               │
┌──────────────▼──────────────────────┐
│    Render (WebSocket Server)        │
│  https://ws-app.onrender.com        │
│  └── ws-server.ts                   │
│      └── Socket.io                  │
│          └── Active Now             │
└─────────────────────────────────────┘
```

## 📋 Checklist Deploy

### Vercel (Frontend + API):

- [ ] Push code lên GitHub
- [ ] Connect GitHub repo với Vercel
- [ ] Vercel tự động deploy
- [ ] Test API: `https://your-app.vercel.app/api/health`
- [ ] Test Frontend: `https://your-app.vercel.app`

### Render (WebSocket):

- [ ] Tạo Web Service trên Render
- [ ] Connect GitHub repo
- [ ] Start Command: `npm run ws`
- [ ] Environment Variables: `PORT`, `JWT_SECRET`, `FRONTEND_URL`
- [ ] Test WebSocket: `https://ws-app.onrender.com/health`

### Cập Nhật Frontend:

- [ ] Cập nhật `src/env.ts`:
  - `API_BASE_URL`: Vercel domain (cùng domain với frontend)
  - `WEBSOCKET_URL`: Render domain
- [ ] Deploy lại frontend

## 🔧 Cấu Hình Files

### `api/index.ts`:
```typescript
import app from '../server.js';
export default app; // Vercel sẽ tự động handle
```

### `server.ts`:
```typescript
// Chỉ start server nếu không phải Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, ...);
}
```

### `vercel.json`:
```json
{
  "functions": {
    "api/index.ts": {
      "memory": 2048,
      "maxDuration": 60
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.ts"
    }
  ]
}
```

## ✅ Kết Quả

### API Server:
- ✅ Chạy trên Vercel (serverless functions)
- ✅ URL: `https://your-app.vercel.app/api/*`
- ✅ Miễn phí
- ✅ Tất cả routes hoạt động

### WebSocket Server:
- ✅ Chạy trên Render (traditional server)
- ✅ URL: `https://ws-app.onrender.com`
- ✅ Miễn phí (free tier)
- ✅ Active Now hoạt động

### Frontend:
- ✅ Chạy trên Vercel
- ✅ Kết nối API: Cùng domain (không cần CORS)
- ✅ Kết nối WebSocket: Render domain

## 💰 Chi Phí

- **Vercel (Frontend + API):** $0 (free tier)
- **Render (WebSocket):** $0 (free tier)
- **Tổng:** $0 (free tier)

## 🎯 Tóm Tắt

**Câu trả lời:**
- ✅ **API CÓ THỂ chạy trên Vercel** (serverless functions)
- ❌ **WebSocket KHÔNG THỂ chạy trên Vercel** (phải deploy riêng)

**Giải pháp:**
- ✅ Deploy API + Frontend trên Vercel
- ✅ Deploy WebSocket trên Render
- ✅ Cập nhật frontend để kết nối cả 2

**Tổng chi phí:** $0 (free tier)

