# Fix Package Lock Sync Error

## 🔴 Lỗi

```
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync.
npm error Missing: yaml@2.8.1 from lock file
```

## 📋 Nguyên Nhân

`package-lock.json` không sync với `package.json`:
- Có dependency mới được thêm vào (hoặc thay đổi version)
- `package-lock.json` chưa được update
- Vercel sử dụng `npm ci` (yêu cầu lock file phải sync)

## ✅ Đã Fix

1. ✅ **Regenerate package-lock.json:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. ✅ **Verify sync:**
   ```bash
   npm ci --dry-run
   ```

3. ✅ **Commit package-lock.json:**
   - Đã commit package-lock.json mới (2844 lines changed)
   - Restore `npm ci` trong vercel.json

## 🚀 Next Steps

Vercel sẽ tự động deploy lại với:
- ✅ `package-lock.json` mới (synced với package.json)
- ✅ `npm ci` command (faster, more reliable)
- ✅ Build sẽ thành công

## 📝 Lưu Ý

### package-lock.json

- ✅ **Luôn commit package-lock.json** - Đảm bảo reproducible builds
- ✅ **Không edit manually** - Chỉ update bằng `npm install`
- ✅ **Sync với package.json** - Luôn chạy `npm install` sau khi thay đổi dependencies

### npm ci vs npm install

- ✅ **npm ci** - Dùng trong CI/CD (faster, stricter, requires lock file)
- ✅ **npm install** - Dùng khi develop (update lock file)
- ✅ **Best practice:** Dùng `npm ci` trong production/CI/CD

### Vercel Build

- ✅ Vercel sử dụng `npm ci` để đảm bảo reproducible builds
- ✅ Lock file phải sync với package.json
- ✅ Nếu không sync → Build sẽ fail

## 🔍 Troubleshooting

### Nếu vẫn lỗi:

1. **Clear Vercel cache:**
   - Vào **Deployments** → **Settings** → **Clear Build Cache**
   - Retry deployment

2. **Verify locally:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm ci --dry-run
   ```

3. **Check for conflicts:**
   - Kiểm tra `package.json` có conflicts không
   - Kiểm tra `package-lock.json` có conflicts không

## 📚 Resources

- [npm ci Documentation](https://docs.npmjs.com/cli/v9/commands/npm-ci)
- [package-lock.json Guide](https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json)
- [Vercel Build Configuration](https://vercel.com/docs/build-step)

## ✅ Success Criteria

- ✅ package-lock.json synced với package.json
- ✅ `npm ci` chạy thành công
- ✅ Vercel build thành công
- ✅ Dependencies được install đúng

