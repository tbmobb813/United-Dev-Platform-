import { showQrPanel } from '../src/qrPanel';

// Mock vscode module
jest.mock('vscode', () => {
  return {
    window: {
      showWarningMessage: jest.fn(),
      showErrorMessage: jest.fn(),
      createWebviewPanel: jest.fn(() => ({
        webview: { html: '' },
      })),
    },
    ViewColumn: { One: 1 },
  };
});

describe('qrPanel', () => {
  const vscode = require('vscode');

  test('shows warning when manager is not running', async () => {
    const fakeManager: any = { status: 'stopped' };
    const context: any = {};

    await showQrPanel(context, fakeManager);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Start UDP sync first using "UDP: Start Sync" command.'
    );
  });

  test('creates webview panel with QR html when running', async () => {
    const fakeData = { qr: 'data:image/png;base64,AAA', pairingUrl: 'https://pair', expiresAt: Date.now() + 60000 };
    const fakeManager: any = {
      status: 'running',
      fetchJson: jest.fn(async () => fakeData),
    };

    const context: any = {};

    await showQrPanel(context, fakeManager);

    expect(fakeManager.fetchJson).toHaveBeenCalledWith('/api/devices/qr');
    expect(vscode.window.createWebviewPanel).toHaveBeenCalled();
    const panel = (vscode.window.createWebviewPanel as jest.Mock).mock.results[0].value;
    expect(panel.webview.html).toContain(fakeData.qr);
    expect(panel.webview.html).toContain(fakeData.pairingUrl);
  });

  test('shows error message when fetch fails', async () => {
    const fakeManager: any = {
      status: 'running',
      fetchJson: jest.fn(async () => { throw new Error('boom'); }),
    };

    const context: any = {};

    await showQrPanel(context, fakeManager);

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch QR code'));
  });
});
// Minimal smoke test for VSCode Extension qrPanel

describe('VSCode Extension qrPanel', () => {
  it('should load without throwing', () => {
    expect(() => require('../src/qrPanel')).not.toThrow();
  });
});
