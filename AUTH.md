# Auth Helpers

Authentication Helpers (`AUTH.md`)

This document describes the authentication helper utilities provided in `lib/auth.tsx`, primarily focused on WebSocket authentication and retrieving user tokens from requests. It also outlines the split credentials flow: OTP vs password.

## Purpose

These utilities integrate with `next-auth` sessions to simplify authenticating users, especially in WebSocket scenarios where standard HTTP header mechanisms aren't directly applicable, and provide a consistent way to get the decoded user token from incoming HTTP requests.

Configuration note:
- Required environment variables (`NEXTAUTH_SECRET`, `HASURA_JWT_SECRET`, etc.) are auto-generated from `hasyx.config.json`. Use `npx hasyx config` to edit configuration. Do not edit `.env` manually.

<details>
<summary>Core Exports (`lib/auth.tsx`)</summary>

*   `WsClientsManager(route?: string)`: A factory function that returns a manager object to handle WebSocket client connections and authentication.
    *   Takes an optional `route` string for namespacing debug logs.
    *   Manages a map of connected clients.
    *   Provides methods to add clients, parse user data from connection requests using `next-auth` cookies, retrieve client data, and remove clients.
*   `getTokenFromRequest(request: NextRequest): Promise<JWT | null>`: An async function to retrieve and decode the `next-auth` JWT from a `NextRequest` object.
    *   Automatically determines the correct session cookie name (`next-auth.session-token` or `__Secure-next-auth.session-token`) based on the request protocol (HTTP/HTTPS).
    *   Requires the `NEXTAUTH_SECRET` environment variable to be set for decoding the JWT.

</details>

## Usage
### Split Credentials Flow (OTP and Password)

Hasyx splits the Credentials sign-in into two independent parts:

1) OTP sign-in (email/phone)
- Start code: `POST /api/auth/credentials/start` with `{ provider: 'email'|'phone', identifier }`
- Verify code: `POST /api/auth/otp/verify` with `{ attemptId, code }`
- Result: returns `userId`; the client calls `signIn('credentials', { userId })` to establish a stable session

2) Password sign-in (email/phone + password)
- Unauthenticated sign-in: `signIn('credentials', { providerType: 'email'|'phone', identifier, password })`
- Password management (authenticated only):
  - Status: `GET /api/auth/credentials/status?providerType&identifier` → `{ linked, hasPassword }`
  - Set/change: `POST /api/auth/credentials/set` with `{ providerType, identifier, newPassword, confirmNewPassword, oldPassword? }`

Diagnostics UI (`/hasyx/diagnostics`):
- `OtpSignInCard` — pure OTP sign-in
- `CredentialsSignInCard` — password sign-in and password management when authenticated


### `WsClientsManager` (WebSocket Authentication)

This is particularly useful when setting up a WebSocket server (e.g., using `next-ws` or another library) that needs to authenticate users based on their existing `next-auth` session.

**Prerequisites:**

*   `next-auth` is configured and working.
*   `NEXTAUTH_SECRET` environment variable is set.
*   A WebSocket server endpoint is set up.

**Example (GraphQL WS via `/api/graphql`):**

```typescript
// app/api/graphql/route.ts
import http from 'http';
import { NextRequest, NextResponse } from 'next/server';
import { WebSocket, WebSocketServer } from 'ws';
import { proxyGET, proxyPOST, proxySOCKET, proxyOPTIONS } from 'hasyx/lib/graphql-proxy';

export async function GET(request: NextRequest) { return proxyGET(request); }
export async function POST(request: NextRequest) { return proxyPOST(request); }
export async function OPTIONS(request: NextRequest) { return proxyOPTIONS(request); }
export function SOCKET(client: WebSocket, request: http.IncomingMessage, server: WebSocketServer) {
  return proxySOCKET(client, request, server);
}
```

### `getTokenFromRequest` (HTTP/WebSocket Token Retrieval)

Use this in API Routes, Server Components, or WebSocket connection handlers to get the decoded JWT payload for the currently logged-in user.

**Key Features:**

