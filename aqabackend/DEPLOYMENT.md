# Deployment Guide for Vercel

## Method 1: Vercel CLI (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd /Users/pavan/Desktop/aqabackend
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **aqabackend** (or your preferred name)
- Directory? **./**
- Override settings? **N**

### Step 4: Add Environment Variables
After deployment, add these in Vercel Dashboard:

1. Go to your project on vercel.com
2. Navigate to Settings > Environment Variables
3. Add:
   - `MONGODB_URI` = `mongodb+srv://aqa:12345@cluster0.zsqkib3.mongodb.net/aqa_shrimp_ai`
   - `JWT_SECRET` = `aqa_shrimp_ai_super_secret_key_2025_change_this_in_production`
   - `NODE_ENV` = `production`

### Step 5: Redeploy
```bash
vercel --prod
```

Your API will be live at: `https://your-project-name.vercel.app`

---

## Method 2: GitHub + Vercel Dashboard

### Step 1: Push to GitHub
```bash
cd /Users/pavan/Desktop/aqabackend
git init
git add .
git commit -m "Initial commit: AQA Shrimp AI Backend"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Other**
   - Root Directory: **./`**
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

### Step 3: Add Environment Variables
In the deployment configuration, add:
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV` = `production`

### Step 4: Deploy
Click "Deploy" and wait for completion.

---

## Testing Deployed API

Replace `http://localhost:3000` with your Vercel URL:

```bash
# Test health check
curl https://your-project.vercel.app/

# Test signup
curl -X POST https://your-project.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## Important Notes

1. **Environment Variables**: Always set them in Vercel Dashboard before first deployment
2. **MongoDB Atlas**: Ensure your IP is whitelisted (or use 0.0.0.0/0 for all IPs)
3. **CORS**: Already configured to allow all origins for mobile app
4. **Cold Starts**: First request may be slow (serverless warmup)
5. **Logs**: View logs in Vercel Dashboard under "Deployments" > "Function Logs"

---

## Troubleshooting

### Error: "Cannot connect to MongoDB"
- Check MongoDB Atlas IP whitelist
- Verify connection string in environment variables
- Ensure database user has read/write permissions

### Error: "Module not found"
- Ensure `package.json` is in root directory
- Check `vercel.json` configuration
- Redeploy with `vercel --prod`

### Error: "JWT token invalid"
- Ensure `JWT_SECRET` is set in Vercel environment variables
- Check token expiration (7 days default)
- Verify token format: `Bearer <token>`

---

## Updating Deployed API

### For automatic deployments:
Push to GitHub main branch - Vercel auto-deploys

### For manual deployments:
```bash
vercel --prod
```

---

## Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

Your API will be available at: `https://api.yourdomain.com`
