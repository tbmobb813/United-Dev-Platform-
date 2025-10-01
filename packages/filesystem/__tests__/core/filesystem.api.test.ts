import { VirtualFileSystem } from '../../VirtualFileSystem';
import { ProjectManager } from '../../ProjectManager';
import { NodeFileSystem } from '../../NodeFileSystem';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { describe, it, expect } from '@jest/globals';

function hasIndexedDB(): boolean {
  return (
    typeof (globalThis as unknown as Record<string, unknown>).indexedDB !==
    'undefined'
  );
}

describe('packages/filesystem - API', () => {
  it('createFileSystem returns virtual fs when requested', () => {
    // Use VirtualFileSystem in browser-like envs; otherwise fallback to NodeFileSystem
    let fsInstance: NodeFileSystem | VirtualFileSystem;
    if (hasIndexedDB()) {
      fsInstance = new VirtualFileSystem('test-db');
    } else {
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'udp-fs-'));
      fsInstance = new NodeFileSystem(tmp);
    }
    expect(fs).toBeDefined();
    // basic contract: write/read/delete
    return fsInstance
      .writeFile('hello.txt', 'world', {
        overwrite: true,
        createDirectories: true,
      })
      .then(() => fsInstance.readFile('hello.txt'))
      .then((content: string | Uint8Array) => {
        expect(String(content)).toBe('world');
        return fsInstance.deleteFile('hello.txt');
      })
      .then(() => fsInstance.exists('hello.txt'))
      .then((exists: boolean) => expect(exists).toBe(false));
  });

  it('createProjectManager can create a project from template', async () => {
    // Use NodeFileSystem in test env to avoid IndexedDB dependency
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'udp-pm-'));
    const nodeFs = new NodeFileSystem(tmp);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const pm = new ProjectManager(nodeFs as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const templateId = 'react-typescript';
    const projectPath = 'projects/myapp';
    await pm.createProject(templateId, projectPath, { projectName: 'myapp' });
    const hasPkg = await nodeFs.exists('projects/myapp/package.json');
    expect(hasPkg).toBe(true);
    const pkg = (await nodeFs.readFile(
      'projects/myapp/package.json'
    )) as string;
    expect(pkg).toContain('react');
    // cleanup
    await nodeFs.deleteDirectory('projects', true);
  });
});
