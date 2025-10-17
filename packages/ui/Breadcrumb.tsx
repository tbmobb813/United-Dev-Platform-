import React, { ReactNode } from 'react';

export interface BreadcrumbItem {
  key?: string | number;
  label: ReactNode;
  href?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (event: React.MouseEvent<any>) => void;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  maxItems?: number;
  itemRender?: (
    item: BreadcrumbItem,
    params: { location: 'first' | 'last' | 'middle' }
  ) => ReactNode;
  className?: string;
  separatorClassName?: string;
  itemClassName?: string;
  activeClassName?: string;
  disabledClassName?: string;
  expandable?: boolean;
  expandText?: ReactNode;
  collapseText?: ReactNode;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  'aria-label'?: string;
}

export interface BreadcrumbSeparatorProps {
  children?: ReactNode;
  className?: string;
}

export interface BreadcrumbLinkProps {
  href?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (event: React.MouseEvent<any>) => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

// Default separator component
export const BreadcrumbSeparator: React.FC<BreadcrumbSeparatorProps> = ({
  children = '/',
  className = '',
}) => (
  <span className={`breadcrumb__separator ${className}`} aria-hidden='true'>
    {children}
  </span>
);

// Link component for breadcrumb items
export const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = ({
  href,
  onClick,
  children,
  className = '',
  disabled = false,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (event: React.MouseEvent<any>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    if (onClick) {
      onClick(event);
    }
  };

  if (href && !disabled) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={`breadcrumb__link ${className}`}
        aria-disabled={disabled}
      >
        {children}
      </a>
    );
  }

  if (onClick && !disabled) {
    return (
      <button
        type='button'
        onClick={handleClick}
        className={`breadcrumb__link breadcrumb__link--button ${className}`}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }

  return (
    <span
      className={`breadcrumb__text ${
        disabled ? 'breadcrumb__text--disabled' : ''
      } ${className}`}
    >
      {children}
    </span>
  );
};

// Main Breadcrumb component
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <BreadcrumbSeparator />,
  maxItems,
  itemRender,
  className = '',
  separatorClassName = '',
  itemClassName = '',
  activeClassName = '',
  disabledClassName = '',
  expandable = false,
  expandText = '...',
  collapseText = 'Show less',
  onItemClick,
  'aria-label': ariaLabel = 'Breadcrumb navigation',
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const shouldTruncate = maxItems && items.length > maxItems && !expanded;

  const getVisibleItems = (): BreadcrumbItem[] => {
    if (!shouldTruncate) {
      return items;
    }

    // Show first item, ellipsis, and last few items
    const lastItems = Math.max(1, maxItems - 2); // Reserve space for first item and ellipsis
    const firstItem = items[0];
    const finalItems = items.slice(-lastItems);

    return [firstItem, ...finalItems];
  };

  const getEllipsisItem = (): BreadcrumbItem => ({
    key: 'ellipsis',
    label: expandable ? (
      <button
        type='button'
        onClick={() => setExpanded(true)}
        className='breadcrumb__expand-button'
        aria-label='Show all breadcrumb items'
      >
        {expandText}
      </button>
    ) : (
      expandText
    ),
    className: 'breadcrumb__ellipsis',
  });

