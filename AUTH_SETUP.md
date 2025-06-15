# Authentication Setup Guide

This guide will help you set up the authentication system for the AI Agents Platform.

## Features

✅ **Email/Password Authentication**
- User registration with email and password
- Secure password hashing with bcrypt
- JWT-based session management

✅ **Social Authentication**
- Google OAuth integration
- GitHub OAuth integration
- Automatic user creation for social logins

✅ **Database Integration**
- User data stored in PostgreSQL via Prisma
- Linked user sessions and agent executions
- Usage tracking per user

✅ **Security Features**
- HTTP-only cookies for token storage
- Password validation and strength requirements
- Protected routes with middleware
- Token expiration and refresh

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

**Required Variables:**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_agents_db"

# Authentication
SESSION_SECRET="your_super_secret_session_key_here_make_it_long_and_random"
JWT_SECRET="your_jwt_secret_key_here_also_make_it_long_and_random"
NEXTAUTH_URL="http://localhost:3000"
```

**Optional OAuth Variables:**
```env
# Google OAuth (optional)
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"

# GitHub OAuth (optional)
GITHUB_CLIENT_ID="your_github_client_id_here"
GITHUB_CLIENT_SECRET="your_github_client_secret_here"
```

### 2. Database Setup

Make sure you have PostgreSQL running and update your database schema:

```bash
npx prisma db push
```

### 3. OAuth Setup (Optional)

#### Google OAuth Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file

#### GitHub OAuth Setup:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Set Authorization callback URL: `http://localhost:3000/api/auth/github/callback`
4. Copy Client ID and Client Secret to your `.env` file

### 4. Start the Application

```bash
npm run dev
```

## Usage

### Authentication Pages

- **Login**: `/auth/login`
- **Register**: `/auth/register`
- **Profile**: `/profile` (protected route)

### Authentication Context

Use the `useAuth` hook in your components:

```tsx
import { useAuth } from '@/lib/auth-context'

function MyComponent() {
  const { user, login, logout, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  if (!user) {
    return <div>Please log in</div>
  }
  
  return <div>Welcome, {user.name}!</div>
}
```

### Protected Routes

Use the `ProtectedRoute` component:

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  )
}
```

### API Routes

The following API routes are available:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/github` - GitHub OAuth initiation

### Middleware Protection

Routes are automatically protected by middleware. Add routes to the `protectedRoutes` array in `middleware.ts`:

```typescript
const protectedRoutes = [
  '/profile',
  '/dashboard',
  '/admin',
  // Add more protected routes
]
```

## Database Schema

The authentication system adds the following models:

### User Model
```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String
  password      String?  // null for social auth users
  provider      String   @default("email")
  providerId    String?
  avatar        String?
  emailVerified Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  sessions      Session[]
  executions    AgentExecution[]
  usage         Usage[]
}
```

### Updated Models
- `Session` - Now linked to users
- `AgentExecution` - Now tracks which user ran the agent
- `Usage` - Now tracks usage per user

## Security Considerations

1. **Password Security**: Passwords are hashed using bcrypt with 12 salt rounds
2. **JWT Security**: Tokens are signed and verified with a secret key
3. **Cookie Security**: HTTP-only cookies prevent XSS attacks
4. **HTTPS**: Use HTTPS in production (set `secure: true` for cookies)
5. **Environment Variables**: Never commit secrets to version control

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Make sure PostgreSQL is running and DATABASE_URL is correct
2. **OAuth Errors**: Check that redirect URIs match exactly in OAuth provider settings
3. **Token Errors**: Ensure JWT_SECRET is set and consistent across restarts
4. **CORS Issues**: Make sure NEXTAUTH_URL matches your domain

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages in the console.

## Next Steps

1. **Email Verification**: Implement email verification for new registrations
2. **Password Reset**: Add forgot password functionality
3. **Two-Factor Authentication**: Add 2FA support
4. **Admin Panel**: Create admin interface for user management
5. **Rate Limiting**: Add rate limiting to auth endpoints
6. **Audit Logging**: Track authentication events

## Support

If you encounter any issues, please check:
1. Environment variables are set correctly
2. Database is running and accessible
3. OAuth providers are configured properly
4. All dependencies are installed

For additional help, refer to the main project documentation or create an issue in the repository.