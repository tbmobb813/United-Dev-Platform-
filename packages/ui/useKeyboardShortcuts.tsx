import { useEffect } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch =
          shortcut.ctrlKey === undefined || shortcut.ctrlKey === event.ctrlKey;
        const shiftMatch =
          shortcut.shiftKey === undefined ||
          shortcut.shiftKey === event.shiftKey;
        const altMatch =
          shortcut.altKey === undefined || shortcut.altKey === event.altKey;
        const metaMatch =
          shortcut.metaKey === undefined || shortcut.metaKey === event.metaKey;
        const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && metaMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
};

export const commonShortcuts = {
  SAVE: { key: "s", ctrlKey: true, description: "Save current file" },
  OPEN: { key: "o", ctrlKey: true, description: "Open file" },
  NEW_FILE: { key: "n", ctrlKey: true, description: "Create new file" },
  AI_ASSISTANT: { key: "k", ctrlKey: true, description: "Open AI Assistant" },
  FIND: { key: "f", ctrlKey: true, description: "Find in file" },
  COMMAND_PALETTE: {
    key: "p",
    ctrlKey: true,
    shiftKey: true,
    description: "Open command palette",
  },
  SETTINGS: { key: ",", ctrlKey: true, description: "Open settings" },
} as const;
