import { EventEmitter } from 'events';
import FileWatcher from '../FileWatcher';

describe('FileWatcher (unit)', () => {
  let fakeFs: any;
  let watcherCallback: ((event: any) => void) | undefined;
  let fw: FileWatcher;

  beforeEach(() => {
    watcherCallback = undefined;

    fakeFs = {
      watch: jest.fn(async (path: string, cb: (event: any) => void) => {
        watcherCallback = cb;
        return Promise.resolve();
      }),
      unwatch: jest.fn(async () => Promise.resolve()),
      readFile: jest.fn(async (p: string) => 'file-contents'),
      writeFile: jest.fn(async (p: string, c: string) => Promise.resolve()),
    };

    fw = new FileWatcher(fakeFs as any);
  });

  test('watching triggers read and emits file events', async () => {
    const createdPromise = new Promise<void>(resolve => {
      fw.on('file:created', (p, content) => {
        expect(p).toBe('/some/file.txt');
        expect(content).toBe('file-contents');
        resolve();
      });
    });

    const syncPromise = new Promise<void>(resolve => {
      fw.on('sync:required', (p, op) => {
        expect(p).toBe('/some/file.txt');
        expect(op).toBe('file-create');
        resolve();
      });
    });

    await fw.watch('/some');
    expect(fakeFs.watch).toHaveBeenCalledWith('/some', expect.any(Function));

    // simulate fs event
    expect(watcherCallback).toBeDefined();
    watcherCallback!({ type: 'add', path: '/some/file.txt' });

    await Promise.all([createdPromise, syncPromise]);
  });

  test('registerCollaborativeDocument updates are written to fs', async () => {
    // Minimal Yjs-like document
    const yText = {
      _content: 'doc-initial',
      toString() {
        return this._content;
      },
      delete(_s: number, _e: number) {
        this._content = '';
      },
      insert(_i: number, v: string) {
        this._content = v;
      },
      length: 0,
    };

    const yjsDoc = new EventEmitter() as any;
    yjsDoc.getText = jest.fn(() => yText);

    fw.registerCollaborativeDocument('/some/doc.txt', yjsDoc);

    // update the text and emit update event
    yText._content = 'new-content';
    yjsDoc.emit('update', new Uint8Array([1, 2, 3]));

    // give async handlers a tick
    await new Promise(r => setTimeout(r, 10));

    expect(fakeFs.writeFile).toHaveBeenCalledWith('/some/doc.txt', 'new-content');
  });
});
