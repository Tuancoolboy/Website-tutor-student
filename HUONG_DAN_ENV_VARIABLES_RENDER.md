# Hướng Dẫn Điền Environment Variables trên Render

## 📋 Cách Điền Environment Variables

Trên Render, khi thêm Environment Variable, bạn sẽ thấy 2 fields:

1. **Key** (Tên biến) - Bên trái
2. **Value** (Giá trị) - Bên phải

## 🔧 Hướng Dẫn Chi Tiết

### Bước 1: Tìm Mục Environment Variables

1. Trong form cấu hình service, scroll xuống
2. Tìm mục **"Environment Variables"** hoặc **"Environment"**
3. Click **"Add Environment Variable"** hoặc **"Add Variable"**

### Bước 2: Điền Từng Biến

Sau khi click "Add Environment Variable", bạn sẽ thấy form:

```
┌─────────────────────────────────────┐
│ Environment Variables               │
├─────────────────────────────────────┤
│ Key: [_____________]                │
│ Value: [_____________]              │
│                                     │
│ [Save] [Cancel]                     │
└─────────────────────────────────────┘
```

## 📝 Ví Dụ Cụ Thể

### Biến 1: PORT

**Cho API Server:**
- **Key:** `PORT`
- **Value:** `3000`
- Click **"Save"**

**Cho WebSocket Server:**
- **Key:** `PORT`
- **Value:** `3001`
- Click **"Save"**

### Biến 2: NODE_ENV

**Cho cả 2 servers:**
- **Key:** `NODE_ENV`
- **Value:** `production`
- Click **"Save"**

### Biến 3: JWT_SECRET

**Cho cả 2 servers (QUAN TRỌNG: Phải CÙNG giá trị!):**

**Cách tạo JWT_SECRET mạnh:**
1. Mở terminal
2. Chạy lệnh:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Copy kết quả (ví dụ: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`)

**Điền vào Render:**
- **Key:** `JWT_SECRET`
- **Value:** `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6` (paste giá trị vừa tạo)
- Click **"Save"**

**⚠️ Lưu ý:** 
- Phải dùng **CÙNG** giá trị cho cả API Server và WebSocket Server
- Giá trị này phải **BẢO MẬT** (không chia sẻ công khai)

### Biến 4: FRONTEND_URL

**Cho cả 2 servers:**

**Nếu đã có Vercel URL:**
- **Key:** `FRONTEND_URL`
- **Value:** `https://website-tutor-student.vercel.app` (thay bằng URL thực tế của bạn)
- Click **"Save"**

**Nếu chưa có Vercel URL:**
- **Key:** `FRONTEND_URL`
- **Value:** `https://your-vercel-app.vercel.app` (tạm thời, sẽ cập nhật sau)
- Click **"Save"**
- **Nhớ cập nhật lại sau khi có Vercel URL!**

### Biến 5: API_URL (Chỉ cho WebSocket Server)

**Chỉ thêm cho WebSocket Server:**

Sau khi deploy API Server, bạn sẽ có domain (ví dụ: `https://tutor-api.onrender.com`)

- **Key:** `API_URL`
- **Value:** `https://tutor-api.onrender.com` (domain của API Server)
- Click **"Save"**

## 📊 Tổng Hợp

### API Server Environment Variables:

| Key | Value | Ghi Chú |
|-----|-------|---------|
| `PORT` | `3000` | Port cho API server |
| `NODE_ENV` | `production` | Môi trường production |
| `JWT_SECRET` | `a1b2c3d4...` | Secret key (tạo random) |
| `FRONTEND_URL` | `https://your-vercel-app.vercel.app` | URL Vercel frontend |

### WebSocket Server Environment Variables:

| Key | Value | Ghi Chú |
|-----|-------|---------|
| `PORT` | `3001` | Port cho WebSocket server |
| `NODE_ENV` | `production` | Môi trường production |
| `JWT_SECRET` | `a1b2c3d4...` | **CÙNG** với API Server |
| `FRONTEND_URL` | `https://your-vercel-app.vercel.app` | URL Vercel frontend |
| `API_URL` | `https://tutor-api.onrender.com` | Domain của API Server |

## ✅ Checklist

Sau khi thêm xong, kiểm tra:

- [ ] Đã thêm tất cả environment variables
- [ ] Key và Value đã điền đúng
- [ ] JWT_SECRET giống nhau ở cả 2 servers
- [ ] FRONTEND_URL đã điền (hoặc sẽ cập nhật sau)
- [ ] API_URL đã điền domain của API Server (cho WebSocket Server)

## 🎯 Ví Dụ Hoàn Chỉnh

### API Server:

```
Environment Variables:
┌─────────────────────────────────────────────┐
│ Key: PORT              Value: 3000          │
│ Key: NODE_ENV          Value: production    │
│ Key: JWT_SECRET        Value: a1b2c3d4...   │
│ Key: FRONTEND_URL      Value: https://...   │
└─────────────────────────────────────────────┘
```

### WebSocket Server:

```
Environment Variables:
┌─────────────────────────────────────────────┐
│ Key: PORT              Value: 3001          │
│ Key: NODE_ENV          Value: production    │
│ Key: JWT_SECRET        Value: a1b2c3d4...   │ (CÙNG với API)
│ Key: FRONTEND_URL      Value: https://...   │
│ Key: API_URL           Value: https://...   │
└─────────────────────────────────────────────┘
```

## 💡 Tips

1. **JWT_SECRET:**
   - Tạo một lần, dùng cho cả 2 servers
   - Lưu lại để dùng sau (không mất)
   - Không chia sẻ công khai

2. **FRONTEND_URL:**
   - Có thể điền tạm thời
   - Cập nhật lại sau khi có Vercel URL
   - Có thể edit sau trong Settings

3. **API_URL:**
   - Chỉ cần cho WebSocket Server
   - Lấy từ domain của API Server
   - Có thể edit sau trong Settings

4. **Kiểm tra lại:**
   - Sau khi thêm xong, scroll lên xem lại
   - Đảm bảo không có typo
   - Đảm bảo JWT_SECRET giống nhau

## 🐛 Lỗi Thường Gặp

### Lỗi: "Invalid environment variable"

**Nguyên nhân:**
- Key hoặc Value có ký tự đặc biệt
- Key có khoảng trắng

**Giải pháp:**
- Key không có khoảng trắng
- Value có thể có ký tự đặc biệt (nhưng phải đúng format)

### Lỗi: "JWT token invalid"

**Nguyên nhân:**
- JWT_SECRET không khớp giữa 2 servers

**Giải pháp:**
- Đảm bảo JWT_SECRET **CÙNG** giá trị ở cả 2 servers
- Copy-paste để tránh typo

## ✅ Hoàn Thành

Sau khi điền xong tất cả environment variables:
1. Click **"Create Web Service"** (hoặc **"Save"** nếu đang edit)
2. Render sẽ deploy service với các environment variables này
3. Kiểm tra logs để đảm bảo không có lỗi

