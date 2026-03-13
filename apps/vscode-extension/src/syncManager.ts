import { EventEmitter } from 'events';
import { ChildProcess, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import type * as vscode from 'vscode';

export type SyncStatus = 'stopped' | 'starting' | 'running' | 'error';

export class UdpSyncManager extends EventEmitter implements vscode.Disposable {
  private port = 21567;
  private serverProc?: ChildProcess;
  private _status: SyncStatus = 'stopped';
  private pollTimer?: NodeJS.Timeout;

  constructor(private workspacePath: string) {
    super();
    this.loadPort();
  }

  private loadPort() {
    const configPath = path.join(this.workspacePath, '.udp', 'config.json');
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        this.port = config.syncPort ?? 21567;
      } catch (e) {
        this.port = 21567;
      }
    }
  }

  get status(): SyncStatus {
    return this._status;
  }

  getPort(): number {
    return this.port;
  }

  start(): void {
    if (this._status === 'running' || this._status === 'starting') return;
    this.setStatus('starting');

    const serverPath = path.resolve(
      __dirname,
      '../../../sync-server/server.js'
    );
    const dbPath = path.join(this.workspacePath, '.udp', 'sync.db');

    this.serverProc = spawn('node', [serverPath], {
      env: {
        ...process.env,
        PORT: String(this.port),
        DATABASE_URL: `file:${dbPath}`,
      },
      stdio: 'ignore',
      detached: false,
    });

    this.serverProc.on('exit', () => {
      if (this._status !== 'stopped') {
        this.setStatus('stopped');
      }
    });

    this.serverProc.on('error', () => {
      this.setStatus('error');
    });

    this.startPolling();
  }

  stop(): void {
    this.stopPolling();
    if (this.serverProc) {
      this.serverProc.kill();
      this.serverProc = undefined;
    }
    this.setStatus('stopped');
  }

  async fetchJson<T>(apiPath: string): Promise<T> {
    const res = await fetch(`http://localhost:${this.port}${apiPath}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  }

  private startPolling() {
    this.pollTimer = setInterval(async () => {
      try {
        await this.fetchJson('/health');
        if (this._status !== 'running') {
          this.setStatus('running');
        }
      } catch {
        if (this._status === 'running') {
          this.setStatus('error');
        }
      }
    }, 2000);
  }

  private stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = undefined;
    }
  }

  private setStatus(s: SyncStatus) {
    this._status = s;
    this.emit('statusChanged', s);
  }

  dispose(): void {
    this.stop();
  }
}
