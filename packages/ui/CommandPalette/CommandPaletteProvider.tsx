import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  Command,
  CommandPaletteContextValue,
  UseCommandPaletteOptions,
} from './types';

const CommandPaletteContext = createContext<
  CommandPaletteContextValue | undefined
>(undefined);

export interface CommandPaletteProviderProps {
  children: React.ReactNode;
  /** Commands to register on mount */
  commands?: Command[];
  /** Keyboard shortcut to open (default: 'mod+k') */
  openShortcut?: string;
}

/**
 * CommandPaletteProvider - Manages command registration and palette state
 *
 * Provides context for command registration and palette control
 */
export const CommandPaletteProvider: React.FC<CommandPaletteProviderProps> = ({
  children,
  commands: initialCommands = [],
  openShortcut = 'mod+k',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [commands, setCommands] = useState<Map<string, Command>>(
    new Map(initialCommands.map(cmd => [cmd.id, cmd]))
  );
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>(() => {
    // Load recent commands from localStorage
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const stored = localStorage.getItem('udp-recent-commands');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Register command
  const registerCommand = useCallback((command: Command) => {
    setCommands(prev => {
      const next = new Map(prev);
      next.set(command.id, command);
      return next;
    });
  }, []);

  // Unregister command
  const unregisterCommand = useCallback((id: string) => {
    setCommands(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // Get all commands
  const getCommands = useCallback(() => {
    return Array.from(commands.values());
  }, [commands]);

  // Get recent commands
  const getRecentCommands = useCallback(() => {
    return recentCommandIds
      .map(id => commands.get(id))
      .filter((cmd): cmd is Command => cmd !== undefined && !cmd.disabled)
      .slice(0, 5); // Show top 5 recent commands
  }, [recentCommandIds, commands]);

  // Add command to history
  const addToHistory = useCallback((id: string) => {
    setRecentCommandIds(prev => {
      // Remove if already exists
      const filtered = prev.filter(cmdId => cmdId !== id);
      // Add to front
      const next = [id, ...filtered].slice(0, 10); // Keep max 10 items

      // Save to localStorage
      try {
        localStorage.setItem('udp-recent-commands', JSON.stringify(next));
      } catch {
        // Ignore localStorage errors
      }

      return next;
    });
  }, []);

  // Execute command
  const executeCommand = useCallback(
    async (id: string) => {
      const command = commands.get(id);
      if (!command || command.disabled) {
        return;
      }

      try {
        await command.action();
        addToHistory(id);
        setIsOpen(false);
      } catch (error) {
        console.error('Command execution failed:', error);
      }
    },
    [commands, addToHistory]
  );

  // Control functions
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  // Set up keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Parse shortcut (mod+k means Cmd on Mac, Ctrl elsewhere)
      const parts = openShortcut.toLowerCase().split('+');
      const needsMod = parts.includes('mod');
      const needsCtrl = parts.includes('ctrl');
      const needsShift = parts.includes('shift');
      const needsAlt = parts.includes('alt');
      const key = parts[parts.length - 1];

      const isMod = needsMod && (e.metaKey || e.ctrlKey);
      const isCtrl = needsCtrl && e.ctrlKey;
      const isShift = needsShift && e.shiftKey;
      const isAlt = needsAlt && e.altKey;

      const modifiersMatch =
        (needsMod ? isMod : true) &&
        (needsCtrl ? isCtrl : true) &&
        (needsShift ? isShift : true) &&
        (needsAlt ? isAlt : true);

      if (modifiersMatch && e.key.toLowerCase() === key) {
        e.preventDefault();
        toggle();
      }

      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openShortcut, toggle, close, isOpen]);

  const value: CommandPaletteContextValue = {
    isOpen,
    open,
    close,
    toggle,
    registerCommand,
    unregisterCommand,
    getCommands,
    getRecentCommands,
    executeCommand,
  };

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
    </CommandPaletteContext.Provider>
  );
};

/**
 * useCommandPalette - Hook to access command palette context
 *
 * @returns Command palette context value
 * @throws Error if used outside CommandPaletteProvider
 */
export function useCommandPalette(): CommandPaletteContextValue {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error(
      'useCommandPalette must be used within CommandPaletteProvider'
    );
  }
  return context;
}

/**
 * useRegisterCommands - Hook to register commands on component mount
 *
 * @param commands - Commands to register
 */
export function useRegisterCommands(commands: Command[]): void {
  const { registerCommand, unregisterCommand } = useCommandPalette();

  useEffect(() => {
    // Register commands
    commands.forEach(registerCommand);

    // Unregister on unmount
    return () => {
      commands.forEach(cmd => unregisterCommand(cmd.id));
    };
  }, [commands, registerCommand, unregisterCommand]);
}
