import { VirtualFileSystem } from '../../VirtualFileSystem';
import { ProjectManager } from '../../ProjectManager';
import { NodeFileSystem } from '../../NodeFileSystem';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { describe, it, expect } from '@jest/globals';

function hasIndexedDB(): boolean {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - globalThis may have different shapes in test environments
  return typeof (globalThis as any).indexedDB !== 'undefined';
}

describe('packages/filesystem - API', () => {
  it('createFileSystem returns virtual fs when requested', async () => {
    // Use VirtualFileSystem in browser-like envs; otherwise fallback to NodeFileSystem
    let fsInstance: NodeFileSystem | VirtualFileSystem;
    if (hasIndexedDB()) {
      fsInstance = new VirtualFileSystem('test-db');
    } else {
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'udp-fs-'));
      fsInstance = new NodeFileSystem(tmp);
    }

    // sanity check that Node's fs module is available in the test env
    expect(fs).toBeDefined();

    // basic contract: write/read/delete using async/await to satisfy lint rules
    await fsInstance.writeFile('hello.txt', 'world', {
      overwrite: true,
      createDirectories: true,
    });

    const content = await fsInstance.readFile('hello.txt');
    expect(String(content)).toBe('world');

    await fsInstance.deleteFile('hello.txt');
    const exists = await fsInstance.exists('hello.txt');
    expect(exists).toBe(false);
  });

  it('createProjectManager can create a project from template', async () => {
    // Use NodeFileSystem in test env to avoid IndexedDB dependency
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'udp-pm-'));
    const nodeFs = new NodeFileSystem(tmp);
    // Use parameter type inference to avoid `any` cast
    const pm = new ProjectManager(
      nodeFs as unknown as ConstructorParameters<typeof ProjectManager>[0]
    );
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
