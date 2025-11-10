# Design System & Theme Guide

A comprehensive design system for the Unified Dev Platform with full dark mode support,
accessibility features, and consistent styling across all components.

## Table of Contents

- [Getting Started](#getting-started)
- [Theme Provider](#theme-provider)
- [Using the Theme](#using-the-theme)
- [Colors](#colors)
- [Typography](#typography)
- [Spacing](#spacing)
- [Components](#components)
- [Responsive Design](#responsive-design)
- [Dark Mode](#dark-mode)
- [Best Practices](#best-practices)

## Getting Started

### Installation

The theme system is built into the `@udp/ui` package. Import what you need:

```typescript
import { ThemeProvider, useTheme, lightTheme, darkTheme } from "@udp/ui";
```

### Basic Setup

Wrap your app with `ThemeProvider`:

```typescript
import { ThemeProvider } from '@udp/ui';

function App() {
  return (
    <ThemeProvider defaultMode='light'>
      <YourApp />
    </ThemeProvider>
  );
}
```

## Theme Provider

The `ThemeProvider` manages theme state and provides theme context to all children.

### Props

```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: "light" | "dark"; // Default: 'light'
  storageKey?: string; // Default: 'udp-theme-mode'
}
```

### Features

- ✅ Automatic dark/light mode switching
- ✅ Persists user preference to localStorage
- ✅ System preference detection
- ✅ Smooth transitions between themes
- ✅ CSS custom properties for global access

### Example

```typescript
<ThemeProvider
  defaultMode='dark'
  storageKey='my-custom-key'
>
  <App />
</ThemeProvider>
```

## Using the Theme

### useTheme Hook

Access theme values in any component:

```typescript
import { useTheme } from '@udp/ui';

function MyComponent() {
  const { theme, mode, setMode, toggleMode } = useTheme();

  return (
    <div style={{ color: theme.colors.text.primary }}>
      <button onClick={toggleMode}>
        {mode === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
}
```

### withTheme HOC

Inject theme props into class components:

```typescript
import { withTheme, Theme } from '@udp/ui';

interface Props {
  theme: Theme;
  mode: 'light' | 'dark';
}

class MyComponent extends React.Component<Props> {
  render() {
    const { theme } = this.props;
    return <div style={{ color: theme.colors.text.primary }} />;
  }
}

export default withTheme(MyComponent);
```

## Colors

### Color Scale

All colors use a scale from 50 (lightest) to 900 (darkest):

```typescript
theme.colors.primary[50]; // Very light blue
theme.colors.primary[500]; // Primary blue
theme.colors.primary[900]; // Very dark blue
```

### Semantic Colors

Use semantic colors that adapt to dark mode:

```typescript
// Surface colors (backgrounds)
theme.colors.surface.base; // Main background
theme.colors.surface.elevated; // Cards, modals
theme.colors.surface.overlay; // Overlays, dropdowns
theme.colors.surface.inset; // Input fields

// Text colors
theme.colors.text.primary; // Main text
theme.colors.text.secondary; // Muted text
theme.colors.text.tertiary; // Very muted text
theme.colors.text.inverse; // Text on colored backgrounds
theme.colors.text.disabled; // Disabled state text

// Border colors
theme.colors.border.default; // Standard borders
theme.colors.border.strong; // Emphasized borders
theme.colors.border.subtle; // Subtle dividers
theme.colors.border.focus; // Focus rings

// Interactive states
theme.colors.interactive.hover; // Hover backgrounds
theme.colors.interactive.active; // Active/pressed backgrounds
theme.colors.interactive.disabled; // Disabled backgrounds
theme.colors.interactive.focus; // Focus backgrounds
```

### Status Colors

```typescript
theme.colors.success[500]; // Green
theme.colors.warning[500]; // Orange
theme.colors.danger[500]; // Red
theme.colors.info[500]; // Blue
```

### Example Usage

```typescript
function Card() {
  const { theme } = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface.elevated,
        border: `1px solid ${theme.colors.border.default}`,
        color: theme.colors.text.primary,
        padding: theme.spacing[4],
        borderRadius: theme.borderRadius.lg,
      }}
    >
      Card content
    </div>
  );
}
```

## Typography

### Font Sizes

```typescript
theme.fontSize.xs; // 12px
theme.fontSize.sm; // 14px
theme.fontSize.base; // 16px
theme.fontSize.lg; // 18px
theme.fontSize.xl; // 20px
theme.fontSize["2xl"]; // 24px
theme.fontSize["3xl"]; // 30px
theme.fontSize["4xl"]; // 36px
```

### Font Weights

```typescript
theme.fontWeight.normal; // 400
theme.fontWeight.medium; // 500
theme.fontWeight.semibold; // 600
theme.fontWeight.bold; // 700
```

### Line Heights

```typescript
theme.lineHeight.tight; // 1.25
theme.lineHeight.normal; // 1.5
theme.lineHeight.relaxed; // 1.75
```

### Example

```typescript
<h1
  style={{
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    lineHeight: theme.lineHeight.tight,
  }}
>
  Heading
</h1>
```

## Spacing

Consistent spacing scale from 0 to 64:

```typescript
theme.spacing[0]; // 0
theme.spacing[1]; // 4px
theme.spacing[2]; // 8px
theme.spacing[3]; // 12px
theme.spacing[4]; // 16px
theme.spacing[6]; // 24px
theme.spacing[8]; // 32px
theme.spacing[12]; // 48px
theme.spacing[16]; // 64px
```

### Example

```typescript
<div
  style={{
    padding: theme.spacing[4],
    marginBottom: theme.spacing[6],
    gap: theme.spacing[2],
  }}
>
  Content
</div>
```

## Components

### Creating Themed Components

```typescript
import { useTheme, mergeStyles } from '@udp/ui';

function CustomButton({ children, ...props }) {
  const { theme } = useTheme();

  const buttonStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary[500],
    color: theme.colors.text.inverse,
    padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    transition: theme.transitions.fast,
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <button style={buttonStyle} {...props}>
      {children}
    </button>
  );
}
```

### Style Patterns

Use built-in style patterns for common layouts:

```typescript
import { stylePatterns, useTheme } from '@udp/ui';

function Component() {
  const { theme } = useTheme();

  return (
    <div style={stylePatterns.flexCenter}>
      <div style={stylePatterns.card(theme)}>
        Content
      </div>
    </div>
  );
}
```

Available patterns:

- `flexCenter` - Centered flexbox
- `flexBetween` - Space-between flexbox
- `flexColumn` - Vertical flexbox
- `card(theme)` - Card container
- `truncate` - Text truncation
- `lineClamp(lines)` - Multi-line truncation

## Responsive Design

### useMediaQuery Hook

```typescript
import { useMediaQuery } from '@udp/ui';

function Component() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div>
      {isMobile ? 'Mobile View' : 'Desktop View'}
    </div>
  );
}
```

### useBreakpoint Hook

```typescript
import { useBreakpoint } from '@udp/ui';

function Component() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
}
```

### Breakpoints

```typescript
theme.breakpoints.xs; // 475px
theme.breakpoints.sm; // 640px
theme.breakpoints.md; // 768px
theme.breakpoints.lg; // 1024px
theme.breakpoints.xl; // 1280px
theme.breakpoints["2xl"]; // 1536px
```

## Dark Mode

### Toggle Dark Mode

```typescript
import { useTheme } from '@udp/ui';

function ThemeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <button onClick={toggleMode}>
      {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

### Set Specific Mode

```typescript
const { setMode } = useTheme();

// Set to dark
setMode("dark");

// Set to light
setMode("light");
```

### Dark Mode Colors

Colors automatically adapt to dark mode. Use semantic colors for automatic adaptation:

```typescript
// ✅ Good - adapts to dark mode
backgroundColor: theme.colors.surface.base;
color: theme.colors.text.primary;

// ❌ Avoid - hardcoded colors
backgroundColor: "#ffffff";
color: "#000000";
```

## Best Practices

### 1. Always Use Theme Values

```typescript
// ✅ Good
padding: theme.spacing[4];

// ❌ Bad
padding: "16px";
```

### 2. Use Semantic Colors

```typescript
// ✅ Good - adapts to dark mode
color: theme.colors.text.primary;

// ❌ Bad - breaks in dark mode
color: "#000000";
```

### 3. Use Transitions

```typescript
// ✅ Good
transition: theme.transitions.fast;

// ❌ Bad
transition: "0.2s ease";
```

### 4. Accessibility

Always include focus states:

```typescript
onFocus={e => {
  e.currentTarget.style.boxShadow =
    `0 0 0 3px ${theme.colors.interactive.focus}`;
}}
```

### 5. Responsive Design

Use breakpoint hooks instead of magic numbers:

```typescript
// ✅ Good
const { isMobile } = useBreakpoint();

// ❌ Bad
const isMobile = window.innerWidth < 768;
```

## Examples

### Complete Component Example

```typescript
import React from 'react';
import { useTheme, mergeStyles, stylePatterns } from '@udp/ui';

interface CardProps {
  title: string;
  children: React.ReactNode;
  elevated?: boolean;
}

export function Card({ title, children, elevated }: CardProps) {
  const { theme } = useTheme();

  const cardStyle: React.CSSProperties = {
    ...stylePatterns.card(theme),
    padding: theme.spacing[6],
    boxShadow: elevated ? theme.shadows.lg : theme.shadows.sm,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <div style={{ color: theme.colors.text.secondary }}>
        {children}
      </div>
    </div>
  );
}
```

### Form Example

```typescript
function LoginForm() {
  const { theme } = useTheme();

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing[3],
    fontSize: theme.fontSize.base,
    backgroundColor: theme.colors.surface.inset,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.md,
    color: theme.colors.text.primary,
    transition: theme.transitions.fast,
  };

  return (
    <form style={{ maxWidth: '400px', margin: '0 auto' }}>
      <input
        type='email'
        placeholder='Email'
        style={inputStyle}
        onFocus={e => {
          e.currentTarget.style.borderColor = theme.colors.border.focus;
          e.currentTarget.style.boxShadow =
            `0 0 0 3px ${theme.colors.interactive.focus}`;
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = theme.colors.border.default;
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
    </form>
  );
}
```

## Migration Guide

### Migrating Existing Components

1. **Wrap your app with ThemeProvider**:

```typescript
// Before
function App() {
  return <YourApp />;
}

// After
import { ThemeProvider } from '@udp/ui';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

2. **Replace hardcoded values with theme values**:

```typescript
// Before
<button style={{ backgroundColor: '#0070f3', padding: '8px 16px' }}>
  Click me
</button>

// After
import { useTheme } from '@udp/ui';

function Button() {
  const { theme } = useTheme();

  return (
    <button
      style={{
        backgroundColor: theme.colors.primary[500],
        padding: `${theme.spacing[2]} ${theme.spacing[4]}`
      }}
    >
      Click me
    </button>
  );
}
```

3. **Update components one at a time** - the theme system is backward compatible!

## Support

For questions or issues with the theme system, please refer to:

- [Component Examples](./examples)
- [API Reference](./API.md)
- [GitHub Issues](https://github.com/your-org/unified-dev-platform/issues)
