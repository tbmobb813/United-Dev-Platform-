declare module 'y-indexeddb' {
  import { Doc } from 'yjs';

  export class IndexeddbPersistence {
    constructor(name: string, doc: Doc);
    whenSynced: Promise<void>;
    destroy?(): void;
  }

  export default IndexeddbPersistence;
}
