import { Awareness } from 'y-protocols/awareness';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

export function createCollabDoc(room: string, serverUrl: string) {
  const doc = new Y.Doc();
  const provider = new WebsocketProvider(serverUrl, room, doc);
  return { doc, provider };
}

export class DocumentManager {
  private doc: Y.Doc;
  private provider: WebsocketProvider;
  public awareness: Awareness;

  constructor(roomName: string, serverUrl: string = 'ws://localhost:1234') {
    this.doc = new Y.Doc();
    this.provider = new WebsocketProvider(serverUrl, roomName, this.doc);
    this.awareness = this.provider.awareness;
  }

  getDocument(): Y.Doc {
    return this.doc;
  }

  getProvider(): WebsocketProvider {
    return this.provider;
  }

  destroy(): void {
    this.provider.destroy();
  }
}

// Export modules
export * from './awareness';
export * from './OfflinePersistence';
