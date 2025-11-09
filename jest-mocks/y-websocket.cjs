// CommonJS mock for y-websocket to be used by Jest when running tests in CJS
// mode. The repository also contains an ESM mock (.mjs) but some test
// environments run jest in CJS and need a CJS mock to avoid parsing `export`.
class WebsocketProvider {
    constructor() {
        // store listeners so tests can behave like a connected socket
        this._listeners = {};
    }

    on(event, cb) {
        // For tests we immediately fire the 'status' -> 'connected' event
        if (event === 'status') {
            // deliver immediately (synchronously) to avoid flaky scheduling in
            // different Jest worker environments
            try {
                cb({ status: 'connected' });
            } catch (e) {
                // swallow errors from test callbacks
            }
        }
        // store for potential later use
        this._listeners[event] = this._listeners[event] || [];
        this._listeners[event].push(cb);
    }

    destroy() {
        // no-op for tests
        this._listeners = {};
    }
}

module.exports = {
    WebsocketProvider,
    default: { WebsocketProvider },
};