*   **Header Check:** First checks the `Authorization: Bearer <token>` header.
*   **Cookie Fallback:** If no valid Bearer token is found, it checks `next-auth` session cookies.
*   **Verification:** Validates Bearer tokens using `verifyJWT` (from `lib/jwt.ts`).
*   **Cookie Decoding:** Uses `next-auth/jwt.getToken` for cookie-based tokens.

**Prerequisites:**

*   `next-auth` is configured and working (for cookie fallback).
*   `NEXTAUTH_SECRET` environment variable is set (for cookie decoding).
*   `HASURA_JWT_SECRET` environment variable is set (for Bearer token verification via `verifyJWT`).

**Example (in a Next.js API Route):**

```typescript
// app/api/my-route/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from 'hasyx/lib/auth'; // Use hasyx import

export async function GET(request: NextRequest) {
  // This will check Bearer token first, then cookie
  const token = await getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Token contains the decoded JWT payload
  console.log('Decoded token:', token);
  const userId = token.sub; // Standard JWT subject, often the user ID

  // Check if the token has Hasura claims (might be present if it came from Bearer)
  const hasuraClaims = token['https://hasura.io/jwt/claims']; 
  if (hasuraClaims) {
      console.log('Hasura Claims:', hasuraClaims);
  } else {
      console.log('Token likely from session cookie, no specific Hasura claims embedded.');
  }

  // Proceed with logic for authenticated user...
  return NextResponse.json({ 
    message: `Hello user ${userId}`, 
    yourToken: token 
  });
}
```

## Test Authentication Helper

### `testAuthorize` (Development & Testing Only)

This utility is specifically designed for development and testing environments to authenticate as any user without going through the normal authentication flow.

> ⚠️ **SECURITY WARNING**: This feature is automatically disabled in production environments. The TEST_TOKEN environment variable should **never** be set in production.

**Prerequisites:**

* Environment Variable: `TEST_TOKEN` - Must be set to enable test authentication
* Environment Variable: `NEXTAUTH_SECRET` - Required for JWT signing
* Non-production environment

**Purpose:**

The `testAuthorize` function allows developers to:
* Authenticate as any existing user by providing their user ID
* Get properly authenticated API clients (axios, apollo, hasyx)
* Test protected routes and features without manual login

**Usage Example:**

```typescript
import { testAuthorize } from 'hasyx/lib/auth';
import myCustomSchema from '../path/to/my-custom-schema.json';

// In a test or development script:
async function testProtectedFeature() {
  // Authenticate as user with ID "user_id_here"
  const { axios, apollo, hasyx } = await testAuthorize(
    'user_id_here',
    { 
      // Optionally pass ApolloClient options and a custom schema
      schema: myCustomSchema, 
      ws: false // Example: disable WebSockets for this client
    }
  );
  
  // These clients are now authenticated as the specified user
  const response = await axios.get('/api/protected-route');
  console.log('Protected data:', response.data);
  
  // Make GraphQL queries as the authenticated user
  // The 'hasyx' instance will use myCustomSchema
  const result = await hasyx.select({ table: 'my_table' });
}
```

**Function Signature:**

```typescript
testAuthorize(
  userId: string, 
  options?: TestAuthorizeOptions
): Promise<{ axios, apollo, hasyx }>
```

The optional `options` object (`TestAuthorizeOptions`) extends the `ApolloOptions` from `lib/apollo.tsx` and allows you to pass any valid option for `createApolloClient` (like `url`, `ws`, `headers`, `secret`), plus a `schema` property.

*   `schema`: If provided, the returned `hasyx` instance will be initialized with this schema instead of the default one. This is useful for tests that involve a different or partial GraphQL schema.
*   Other `ApolloOptions` (e.g., `ws: false`): These are passed directly to the `createApolloClient` function, allowing you to customize the behavior of the returned `apollo` and `hasyx` clients for a specific test.

**How It Works:**

1. Verifies the environment allows test authentication
2. Fetches the user data from the database using the provided user ID
3. Generates a valid JWT with proper Hasura claims
4. Creates and returns authenticated client instances

**Security Considerations:**

* Only enable `TEST_TOKEN` in local development or controlled test environments
* Never commit `.env` files containing your `TEST_TOKEN` value
* The functionality has built-in safeguards to prevent production use

## JWT Auth: Local Storage Without Session

