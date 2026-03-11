import { ProjectManager, ProjectTemplate, ProjectFile } from '../ProjectManager';
import { NodeFileSystem } from '../NodeFileSystem';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

describe('ProjectManager', () => {
  let pm: ProjectManager;
  let nfs: NodeFileSystem;
  let tmp: string;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-test-'));
    nfs = new NodeFileSystem(tmp);
    pm = new ProjectManager(nfs);
  });

  afterEach(async () => {
    try {
      await nfs.deleteDirectory('/', true);
    } catch {}
  });

  it('can add and retrieve templates', () => {
    const template: ProjectTemplate = {
      id: 'test-template',
      name: 'Test Template',
      description: 'desc',
      type: 'web',
      framework: 'none',
      language: 'typescript',
      files: [],
    };
    pm.addTemplate(template);
    expect(pm.getTemplates().find(t => t.id === 'test-template')).toBeDefined();
    expect(pm.getTemplate('test-template')).toEqual(template);
    expect(pm.getTemplate('missing')).toBeUndefined();
  });

  it('analyzes an empty project', async () => {
    const tmpPath = 'empty-project';
    await nfs.createDirectory(tmpPath, true);
    const result = await pm.analyzeProject(tmpPath);
    expect(result.totalFiles).toBe(0);
    expect(result.totalDirectories).toBe(0);
    expect(result.structure.length).toBe(0);
  });

  it('createWorkspaceConfig and loadWorkspaceConfig roundtrip', async () => {
    const config = {
      name: 'ws',
      version: '1.0.0',
      type: 'web',
      rootPath: 'ws',
    };
    await pm.createWorkspaceConfig('ws', config);
    const loaded = await pm.loadWorkspaceConfig('ws');
    expect(loaded).toMatchObject(config);
  });

  it('createProject throws for missing template', async () => {
    await expect(pm.createProject('not-found', '/foo', {})).rejects.toThrow();
  });
});
