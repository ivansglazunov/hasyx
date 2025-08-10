import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useResizeDetector } from 'react-resize-detector';
// Tailwind/inlined styles only; module CSS removed by request

/**
 * Props for the `HoverCard` component.
 *
 * Provides interactive 3D-tilt feedback based on mouse position or device orientation.
 */
export interface HoverCardProps {
  /** Child content to render inside the hover card. */
  children: React.ReactNode;
  /** Strength of response to input in range 0-1. Default is 0.5. */
  force?: number;
  /** Additional class names to append to the root element. */
  className?: string;
  /** Disable all hover/orientation effects when true. */
  disabled?: boolean;
  /** Maximum rotation in degrees. Default is 15. */
  maxRotation?: number;
  /** Maximum visual lift in pixels. Default is 30. */
  maxLift?: number;
  /** Whether to enable glow effect (currently reserved). */
  enableGlow?: boolean;
  /** Use device orientation instead of mouse when available. */
  useDeviceOrientation?: boolean;
  /** Sensitivity for device orientation input in range 0-1. Default is 0.8. */
  orientationSensitivity?: number;
  /** Time in ms to return to center after orientation change (diagnostic). */
  returnToCenter?: number;
  /**
   * Callback invoked with raw orientation data and diagnostics.
   * Useful for debugging and visualizing sensor values.
   */
  onOrientationData?: (data: {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
    timestamp: number;
    isSupported: boolean;
    isActive: boolean;
  } | null) => void;
}

/**
 * Interactive card that tilts with mouse or device orientation.
 *
 * - On desktop: reacts to mouse position while hovered
 * - On mobile: reacts to deviceorientation events if supported (with decay)
 *
 * @param props - {@link HoverCardProps}
 */