JWT authentication mode enables mobile applications (Android/iOS) to authenticate via OAuth providers without relying on traditional client-server sessions. This is essential for client-only builds where session cookies are not available.

### How It Works

1. **Mobile App**: Generates UUID and starts polling for JWT token
2. **OAuth Flow**: User completes OAuth authentication on web
3. **JWT Storage**: Token saved to `auth_jwt` table with UUID
4. **Token Retrieval**: Mobile app receives JWT via UUID polling
5. **API Access**: Mobile app uses JWT for authenticated requests

### Configuration

Enable in your variant configuration:
```bash
npx hasyx config
# Select variant → Host Configuration → Enable JWT Auth
```

Or manually in `hasyx.config.json`:
```json
{
  "hosts": {
    "prod": {
      "url": "https://hasyx.deep.foundation",
      "jwtAuth": true
    }
  }
}
```

**Note**: JWT auth is automatically enabled for client-only builds (`clientOnly: true`) and when explicitly configured (`jwtAuth: true`).

### Automatic JWT Auth for Client Builds

When building client-only applications, JWT auth is automatically enabled:

```bash
# npm run client automatically enables JWT auth
npm run client

# npx hasyx client automatically enables JWT auth  
npx hasyx client
```

**What happens automatically:**
- `NEXT_PUBLIC_JWT_AUTH=1` is added to `.env` file
- JWT authentication system is activated
- Mobile apps can authenticate via OAuth + JWT flow

This ensures that mobile applications and standalone builds can authenticate without server-side sessions.

### JWT_FORCE: Guaranteed JWT Availability for Serverless

For serverless environments (like Vercel) where WebSocket subscriptions are not available, the `JWT_FORCE` configuration ensures that JWT tokens are always available for direct Hasura GraphQL endpoint access.

**Configuration:**
```bash
npx hasyx config
# Select variant → Host Configuration → Enable JWT Force
```

Or manually in `hasyx.config.json`:
```json
{
  "hosts": {
    "prod": {
      "url": "https://hasyx.deep.foundation",
      "jwtForce": true
    }
  }
}
```

**What happens automatically:**
- `NEXT_PUBLIC_JWT_FORCE=1` is added to `.env` file
- JWT token is automatically requested from `/api/auth/get-jwt` on app initialization
- Hasyx client is rebuilt with JWT token for WebSocket support
- Apollo client uses `NEXT_PUBLIC_HASURA_GRAPHQL_URL` directly for subscriptions

**Benefits:**
- **WebSocket Support**: Enables real-time subscriptions in serverless environments
- **Direct Hasura Access**: Bypasses API routes for GraphQL operations
- **Automatic Token Management**: JWT is retrieved and stored without user intervention
- **Serverless Compatibility**: Works in Vercel, Netlify, and other serverless platforms

**How it works:**
1. App starts and checks for `NEXT_PUBLIC_JWT_FORCE=1`
2. If JWT not in localStorage, automatically requests from `/api/auth/get-jwt`
3. JWT token is stored and Hasyx client is rebuilt
4. Apollo client switches to direct Hasura endpoint with WebSocket support
5. All GraphQL operations (including subscriptions) work via Hasura endpoint

This ensures that even in serverless environments, your application can use WebSocket subscriptions and direct Hasura GraphQL access for optimal performance.

### Client Implementation

The JWT client is available in `components/jwt-auth.tsx`:

```typescript
import { useJwt } from "hasyx/components/jwt-auth";

// In your component
const jwtClient = useJwt();

// Generate UUID and start polling
const jwtId = uuidv4();
localStorage.setItem('nextauth_jwt_id', jwtId);

jwtClient.id = jwtId;
jwtClient.start(); // Polls every second

// Handle JWT received
jwtClient.onDone = (jwt) => {
  localStorage.setItem('nextauth_jwt', jwt);
  // Use JWT for API calls
};
```

### Using Hasyx JWT Method

For programmatic JWT retrieval, you can use the `.jwt()` method on any Hasyx instance:

```typescript
import { useHasyx } from 'hasyx';

function MyComponent() {
  const hasyx = useHasyx();
  
  const handleGetJwt = async () => {
    try {
      // This will request JWT from /api/auth/get-jwt
      const token = await hasyx.jwt();
      console.log('JWT received:', token);
      
      // Token is automatically stored and Hasyx client rebuilt
      // You can now use WebSocket subscriptions
    } catch (error) {
      console.error('Failed to get JWT:', error);
    }
  };
  
  return (
    <button onClick={handleGetJwt}>
      Get JWT Token
    </button>
  );
}
```

