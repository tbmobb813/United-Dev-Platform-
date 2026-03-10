import * as vscode from 'vscode';
import { UdpSyncManager } from './syncManager';
import { UdpStatusBar } from './statusBar';
import { UdpSidebarProvider } from './sidebarProvider';
import { showQrPanel } from './qrPanel';

export function activate(context: vscode.ExtensionContext) {
  const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspacePath) {
    return;
  }

  const manager = new UdpSyncManager(workspacePath);
  const statusBar = new UdpStatusBar(context, manager);
  const sidebar = new UdpSidebarProvider(context.extensionUri, manager);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('udp.sidebarView', sidebar),
    vscode.commands.registerCommand('udp.startSync', () => manager.start()),
    vscode.commands.registerCommand('udp.stopSync', () => manager.stop()),
    vscode.commands.registerCommand('udp.showQR', () => showQrPanel(context, manager)),
    manager,
    statusBar
  );

  statusBar.init();
}

export function deactivate() {}