export const HoverCard: React.FC<HoverCardProps> = ({ 
  children, 
  force = 0.5, 
  className = '',
  disabled = false,
  maxRotation = 15,
  maxLift = 30,
  enableGlow = true,
  useDeviceOrientation = true,
  orientationSensitivity = 0.8,
  returnToCenter = 1500,
  onOrientationData
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [elementCenter, setElementCenter] = useState({ x: 0, y: 0 });
  const [orientationSupported, setOrientationSupported] = useState(false);
  const [isUsingOrientation, setIsUsingOrientation] = useState(false);
  const [orientationData, setOrientationData] = useState<{
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
    timestamp: number;
  } | null>(null);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const lastOrientationRef = useRef<{ gamma: number; beta: number } | null>(null);
  const decayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const { width, height, ref } = useResizeDetector<HTMLDivElement>({
    refreshMode: 'debounce',
    refreshRate: 100,
  });

  // Check for device orientation support and set up listener
  useEffect(() => {
    if (!useDeviceOrientation || disabled) return;

    const checkOrientationSupport = () => {
      if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
        setOrientationSupported(true);
        
        const handleOrientation = (event: DeviceOrientationEvent) => {
          const now = Date.now();
          
          // Always update diagnostic data
          setOrientationData({
            alpha: event.alpha,
            beta: event.beta,
            gamma: event.gamma,
            timestamp: now
          });
          
          if (event.gamma === null || event.beta === null) return;
          
          setIsUsingOrientation(true);
          
          // Convert device orientation to normalized values
          const gamma = Math.max(-90, Math.min(90, event.gamma));
          const beta = Math.max(-90, Math.min(90, event.beta));
          
          const lastOrientation = lastOrientationRef.current;
          
          if (lastOrientation) {
            // Calculate delta from previous orientation
            const deltaGamma = gamma - lastOrientation.gamma;
            const deltaBeta = beta - lastOrientation.beta;
            
            // Apply delta to current position with sensitivity
            const currentPos = currentPositionRef.current;
            const deltaX = -(deltaGamma / 90) * orientationSensitivity * 0.5; // Reduce sensitivity for delta
            const deltaY = -(deltaBeta / 90) * orientationSensitivity * 0.5;
            
            // Add delta to current position (accumulate changes)
            const newX = Math.max(-1, Math.min(1, currentPos.x + deltaX));
            const newY = Math.max(-1, Math.min(1, currentPos.y + deltaY));
            
            currentPositionRef.current = { x: newX, y: newY };
            setMousePosition({ x: newX, y: newY });
          }
          
          // Update last orientation
          lastOrientationRef.current = { gamma, beta };
        };
        
        window.addEventListener('deviceorientation', handleOrientation, true);
        
        return () => {
          window.removeEventListener('deviceorientation', handleOrientation, true);
        };
      }
      return undefined;
    };

    const cleanup = checkOrientationSupport();
    
    return cleanup;
  }, [useDeviceOrientation, disabled, orientationSensitivity, returnToCenter]);

  // Constant decay effect - always running when device orientation is enabled
  useEffect(() => {
    if (!useDeviceOrientation || disabled) return;

    const decayRate = 0.95; // How quickly to decay (0.95 = retain 95% each frame)
    const threshold = 0.01; // Stop decay when position is very small
    
    decayIntervalRef.current = setInterval(() => {
      const currentPos = currentPositionRef.current;
      const magnitude = Math.sqrt(currentPos.x * currentPos.x + currentPos.y * currentPos.y);
      
      if (magnitude > threshold) {
        const newX = currentPos.x * decayRate;
        const newY = currentPos.y * decayRate;
        
        currentPositionRef.current = { x: newX, y: newY };
        setMousePosition({ x: newX, y: newY });
      } else if (magnitude > 0) {
        // Stop completely when very small
        currentPositionRef.current = { x: 0, y: 0 };
        setMousePosition({ x: 0, y: 0 });
        setIsUsingOrientation(false);
      }
    }, 16); // 60fps

    return () => {
      if (decayIntervalRef.current) {
        clearInterval(decayIntervalRef.current);
      }
    };
  }, [useDeviceOrientation, disabled]);

  // Send diagnostic data to parent component
  useEffect(() => {
    if (onOrientationData) {
      if (orientationData) {
        onOrientationData({
          ...orientationData,
          isSupported: orientationSupported,
          isActive: isUsingOrientation
        });
      } else {
        onOrientationData({
          alpha: null,
          beta: null,
          gamma: null,
          timestamp: Date.now(),
          isSupported: orientationSupported,
          isActive: isUsingOrientation
        });
      }
    }
  }, [orientationData, orientationSupported, isUsingOrientation, onOrientationData]);

  const handleMouseEnter = useCallback(() => {
    if (disabled || isUsingOrientation) return;
    setIsHovered(true);
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setElementCenter({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, [disabled, isUsingOrientation]);

  const handleMouseLeave = useCallback(() => {
    if (disabled || isUsingOrientation) return;
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  }, [disabled, isUsingOrientation]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (disabled || isUsingOrientation || !isHovered || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate relative position from center (-1 to 1)
    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);
    
    setMousePosition({ x: relativeX, y: relativeY });
  }, [disabled, isUsingOrientation, isHovered]);

  // Handle click events to ensure they reach child elements
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Allow clicks to pass through to children
  }, []);

  // Calculate transform values based on mouse position and force - only rotation
  let rotateX, rotateY;
  
  if (isUsingOrientation) {
    // For device orientation: double effect + invert both axes
    rotateX = -mousePosition.y * force * maxRotation * 3; // Invert up/down
    rotateY = mousePosition.x * force * maxRotation * 3;  // Invert left/right
  } else {
    // For mouse: original behavior
    rotateX = mousePosition.y * force * maxRotation * 0.25;
    rotateY = -mousePosition.x * force * maxRotation * 0.25; // Negative for natural feel
  }
  
  // Keep original shadow without glow effects
  const boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

  const transformStyle = {
    transform: `
      perspective(1200px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
    `,
    boxShadow,
    transition: (isHovered || isUsingOrientation)
      ? 'transform 0.08s ease-out, box-shadow 0.2s ease-out' 
      : 'transform 0.4s cubic-bezier(0.23, 1, 0.320, 1), box-shadow 0.4s ease-out',
  } as React.CSSProperties;

  // Merge refs for both resize detection and mouse events
  const mergedRef = useCallback((node: HTMLDivElement | null) => {
    cardRef.current = node;
    ref(node);
  }, [ref]);

  return (
    <div
      ref={mergedRef}
      className={`transform will-change-transform ${className}`}
      style={{
        ...transformStyle,
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

