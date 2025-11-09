# Hướng Dẫn Test Sau Khi Deploy

## ✅ Vercel Auto-Deploy

### Vercel Tự Động Deploy:
- ✅ Khi bạn push code lên GitHub
- ✅ Vercel tự động detect changes
- ✅ Tự động build và deploy
- ✅ Không cần làm gì thêm

## 🚀 Các Bước

### Bước 1: Kiểm Tra Deployment Status

1. Vào Vercel Dashboard: https://vercel.com
2. Chọn project: `website-tutor-student`
3. Vào tab **"Deployments"**
4. Kiểm tra deployment mới nhất:
   - ✅ **Status:** "Ready" (màu xanh)
   - ⏳ **Status:** "Building" (đang build)
   - ❌ **Status:** "Error" (có lỗi)

### Bước 2: Đợi Deploy Hoàn Thành

- ⏳ **Thời gian:** 2-5 phút
- ✅ **Khi nào:** Status chuyển sang "Ready"
- 🔔 **Thông báo:** Vercel sẽ gửi email khi deploy xong (nếu đã bật)

### Bước 3: Test Trên Website

1. Mở browser: `https://website-tutor-student-s8rl.vercel.app`
2. **Hard refresh** để clear cache:
   - **Windows/Linux:** `Ctrl + Shift + R` hoặc `Ctrl + F5`
   - **Mac:** `Cmd + Shift + R`
3. Đăng nhập
4. Test các tính năng:
   - ✅ Gửi tin nhắn
   - ✅ Active Now
   - ✅ Real-time messaging
   - ✅ Online status

## 🔍 Kiểm Tra Lỗi

### Nếu Có Lỗi:

1. **Xem Logs trên Vercel:**
   - Vào Deployment → Click vào deployment
   - Xem tab **"Logs"**
   - Tìm lỗi chi tiết

2. **Xem Browser Console:**
   - Mở Browser Console (F12)
   - Xem lỗi JavaScript
   - Xem Network requests

3. **Test API Endpoints:**
   ```bash
   # Test health endpoint
   curl https://website-tutor-student-s8rl.vercel.app/api/health
   
   # Test users endpoint
   curl https://website-tutor-student-s8rl.vercel.app/api/users?limit=10
   ```

## ✅ Checklist Test

### Frontend:
- [ ] Website load được
- [ ] Đăng nhập hoạt động
- [ ] Messages page load được
- [ ] Active Now hiển thị
- [ ] Gửi tin nhắn hoạt động
- [ ] Không còn `ERR_INSUFFICIENT_RESOURCES`
- [ ] Không còn requests liên tục

### API:
- [ ] Health endpoint hoạt động
- [ ] Users endpoint hoạt động
- [ ] Messages endpoint hoạt động
- [ ] Conversations endpoint hoạt động

### WebSocket:
- [ ] WebSocket connection thành công
- [ ] Online status hoạt động
- [ ] Active Now cập nhật real-time

## 🐛 Troubleshooting

### Lỗi: "Website không load"

**Nguyên nhân:**
- Deployment chưa hoàn thành
- Build failed

**Giải pháp:**
1. Kiểm tra deployment status trên Vercel
2. Xem logs để tìm lỗi
3. Đợi deployment hoàn thành

### Lỗi: "ERR_INSUFFICIENT_RESOURCES"

**Nguyên nhân:**
- Code cũ chưa được deploy
- Cache chưa được clear

**Giải pháp:**
1. Hard refresh browser (`Ctrl + Shift + R`)
2. Clear browser cache
3. Đợi Vercel deploy xong
4. Test lại

### Lỗi: "Failed to fetch"

**Nguyên nhân:**
- API server chưa ready
- CORS error
- Network error

**Giải pháp:**
1. Kiểm tra API endpoint: `/api/health`
2. Kiểm tra CORS settings
3. Kiểm tra browser console
4. Kiểm tra network tab

## 🎯 Quick Test

### Test Nhanh:

1. **Mở website:** `https://website-tutor-student-s8rl.vercel.app`
2. **Hard refresh:** `Ctrl + Shift + R` (hoặc `Cmd + Shift + R`)
3. **Đăng nhập**
4. **Vào Messages**
5. **Kiểm tra:**
   - ✅ Active Now load được
   - ✅ Không còn requests liên tục
   - ✅ Gửi tin nhắn hoạt động

## 📝 Lưu Ý

### Cache:
- **Browser cache:** Cần hard refresh để clear
- **Vercel cache:** Tự động clear khi deploy mới
- **CDN cache:** Tự động clear sau vài phút

### Deployment Time:
- **Build time:** 2-5 phút
- **Deploy time:** 1-2 phút
- **Total:** 3-7 phút

### Auto-Deploy:
- ✅ **Tự động:** Khi push lên GitHub
- ✅ **Tự động:** Khi merge PR
- ✅ **Tự động:** Khi có thay đổi code

## ✅ Kết Luận

### Sau Khi Push:
1. ✅ Vercel tự động detect changes
2. ✅ Tự động build và deploy
3. ✅ Đợi 3-7 phút
4. ✅ Test trên website
5. ✅ Hard refresh để clear cache

### Test:
- ✅ Website hoạt động
- ✅ Không còn lỗi
- ✅ Tính năng hoạt động bình thường

## 🎉 Hoàn Thành

Sau khi deploy xong:
- ✅ Code mới đã được deploy
- ✅ Lỗi đã được fix
- ✅ Website hoạt động bình thường
- ✅ Có thể test ngay

