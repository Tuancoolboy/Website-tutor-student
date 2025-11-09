# Thông Tin API Server - Chạy Ở Đâu?

## 📍 API Server Chạy Trên Port Nào?

### 🔍 Trong Code:

#### File: `server.ts`
```typescript
// Dòng 275-294
const PORT = config.api.port;
app.listen(PORT, () => {
  console.log(`Port: ${PORT}`);
  console.log(`API Base: http://localhost:${PORT}/api`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
});
```

#### File: `lib/config.ts`
```typescript
// Dòng 31-34
api: {
  // Support both PORT (Render/Railway) and API_PORT (local)
  port: parseInt(process.env.PORT || process.env.API_PORT || '3000'),
  basePath: '/api'
}
```

#### File: `package.json`
```json
// Dòng 8
"api": "tsx server.ts"
```

## 🎯 Port Configuration

### Mặc Định:
- **Port:** `3000`
- **URL:** `http://localhost:3000`
- **API Base:** `http://localhost:3000/api`
- **Health Check:** `http://localhost:3000/health`

### Environment Variables:

#### Local Development:
- Không cần set (dùng default 3000)
- Hoặc set: `API_PORT=3000`

#### Render/Railway:
- Render/Railway tự động set: `PORT=xxxx` (tự động assign)
- Code sẽ dùng `process.env.PORT` (ưu tiên)
- Fallback về `process.env.API_PORT` hoặc `3000`

## 🔧 Cách Server Khởi Động

### 1. Command:
```bash
npm run api
```

### 2. Flow:
1. Chạy `npm run api`
2. `tsx server.ts` → Load và execute `server.ts`
3. `server.ts` → Import `config` từ `lib/config.ts`
4. `config.api.port` → Lấy port:
   - Ưu tiên: `process.env.PORT` (Render/Railway)
   - Thứ 2: `process.env.API_PORT` (local override)
   - Fallback: `3000` (default)
5. `app.listen(PORT)` → Start Express server trên port đó

### 3. Output:
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║           🎓 Tutor Support System API Server                ║
║                                                              ║
║  Status: ✅ Running                                          ║
║  Port: 3000                                                  ║
║  Environment: development                                    ║
║                                                              ║
║  API Base: http://localhost:3000/api                         ║
║  Health Check: http://localhost:3000/health                  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## 🌐 URLs Theo Environment

### Local Development:
```
API Server: http://localhost:3000
API Base: http://localhost:3000/api
Health Check: http://localhost:3000/health
```

### Render:
```
API Server: https://tutor-api.onrender.com
API Base: https://tutor-api.onrender.com/api
Health Check: https://tutor-api.onrender.com/health
```

### Railway:
```
API Server: https://tutor-api-production.up.railway.app
API Base: https://tutor-api-production.up.railway.app/api
Health Check: https://tutor-api-production.up.railway.app/health
```

## 📋 Tóm Tắt

| Environment | Port Source | Default | URL Format |
|-------------|-------------|---------|------------|
| **Local** | `API_PORT` hoặc default | `3000` | `http://localhost:3000` |
| **Render** | `PORT` (tự động) | Auto | `https://your-app.onrender.com` |
| **Railway** | `PORT` (tự động) | Auto | `https://your-app.railway.app` |

## ✅ Đã Sửa

### 1. Port Configuration:
- ✅ Hỗ trợ `process.env.PORT` (Render/Railway)
- ✅ Hỗ trợ `process.env.API_PORT` (local)
- ✅ Fallback về `3000` (default)

### 2. Server Startup:
- ✅ Bỏ điều kiện `if (process.env.NODE_ENV !== 'production')`
- ✅ Server sẽ chạy ở cả development và production
- ✅ Tương thích với Render/Railway

## 🎯 Kết Luận

**API Server:**
- **File:** `server.ts`
- **Port:** `3000` (local) hoặc port được assign bởi Render/Railway
- **Command:** `npm run api`
- **Config:** `lib/config.ts`
- **URL:** `http://localhost:3000/api` (local) hoặc domain từ Render/Railway

**WebSocket Server:**
- **File:** `ws-server.ts`
- **Port:** `3001` (local) hoặc port được assign bởi Render/Railway
- **Command:** `npm run ws`
- **Config:** Direct `process.env.PORT || 3001`
- **URL:** `http://localhost:3001` (local) hoặc domain từ Render/Railway

