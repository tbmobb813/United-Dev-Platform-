import * as vscode from 'vscode';
import type { UdpSyncManager } from './syncManager';

export async function showQrPanel(
  context: vscode.ExtensionContext,
  manager: UdpSyncManager
) {
  if (manager.status !== 'running') {
    vscode.window.showWarningMessage(
      'Start UDP sync first using "UDP: Start Sync" command.'
    );
    return;
  }

  try {
    const data = await manager.fetchJson<{
      qr: string;
      pairingUrl: string;
      expiresAt: number;
    }>('/api/devices/qr');

    const panel = vscode.window.createWebviewPanel(
      'udp.qr',
      'UDP: Pair Device',
      vscode.ViewColumn.One,
      {}
    );

    const expiryTime = new Date(data.expiresAt).toLocaleTimeString();
    panel.webview.html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin: 0;
      background: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
    }
    h2 {
      margin-top: 0;
      margin-bottom: 24px;
    }
    img {
      border: 2px solid var(--vscode-focusBorder);
      border-radius: 8px;
    }
    code {
      margin-top: 24px;
      padding: 8px 12px;
      background: var(--vscode-editor-inlineValue-background);
      border-radius: 4px;
      font-size: 12px;
      user-select: all;
    }
    .expiry {
      color: var(--vscode-descriptionForeground);
      font-size: 12px;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <h2>Scan to pair your mobile device</h2>
  <img src="${data.qr}" width="280" height="280" alt="QR Code" />
  <code>${data.pairingUrl}</code>
  <p class="expiry">Expires ${expiryTime}</p>
</body>
</html>`;
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to fetch QR code: ${error}`);
  }
}
