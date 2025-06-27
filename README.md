# React App with Tailwind CSS Boilerplate for Automate Builders

A secure, full-stack React application template with TypeScript, Express.js backend, and SQLite database. Features comprehensive security, testing, and dynamic form generation.

## ✨ Features

- **🔒 Security First**: Input validation, sanitization, password hashing (bcrypt), and XSS protection
- **📘 TypeScript**: Full TypeScript implementation for both frontend and backend
- **🧪 Testing**: Comprehensive test coverage with Jest (backend) and Vitest (frontend)
- **🎨 Modern UI**: React 19, Tailwind CSS, Radix UI components with dark/light themes
- **🗄️ Smart Database**: SQLite with automatic schema migration and dynamic table creation
- **📝 Dynamic Forms**: Auto-generated forms with validation based on configuration
- **🐳 Docker Ready**: Containerized deployment with Docker Compose
- **🔄 Version Control**: Template synchronization with upstream changes

## 🎨 Background Logo Customization

The application supports customizable background logos that can display either text or [Lucide icons](https://lucide.dev/):

### Text Logo
Set `VITE_BACKGROUND_LOGO_TEXT` to any text value:
```bash
VITE_BACKGROUND_LOGO_TEXT="AB"           # Displays "AB" as background text
VITE_BACKGROUND_LOGO_TEXT="MyApp"        # Displays "MyApp" as background text
```

### Lucide Icon Logo
Prefix with `lucide-` to use any Lucide icon:
```bash 
VITE_BACKGROUND_LOGO_TEXT="lucide-settings"    # Settings icon
VITE_BACKGROUND_LOGO_TEXT="lucide-database"    # Database icon
VITE_BACKGROUND_LOGO_TEXT="lucide-server"      # Server icon
```

The logo automatically:
- Adjusts font size based on text length
- Supports dark/light theme switching
- Displays at low opacity (10%) as a background element
- Scales responsively across different screen sizes

Browse available icons at [lucide.dev](https://lucide.dev/) and use the icon name with the `lucide-` prefix.

## How to use

### 1. Download script file and clone this template
```bash
wget -O git-template-remote.sh https://raw.githubusercontent.com/sieteunoseis/react-express-tailwind-app/refs/heads/main/scripts/git-template-remote.sh
chmod +x git-template-remote.sh

# Standard clone (preserves template history for sync)
./git-template-remote.sh https://github.com/sieteunoseis/react-express-tailwind-app.git <your-project-name>

# Fresh start (removes template history)
./git-template-remote.sh --fresh https://github.com/sieteunoseis/react-express-tailwind-app.git <your-project-name>
```

**Clone Options:**
- **Standard**: Preserves template git history and allows syncing upstream changes with `npm run sync-remote`
- **Fresh (`--fresh`)**: Starts with a clean git history containing only an "Initial commit from template"
### 2. Install dependencies
```
npm run install-all
```
### 3. Configure your application

#### Database Schema Configuration
Update `frontend/public/dbSetup.json` to define your connection fields and validation rules:

```json
[
  {
    "name": "hostname",
    "type": "TEXT",
    "validator": { "name": "isFQDN", "options": { "allow_numeric_tld": true } }
  },
  {
    "name": "version",
    "type": "TEXT", 
    "validator": { "name": "isDecimal", "options": { "force_decimal": false, "decimal_digits": "1,2", "locale": "en-US" } },
    "optional": true
  }
]
```

This configuration:
- Uses validation from [validator.js](https://www.npmjs.com/package/validator)
- Dynamically builds forms with client and server-side validation
- Supports optional fields (like version numbers)
- Auto-generates database schema

#### Environment Variables
Copy `.env.example` to `.env` and configure your application:

```bash
cp .env.example .env
```

Key configuration options:

```bash
# Backend Configuration
PORT=5000                    # Backend server port (default: 5000)
NODE_ENV=development         # Environment mode

# Application Branding
VITE_BRANDING_NAME="Your Company Name"
VITE_BRANDING_URL="https://yourcompany.com"
VITE_BACKGROUND_LOGO_TEXT="AB"          # Background logo text or Lucide icon (e.g., "lucide-settings")

# Database Schema
VITE_TABLE_COLUMNS=name,hostname,username,password,version
```

**Port Configuration**: 
- **Development**: Frontend proxies API calls to `localhost:${PORT}` 
- **Docker**: Frontend uses service name `http://backend:${PORT}` for container-to-container communication
- **Production**: Configurable via `VITE_API_URL` environment variable

### 4. Run the app
```bash
npm run dev  # Starts both frontend and backend in development mode
```

### 5. Build and run with Docker

#### Local Development Docker
```bash
# Build and run with Docker Compose (builds locally)
npm run build  # or docker-compose up --build

# Individual commands
docker-compose up --build   # Build and start containers
docker-compose up           # Start existing containers  
docker-compose down         # Stop containers
```

#### Testing with Pre-built Images
For testing with images from GitHub Container Registry:
```bash
cd docker
./test.sh          # Test with pre-built images
./test.sh --dev     # Test with local builds

# Manual Docker Compose
docker-compose up -d                    # Use pre-built images
docker-compose -f docker-compose.dev.yml up -d  # Use local builds
```

### 6. Build for production (manual)

```bash
cd frontend && npm run build  # Frontend build only
cd backend && npm run build   # Backend TypeScript compilation
```

### 6. Run tests

```bash
# Backend tests (Jest + TypeScript)
cd backend && npm test

# Frontend tests (Vitest + React Testing Library)  
cd frontend && npm test
```

### 7. Type checking

```bash
cd backend && npm run type-check   # TypeScript type checking
cd frontend && npm run build       # Includes type checking
```

### 8. Sync upstream changes from the template to your project
```bash
npm run sync-remote  # Pulls latest template updates
```

**Note**: This command only works if you cloned using the standard method (without `--fresh` flag). Projects created with `--fresh` don't have the upstream remote configured for syncing.

## 🔧 Development Guide

### Project Structure
```
├── frontend/               # React + TypeScript + Vite
│   ├── src/components/    # Reusable UI components
│   ├── src/pages/         # Application pages
│   └── public/dbSetup.json # Database schema configuration
├── backend/               # Express.js + TypeScript
│   ├── src/              # TypeScript source files
│   ├── dist/             # Compiled JavaScript
│   ├── tests/            # Jest test files
│   └── db/               # SQLite database files
└── scripts/              # Utility scripts
```

### Security Features
- **Input Validation**: Server-side validation using validator.js
- **Data Sanitization**: HTML escaping and XSS protection
- **Password Security**: Bcrypt hashing with 12 salt rounds
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error logging and secure responses

### Database Features
- **Auto Schema Migration**: Automatically updates database schema
- **Dynamic Table Creation**: Based on environment configuration
- **Connection Selection Logic**: Transaction-based with race condition prevention
- **Optional Fields**: Support for optional fields (e.g., version numbers)

## 🚨 Troubleshooting

### Permission denied when running the script
```bash
chmod +x git-template-remote.sh
```

### Git divergent branches error
```bash
git config pull.rebase false  # merge (recommended)
git config pull.rebase true   # rebase
git config pull.ff only       # fast-forward only
```

### SQLite database error: SQLITE_CANTOPEN
```bash
mkdir backend/db  # Create database directory
```

### TypeScript compilation errors
```bash
cd backend && npm run build  # Check for TypeScript errors
cd frontend && npm run build # Frontend type checking
```

### Test failures
```bash
# Clean install and rebuild
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install-all
npm run build
```

### Port conflicts (EADDRINUSE)
```bash
# Check what's using your backend port
lsof -i :5000

# Kill processes using common ports
lsof -ti:3000 | xargs kill -9   # Frontend (production)
lsof -ti:5173 | xargs kill -9   # Frontend (dev)
lsof -ti:5000 | xargs kill -9   # Backend (default)

# Or change the backend port in .env
echo "PORT=8000" >> .env        # Use port 8000 instead
```

### Changing the backend port
To use a different backend port:

1. **Update `.env` file**:
   ```bash
   PORT=8000  # Your preferred port
   ```

2. **Restart the application**:
   ```bash
   npm run dev
   ```

The frontend will automatically proxy to the new port via Vite configuration.

---

**Template Reference**: Script based on [Propagating Git Template Changes](https://www.mslinn.com/git/700-propagating-git-template-changes.html)