# WebSocket Server Tests

Comprehensive test suite for the WebSocket collaborative editing server.

## Test Structure

```
__tests__/
├── README.md                    # This file
├── handlers.test.ts             # Unit tests for message handlers
├── integration/
│   └── websocket-server.test.ts # Integration tests
└── utils/
    └── test-helpers.ts          # Test utilities and mocks
```

## Test Types

### Unit Tests (`handlers.test.ts`)
Tests individual message handler functions in isolation with mocked dependencies.

**Coverage:**
- ✅ `handleJoinSession` - Join session with authentication
- ✅ `handleLeaveSession` - Leave session and update presence
- ✅ `handleCursorUpdate` - Update user cursor position
- ✅ `handleFileSave` - Save file content with permissions
- ✅ `updateUserPresence` - User presence tracking
- ✅ `broadcastToSession` - Broadcast messages to participants

**Tests:**
- Valid operations with proper authentication
- Invalid session/file IDs
- Unauthorized access attempts
- Missing required parameters
- Database state verification
- Message broadcasting logic

### Integration Tests (`integration/websocket-server.test.ts`)
Tests the full WebSocket server with real WebSocket connections.

**Coverage:**
- ✅ Connection establishment
- ✅ Authentication parameter handling
- ✅ Session join/leave flows
- ✅ Cursor position synchronization
- ✅ File save operations
- ✅ Multi-client collaboration
- ✅ Connection cleanup
- ✅ Error handling

**Tests:**
- Full client-server communication
- Multiple concurrent clients
- Real-time message exchange
- Database persistence
- Connection lifecycle

## Running Tests

### Prerequisites

1. **PostgreSQL Database**
   ```bash
   # Start PostgreSQL using Docker
   docker run --name udp-test-db \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=udp_test \
     -p 5433:5432 \
     -d postgres:16-alpine
   ```

2. **Environment Variables**
   Create `.env.test` file in the root:
   ```env
   # Test Database
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/udp_test"

   # NextAuth (for JWT testing)
   NEXTAUTH_SECRET="test-secret-key-at-least-32-chars-long"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Database Schema**
   ```bash
   cd packages/db
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/udp_test" pnpm db:push
   ```

### Run All Tests

```bash
cd apps/api
pnpm test
```

### Run Unit Tests Only

```bash
pnpm test:unit
```

Unit tests run independently and don't require the WebSocket server to be running.

### Run Integration Tests

```bash
# 1. Start the WebSocket server in one terminal
pnpm dev

# 2. In another terminal, run integration tests
pnpm test:integration
```

Integration tests require the WebSocket server to be running on `localhost:3030`.

### Watch Mode

```bash
pnpm test:watch
```

Automatically reruns tests when files change.

### Coverage Report

```bash
pnpm test:coverage
```

Generates a coverage report showing which lines of code are tested.

## Test Utilities

### MockWebSocket

Mock WebSocket connection for unit testing.

```typescript
import { MockWebSocket } from './utils/test-helpers';

const ws = new MockWebSocket();

// Send data through the mock
ws.send(JSON.stringify({ type: 'test' }));

// Get sent messages
const messages = ws.getSentJSON();
const lastMessage = ws.getLastSentJSON();

// Simulate receiving a message
ws.receiveMessage('Hello from server');

// Check connection state
expect(ws.readyState).toBe(1); // OPEN
```

### Test Fixtures

Pre-configured test data for consistent testing.

```typescript
import { testData, createTestFixtures, cleanupTestData } from './utils/test-helpers';

// In beforeAll
const fixtures = await createTestFixtures(prisma);

// Use test data
const userId = testData.user.id;
const projectId = testData.project.id;

// In afterAll
await cleanupTestData(prisma);
```

### createMockRequest

Create mock HTTP upgrade requests for WebSocket testing.

```typescript
import { createMockRequest } from './utils/test-helpers';

const req = createMockRequest({
  sessionId: 'test-session-1',
  projectId: 'test-project-1',
  userId: 'test-user-1',
  docName: 'my-document',
});
```

### waitForMessage

Wait for a specific message type in tests.

```typescript
import { waitForMessage } from './utils/test-helpers';