**Note:** When using `hasyx.jwt()`, the JWT token is automatically stored in localStorage and the Hasyx client is rebuilt to use the direct Hasura GraphQL endpoint with WebSocket support.

### API Endpoints

- `GET /api/auth_jwt?jwt=<uuid>` - Check JWT status
- `POST /api/auth/jwt-complete` - Complete JWT authentication
- `GET /api/auth/jwt-signin` - JWT signin completion page

### Local Storage Keys

- `nextauth_jwt_id` - UUID for JWT polling
- `nextauth_jwt` - Received JWT token for API calls

### Use Cases

- **Mobile Apps**: Android/iOS applications
- **Client-Only Builds**: Standalone applications without server
- **Cross-Platform**: Capacitor, Electron, PWA
- **OAuth Integration**: Google, GitHub, Telegram, etc.

## Dependencies

*   `next-auth` (specifically session cookies and `next-auth/jwt` for decoding)
*   `jose` (used internally by `lib/jwt.ts` for token verification)
*   `uuid` (for generating client IDs in `WsClientsManager`)
*   `ws` (or your chosen WebSocket library, for the `WebSocket` type hint)
*   `debug` (for logging)
*   Environment Variable: `NEXTAUTH_SECRET`
*   Environment Variable: `HASURA_JWT_SECRET` (for Bearer token verification)

## Telegram Login Authentication

The project now supports authentication via Telegram Login. This allows users to sign in using their Telegram account.

**Setup Requirements:**

1.  **Telegram Bot:** You need a Telegram bot. You can create one or use an existing one by talking to `@BotFather` on Telegram.
    *   Obtain your bot's `USERNAME` (e.g., `MyWebAppBot`).
    *   Obtain your bot's `API TOKEN`.
2.  **Domain Linking:** Using `@BotFather`, you must link your website's domain to your bot. Use the `/setdomain` command. The domain should be the one where your application is hosted (e.g., `https://yourapp.com` or `http://localhost:3000` for development).
3.  **Environment Variables:**
    *   `TELEGRAM_LOGIN_BOT_TOKEN`: Your Telegram Bot API Token.
    *   `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`: Your Telegram Bot Username (this is public and used by the client-side widget).

**How it Works:**

1.  A "Login with Telegram" button is displayed on the client-side.
2.  When clicked, it uses the Telegram Login Widget, which requires `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` to be configured.
3.  After the user authorizes via Telegram, the widget receives user data (ID, name, photo, auth_date, and a verification hash).
4.  This data is sent to a NextAuth `CredentialsProvider` (ID: `telegram`).
5.  The backend verifies the `hash` using your `TELEGRAM_LOGIN_BOT_TOKEN` to ensure the data is authentic and from Telegram.
6.  It also checks `auth_date` to prevent replay attacks.
7.  If valid, `getOrCreateUserAndAccount` is called to find or create a user in your database associated with the Telegram ID.
8.  A session is established for the user.

**Configuration Assistance:**

The `hasyx-assist` CLI tool has been updated to help you configure these settings. It will prompt you for:
*   Telegram Bot Username (`TELEGRAM_LOGIN_BOT_USERNAME`)
*   Telegram Bot Token (`TELEGRAM_LOGIN_BOT_TOKEN`)

It will also provide instructions on how to set up your bot with `@BotFather` and link your domain.

**Client-Side Implementation:**

*   The `components/auth/telegram-login-button.tsx` component renders the Telegram widget.
*   It uses `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` from environment variables.
*   Upon successful Telegram authentication, it calls `signIn('telegram', { ...userData })` from `next-auth/react`.

**Backend Implementation:**

*   `lib/telegram-credentials.ts` defines the `TelegramProvider` (a NextAuth Credentials provider).
*   This provider handles the `authorize` callback, verifies the data from Telegram, and interacts with `getOrCreateUserAndAccount`.
*   The `TelegramProvider` is integrated into `lib/auth-options.ts`. 