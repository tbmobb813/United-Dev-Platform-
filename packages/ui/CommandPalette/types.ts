/**
 * Command Palette Types
 *
 * Type definitions for the command palette system
 */

import React from 'react';

export interface Command {
  /** Unique identifier for the command */
  id: string;

  /** Display label for the command */
  label: string;

  /** Optional description/subtitle */
  description?: string;

  /** Icon (emoji or component) */
  icon?: string | React.ReactNode;

  /** Category for grouping commands */
  category?: string;

  /** Keywords for search matching */
  keywords?: string[];

  /** Keyboard shortcut hint */
  shortcut?: string;

  /** Function to execute when command is selected */
  action: () => void | Promise<void>;

  /** Whether command is currently available */
  disabled?: boolean;

  /** Custom data for the command */
  metadata?: Record<string, unknown>;
}

export interface CommandGroup {
  /** Group name */
  name: string;

  /** Commands in this group */
  commands: Command[];

  /** Optional priority for ordering groups */
  priority?: number;
}

export interface CommandPaletteProps {
  /** Whether the palette is open */
  isOpen: boolean;

  /** Callback when palette should close */
  onClose: () => void;

  /** Additional commands to register */
  commands?: Command[];

  /** Placeholder text for search input */
  placeholder?: string;

  /** Maximum number of results to show */
  maxResults?: number;
}

export interface UseCommandPaletteOptions {
  /** Commands to register */
  commands?: Command[];

  /** Keyboard shortcut to open palette */
  openShortcut?: string;
}

export interface CommandPaletteContextValue {
  /** Whether palette is open */
  isOpen: boolean;

  /** Open the palette */
  open: () => void;

  /** Close the palette */
  close: () => void;

  /** Toggle palette visibility */
  toggle: () => void;

  /** Register a command */
  registerCommand: (command: Command) => void;

  /** Unregister a command */
  unregisterCommand: (id: string) => void;

  /** Get all registered commands */
  getCommands: () => Command[];

  /** Get recently executed commands */
  getRecentCommands: () => Command[];

  /** Execute a command by ID */
  executeCommand: (id: string) => Promise<void>;
}
