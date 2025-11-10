import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTheme } from '../ThemeProvider';
import { useCommandPalette } from './CommandPaletteProvider';
import { searchCommands, highlightMatches } from './fuzzySearch';
import { Command, CommandGroup } from './types';
import { stylePatterns } from '../styled';

export interface CommandPaletteProps {
  /** Placeholder text for search */
  placeholder?: string;
  /** Maximum results to show */
  maxResults?: number;
}

/**
 * CommandPalette - Keyboard-driven command interface
 *
 * Features:
 * - Fuzzy search across all commands
 * - Keyboard navigation (arrows, enter, escape)
 * - Command grouping by category
 * - Recent commands tracking
 * - Customizable shortcuts
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  placeholder = 'Type a command or search...',
  maxResults = 10,
}) => {
  const { theme } = useTheme();
  const { isOpen, close, getCommands, executeCommand } = useCommandPalette();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Get and search commands
  const allCommands = useMemo(() => getCommands(), [getCommands]);
  const searchResults = useMemo(
    () => searchCommands(query, allCommands, maxResults),
    [query, allCommands, maxResults]
  );

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups = new Map<string, CommandGroup>();

    for (const result of searchResults) {
      const category = result.command.category || 'Commands';

      if (!groups.has(category)) {
        groups.set(category, {
          name: category,
          commands: [],
        });
      }

      groups.get(category)!.commands.push(result.command);
    }

    return Array.from(groups.values());
  }, [searchResults]);

  // Reset state when palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    selectedElement?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [selectedIndex]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalResults = searchResults.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalResults);
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalResults) % totalResults);
        break;

      case 'Enter':
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          executeCommand(searchResults[selectedIndex].command.id);
        }
        break;

      case 'Escape':
        e.preventDefault();
        close();
        break;

      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        break;

      case 'End':
        e.preventDefault();
        setSelectedIndex(totalResults - 1);
        break;
    }
  };

  if (!isOpen) {
    return null;
  }

  // Styles
  const overlayStyle: React.CSSProperties = {
    ...stylePatterns.fixedFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: theme.zIndex.modal,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '20vh',
    animation: 'fadeIn 150ms ease-out',
  };

  const paletteStyle: React.CSSProperties = {
    width: '90%',
    maxWidth: '640px',
    backgroundColor: theme.colors.surface.overlay,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.xl,
    border: `1px solid ${theme.colors.border.default}`,
    overflow: 'hidden',
    animation: 'slideDown 200ms ease-out',
  };

  const searchContainerStyle: React.CSSProperties = {
    padding: theme.spacing[4],
    borderBottom: `1px solid ${theme.colors.border.default}`,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
    fontSize: theme.fontSize.base,
    backgroundColor: theme.colors.surface.inset,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.md,
    color: theme.colors.text.primary,
    outline: 'none',
    transition: theme.transitions.fast,
  };

  const resultsContainerStyle: React.CSSProperties = {
    maxHeight: '400px',
    overflowY: 'auto',
    padding: theme.spacing[2],
  };

  const groupHeaderStyle: React.CSSProperties = {
    padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: theme.spacing[2],
  };

  const commandItemStyle = (isSelected: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[3],
    padding: `${theme.spacing[3]} ${theme.spacing[3]}`,
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    transition: theme.transitions.fast,
    backgroundColor: isSelected
      ? theme.colors.interactive.focus
      : 'transparent',
  });

  const iconStyle: React.CSSProperties = {
    fontSize: theme.fontSize.xl,
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const labelContainerStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    ...stylePatterns.truncate,
  };

  const shortcutStyle: React.CSSProperties = {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.tertiary,
    backgroundColor: theme.colors.surface.inset,
    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.border.default}`,
    fontFamily: 'monospace',
  };

  const emptyStateStyle: React.CSSProperties = {
    padding: `${theme.spacing[8]} ${theme.spacing[4]}`,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  };

  let globalIndex = 0;

  return (
    <>
      <div style={overlayStyle} onClick={close}>
        <div style={paletteStyle} onClick={e => e.stopPropagation()}>
          {/* Search Input */}
          <div style={searchContainerStyle}>
            <input
              ref={inputRef}
              type='text'
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              style={inputStyle}
              onFocus={e => {
                e.currentTarget.style.borderColor = theme.colors.border.focus;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.interactive.focus}`;
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = theme.colors.border.default;
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Results List */}
          <div ref={listRef} style={resultsContainerStyle}>
            {searchResults.length === 0 ? (
              <div style={emptyStateStyle}>
                {query
                  ? 'No commands found'
                  : 'Start typing to search commands...'}
              </div>
            ) : (
              groupedResults.map(group => (
                <div key={group.name}>
                  {groupedResults.length > 1 && (
                    <div style={groupHeaderStyle}>{group.name}</div>
                  )}
                  {group.commands.map(command => {
                    const currentIndex = globalIndex++;
                    const result = searchResults[currentIndex];
                    const isSelected = currentIndex === selectedIndex;

                    return (
                      <div
                        key={command.id}
                        data-index={currentIndex}
                        style={commandItemStyle(isSelected)}
                        onClick={() => executeCommand(command.id)}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                      >
                        {command.icon && (
                          <div style={iconStyle}>{command.icon}</div>
                        )}
                        <div style={labelContainerStyle}>
                          <div style={labelStyle}>
                            {result
                              ? highlightMatches(command.label, result.matches)
                              : command.label}
                          </div>
                          {command.description && (
                            <div style={descriptionStyle}>
                              {command.description}
                            </div>
                          )}
                        </div>
                        {command.shortcut && (
                          <div style={shortcutStyle}>{command.shortcut}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};
