import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

export function createCollabDoc(room: string, serverUrl: string) {
  const doc = new Y.Doc();
  const provider = new WebsocketProvider(serverUrl, room, doc);
  return { doc, provider };
}

// Export awareness functionality
export * from './awareness';

// Export types and classes
export { DocumentManager } from './DocumentManager';
export * from './types';
