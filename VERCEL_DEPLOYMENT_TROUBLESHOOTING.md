# Vercel Deployment Troubleshooting

## 🔴 Vấn Đề

Vercel đang deploy commit cũ (`727e5ae`) thay vì commit mới (`a68993f`) có package-lock.json đã fix.

## ✅ Giải Pháp

### Option 1: Kiểm Tra Deployment Mới Nhất (Khuyến Nghị)

1. Vào **Vercel Dashboard** → **Deployments**
2. Kiểm tra deployment mới nhất:
   - **Commit:** Phải là `a68993f` (Fix package-lock.json sync)
   - **Status:** Đang chạy hoặc đã hoàn thành
3. Nếu deployment mới nhất vẫn là `727e5ae`:
   - Click **Redeploy** trên deployment mới nhất
   - Hoặc đợi Vercel auto-deploy (thường 1-2 phút sau khi push)

### Option 2: Clear Build Cache và Redeploy

1. Vào **Vercel Dashboard** → **Deployments**
2. Click vào deployment mới nhất
3. Vào **Settings** → **Clear Build Cache**
4. Click **Redeploy**

### Option 3: Trigger Deployment Mới

1. Vào **Vercel Dashboard** → **Deployments**
2. Click **Create Deployment**
3. Chọn **Branch:** `main`
4. Chọn **Commit:** `a68993f` (hoặc latest)
5. Click **Deploy**

### Option 4: Verify Commit trên GitHub

1. Vào **GitHub** → Repository → **Commits**
2. Kiểm tra commit mới nhất:
   - **Commit:** `a68993f` - "Fix package-lock.json sync: Regenerate lock file and restore npm ci"
   - **Files changed:** `package-lock.json` (1684 insertions, 1160 deletions)
3. Nếu commit này đã có trên GitHub → Vercel sẽ tự động deploy

## 📋 Kiểm Tra

### Local (Đã Verify)

✅ Commit mới nhất: `a68993f`
✅ package-lock.json đã có `yaml@2.8.1`
✅ `npm ci` chạy thành công local
✅ Đã push lên GitHub

### Vercel (Cần Kiểm Tra)

- [ ] Deployment mới nhất dùng commit `a68993f`
- [ ] Build cache đã được clear
- [ ] Build thành công với package-lock.json mới

## 🚀 Next Steps

1. ✅ **Kiểm tra Vercel Dashboard** - Xem deployment mới nhất
2. ✅ **Clear Build Cache** - Nếu cần
3. ✅ **Redeploy** - Trigger deployment mới
4. ✅ **Verify Build** - Kiểm tra build logs

## 🔍 Troubleshooting

### Nếu Vercel vẫn deploy commit cũ:

1. **Check GitHub webhook:**
   - Vào **Vercel Dashboard** → **Settings** → **Git**
   - Kiểm tra webhook có hoạt động không

2. **Manual trigger:**
   - Vào **Deployments** → **Create Deployment**
   - Chọn commit mới nhất

3. **Clear cache:**
   - Clear build cache
   - Clear deployment cache (nếu có)

### Nếu build vẫn fail:

1. **Check package-lock.json:**
   - Verify `yaml@2.8.1` có trong lock file
   - Verify lock file đã được commit

2. **Check vercel.json:**
   - Verify `installCommand` là `npm ci`
   - Verify `buildCommand` là `npm ci && npm run build`

3. **Check .npmrc:**
   - Verify `.npmrc` có retry settings
   - Verify registry URL đúng

## 📝 Lưu Ý

### Vercel Auto-Deploy

- ✅ Vercel tự động deploy khi push code lên GitHub
- ✅ Thường mất 1-2 phút để trigger
- ✅ Có thể bị delay nếu có nhiều deployments

### Build Cache

- ✅ Vercel cache dependencies để build nhanh hơn
- ✅ Có thể cần clear cache nếu lock file thay đổi
- ✅ Clear cache: **Settings** → **Clear Build Cache**

### Commit Sync

- ✅ Đảm bảo commit mới nhất đã được push lên GitHub
- ✅ Đảm bảo Vercel có quyền truy cập repository
- ✅ Đảm bảo webhook hoạt động đúng

## ✅ Success Criteria

- ✅ Deployment mới nhất dùng commit `a68993f`
- ✅ Build thành công với package-lock.json mới
- ✅ Không có lỗi "Missing: yaml@2.8.1"
- ✅ Dependencies được install đúng

## 📚 Resources

- [Vercel Deployment Guide](https://vercel.com/docs/concepts/deployments/overview)
- [Vercel Build Cache](https://vercel.com/docs/build-step#caching)
- [Vercel Git Integration](https://vercel.com/docs/concepts/git)

