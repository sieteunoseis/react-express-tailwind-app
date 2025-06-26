# TODO Tasks

## ✅ Completed Tasks

- [x] Add instructions on how to use wget to download files from github directly for the /scripts/git-template-remote.sh file
- [x] Scan code base and update README.md with any new instructions or information

## ✅ Recently Fixed

- [x] **Toast Auto-Close Issue**: Fixed `TOAST_REMOVE_DELAY` in `use-toast.ts` from 1000000ms to 5000ms (5 seconds)
- [x] **Docker API Routing**: Fixed duplicate `/api` prefix by correcting `VITE_API_URL` configuration
- [x] **Form Feedback**: Added toast notifications to DataForm for success/error messages
- [x] **GitHub Actions Docker Test**: Fixed missing `.env` file and port conflicts in workflow
  - Added fallback to copy `.env` from root directory if not found in `/docker`
  - Fixed Docker image tags to use dynamic `FRONTEND_TAG` and `BACKEND_TAG` variables
  - Resolved port conflict between frontend (3000) and backend (3001)
  - Updated health check and API test endpoints in workflow

## 🔧 Open Issues

- [x] Fix TOAST component - does not auto close after showing message, it always stays open
- [x] Fix Docker API routing issue - frontend making requests to `/api/api/data` instead of `/api/data`

## 🐛 Bug Details

### Docker API Routing Bug

**Error:** Frontend making duplicate API calls to wrong endpoints

```javascript
Failed to load resource: the server responded with a status of 404 (Not Found)
hook.js:608 Error fetching data: Error: API call failed: 404 Not Found
    at oc (index--lHWS2hr.js:126:26923)
    at async i (index--lHWS2hr.js:126:29909)
api/api/data:1 
 Failed to load resource: the server responded with a status of 404 (Not Found)
hook.js:608 Error fetching data: Error: API call failed: 404 Not Found
    at oc (index--lHWS2hr.js:126:26923)
    at async i (index--lHWS2hr.js:126:29909)
api/api/data:1 
 Failed to load resource: the server responded with a status of 404 (Not Found)
hook.js:608 Error inserting data: Error: API call failed: 404 Not Found
    at oc (index--lHWS2hr.js:126:26923)
    at async h (index--lHWS2hr.js:126:27455)
overrideMethod @ hook.js:608
```

### Backend Logs

```log
[2025-06-26T18:31:13.332Z] INFO: Server running on port 3000

[2025-06-26T18:31:13.333Z] INFO: Environment: production

[2025-06-26T18:31:13.334Z] INFO: Connected to SQLite database

[2025-06-26T18:31:13.339Z] INFO: Database table created with schema: [ 'name', 'hostname', 'username', 'version' ]

[2025-06-26T18:31:16.858Z] INFO: GET /api/data {

  ip: '172.18.0.3',

  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'

}

[2025-06-26T18:31:16.939Z] INFO: GET /api/api/data {

  ip: '172.18.0.3',

  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'

}

[2025-06-26T18:32:18.767Z] INFO: GET /api/data {

  ip: '172.18.0.3',

  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'

}

[2025-06-26T18:32:18.785Z] INFO: GET /api/api/data {

  ip: '172.18.0.3',

  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'

}

[2025-06-26T18:32:48.681Z] INFO: POST /api/api/data {

  ip: '172.18.0.3',

  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'

}
```