const message = await waitForMessage(ws, 'session-joined', 1000);
expect(message.type).toBe('session-joined');
```

## Writing New Tests

### Unit Test Template

```typescript
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { prisma } from '@udp/db';
import { handleYourFunction } from '../handlers.js';
import { MockWebSocket, createTestFixtures, cleanupTestData } from './utils/test-helpers';

describe('Your Handler', () => {
  let fixtures: any;

  beforeAll(async () => {
    await cleanupTestData(prisma);
    fixtures = await createTestFixtures(prisma);
  });

  afterAll(async () => {
    await cleanupTestData(prisma);
    await prisma.$disconnect();
  });

  it('should do something', async () => {
    const ws = new MockWebSocket();

    const result = await handleYourFunction(ws, { /* data */ });

    expect(result.success).toBe(true);
  });
});
```

### Integration Test Template

```typescript
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { WebSocket } from 'ws';
import { prisma } from '@udp/db';

const describeIfServerRunning = process.env.TEST_INTEGRATION ? describe : describe.skip;

describeIfServerRunning('Your Integration Test', () => {
  beforeAll(async () => {
    // Setup
  });

  afterAll(async () => {
    // Cleanup
    await prisma.$disconnect();
  });

  it('should do something', async () => {
    const ws = new WebSocket('ws://localhost:3030');

    // Wait for connection
    await new Promise((resolve, reject) => {
      ws.once('open', resolve);
      ws.once('error', reject);
    });

    // Test logic
    ws.send(JSON.stringify({ type: 'test' }));

    ws.close();
  });
});
```

## Debugging Tests

### Enable Verbose Logging

```bash
DEBUG=* pnpm test
```

### Run Single Test File

```bash
pnpm test handlers.test.ts
```

### Run Single Test Case

```bash
pnpm test -t "should successfully join a session"
```

### Inspect Database State

```typescript
// Add this to your test
const presence = await prisma.userPresence.findMany();
console.log('Current presence:', presence);
```

## Continuous Integration

For CI environments, use the combined test script:

```bash
# Start server in background
pnpm dev &
SERVER_PID=$!

# Wait for server to be ready
sleep 3

# Run all tests
pnpm test

# Stop server
kill $SERVER_PID
```

Or use Docker Compose to orchestrate services:

```yaml
# docker-compose.test.yml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: udp_test
    ports:
      - "5433:5432"

  api:
    build: .
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/udp_test
      NODE_ENV: test
    depends_on:
      - postgres
    command: pnpm test
```

## Test Coverage Goals

Target coverage metrics:
- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

Current coverage (run `pnpm test:coverage` to see latest):
```
File                | % Stmts | % Branch | % Funcs | % Lines
--------------------|---------|----------|---------|--------
handlers.js         |   85%   |   78%    |   88%   |   85%
server.js           |   65%   |   60%    |   70%   |   65%
```

## Common Issues

### "Connection refused" Error
- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- For integration tests, ensure WebSocket server is running

### "Timeout waiting for message"
- Increase timeout in test: `waitForMessage(ws, 'type', 5000)`
- Check server logs for errors
- Verify database connection is working

### "Unique constraint violation"
- Run `await cleanupTestData(prisma)` before tests
- Ensure test data uses unique IDs (starting with 'test-')

### Tests Pass Individually But Fail Together
- Tests are sharing database state
- Add proper cleanup in `afterEach` or `beforeEach`
- Use unique IDs for each test case

## Best Practices

1. **Isolation:** Each test should be independent
2. **Cleanup:** Always clean up test data
3. **Descriptive:** Use clear test names
4. **Fast:** Keep unit tests under 100ms
5. **Deterministic:** No flaky tests
6. **Coverage:** Aim for high coverage, especially on critical paths

## Contributing

When adding new WebSocket features:

1. ✅ Write handler function in `handlers.js`
2. ✅ Export function for testing
3. ✅ Add unit tests in `handlers.test.ts`
4. ✅ Add integration test in `websocket-server.test.ts`
5. ✅ Update this README
6. ✅ Run full test suite before committing

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [WebSocket Testing Guide](https://github.com/websockets/ws#usage-examples)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing/unit-testing)
- [Project Documentation](../../docs/)
