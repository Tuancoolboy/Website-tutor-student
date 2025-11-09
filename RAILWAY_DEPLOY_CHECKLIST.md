# Railway Deploy Checklist - Quick Guide

## 🚀 Quick Steps

### Service 1: API Server

- [ ] **Tạo Service:**
  - New Project → Deploy from GitHub repo
  - Chọn repository: `Website-tutor-student`

- [ ] **Cấu Hình:**
  - Name: `tutor-api`
  - Start Command: `npm run api`
  - Root Directory: `/` (để trống)

- [ ] **Environment Variables:**
  - `PORT=3000`
  - `NODE_ENV=production`
  - `JWT_SECRET=your-secret-key-here`
  - `FRONTEND_URL=https://your-vercel-app.vercel.app`

- [ ] **Lấy Domain:**
  - Copy domain: `https://tutor-api-production.up.railway.app`
  - Test: `curl https://tutor-api-production.up.railway.app/health`

### Service 2: WebSocket Server

- [ ] **Tạo Service:**
  - New Service → GitHub Repo
  - Chọn cùng repository: `Website-tutor-student`

- [ ] **Cấu Hình:**
  - Name: `tutor-websocket`
  - Start Command: `npm run ws`
  - Root Directory: `/` (để trống)

- [ ] **Environment Variables:**
  - `PORT=3001`
  - `NODE_ENV=production`
  - `JWT_SECRET=your-secret-key-here` (CÙNG với API Server)
  - `FRONTEND_URL=https://your-vercel-app.vercel.app`
  - `API_URL=https://tutor-api-production.up.railway.app`

- [ ] **Lấy Domain:**
  - Copy domain: `https://tutor-websocket-production.up.railway.app`
  - Test: `curl https://tutor-websocket-production.up.railway.app/health`

## ✅ Verification

- [ ] API Server health check: ✅
- [ ] WebSocket Server health check: ✅
- [ ] Logs không có lỗi: ✅
- [ ] Environment variables đã cấu hình: ✅

## 📝 Information to Save

```
API Server URL: https://tutor-api-production.up.railway.app
API Base URL: https://tutor-api-production.up.railway.app/api

WebSocket Server URL: https://tutor-websocket-production.up.railway.app

JWT_SECRET: [your-secret-key]

Frontend URL: https://your-vercel-app.vercel.app
```

## 🎯 Next: Update Frontend

Sau khi deploy xong, cập nhật frontend:
1. Cập nhật `src/env.ts` với Railway URLs
2. Thêm environment variables trên Vercel
3. Deploy frontend lên Vercel

## 🐛 Common Issues

- **Build failed:** Kiểm tra Start Command (`npm run api` / `npm run ws`)
- **Port error:** Railway tự động assign port, không cần cấu hình
- **CORS error:** Kiểm tra `FRONTEND_URL` environment variable
- **JWT error:** Đảm bảo cả 2 servers dùng CÙNG `JWT_SECRET`

## 📚 Full Guide

Xem file `HUONG_DAN_DEPLOY_RAILWAY_CHI_TIET.md` để biết chi tiết từng bước.

