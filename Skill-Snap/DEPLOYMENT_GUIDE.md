# SkillSnap Azure Deployment Guide (GitHub Actions)

This guide walks you through deploying the combined SkillSnap API + Blazor WebAssembly client to Azure App Service using GitHub Actions CI/CD.

## Prerequisites

- GitHub repository access (you're reading this, so ✅)
- Azure subscription with permissions to create resources
- Azure Portal access

## Step 1: Create Azure Resources

### 1.1 Create a Resource Group

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for **"Resource groups"** → click **+ Create**
3. Fill in:
   - **Subscription**: Select your Azure subscription
   - **Resource group name**: `SkillSnap-RG` (or your preference)
   - **Region**: Choose nearest to you (e.g., `East US`, `West Europe`, `Central US`)
4. Click **Review + create** → **Create**
5. Wait for deployment to complete

### 1.2 Create an App Service Plan

1. Search for **"App Service plans"** → click **+ Create**
2. Fill in:
   - **Subscription**: Same as above
   - **Resource group**: Select `SkillSnap-RG` (from step 1.1)
   - **Name**: `SkillSnap-Plan` (or your preference)
   - **Operating System**: **Windows**
   - **Region**: Same region as resource group
   - **Pricing tier**: Click **Change size** → Select **B1 (Basic)** for testing, or **S1 (Standard)** for production
3. Click **Review + create** → **Create**
4. Wait for deployment to complete

### 1.3 Create a Web App

1. Search for **"App Services"** → click **+ Create**
2. Click **Web App**
3. Fill in:
   - **Subscription**: Same as above
   - **Resource group**: Select `SkillSnap-RG`
   - **Name**: `skillsnap-<unique>` (must be globally unique; e.g., `skillsnap-sohaib-1127`, `skillsnap-demo-prod`)
     - Azure will check availability as you type (green checkmark = available)
   - **Publish**: **Code**
   - **Runtime stack**: **.NET 9** (or the latest available)
   - **Operating System**: **Windows**
   - **Region**: Same as resource group
   - **App Service plan**: Select `SkillSnap-Plan` (from step 1.2)
4. Click **Review + create** → **Create**
5. Wait for deployment to complete (~1-2 minutes)

## Step 2: Download Publish Profile

1. After the Web App is created, go to the **Web App overview** page
2. Click the **Get publish profile** button (top-right area, or look for the download icon)
   - This downloads a `.PublishSettings` XML file to your computer
3. **Open the file in a text editor** (Notepad, VS Code, etc.)
4. **Copy the entire contents** of the XML file (Ctrl+A → Ctrl+C)
   - Keep this file safe; it contains deployment credentials

## Step 3: Add GitHub Secrets

1. Go to your GitHub repository: `https://github.com/sohaibdevv/Skill-Snap`
2. Click **Settings** (top menu bar)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** (green button, top-right)

### Secret 1: Publish Profile

- **Name**: `COMBINED_PUBLISH_PROFILE`
- **Secret**: Paste the entire XML content from the publish profile file you downloaded in Step 2
- Click **Add secret**

### Secret 2: App Name

- Click **New repository secret** again
- **Name**: `COMBINED_APP_NAME`
- **Secret**: Paste the name of your Web App (e.g., `skillsnap-sohaib-1127`)
- Click **Add secret**

### Verify Secrets

You should now see both secrets listed under **Repository secrets**:
- `COMBINED_APP_NAME`
- `COMBINED_PUBLISH_PROFILE`

(The secret values are hidden after creation; only GitHub Actions can read them.)

## Step 4: Trigger Deployment

### Option A: Push a commit to `main` (Automatic)

```powershell
# In your local repo (c:\Users\dell\Skill-Snap)
cd c:\Users\dell\Skill-Snap
git add .
git commit -m "Deploy SkillSnap to Azure App Service"
git push origin main
```

The `.github/workflows/deploy-combined.yml` workflow will automatically run and deploy the app.

### Option B: Trigger manually via GitHub UI

1. Go to your repo → **Actions** tab
2. In the left sidebar, click **Build, bundle Blazor client into API, and deploy combined App Service**
3. Click **Run workflow** (green button) → Select branch `main` → **Run workflow**

The workflow will start and deploy the app.

## Step 5: Monitor Deployment

1. Go to your repo → **Actions** tab
2. Click the workflow run (should show "in progress" with a yellow dot)
3. Watch the progress:
   - **Checkout** ✅
   - **Setup .NET** ✅
   - **Restore** (dependencies)
   - **Publish combined API** (~2 minutes)
   - **Deploy to Azure Web App** (~1-2 minutes)
4. Once complete, you should see a green ✅ checkmark

If there's a red ✗, click the failed step to see the error logs.

## Step 6: Access Your App

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for **"App Services"** and click your app (e.g., `skillsnap-sohaib-1127`)
3. Click the **URL** link at the top (looks like `https://skillsnap-<unique>.azurewebsites.net`)
4. Your app should load with:
   - Blazor client UI (homepage, login, projects, skills)
   - API endpoints at `/api/*`

## Step 7: Post-Deployment Configuration (Important)

### 7.1 Configure App Settings

The app uses `appsettings.json` for configuration. Some settings should **not** be in the repository for security reasons. Add them as **App Settings** in Azure:

1. In your Web App → **Settings** → **Configuration**
2. Click **+ New application setting** for each:

| Key | Example Value | Description |
|-----|---------------|-------------|
| `JwtSettings__SecretKey` | `YourSecureSecretKey123456789...` | JWT signing key (generate a long random string) |
| `JwtSettings__Issuer` | `SkillSnapApi` | JWT issuer name |
| `JwtSettings__Audience` | `SkillSnapClient` | JWT audience name |
| `DefaultConnection` | `Server=tcp:your-db.database.windows.net,...` | (If using SQL Database instead of SQLite) |

3. Click **Save** and confirm the restart

### 7.2 Update CORS (if needed)

If your client is deployed on a different domain than the API:

1. In your repo, edit `SkillSnap/SkillSnap.Api/Program.cs`
2. Find the CORS section:
   ```csharp
   options.AddPolicy("AllowClient", policy =>
   {
       policy.WithOrigins("https://localhost:5041", "http://localhost:5041")
             .AllowAnyMethod()
             .AllowAnyHeader();
   });
   ```
3. Replace `WithOrigins(...)` with your production URL:
   ```csharp
   policy.WithOrigins("https://skillsnap-<unique>.azurewebsites.net")
         .AllowAnyMethod()
         .AllowAnyHeader();
   ```
4. Commit and push → workflow auto-deploys

### 7.3 Enable HTTPS

Azure App Service provides free HTTPS certificates. To enforce HTTPS:

1. In your Web App → **Settings** → **Configuration**
2. Add a new setting: `HTTPS_ONLY` = `On`
3. Click **Save**

## Troubleshooting

### Deployment fails in GitHub Actions
- Check the **Actions** tab → click the failed run → expand the failed step
- Common issues:
  - Secrets not configured correctly (typo in name or missing)
  - Publish profile XML is malformed

### App returns 404 or error page
- Check **Web App Logs**: Settings → **App Service logs** → Enable (if not already)
- SSH into the app or use **Kudu** (Advanced Tools) to inspect `/home/site/wwwroot`
- Verify `index.html` and `_framework` files are present

### API not responding
- Check `appsettings.json` is deployed (in the publish output)
- Verify JWT settings are configured in App Settings
- Check Azure **Application Insights** or **Log Stream** for errors

### Static files not serving (blank page)
- Verify `wwwroot` folder exists in the publish output
- Check the Blazor client files bundled correctly during publish
- Restart the Web App: Web App → **Restart**

## Next Steps

### Enable Monitoring & Diagnostics
- Enable **Application Insights**: Web App → **Settings** → **Application Insights** → **Turn on**
- This helps diagnose performance and errors in production

### Set up Custom Domain (Optional)
- Web App → **Settings** → **Custom domains** → **Add custom domain**
- Follow the DNS configuration steps

### Continuous Improvements
- Add more automated tests to the GitHub Actions workflow
- Implement staging/production slot deployment
- Set up alerts for errors and performance issues

## Support & References

- [Azure App Service Documentation](https://learn.microsoft.com/azure/app-service/)
- [Blazor WebAssembly Hosting in ASP.NET Core](https://learn.microsoft.com/aspnet/core/blazor/host-and-deploy/webassembly)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [SkillSnap Project README](./README.md)

---

**Status**: After following all steps above, your SkillSnap app should be live at `https://skillsnap-<unique>.azurewebsites.net` ✅

