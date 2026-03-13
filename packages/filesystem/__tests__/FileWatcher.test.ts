import { FileWatcher } from '../FileWatcher';
import { NodeFileSystem } from '../NodeFileSystem';
import fs from 'fs';
import path from 'path';

describe('FileWatcher', () => {
  // Set a global Jest timeout for all tests in this file (e.g., 15 seconds)
  jest.setTimeout(15000);
  const TEST_DIR = path.join(__dirname, 'tmp-filewatcher');
  let watcher: FileWatcher;
  let fsProvider: NodeFileSystem;

  beforeAll(() => {
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR);
    }
    fsProvider = new NodeFileSystem(TEST_DIR);
  });

  afterAll(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
  });

  afterEach(async () => {
    if (watcher) {
      await watcher.destroy();
    }
  });

  it('should instantiate without error', () => {
    watcher = new FileWatcher(fsProvider);
    expect(watcher).toBeDefined();
  });

  it('should emit file:created when a file is created', done => {
    watcher = new FileWatcher(fsProvider);
    watcher.watch(TEST_DIR).then(() => {
      const testFile = path.join(TEST_DIR, 'created.txt');
      const failTimeout = setTimeout(() => {
        done(new Error('Timeout: file:created event not received'));
      }, 5000);
      watcher.on('file:created', filePath => {
        clearTimeout(failTimeout);
        expect(filePath.endsWith('created.txt')).toBe(true);
        done();
      });
      // Wait for chokidar's 'ready' event before writing file
      const chokidarWatcher = fsProvider.getWatcher(TEST_DIR);
      if (chokidarWatcher) {
        console.log('[TEST] Waiting for chokidar ready event for file:created');
        chokidarWatcher.on('ready', () => {
          console.log('[TEST] Chokidar ready event fired for file:created');
          fs.writeFileSync(testFile, 'hello');
          console.log('[TEST] File created:', testFile);
        });
      } else {
        // fallback: delay if watcher not available
        setTimeout(() => {
          console.log('[TEST] Fallback: creating file after delay');
          fs.writeFileSync(testFile, 'hello');
        }, 500);
      }
    });
  }, 15000);

  it('should emit file:deleted when a file is deleted', done => {
    watcher = new FileWatcher(fsProvider);
    watcher.watch(TEST_DIR).then(() => {
      const testFile = path.join(TEST_DIR, 'deleted.txt');
      const failTimeout = setTimeout(() => {
        done(new Error('Timeout: file:deleted event not received'));
      }, 5000);
      watcher.on('file:deleted', filePath => {
        clearTimeout(failTimeout);
        expect(filePath.endsWith('deleted.txt')).toBe(true);
        done();
      });
      const chokidarWatcher = fsProvider.getWatcher(TEST_DIR);
      if (chokidarWatcher) {
        console.log('[TEST] Waiting for chokidar ready event for file:deleted');
        chokidarWatcher.on('ready', () => {
          console.log('[TEST] Chokidar ready event fired for file:deleted');
          fs.writeFileSync(testFile, 'bye');
          console.log('[TEST] File created for delete:', testFile);
          setTimeout(() => {
            fs.unlinkSync(testFile);
            console.log('[TEST] File deleted:', testFile);
          }, 100);
        });
      } else {
        setTimeout(() => {
          console.log(
            '[TEST] Fallback: creating and deleting file after delay'
          );
          fs.writeFileSync(testFile, 'bye');
          setTimeout(() => fs.unlinkSync(testFile), 100);
        }, 500);
      }
    });
  }, 15000);

  it('should emit file:changed when a file is changed', done => {
    watcher = new FileWatcher(fsProvider);
    watcher.watch(TEST_DIR).then(() => {
      const testFile = path.join(TEST_DIR, 'modified.txt');
      const failTimeout = setTimeout(() => {
        done(new Error('Timeout: file:changed event not received'));
      }, 5000);
      watcher.on('file:changed', filePath => {
        clearTimeout(failTimeout);
        expect(filePath.endsWith('modified.txt')).toBe(true);
        done();
      });
      const chokidarWatcher = fsProvider.getWatcher(TEST_DIR);
      if (chokidarWatcher) {
        console.log('[TEST] Waiting for chokidar ready event for file:changed');
        chokidarWatcher.on('ready', () => {
          console.log('[TEST] Chokidar ready event fired for file:changed');
          fs.writeFileSync(testFile, 'old');
          console.log('[TEST] File created for change:', testFile);
          setTimeout(() => {
            fs.writeFileSync(testFile, 'new');
            console.log('[TEST] File changed:', testFile);
          }, 100);
        });
      } else {
        setTimeout(() => {
          console.log(
            '[TEST] Fallback: creating and changing file after delay'
          );
          fs.writeFileSync(testFile, 'old');
          setTimeout(() => fs.writeFileSync(testFile, 'new'), 100);
        }, 500);
      }
    });
  }, 15000);
});
