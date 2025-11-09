# API Server Port Configuration

## 📍 API Server Chạy Trên Port Nào?

### Trong Code:

#### File: `server.ts` (dòng 275)
```typescript
const PORT = config.api.port;
app.listen(PORT, () => {
  console.log(`Port: ${PORT}`);
});
```

#### File: `lib/config.ts` (dòng 32)
```typescript
api: {
  port: parseInt(process.env.API_PORT || '3000'),
  basePath: '/api'
}
```

### Port Mặc Định:
- **Default:** `3000`
- **Có thể override:** Bằng environment variable `API_PORT`

### Trên Render/Railway:

#### Render và Railway tự động assign port:
- Render/Railway tự động assign port qua environment variable `PORT`
- **QUAN TRỌNG:** Code hiện tại dùng `API_PORT`, nhưng Render/Railway dùng `PORT`

### 🔧 Cần Sửa:

Code hiện tại:
```typescript
// lib/config.ts
api: {
  port: parseInt(process.env.API_PORT || '3000'),
}
```

**Vấn đề:** Render/Railway dùng `process.env.PORT`, không phải `process.env.API_PORT`

**Giải pháp:** Sửa để hỗ trợ cả 2:
```typescript
api: {
  port: parseInt(process.env.PORT || process.env.API_PORT || '3000'),
}
```

## 📋 Tổng Hợp

### Local Development:
- Port: `3000` (mặc định)
- URL: `http://localhost:3000`
- API Base: `http://localhost:3000/api`

### Render/Railway:
- Port: Tự động assign (qua `process.env.PORT`)
- URL: `https://your-app.onrender.com` hoặc `https://your-app.railway.app`
- API Base: `https://your-app.onrender.com/api`

### Environment Variables:

#### Local:
- Không cần set (dùng default 3000)
- Hoặc set: `API_PORT=3000`

#### Render/Railway:
- Render/Railway tự động set: `PORT=xxxx` (tự động assign)
- **KHÔNG CẦN** set `PORT` trong environment variables
- Render/Railway tự động inject `PORT` vào process.env

## 🎯 Cách Server Khởi Động

### Command:
```bash
npm run api
```

### Script trong package.json:
```json
"api": "tsx server.ts"
```

### Flow:
1. Chạy `npm run api`
2. `tsx server.ts` → Load `server.ts`
3. `server.ts` → Import `config` từ `lib/config.ts`
4. `config.api.port` → Lấy port (mặc định 3000 hoặc từ env)
5. `app.listen(PORT)` → Start server trên port đó

## 🔍 Kiểm Tra Port Đang Chạy

### Local:
```bash
# Chạy server
npm run api

# Output sẽ hiển thị:
# Port: 3000
# API Base: http://localhost:3000/api
```

### Render/Railway:
```bash
# Xem logs trên Render/Railway dashboard
# Sẽ hiển thị port được assign
```

### Test:
```bash
# Local
curl http://localhost:3000/health

# Render
curl https://your-app.onrender.com/health

# Railway
curl https://your-app.railway.app/health
```

## ⚠️ Vấn Đề Và Giải Pháp

### Vấn Đề:
Code hiện tại dùng `process.env.API_PORT`, nhưng Render/Railway dùng `process.env.PORT`

### Giải Pháp:
Sửa `lib/config.ts` để hỗ trợ cả 2:
```typescript
api: {
  port: parseInt(process.env.PORT || process.env.API_PORT || '3000'),
}
```

### Sau Khi Sửa:
- ✅ Hoạt động trên local (dùng default 3000)
- ✅ Hoạt động trên Render (dùng PORT từ Render)
- ✅ Hoạt động trên Railway (dùng PORT từ Railway)
- ✅ Có thể override bằng API_PORT nếu cần

## 📝 Tóm Tắt

| Environment | Port Source | Default | Override |
|-------------|-------------|---------|----------|
| **Local** | `API_PORT` hoặc default | `3000` | Set `API_PORT` |
| **Render** | `PORT` (tự động) | Auto | Render tự assign |
| **Railway** | `PORT` (tự động) | Auto | Railway tự assign |

### URLs:

#### Local:
- API: `http://localhost:3000/api`
- Health: `http://localhost:3000/health`

#### Render:
- API: `https://your-app.onrender.com/api`
- Health: `https://your-app.onrender.com/health`

#### Railway:
- API: `https://your-app.railway.app/api`
- Health: `https://your-app.railway.app/health`

## ✅ Kết Luận

- **API Server chạy trên:** Port 3000 (local) hoặc port được assign bởi Render/Railway
- **Config file:** `lib/config.ts`
- **Start command:** `npm run api`
- **Main file:** `server.ts`
- **Cần sửa:** Hỗ trợ `process.env.PORT` để tương thích với Render/Railway

