import { useEffect, useRef, useCallback } from 'react';
import { useDevicePermissions } from './device-permissions';

/** Configuration options for {@link useDeviceMotion}. */
export interface ShockConfig {
  /** Minimum acceleration magnitude to trigger an event. Default: 15. */
  threshold?: number;
  /** Cooldown between triggers in milliseconds. Default: 300. */
  cooldown?: number;
  /** Whether to request motion permission on iOS. Default: true. */
  requirePermission?: boolean;
}

/** Data emitted by {@link useDeviceMotion} on motion events. */
export interface ShockData {
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  magnitude: number;
  timestamp: number;
}

/**
 * Subscribes to `devicemotion` and invokes a callback when a shock-like motion
 * is detected (based on acceleration magnitude and a cooldown window).
 *
 * @param onMotion - Callback to receive {@link ShockData}
 * @param config - {@link ShockConfig}
 */
export const useDeviceMotion = (
  onMotion: (data: ShockData) => void,
  config: ShockConfig = {}
) => {
  const {
    threshold = 15, // Default threshold for shock detection
    cooldown = 300, // 300ms cooldown between shocks
    requirePermission = true
  } = config;

  const lastShockRef = useRef<number>(0);
  const devicePermissions = useDevicePermissions('motion');

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const now = Date.now();
    
    // Check cooldown
    if (now - lastShockRef.current < cooldown) return;

    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration || acceleration.x === null || acceleration.y === null || acceleration.z === null) {
      return;
    }

    // Calculate magnitude of acceleration
    const magnitude = Math.sqrt(
      acceleration.x * acceleration.x +
      acceleration.y * acceleration.y +
      acceleration.z * acceleration.z
    );

    // Check if magnitude exceeds threshold
    if (magnitude > threshold) {
      lastShockRef.current = now;
      onMotion({
        acceleration: {
          x: acceleration.x,
          y: acceleration.y,
          z: acceleration.z
        },
        magnitude,
        timestamp: now
      });
    }
  }, [onMotion, threshold, cooldown]);

  useEffect(() => {
    const setupMotionListener = async () => {
      if (typeof window === 'undefined') return;

      // Request permission if required
      if (requirePermission && devicePermissions.permissionStatus !== 'granted') {
        const granted = await devicePermissions.requestPermission();
        if (!granted) return;
      }

      window.addEventListener('devicemotion', handleMotion, true);

      return () => {
        window.removeEventListener('devicemotion', handleMotion, true);
      };
    };

    const cleanup = setupMotionListener();
    
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, [handleMotion, requirePermission, devicePermissions]);

  return {
    requestPermission: devicePermissions.requestPermission,
    isSupported: devicePermissions.isSupported,
    permissionGranted: devicePermissions.permissionStatus === 'granted',
    permissionStatus: devicePermissions.permissionStatus
  };
};

