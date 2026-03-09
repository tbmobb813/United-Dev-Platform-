import * as vscode from 'vscode';
import type { UdpSyncManager, SyncStatus } from './syncManager';

export class UdpStatusBar implements vscode.Disposable {
  private item: vscode.StatusBarItem;

  constructor(context: vscode.ExtensionContext, private manager: UdpSyncManager) {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    context.subscriptions.push(this.item);
  }

  init() {
    this.manager.on('statusChanged', (s: SyncStatus) => this.update(s));
    this.update(this.manager.status);
    this.item.show();
  }

  private update(status: SyncStatus) {
    const map: Record<SyncStatus, { text: string; cmd: string; tooltip: string }> = {
      stopped: {
        text: '$(circle-slash) UDP: Stopped',
        cmd: 'udp.startSync',
        tooltip: 'Click to start sync',
      },
      starting: {
        text: '$(sync~spin) UDP: Starting...',
        cmd: 'udp.stopSync',
        tooltip: 'Starting sync server...',
      },
      running: {
        text: '$(check) UDP: Syncing',
        cmd: 'udp.stopSync',
        tooltip: 'Click to stop sync',
      },
      error: {
        text: '$(error) UDP: Error',
        cmd: 'udp.startSync',
        tooltip: 'Sync error — click to restart',
      },
    };

    const config = map[status];
    this.item.text = config.text;
    this.item.command = config.cmd;
    this.item.tooltip = config.tooltip;
  }

  dispose() {
    this.item.dispose();
  }
}
