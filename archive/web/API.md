# Backend API Documentation

## Overview

The Unified Development Platform provides a comprehensive REST API for managing users, projects,
files, collaboration, and AI interactions. All endpoints return JSON responses with consistent error
handling.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API operates without authentication middleware. In production, all endpoints should
be protected with NextAuth.js session validation.

## API Endpoints

### Users

#### GET /api/users

List all users with pagination support.

**Query Parameters:**

- None

**Response:**

```json
{
  "users": [
    {
      "id": "cuid",
      "email": "user@example.com",
      "username": "username",
      "name": "User Name",
      "avatar": "https://...",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/users

Create a new user.

**Body:**

```json
{
  "email": "user@example.com",
  "username": "username",
  "name": "User Name", // optional
  "avatar": "https://...", // optional
  "githubId": "12345" // optional
}
```

#### GET /api/users/[id]

Get user by ID with projects and memberships.

#### PUT /api/users/[id]

Update user information.

#### DELETE /api/users/[id]

Delete user and cascade delete owned projects.

### Projects

#### GET /api/projects

List projects with filtering and pagination.

**Query Parameters:**

- `userId`: Filter by user (owned or member)
- `visibility`: Filter by visibility (PRIVATE, PUBLIC, TEAM)
- `search`: Search in name/description
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### POST /api/projects

Create a new project.

**Body:**

```json
{
  "name": "Project Name",
  "description": "Project description", // optional
  "visibility": "PRIVATE", // PRIVATE|PUBLIC|TEAM
  "ownerId": "user_cuid",
  "repositoryUrl": "https://github.com/..." // optional
}
```

#### GET /api/projects/[id]

Get project details with files, members, and active sessions.

#### PUT /api/projects/[id]

Update project information.

#### DELETE /api/projects/[id]

Delete project and all associated data.

### Files

#### GET /api/projects/[id]/files

List project files.

**Query Parameters:**

- `path`: Filter by path prefix
- `type`: Filter by type (FILE|DIRECTORY)
- `includeContent`: Include file content (true|false)

#### POST /api/projects/[id]/files

Create a new file or directory.

**Body:**

```json
{
  "path": "/src/components/Button.tsx",
  "name": "Button.tsx",
  "type": "FILE", // FILE|DIRECTORY
  "content": "file content", // optional
  "mimeType": "text/typescript" // optional
}
```

#### GET /api/projects/[id]/files/[fileId]

Get file details with content and activity history.

#### PUT /api/projects/[id]/files/[fileId]

Update file content or metadata.

**Body:**

```json
{
  "content": "updated content",
  "userId": "user_cuid" // for activity tracking
}
```

#### DELETE /api/projects/[id]/files/[fileId]

Delete file.

### Collaboration

#### GET /api/projects/[id]/sessions

List collaboration sessions for a project.

#### POST /api/projects/[id]/sessions

Create a new collaboration session.

**Body:**

```json
{
  "name": "Session Name",
  "userId": "user_cuid" // optional, adds as participant
}
```

### AI Chat

#### GET /api/ai/sessions

List AI chat sessions.

**Query Parameters:**

- `userId`: Filter by user
- `projectId`: Filter by project
- `context`: Filter by context type

#### POST /api/ai/sessions

Create a new AI chat session.

**Body:**

```json
{
  "title": "Chat Title", // optional
  "context": "GENERAL", // GENERAL|CODE_REVIEW|DEBUGGING|ARCHITECTURE|DOCUMENTATION
  "userId": "user_cuid",
  "projectId": "project_cuid" // optional
}
```

#### POST /api/ai

Stream AI chat with optional database storage.

**Body:**

```json
{
  "messages": [{ "role": "user", "content": "Hello" }],
  "system": "You are a helpful assistant", // optional
  "sessionId": "session_cuid", // optional, for message storage
  "userId": "user_cuid" // optional
}
```

**Response:** Server-Sent Events (SSE) stream

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message"
}
```

Common status codes:

- `400`: Bad Request (validation errors)
- `404`: Not Found
- `405`: Method Not Allowed
- `500`: Internal Server Error

## Database Schema

The API uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User accounts with GitHub OAuth support
- **Project**: Development projects with visibility controls
- **ProjectFile**: File system with content storage
- **ProjectMember**: Team membership with roles
- **CollaborationSession**: Real-time collaboration sessions
- **AiChatSession**: AI chat conversations
- **AiMessage**: Individual chat messages
- **FileActivity**: File change tracking
- **GitRepository**: Git integration metadata

## Next Steps

1. Add NextAuth.js authentication middleware
2. Implement project member authorization checks
3. Add WebSocket integration for real-time updates
4. Add file upload/download endpoints
5. Implement Git repository sync
6. Add data validation with Zod
7. Add rate limiting and API quotas
