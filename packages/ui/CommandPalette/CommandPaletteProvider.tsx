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

  // Execute command
  const executeCommand = useCallback(
    async (id: string) => {
      const command = commands.get(id);
      if (!command || command.disabled) {
        return;
      }

      try {
        await command.action();
        setIsOpen(false);
      } catch (error) {
        console.error('Command execution failed:', error);
      }
    },
    [commands]
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
