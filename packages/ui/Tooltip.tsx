import React, { useEffect, useRef, useState } from 'react';

export type TooltipPlacement = 
  | 'top' 
  | 'bottom' 
  | 'left' 
  | 'right' 
  | 'top-start' 
  | 'top-end' 
  | 'bottom-start' 
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  delay?: number;
  hideDelay?: number;
  disabled?: boolean;
  className?: string;
  overlayClassName?: string;
  maxWidth?: number;
  arrow?: boolean;
  offset?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  trigger = 'hover',
  visible,
  onVisibleChange,
  delay = 0,
  hideDelay = 0,
  disabled = false,
  className = '',
  overlayClassName = '',
  maxWidth = 250,
  arrow = true,
  offset = 8
}) => {
  const [internalVisible, setInternalVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<number>();
  const hideTimeoutRef = useRef<number>();

  const isVisible = visible !== undefined ? visible : internalVisible;

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) {return;}

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    // Calculate base position
    switch (placement) {
      case 'top':
      case 'top-start':
      case 'top-end':
        top = triggerRect.top - tooltipRect.height - offset;
        break;
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        top = triggerRect.bottom + offset;
        break;
      case 'left':
      case 'left-start':
      case 'left-end':
        left = triggerRect.left - tooltipRect.width - offset;
        break;
      case 'right':
      case 'right-start':
      case 'right-end':
        left = triggerRect.right + offset;
        break;
    }

    // Calculate left position for top/bottom placements
    if (placement.startsWith('top') || placement.startsWith('bottom')) {
      switch (placement) {
        case 'top':
        case 'bottom':
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'top-start':
        case 'bottom-start':
          left = triggerRect.left;
          break;
        case 'top-end':
        case 'bottom-end':
          left = triggerRect.right - tooltipRect.width;
          break;
      }
    }

    // Calculate top position for left/right placements
    if (placement.startsWith('left') || placement.startsWith('right')) {
      switch (placement) {
        case 'left':
        case 'right':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          break;
        case 'left-start':
        case 'right-start':
          top = triggerRect.top;
          break;
        case 'left-end':
        case 'right-end':
          top = triggerRect.bottom - tooltipRect.height;
          break;
      }
    }

    // Ensure tooltip stays within viewport
    if (left < 0) {
      left = 8;
    } else if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 8;
    }

    if (top < 0) {
      top = 8;
    } else if (top + tooltipRect.height > viewportHeight) {
      top = viewportHeight - tooltipRect.height - 8;
    }

    setPosition({ top, left });
  };

  const show = () => {
    if (disabled) {return;}

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }

    if (delay > 0) {
      showTimeoutRef.current = window.setTimeout(() => {
        setInternalVisible(true);
        onVisibleChange?.(true);
      }, delay);
    } else {
      setInternalVisible(true);
      onVisibleChange?.(true);
    }
  };

  const hide = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = undefined;
    }

    if (hideDelay > 0) {
      hideTimeoutRef.current = window.setTimeout(() => {
        setInternalVisible(false);
        onVisibleChange?.(false);
      }, hideDelay);
    } else {
      setInternalVisible(false);
      onVisibleChange?.(false);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      show();
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      hide();
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      if (isVisible) {
        hide();
      } else {
        show();
      }
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') {
      show();
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus') {
      hide();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isVisible) {
      hide();
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isVisible, placement]);

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const getArrowStyles = () => {
    const arrowSize = 6;
    const styles: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid'
    };

    if (placement.startsWith('top')) {
      styles.top = '100%';
      styles.left = '50%';
      styles.marginLeft = -arrowSize;
      styles.borderWidth = `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`;
      styles.borderColor = 'var(--tooltip-bg, #333) transparent transparent transparent';
    } else if (placement.startsWith('bottom')) {
      styles.bottom = '100%';
      styles.left = '50%';
      styles.marginLeft = -arrowSize;
      styles.borderWidth = `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`;
      styles.borderColor = 'transparent transparent var(--tooltip-bg, #333) transparent';
    } else if (placement.startsWith('left')) {
      styles.left = '100%';
      styles.top = '50%';
      styles.marginTop = -arrowSize;
      styles.borderWidth = `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`;
      styles.borderColor = 'transparent transparent transparent var(--tooltip-bg, #333)';
    } else if (placement.startsWith('right')) {
      styles.right = '100%';
      styles.top = '50%';
      styles.marginTop = -arrowSize;
      styles.borderWidth = `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`;
      styles.borderColor = 'transparent var(--tooltip-bg, #333) transparent transparent';
    }

    return styles;
  };

  if (!content) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        ref={triggerRef}
        className={`tooltip-trigger ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        tabIndex={trigger === 'focus' ? 0 : undefined}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`tooltip tooltip--${placement} ${overlayClassName}`}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            maxWidth,
            zIndex: 1000
          }}
          role='tooltip'
          aria-hidden={!isVisible}
        >
          <div className='tooltip__content'>
            {content}
          </div>
          {arrow && (
            <div 
              className='tooltip__arrow'
              style={getArrowStyles()}
            />
          )}
        </div>
      )}
    </>
  );
};

// Higher-order component for easy tooltip wrapping
export interface WithTooltipProps extends Omit<TooltipProps, 'children'> {
  tooltip: React.ReactNode;
}

export const withTooltip = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithTooltipComponent: React.FC<P & WithTooltipProps> = (props) => {
    const { tooltip, placement, trigger, ...componentProps } = props;

    return (
      <Tooltip 
        content={tooltip} 
        placement={placement} 
        trigger={trigger}
      >
        <WrappedComponent {...(componentProps as P)} />
      </Tooltip>
    );
  };

  WithTooltipComponent.displayName = `withTooltip(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithTooltipComponent;
};

export default Tooltip;