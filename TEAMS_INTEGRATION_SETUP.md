# Microsoft Teams Integration Setup Guide

## Overview

The Swap platform now uses **Microsoft Teams** for online meetings instead of Zoom. This provides better integration with educational institutions and simpler API authentication.

## Features

✅ Automatic Teams meeting creation when accepting online session requests  
✅ Graceful fallback to placeholder links if credentials not configured  
✅ Meeting duration automatically set from session length  
✅ No meeting time limits (unlike Zoom's 40-minute free tier limit)  
✅ Works with existing Microsoft 365 accounts

## Setup Instructions

### 1. Register an Azure App

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Configure:
   - **Name**: "Swap Meeting Creator" (or any name)
   - **Supported account types**: "Accounts in any organizational directory (Any Azure AD directory - Multitenant)"
   - **Redirect URI**: Leave blank (not needed for server-to-server)
5. Click **Register**

### 2. Get Your Credentials

After registration, you'll see the app overview page:

1. Copy the **Application (client) ID** → This is your `AZURE_CLIENT_ID`
2. Copy the **Directory (tenant) ID** → This is your `AZURE_TENANT_ID`

### 3. Create a Client Secret

1. In your app's page, go to **Certificates & secrets**
2. Click **New client secret**
3. Add a description (e.g., "Swap Backend Secret")
4. Set expiration (recommend 24 months)
5. Click **Add**
6. **IMPORTANT**: Copy the **Value** immediately → This is your `AZURE_CLIENT_SECRET`
   - ⚠️ You won't be able to see it again!

### 4. Grant API Permissions

1. In your app's page, go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Select **Application permissions** (not Delegated)
5. Search for and select:
   - `OnlineMeetings.ReadWrite.All`
6. Click **Add permissions**
7. Click **Grant admin consent for [Your Organization]** (requires admin privileges)
   - ⚠️ This step requires tenant admin approval

### 5. Update Environment Variables

Add the following to `swap-backend-pg/.env`:

```env
# Microsoft Teams/Azure AD credentials for online meeting creation
AZURE_TENANT_ID=your_tenant_id_here
AZURE_CLIENT_ID=your_client_id_here
AZURE_CLIENT_SECRET=your_client_secret_here
```

Replace the placeholder values with the credentials from steps 2-3.

### 6. Install Dependencies

```bash
cd swap-backend-pg
npm install
```

This will install the new packages:
- `@azure/identity` - Azure authentication
- `@microsoft/microsoft-graph-client` - Microsoft Graph API client

### 7. Restart Backend Server

```bash
cd swap-backend-pg
npm run dev
```

You should see:
```
[MeetingsService] Microsoft Graph client initialized successfully
```

## Testing

1. **Create a time slot** with session type "Online"
2. **Send a request** for that time slot
3. **Accept the request** as the teacher
4. Check the session details - you should see a real Teams meeting link like:
   ```
   https://teams.microsoft.com/l/meetup-join/19%3ameeting_...
   ```

## Troubleshooting

### "Azure credentials not configured" warning

**Cause**: Environment variables not set correctly  
**Fix**: Double-check `.env` file has all three variables set

### "Failed to create Teams meeting"

**Possible causes**:
1. **Invalid credentials**: Verify tenant ID, client ID, and secret
2. **Permissions not granted**: Ensure `OnlineMeetings.ReadWrite.All` is granted and admin consent given
3. **Secret expired**: Client secrets expire - create a new one if needed
4. **Network issues**: Check firewall/proxy settings

**To debug**: Check backend logs for detailed error messages

### Meeting links show "placeholder-..."

**Cause**: Teams API call failed or credentials not configured  
**Behavior**: System falls back to placeholder links  
**Fix**: Configure Azure credentials properly and check logs for API errors

### "Grant admin consent" button is grayed out

**Cause**: You need Azure AD admin privileges  
**Fix**: Ask your IT administrator to grant consent for the app

## Fallback Behavior

If Teams integration fails (wrong credentials, API down, etc.), the system will:
1. Log the error with details
2. Return a placeholder meeting link
3. Continue functioning - the request will still be accepted
4. Users can manually create their own Teams meetings if needed

This ensures the platform remains functional even if Teams API is unavailable.

## Production Considerations

### Security
- Store credentials in secure environment variables, never in code
- Rotate client secrets periodically (before expiration)
- Use Azure Key Vault for enhanced security in production

### Monitoring
- Monitor logs for "Failed to create Teams meeting" errors
- Set up alerts for credential expiration
- Track meeting creation success rate

### Multi-User Support
The current implementation uses application-level permissions (`/me/onlineMeetings` endpoint). To create meetings on behalf of specific users, you would need:
1. User delegated permissions
2. Per-user authentication flow
3. Or use the `/users/{userId}/onlineMeetings` endpoint with a service account

The current approach works well for most use cases where the app creates meetings centrally.

## API Reference

- [Microsoft Graph OnlineMeeting Resource](https://learn.microsoft.com/en-us/graph/api/resources/onlinemeeting)
- [Create OnlineMeeting](https://learn.microsoft.com/en-us/graph/api/application-post-onlinemeetings)
- [Azure App Registration](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)

## Support

If you encounter issues:
1. Check backend logs for detailed error messages
2. Verify all setup steps were completed
3. Ensure Azure AD admin consent was granted
4. Test Azure credentials with Microsoft Graph Explorer: https://developer.microsoft.com/en-us/graph/graph-explorer