  const renderItem = (
    item: BreadcrumbItem,
    index: number,
    isLast: boolean
  ): ReactNode => {
    const location = index === 0 ? 'first' : isLast ? 'last' : 'middle';

    if (itemRender) {
      return itemRender(item, { location });
    }

    const itemClasses = [
      'breadcrumb__item',
      itemClassName,
      item.className || '',
      isLast ? `breadcrumb__item--active ${activeClassName}` : '',
      item.disabled ? `breadcrumb__item--disabled ${disabledClassName}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    const content = (
      <>
        {item.icon && <span className='breadcrumb__icon'>{item.icon}</span>}
        <span className='breadcrumb__label'>{item.label}</span>
      </>
    );

    return (
      <li key={item.key || index} className={itemClasses}>
        <BreadcrumbLink
          href={!isLast ? item.href : undefined}
          onClick={
            !isLast
              ? event => {
                  if (item.onClick) {
                    item.onClick(event);
                  }
                  if (onItemClick) {
                    onItemClick(item, index);
                  }
                }
              : undefined
          }
          disabled={item.disabled}
          className={isLast ? 'breadcrumb__current' : ''}
        >
          {content}
        </BreadcrumbLink>
      </li>
    );
  };

  const renderSeparator = (index: number): ReactNode => {
    if (React.isValidElement(separator)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const separatorElement = separator as any;
      return React.cloneElement(separatorElement, {
        key: `separator-${index}`,
        className: `${
          separatorElement.props?.className || ''
        } ${separatorClassName}`.trim(),
      });
    }

    return (
      <BreadcrumbSeparator
        key={`separator-${index}`}
        className={separatorClassName}
      >
        {separator}
      </BreadcrumbSeparator>
    );
  };

  const visibleItems = getVisibleItems();
  const needsEllipsis = shouldTruncate && items.length > visibleItems.length;

  // Insert ellipsis after first item if needed
  const itemsToRender =
    needsEllipsis && visibleItems.length > 1
      ? [visibleItems[0], getEllipsisItem(), ...visibleItems.slice(1)]
      : visibleItems;

  const breadcrumbClasses = [
    'breadcrumb',
    className,
    expanded ? 'breadcrumb--expanded' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={breadcrumbClasses} aria-label={ariaLabel}>
      <ol className='breadcrumb__list' role='list'>
        {itemsToRender.map((item, index) => {
          const isLast = index === itemsToRender.length - 1;
          const itemElement = renderItem(item, index, isLast);

          if (isLast) {
            return itemElement;
          }

          return (
            <React.Fragment key={item.key || index}>
              {itemElement}
              {renderSeparator(index)}
            </React.Fragment>
          );
        })}

        {expanded && expandable && (
          <li className='breadcrumb__collapse'>
            <button
              type='button'
              onClick={() => setExpanded(false)}
              className='breadcrumb__collapse-button'
              aria-label='Collapse breadcrumb items'
            >
              {collapseText}
            </button>
          </li>
        )}
      </ol>
    </nav>
  );
};

// Common breadcrumb patterns and utilities
export const breadcrumbUtils = {
  // Create breadcrumb items from a path
  fromPath: (
    path: string,
    options: {
      basePath?: string;
      labelMap?: Record<string, string>;
      includeRoot?: boolean;
      rootLabel?: ReactNode;
    } = {}
  ): BreadcrumbItem[] => {
    const {
      basePath = '',
      labelMap = {},
      includeRoot = true,
      rootLabel = 'Home',
    } = options;

    const segments = path.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];

    if (includeRoot) {
      items.push({
        key: 'root',
        label: rootLabel,
        href: basePath || '/',
      });
    }

    segments.forEach((segment, index) => {
      const segmentPath = `${basePath}/${segments
        .slice(0, index + 1)
        .join('/')}`;
      const label =
        labelMap[segment] ||
        segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      items.push({
        key: segmentPath,
        label,
        href: segmentPath,
      });
    });

    return items;
  },

  // Create breadcrumb items from a hierarchy
  fromHierarchy: (
    hierarchy: Array<{
      id: string;
      name: string;
      url?: string;
      icon?: ReactNode;
    }>
  ): BreadcrumbItem[] => {
    return hierarchy.map(item => ({
      key: item.id,
      label: item.name,
      href: item.url,
      icon: item.icon,
    }));
  },

  // Common separators
  separators: {
    slash: '/',
    chevron: '›',
    arrow: '→',
    dot: '•',
    pipe: '|',
    chevronIcon: <span style={{ fontSize: '0.8em' }}>▸</span>,
    homeIcon: <span style={{ fontSize: '0.9em' }}>🏠</span>,
  },
};

// Preset breadcrumb configurations
export const breadcrumbPresets = {
  // File system style
  fileSystem: {
    separator: breadcrumbUtils.separators.slash,
    maxItems: 5,
    expandable: true,
  },

  // Website navigation style
  website: {
    separator: breadcrumbUtils.separators.chevron,
    maxItems: 4,
    expandable: false,
  },

  // Application navigation style
  application: {
    separator: breadcrumbUtils.separators.chevronIcon,
    maxItems: 6,
    expandable: true,
  },

  // Minimal style
  minimal: {
    separator: breadcrumbUtils.separators.dot,
    maxItems: 3,
    expandable: false,
  },
};

export default Breadcrumb;
