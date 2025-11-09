# Fix Login 500 Error

## 🔴 Lỗi

```
Server returned invalid response: 500
```

Khi đăng nhập, server trả về lỗi 500.

## 📋 Nguyên Nhân

Lỗi 500 có thể do:

1. **Blob Storage chưa được setup đúng:**
   - `BLOB_READ_WRITE_TOKEN` chưa được set trên Vercel
   - File `users.json` chưa được upload lên Blob Storage
   - Blob Storage không thể đọc được

2. **Lỗi khi đọc từ Blob Storage:**
   - Network error khi fetch blob
   - Blob không tồn tại
   - Blob trả về HTML error page thay vì JSON

3. **Lỗi khi parse JSON:**
   - Blob content không phải là JSON hợp lệ
   - Blob content bị corrupted

## ✅ Giải Pháp

### Bước 1: Kiểm Tra Vercel Environment Variables

1. Vào **Vercel Dashboard** → Project → **Settings** → **Environment Variables**
2. Kiểm tra `BLOB_READ_WRITE_TOKEN`:
   - **Key:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** Token từ Blob Storage (bắt đầu với `vercel_blob_rw_...`)
   - **Environment:** Production, Preview, Development (tất cả)

3. Nếu chưa có → Thêm token:
   - Lấy token từ Blob Storage settings
   - Thêm vào Vercel environment variables
   - Redeploy project

### Bước 2: Kiểm Tra Blob Storage Files

1. Vào **Vercel Dashboard** → Project → **Storage**
2. Click vào Blob Storage (`tutor-student`)
3. Vào **Browser** tab
4. Kiểm tra file `data/users.json`:
   - ✅ File có tồn tại không?
   - ✅ File có size > 0 không?
   - ✅ File có thể download được không?

5. Nếu file không tồn tại → Upload lại:
   ```bash
   BLOB_READ_WRITE_TOKEN=your-token npx tsx scripts/upload-to-blob.ts
   ```

### Bước 3: Kiểm Tra Vercel Function Logs

1. Vào **Vercel Dashboard** → Project → **Functions**
2. Click vào function `/api/auth/login`
3. Xem **Logs** tab
4. Tìm lỗi cụ thể:
   - `BLOB_READ_WRITE_TOKEN is not set`
   - `No blob found for users.json`
   - `Failed to fetch blob`
   - `Invalid JSON format`

### Bước 4: Test Blob Storage

1. Test đọc file từ Blob Storage:
   ```bash
   # Set token
   export BLOB_READ_WRITE_TOKEN=your-token
   
   # Test read
   node -e "
   import('@vercel/blob').then(({ list }) => {
     list({ prefix: 'data/users.json' }).then(result => {
       console.log('Blobs:', result.blobs.map(b => b.pathname));
     });
   });
   "
   ```

## 🔍 Debugging

### Check Logs

Code đã được cập nhật để log chi tiết hơn:

```
[Blob Storage] Attempting to read users.json from data/users.json
[Blob Storage] Found 1 blobs with prefix data/users.json
[Blob Storage] Found blob at data/users.json, URL: https://...
[Blob Storage] Successfully read users.json, found 10 items
```

### Common Errors

#### Error 1: `BLOB_READ_WRITE_TOKEN is not set`

**Solution:**
- Thêm `BLOB_READ_WRITE_TOKEN` vào Vercel environment variables
- Redeploy project

#### Error 2: `No blob found for users.json`

**Solution:**
- Upload file lên Blob Storage:
  ```bash
  BLOB_READ_WRITE_TOKEN=your-token npx tsx scripts/upload-to-blob.ts
  ```

#### Error 3: `Failed to fetch blob: 404`

**Solution:**
- Kiểm tra file có tồn tại trong Blob Storage không
- Kiểm tra path có đúng không (`data/users.json`)
- Upload lại file nếu cần

#### Error 4: `Invalid JSON format`

**Solution:**
- Kiểm tra file có bị corrupted không
- Upload lại file từ local:
  ```bash
  BLOB_READ_WRITE_TOKEN=your-token npx tsx scripts/upload-to-blob.ts
  ```

## 🚀 Quick Fix

### Option 1: Upload Files Again

```bash
# Set token
export BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xwOA5VJjf30ajOZs_lz7krAFWU83LbbUADufrwawyA97MrQ

# Upload files
npx tsx scripts/upload-to-blob.ts
```

### Option 2: Verify Vercel Environment Variables

1. Vào **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Verify `BLOB_READ_WRITE_TOKEN` is set
3. Redeploy project

### Option 3: Check Vercel Function Logs

1. Vào **Vercel Dashboard** → **Functions**
2. Click `/api/auth/login`
3. Xem logs để tìm lỗi cụ thể

## 📝 Code Changes

### Improved Error Handling

- ✅ Added detailed logging for Blob Storage operations
- ✅ Throw errors instead of returning empty array for critical files
- ✅ Better error messages with context

### Critical Files

Files that will throw errors instead of returning empty array:
- `users.json` - Required for login
- `messages.json` - Required for messaging
- `conversations.json` - Required for conversations

## ✅ Verification

Sau khi fix, kiểm tra:

1. ✅ **Vercel Environment Variables** - `BLOB_READ_WRITE_TOKEN` is set
2. ✅ **Blob Storage Files** - `data/users.json` exists
3. ✅ **Vercel Function Logs** - No errors
4. ✅ **Login Test** - Can login successfully

## 🎯 Next Steps

1. ✅ **Check Vercel logs** - Xem lỗi cụ thể
2. ✅ **Verify Blob Storage** - File `users.json` exists
3. ✅ **Upload files** - Nếu file không tồn tại
4. ✅ **Test login** - Verify fix works

## 📚 Resources

- [Vercel Blob Storage Docs](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel Function Logs](https://vercel.com/docs/functions/logs)

