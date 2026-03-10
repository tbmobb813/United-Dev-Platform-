// CommonJS mock for y-websocket to be used by Jest when running tests in CJS
// mode. The repository also contains an ESM mock (.mjs) but some test
// environments run jest in CJS and need a CJS mock to avoid parsing `export`.
//
// Integration tests that need a REAL WebSocket connection (e.g. sync-server
// integration tests) should override this mock via jest.mock() or by using
// the actual y-websocket package.  For unit tests the mock fires both
// `status` (connected) and `sync` events immediately so tests that wait on
// these events don't hang indefinitely.

class WebsocketProvider {
  constructor(serverUrl, roomname, doc, opts) {
    this.serverUrl = serverUrl;
    this.roomname = roomname;
    this.doc = doc;
    // store listeners so tests can behave like a connected socket
    this._listeners = {};
    // Schedule firing both 'sync' and 'status' events asynchronously so
    // tests that register handlers synchronously after construction still
    // receive the events.
    setTimeout(() => this._emit('sync', true), 0);
    setTimeout(() => this._emit('status', { status: 'connected' }), 0);
  }

  _emit(event, ...args) {
    const handlers = this._listeners[event] || [];
    for (const cb of handlers) {
      try {
        cb(...args);
      } catch (e) {
        // swallow errors from test callbacks
      }
    }
  }

  on(event, cb) {
    this._listeners[event] = this._listeners[event] || [];
    this._listeners[event].push(cb);
  }

  off(event, cb) {
    if (this._listeners[event]) {
      this._listeners[event] = this._listeners[event].filter((h) => h !== cb);
    }
  }

  connect() {
    // Re-emit sync + status on reconnect
    setTimeout(() => this._emit('sync', true), 0);
    setTimeout(() => this._emit('status', { status: 'connected' }), 0);
  }

  disconnect() {
    setTimeout(() => this._emit('status', { status: 'disconnected' }), 0);
  }

  destroy() {
    this._listeners = {};
  }
}

module.exports = {
  WebsocketProvider,
  default: { WebsocketProvider },
};
