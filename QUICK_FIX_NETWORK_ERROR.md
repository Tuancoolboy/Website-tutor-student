# Quick Fix: Vercel Build Network Error

## 🔴 Lỗi

```
npm error code ECONNRESET
npm error network aborted
```

## ✅ Đã Fix

1. ✅ **Tạo file `.npmrc`** - Configure npm registry với retry settings
2. ✅ **Cập nhật `vercel.json`** - Sử dụng `npm ci` thay vì `npm install` (faster, more reliable)
3. ✅ **Đã push code** - Vercel sẽ tự động deploy lại

## 🚀 Next Steps

### Option 1: Chờ Auto-Deploy (Khuyến Nghị)

Vercel sẽ tự động deploy lại sau khi bạn push code:
- ✅ Đợi 1-2 phút
- ✅ Vào **Deployments** tab
- ✅ Xem deployment mới nhất
- ✅ Build sẽ thành công với cấu hình mới

### Option 2: Manual Retry

Nếu muốn retry ngay:
1. Vào **Vercel Dashboard** → **Deployments**
2. Tìm deployment bị lỗi
3. Click **Retry** (hoặc **Redeploy**)
4. Đợi build hoàn thành (2-5 phút)

## 📝 Các Thay Đổi

### 1. File `.npmrc`

```
registry=https://registry.npmjs.org/
fetch-retries=3
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
```

**Lợi ích:**
- ✅ Retry tự động khi network timeout
- ✅ Tăng timeout để tránh lỗi network
- ✅ More reliable builds

### 2. File `vercel.json`

```json
{
  "buildCommand": "npm ci && npm run build",
  "installCommand": "npm ci --prefer-offline --no-audit"
}
```

**Lợi ích:**
- ✅ `npm ci` faster và more reliable hơn `npm install`
- ✅ `--prefer-offline` sử dụng cache khi có thể
- ✅ `--no-audit` skip audit (faster)

## 🧪 Kiểm Tra

Sau khi deploy, kiểm tra:

1. ✅ **Build thành công** - Không có lỗi network
2. ✅ **Dependencies installed** - Tất cả packages được install
3. ✅ **Build output created** - `dist/` folder được tạo
4. ✅ **Deployment successful** - App hoạt động bình thường

## 📊 Expected Build Time

- **Before:** 2-5 phút (có thể fail với network error)
- **After:** 1-3 phút (faster, more reliable)

## 🔍 Troubleshooting

### Nếu vẫn lỗi sau khi retry:

1. **Check network status:**
   - npm registry có đang down không?
   - Vercel build servers có đang gặp vấn đề không?

2. **Clear build cache:**
   - Vào **Deployments** → **Settings** → **Clear Build Cache**
   - Retry deployment

3. **Check dependencies:**
   - Kiểm tra `package.json` - có dependencies nào quá lớn không?
   - Kiểm tra `package-lock.json` - có được commit không?

## 📚 Resources

- [Vercel Build Configuration](https://vercel.com/docs/build-step)
- [npm ci vs npm install](https://docs.npmjs.com/cli/v9/commands/npm-ci)
- [npm Network Issues](https://docs.npmjs.com/troubleshooting/network-issues)

## ✅ Success Criteria

- ✅ Build thành công trên Vercel
- ✅ Không có lỗi network
- ✅ Dependencies được install đúng
- ✅ App deploy và hoạt động bình thường

