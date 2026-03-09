import * as vscode from 'vscode';
import type { UdpSyncManager } from './syncManager';

interface Device {
  deviceId: string;
  info?: {
    name?: string;
    platform?: string;
  };
  confirmed?: boolean;
}

export class UdpSidebarProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;
  private pollTimer?: NodeJS.Timeout;

  constructor(private extensionUri: vscode.Uri, private manager: UdpSyncManager) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    webviewView.webview.html = this.getWebviewContent();

    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case 'startSync':
          this.manager.start();
          break;
        case 'stopSync':
          this.manager.stop();
          break;
        case 'showQR':
          vscode.commands.executeCommand('udp.showQR');
          break;
        case 'removeDevice':
          await this.removeDevice(message.deviceId);
          break;
      }
    });

    this.manager.on('statusChanged', () => {
      this.updateView();
    });

    this.startPolling();
    this.updateView();
  }

  private getWebviewContent(): string {
    return `<!DOCTYPE html>
<html>
<head>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: var(--vscode-editor-foreground);
      padding: 12px;
      font-size: 13px;
    }
    .status {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding: 8px;
      background: var(--vscode-editor-background);
      border-radius: 4px;
      border-left: 3px solid var(--vscode-focusBorder);
    }
    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .status-indicator.running {
      background: #4ec9b0;
    }
    .status-indicator.stopped {
      background: #d4d4d4;
    }
    .status-indicator.error {
      background: #f48771;
    }
    .status-text {
      flex: 1;
    }
    .controls {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    button {
      flex: 1;
      padding: 6px 12px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
    }
    button:hover {
      background: var(--vscode-button-hoverBackground);
    }
    button:active {
      background: var(--vscode-button-background);
    }
    button.secondary {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
    button.secondary:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }
    .devices {
      border-top: 1px solid var(--vscode-widget-border);
      padding-top: 12px;
    }
    .devices-label {
      font-weight: 500;
      margin-bottom: 8px;
      font-size: 12px;
      text-transform: uppercase;
      color: var(--vscode-descriptionForeground);
    }
    .device-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .device-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: var(--vscode-dropdown-background);
      border-radius: 3px;
      border: 1px solid var(--vscode-widget-border);
    }
    .device-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
    .device-info {
      flex: 1;
      min-width: 0;
    }
    .device-name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .device-platform {
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
    }
    .device-remove {
      background: transparent;
      border: none;
      color: var(--vscode-descriptionForeground);
      cursor: pointer;
      padding: 0;
      font-size: 12px;
      flex-shrink: 0;
    }
    .device-remove:hover {
      color: var(--vscode-editor-foreground);
    }
    .empty-state {
      color: var(--vscode-descriptionForeground);
      font-size: 12px;
      text-align: center;
      padding: 16px 8px;
    }
  </style>
</head>
<body>
  <div class="status" id="status">
    <div class="status-indicator stopped"></div>
    <div class="status-text">UDP: Stopped</div>
  </div>

  <div class="controls">
    <button id="startBtn" onclick="startSync()">Start Sync</button>
    <button id="stopBtn" onclick="stopSync()" style="display:none;">Stop Sync</button>
    <button class="secondary" onclick="showQR()" id="qrBtn">Pair Device</button>
  </div>

  <div class="devices">
    <div class="devices-label">Connected Devices</div>
    <div id="deviceList" class="device-list">
      <div class="empty-state">No devices paired</div>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();

    function startSync() {
      vscode.postMessage({ type: 'startSync' });
    }

    function stopSync() {
      vscode.postMessage({ type: 'stopSync' });
    }

    function showQR() {
      vscode.postMessage({ type: 'showQR' });
    }

    function removeDevice(deviceId) {
      if (confirm('Remove this device?')) {
        vscode.postMessage({ type: 'removeDevice', deviceId });
      }
    }

    function updateStatus(status, devices) {
      const statusEl = document.getElementById('status');
      const startBtn = document.getElementById('startBtn');
      const stopBtn = document.getElementById('stopBtn');
      const qrBtn = document.getElementById('qrBtn');
      const deviceList = document.getElementById('deviceList');

      // Update status
      const indicator = statusEl.querySelector('.status-indicator');
      const text = statusEl.querySelector('.status-text');

      indicator.className = 'status-indicator ' + status;
      const statusTexts = {
        running: 'UDP: Syncing',
        starting: 'UDP: Starting...',
        stopped: 'UDP: Stopped',
        error: 'UDP: Error',
      };
      text.textContent = statusTexts[status] || status;

      // Update buttons
      const isRunning = status === 'running';
      startBtn.style.display = isRunning ? 'none' : '';
      stopBtn.style.display = isRunning ? '' : 'none';
      qrBtn.disabled = !isRunning;

      // Update devices
      if (!devices || devices.length === 0) {
        deviceList.innerHTML = '<div class="empty-state">No devices paired</div>';
      } else {
        deviceList.innerHTML = devices
          .map(
            (device) => \`
          <div class="device-item">
            <div class="device-icon">📱</div>
            <div class="device-info">
              <div class="device-name">\${device.info?.name || 'Unknown Device'}</div>
              <div class="device-platform">\${device.info?.platform || 'Unknown'}</div>
            </div>
            <button class="device-remove" onclick="removeDevice('\${device.deviceId}')">Remove</button>
          </div>
        \`
          )
          .join('');
      }
    }

    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message.type === 'update') {
        updateStatus(message.status, message.devices);
      }
    });
  </script>
</body>
</html>`;
  }

  private async updateView() {
    if (!this.view) return;

    try {
      const status = this.manager.status;
      let devices: Device[] = [];

      if (status === 'running') {
        try {
          const response = await this.manager.fetchJson<{ devices: Device[] }>('/api/devices');
          devices = response.devices.filter((d) => d.confirmed) || [];
        } catch (e) {
          // Ignore fetch errors
        }
      }

      this.view.webview.postMessage({
        type: 'update',
        status,
        devices,
      });
    } catch (e) {
      // Ignore errors
    }
  }

  private startPolling() {
    this.pollTimer = setInterval(() => {
      this.updateView();
    }, 5000);
  }

  private stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = undefined;
    }
  }

  private async removeDevice(deviceId: string) {
    try {
      await this.manager.fetchJson(`/api/devices/${deviceId}`);
      // Use DELETE method by making a raw fetch
      await fetch(`http://localhost:${this.manager.getPort()}/api/devices/${deviceId}`, {
        method: 'DELETE',
      });
      this.updateView();
    } catch (e) {
      vscode.window.showErrorMessage(`Failed to remove device: ${e}`);
    }
  }

  focus() {
    // This can be called to focus the webview if needed
  }
}
