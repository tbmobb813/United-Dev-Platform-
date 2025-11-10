/**
 * App Commands Hook
 *
 * Provides built-in commands for the main application
 */

import { useMemo } from 'react';
import { Command } from '@udp/ui';
import { useRouter } from 'next/router';

interface UseAppCommandsOptions {
  onOpenFile?: () => void;
  onSaveFile?: () => void;
  onCreateFile?: () => void;
  onOpenAI?: () => void;
  onOpenSettings?: () => void;
  onOpenShortcuts?: () => void;
  onToggleTheme?: () => void;
  onSignOut?: () => void;
}

/**
 * Hook to get application commands for the command palette
 */
export function useAppCommands(options: UseAppCommandsOptions): Command[] {
  const router = useRouter();

  return useMemo<Command[]>(
    () => [
      // File Commands
      {
        id: 'file.open',
        label: 'Open File',
        description: 'Browse and open a file',
        icon: '📁',
        category: 'File',
        keywords: ['open', 'browse', 'file', 'load'],
        shortcut: 'Ctrl+O',
        action: () => {
          options.onOpenFile?.();
        },
      },
      {
        id: 'file.save',
        label: 'Save File',
        description: 'Save the current file',
        icon: '💾',
        category: 'File',
        keywords: ['save', 'write', 'file'],
        shortcut: 'Ctrl+S',
        action: () => {
          options.onSaveFile?.();
        },
      },
      {
        id: 'file.new',
        label: 'New File',
        description: 'Create a new file',
        icon: '➕',
        category: 'File',
        keywords: ['new', 'create', 'file'],
        shortcut: 'Ctrl+N',
        action: () => {
          options.onCreateFile?.();
        },
      },

      // AI Commands
      {
        id: 'ai.open',
        label: 'Open AI Assistant',
        description: 'Get AI-powered coding help',
        icon: '🤖',
        category: 'AI',
        keywords: ['ai', 'assistant', 'help', 'copilot'],
        shortcut: 'Ctrl+Shift+A',
        action: () => {
          options.onOpenAI?.();
        },
      },
      {
        id: 'ai.explain',
        label: 'Explain Code',
        description: 'Ask AI to explain selected code',
        icon: '💡',
        category: 'AI',
        keywords: ['explain', 'ai', 'understand', 'documentation'],
        action: () => {
          options.onOpenAI?.();
          // TODO: Pre-fill with "Explain this code" prompt
        },
      },
      {
        id: 'ai.refactor',
        label: 'Refactor Code',
        description: 'Get AI suggestions for refactoring',
        icon: '✨',
        category: 'AI',
        keywords: ['refactor', 'improve', 'ai', 'clean'],
        action: () => {
          options.onOpenAI?.();
          // TODO: Pre-fill with "Refactor this code" prompt
        },
      },
      {
        id: 'ai.fix',
        label: 'Fix Bug',
        description: 'Ask AI to help fix a bug',
        icon: '🐛',
        category: 'AI',
        keywords: ['fix', 'bug', 'debug', 'ai', 'error'],
        action: () => {
          options.onOpenAI?.();
          // TODO: Pre-fill with "Help me fix this bug" prompt
        },
      },

      // Navigation Commands
      {
        id: 'nav.home',
        label: 'Go to Home',
        description: 'Navigate to home page',
        icon: '🏠',
        category: 'Navigation',
        keywords: ['home', 'main', 'dashboard'],
        action: () => {
          router.push('/');
        },
      },
      {
        id: 'nav.minimal',
        label: 'Go to Minimal Editor',
        description: 'Open the minimal editor view',
        icon: '📝',
        category: 'Navigation',
        keywords: ['minimal', 'editor', 'simple'],
        action: () => {
          router.push('/minimal');
        },
      },
      {
        id: 'nav.offline',
        label: 'Go to Offline Demo',
        description: 'Open offline editing demo',
        icon: '📴',
        category: 'Navigation',
        keywords: ['offline', 'demo', 'local'],
        action: () => {
          router.push('/offline-demo');
        },
      },
      {
        id: 'nav.presence',
        label: 'Go to Presence Demo',
        description: 'Open collaborative presence demo',
        icon: '👥',
        category: 'Navigation',
        keywords: ['presence', 'collaboration', 'demo'],
        action: () => {
          router.push('/presence-demo');
        },
      },

      // View Commands
      {
        id: 'view.theme',
        label: 'Toggle Dark Mode',
        description: 'Switch between light and dark themes',
        icon: '🌓',
        category: 'View',
        keywords: ['theme', 'dark', 'light', 'mode', 'appearance'],
        action: () => {
          options.onToggleTheme?.();
        },
      },
      {
        id: 'view.shortcuts',
        label: 'Show Keyboard Shortcuts',
        description: 'Display all keyboard shortcuts',
        icon: '⌨️',
        category: 'View',
        keywords: ['shortcuts', 'keyboard', 'hotkeys', 'help'],
        shortcut: 'F1',
        action: () => {
          options.onOpenShortcuts?.();
        },
      },
      {
        id: 'view.settings',
        label: 'Open Settings',
        description: 'Configure application settings',
        icon: '⚙️',
        category: 'View',
        keywords: ['settings', 'preferences', 'config'],
        shortcut: 'Ctrl+,',
        action: () => {
          options.onOpenSettings?.();
        },
      },

      // Session Commands
      {
        id: 'session.signout',
        label: 'Sign Out',
        description: 'Log out of your account',
        icon: '👋',
        category: 'Session',
        keywords: ['signout', 'logout', 'exit', 'leave'],
        action: () => {
          options.onSignOut?.();
        },
      },

      // Help Commands
      {
        id: 'help.docs',
        label: 'View Documentation',
        description: 'Open the documentation',
        icon: '📚',
        category: 'Help',
        keywords: ['docs', 'documentation', 'help', 'guide'],
        action: () => {
          window.open(
            'https://github.com/your-org/unified-dev-platform',
            '_blank'
          );
        },
      },
      {
        id: 'help.feedback',
        label: 'Send Feedback',
        description: 'Report bugs or suggest features',
        icon: '💬',
        category: 'Help',
        keywords: ['feedback', 'bug', 'report', 'suggest', 'feature'],
        action: () => {
          window.open(
            'https://github.com/your-org/unified-dev-platform/issues',
            '_blank'
          );
        },
      },
    ],
    [router, options]
  );
}
