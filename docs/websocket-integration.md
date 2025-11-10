# WebSocket Integration Guide

This document describes the WebSocket server integration completed for real-time collaborative editing with database persistence.

## Overview

The WebSocket integration connects the client-side Yjs collaborative editor to a backend server with:
- Database-backed session persistence
- User authentication via NextAuth.js
- Real-time presence tracking
- Cursor position synchronization

## Architecture

```
┌─────────────────┐         WebSocket         ┌──────────────────┐
│                 │  ←─────────────────────→   │                  │
│  Client (Web)   │    + Query Params          │  API Server      │
│  - Yjs Doc      │    + Join Messages         │  - Yjs Provider  │
│  - Awareness    │                            │  - Prisma DB     │
└─────────────────┘                            └──────────────────┘
                                                        │
                                                        ▼
                                                ┌──────────────────┐
                                                │   PostgreSQL     │
                                                │  - Sessions      │
                                                │  - Presence      │
                                                │  - Projects      │
                                                └──────────────────┘
```

## Connection Protocol

### 1. WebSocket URL with Authentication

Clients connect with query parameters:
```
ws://localhost:3030?sessionId=<session-id>&projectId=<project-id>&userId=<user-id>
```

**Parameters:**
- `sessionId`: Unique identifier for the collaborative session
- `projectId`: Project the session belongs to
- `userId`: Authenticated user ID from NextAuth session

### 2. Join Session Message

After WebSocket connection is established, client sends:
```json
{
  "type": "join-session",
  "sessionId": "session-room-document",
  "projectId": "demo-project-id",
  "userId": "user-123",
  "userName": "John Doe"
}
```

### 3. Cursor Update Messages

As users move their cursor, client sends:
```json
{
  "type": "cursor-update",
  "sessionId": "session-room-document",
  "userId": "user-123",
  "cursor": {
    "line": 10,
    "column": 25
  }
}
```

### 4. Leave Session Message

On disconnect, client sends:
```json
{
  "type": "leave-session",
  "sessionId": "session-room-document",
  "userId": "user-123"
}
```

## Client Implementation

### Main Editor (index.client.tsx)

**Key Changes:**
1. Replaced `localStorage` authentication with `useSession()` from NextAuth
2. Added query parameters to WebSocket URL
3. Send join-session message on connection
4. Send cursor-update messages on cursor movement
5. Send leave-session message on cleanup
6. Proper authentication redirects

**Code Example:**
```typescript
const { data: session, status } = useSession();

// Build WebSocket URL with auth params
const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3030';
const wsUrl = `${wsBaseUrl}?sessionId=${sessionId}&projectId=${projectId}&userId=${userId}`;

const provider = new WebsocketProvider(wsUrl, docId, doc);

// Send join message when connected
provider.on('status', (event) => {
  if (event.status === 'connected' && provider.ws) {
    provider.ws.send(JSON.stringify({
      type: 'join-session',
      sessionId,
      projectId,
      userId,
      userName: session.user?.name
    }));
  }
});
```

### Offline Editor Client (OfflineEditorClient.tsx)

**Enhanced Features:**
- Optional authentication parameters
- Backward compatible (works without auth in dev mode)
- Automatic join/leave message handling

**Usage:**
```tsx
<OfflineEditorClient
  room="my-room"
  serverUrl="ws://localhost:3030"
  sessionId="session-123"
  projectId="project-456"
  userId="user-789"
>
  {(doc, status) => (
    <div>Connected: {status.isConnected}</div>
  )}
</OfflineEditorClient>
```

## Server Implementation

### WebSocket Handler (apps/api/server.js)

**Key Features:**
1. Extract auth params from URL query string
2. Set up Yjs document collaboration
3. Handle custom messages (join, leave, cursor-update, file-save)
4. Track user presence in database
5. Persist Yjs state to database

**Message Handlers:**
- `handleJoinSession()`: Verify session access, update presence
- `handleLeaveSession()`: Update presence to inactive
- `handleCursorUpdate()`: Store cursor position in UserPresence table
- `handleFileSave()`: Save file content to database

### Database Models

**CollaborativeSession:**
```prisma
model CollaborativeSession {
  id          String   @id @default(cuid())
  roomId      String   @unique
  projectId   String?
  name        String
  isActive    Boolean  @default(true)
  yjsState    Bytes?   // Yjs document state
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  participants User[]
  presence     UserPresence[]
}
```

**UserPresence:**
```prisma
model UserPresence {
  id        String   @id @default(cuid())
  userId    String
  sessionId String
  cursor    Json?
  selection Json?
  isActive  Boolean  @default(true)
  lastSeen  DateTime @default(now())

  user    User                 @relation(...)
  session CollaborativeSession @relation(...)

  @@unique([userId, sessionId])
}
```

## Environment Configuration

### Required Environment Variables

**.env**
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/udp_dev"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-secret"

# WebSocket Server
NEXT_PUBLIC_WS_URL="ws://localhost:3030"
```

## Testing the Integration

### 1. Start PostgreSQL
```bash
docker run --name udp-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=udp_dev \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### 2. Set up Database
```bash
cd packages/db
pnpm db:push
pnpm db:seed
```

### 3. Start WebSocket Server
```bash
cd apps/api
pnpm dev
```

### 4. Start Web App
```bash
cd apps/web
pnpm dev
```

### 5. Test Collaboration
1. Open http://localhost:3000 in two browser windows
2. Sign in with OAuth (GitHub or Google)
3. Both users should see each other in the active users list
4. Type in one window - changes appear in the other
5. Move cursor - cursor position syncs to other users

## Development vs Production

### Development Mode
- Server accepts connections without sessionId/projectId
- Allows testing without full authentication setup
- Console logs show all WebSocket events

### Production Mode
- Requires valid sessionId, projectId, and userId
- Validates user has access to project
- Rate limiting on cursor updates (recommended)

## Troubleshooting

### Issue: "WebSocket connection error"
**Solution:** Check that API server is running on port 3030 and `NEXT_PUBLIC_WS_URL` is set correctly.

### Issue: "User ID not found in session"
**Solution:** Ensure NextAuth is properly configured and user is signed in. Check that `session.user.id` exists in session callback.

### Issue: "Missing sessionId or projectId"
**Solution:** In production, these are required. Check that client code includes all query parameters in WebSocket URL.

### Issue: "Database connection failed"
**Solution:** Verify DATABASE_URL is correct and PostgreSQL is running. Run `pnpm db:push` to create tables.

## Next Steps

1. **Add WebSocket server tests** - Unit and integration tests for message handlers
2. **Implement file operations** - Complete file-save handler with validation
3. **Add rate limiting** - Throttle cursor updates to reduce server load
4. **Session persistence** - Periodically save Yjs state to database
5. **Conflict resolution** - Handle edge cases when users edit same lines
6. **Performance monitoring** - Track WebSocket connection metrics
7. **Horizontal scaling** - Use Redis for multi-server WebSocket sync

## References

- [Yjs Documentation](https://docs.yjs.dev/)
- [y-websocket Provider](https://github.com/yjs/y-websocket)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
