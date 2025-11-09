// Minimal mock for y-websocket used in Jest tests to avoid transforming
// upstream ESM sources during unit tests.
export class WebsocketProvider {
    constructor() {
        // no-op mock implementation
    }
}

export default { WebsocketProvider };
