# Quick Start: Microsoft Teams Integration

## 🚀 Get Azure Credentials (10 minutes)

### Step 1: Azure Portal
```
1. Go to: https://portal.azure.com
2. Navigate to: Azure Active Directory → App registrations
3. Click: New registration
4. Name: "Swap Meeting Creator"
5. Account type: Multitenant
6. Click: Register
```

### Step 2: Copy IDs
```
Application (client) ID  → AZURE_CLIENT_ID
Directory (tenant) ID    → AZURE_TENANT_ID
```

### Step 3: Create Secret
```
1. Go to: Certificates & secrets
2. Click: New client secret
3. Description: "Swap Backend"
4. Expiration: 24 months
5. Click: Add
6. COPY VALUE NOW → AZURE_CLIENT_SECRET (you won't see it again!)
```

### Step 4: Grant Permissions
```
1. Go to: API permissions
2. Click: Add a permission
3. Select: Microsoft Graph
4. Select: Application permissions
5. Search: OnlineMeetings.ReadWrite.All
6. Click: Add permissions
7. Click: Grant admin consent (requires admin)
```

## 📝 Update .env File

```bash
cd swap-backend-pg
```

Edit `.env` and replace placeholders:
```env
AZURE_TENANT_ID=paste_your_tenant_id_here
AZURE_CLIENT_ID=paste_your_client_id_here
AZURE_CLIENT_SECRET=paste_your_secret_value_here
```

## ▶️ Start Backend

```bash
npm install
npm run dev
```

Look for: `[MeetingsService] Microsoft Graph client initialized successfully`

## ✅ Test It

1. **Create time slot** with session type "Online"
2. **Send request** for that slot
3. **Accept request** as teacher
4. **Check session** - should have real Teams meeting link!

## 🆘 Troubleshooting

**Problem**: "Azure credentials not configured"
- **Fix**: Check .env file has all 3 variables set

**Problem**: "Failed to create Teams meeting"
- **Fix**: Verify permissions granted and admin consent given

**Problem**: Meeting shows placeholder link
- **Fix**: Check backend logs for detailed error, verify credentials

## 📚 Full Documentation

- Setup Guide: `TEAMS_INTEGRATION_SETUP.md`
- Implementation Details: `TEAMS_INTEGRATION_COMPLETE.md`
- Feature Docs: `SESSION_TYPE_IMPLEMENTATION.md`

## 💡 Tips

- Without credentials, system uses placeholder links (still works!)
- Client secrets expire - set calendar reminder to renew
- Test credentials first at: https://developer.microsoft.com/graph/graph-explorer
- Production: Use Azure Key Vault for credentials

---

**Need admin consent?** Ask your IT department to grant `OnlineMeetings.ReadWrite.All` permission
