// Minimal mock for y-websocket used in Jest tests to avoid transforming
// upstream ESM sources during unit tests.
// Fires both 'sync' and 'status' events asynchronously after construction
// so tests that wait on these events don't hang.
export class WebsocketProvider {
  constructor(serverUrl, roomname, doc, opts) {
    this.serverUrl = serverUrl;
    this.roomname = roomname;
    this.doc = doc;
    this._listeners = {};
    setTimeout(() => this._emit('sync', true), 0);
    setTimeout(() => this._emit('status', { status: 'connected' }), 0);
  }

  _emit(event, ...args) {
    const handlers = this._listeners[event] || [];
    for (const cb of handlers) {
      try { cb(...args); } catch (e) { /* swallow */ }
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

export default { WebsocketProvider };
