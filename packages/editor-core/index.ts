import { Awareness } from 'y-protocols/awareness';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

// User presence interface
export interface UserPresence {
  id: string;
  name: string;
  color: string;
  lastSeen: Date;
  isActive: boolean;
}

// Document interface
export interface CollaborativeDocument {
  id: string;
  content: Y.Text;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

export function createCollabDoc(room: string, serverUrl: string) {
  const doc = new Y.Doc();
  const provider = new WebsocketProvider(serverUrl, room, doc);
  return { doc, provider };
}

export class DocumentManager {
  private doc: Y.Doc;
  private provider: WebsocketProvider;
  private serverUrl: string;
  private user: Omit<UserPresence, 'lastSeen' | 'isActive'>;
  private collaboratorsChangeCallback?: (collaborators: UserPresence[]) => void;
  public awareness: Awareness;

  constructor(
    user: Omit<UserPresence, 'lastSeen' | 'isActive'>,
    serverUrl: string = 'ws://localhost:1234'
  ) {
    this.user = user;
    this.serverUrl = serverUrl;
    this.doc = new Y.Doc();
    this.provider = new WebsocketProvider(serverUrl, 'default-room', this.doc);
    this.awareness = this.provider.awareness;

    // Set user presence
    this.awareness.setLocalStateField('user', {
      ...user,
      lastSeen: new Date(),
      isActive: true,
    });

    // Listen for awareness changes
    this.awareness.on('change', () => {
      if (this.collaboratorsChangeCallback) {
        const collaborators = this.getCollaborators();
        this.collaboratorsChangeCallback(collaborators);
      }
    });
  }

  async openDocument(
    roomId: string,
    documentId?: string
  ): Promise<CollaborativeDocument> {
    // Update the room
    this.provider.destroy();
    const actualRoomId = documentId ? `${roomId}-${documentId}` : roomId;
    this.provider = new WebsocketProvider(
      this.serverUrl,
      actualRoomId,
      this.doc
    );
    this.awareness = this.provider.awareness;

    // Re-set user presence
    this.awareness.setLocalStateField('user', {
      ...this.user,
      lastSeen: new Date(),
      isActive: true,
    });

    // Wait for connection
    await new Promise<void>(resolve => {
      if (this.provider.wsconnected) {
        resolve();
      } else {
        this.provider.on('status', ({ status }: { status: string }) => {
          if (status === 'connected') {
            resolve();
          }
        });
      }
    });

    const content = this.doc.getText('content');

    return {
      id: documentId || roomId,
      content,
      metadata: {},
    };
  }

  onCollaboratorsChanged(
    callback: (collaborators: UserPresence[]) => void
  ): void {
    this.collaboratorsChangeCallback = callback;
    // Immediately call with current collaborators
    callback(this.getCollaborators());
  }

  private getCollaborators(): UserPresence[] {
    const collaborators: UserPresence[] = [];

    this.awareness.getStates().forEach((state, clientId) => {
      if (state.user && clientId !== this.awareness.clientID) {
        collaborators.push(state.user as UserPresence);
      }
    });

    return collaborators;
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
