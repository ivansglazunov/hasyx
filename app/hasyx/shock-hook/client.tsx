"use client";

import React, { useState } from 'react';
import { useDeviceMotion } from '../../../hooks/device-motion';

export function ShockHookClient() {
  const [isGlowing, setIsGlowing] = useState(false);
  const [shockData, setShockData] = useState<{
    magnitude: number;
    acceleration: { x: number; y: number; z: number };
    timestamp: number;
  } | null>(null);
  const [shockCount, setShockCount] = useState(0);
  const [lastShockTime, setLastShockTime] = useState<string>('');

  const { requestPermission, isSupported, permissionGranted, permissionStatus } = useDeviceMotion(
    (data) => {
      setIsGlowing(true);
      setShockData(data);
      setShockCount((prev) => prev + 1);
      setLastShockTime(new Date().toLocaleTimeString());

      setTimeout(() => setIsGlowing(false), 100);
    },
    {
      threshold: 15,
      cooldown: 300,
      requirePermission: true,
    }
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 text-neutral-100">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-semibold">Shake Demo</h1>
        <p className="text-neutral-400 text-sm">Shake your device to trigger glow</p>
      </div>

      <div className="mb-10 relative">
        <div
          className={`w-48 h-48 rounded-full transition-all ${
            isGlowing
              ? 'bg-cyan-400 shadow-[0_0_60px_12px_rgba(34,211,238,0.8)] scale-110'
              : 'bg-neutral-700 shadow scale-100'
          }`}
          style={{
            background: isGlowing
              ? 'radial-gradient(circle, #06b6d4, #0891b2, #0e7490)'
              : 'radial-gradient(circle, #3f3f46, #262626, #171717)',
            transition: isGlowing ? 'all 80ms ease-out' : 'all 1600ms cubic-bezier(0.23,1,0.32,1)'
          }}
        >
          <div
            className={`absolute inset-4 rounded-full transition-all ${
              isGlowing ? 'bg-white/30 shadow-inner' : 'bg-neutral-600/20'
            }`}
          />
          <div
            className={`absolute inset-16 rounded-full transition-all ${
              isGlowing ? 'bg-white shadow' : 'bg-neutral-500'
            }`}
          />
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg bg-neutral-900 border border-neutral-800 w-[320px]">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-300">Supported:</span>
            <span className={isSupported ? 'text-emerald-400' : 'text-red-400'}>{isSupported ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-300">Permission:</span>
            <span className="text-neutral-200">{permissionStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-300">Shock Count:</span>
            <span className="text-neutral-100 font-mono">{shockCount}</span>
          </div>
          {lastShockTime && (
            <div className="flex justify-between">
              <span className="text-neutral-300">Last Shock:</span>
              <span className="text-neutral-100 font-mono text-xs">{lastShockTime}</span>
            </div>
          )}
        </div>
      </div>

      {isSupported && permissionStatus !== 'granted' && (
        <div className="text-center">
          <button
            onClick={requestPermission}
            disabled={permissionStatus === 'requesting'}
            className="px-4 py-2 rounded-md bg-neutral-100 text-neutral-900 text-sm disabled:opacity-60"
          >
            {permissionStatus === 'requesting' ? 'Requesting...' : 'Grant motion permission'}
          </button>
        </div>
      )}

      {shockData && (
        <div className="mt-8 p-4 rounded-lg bg-neutral-900 border border-neutral-800 w-[320px] text-xs text-neutral-300">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p><strong>Magnitude:</strong> {shockData.magnitude.toFixed(2)}</p>
              <p><strong>X:</strong> {shockData.acceleration.x.toFixed(2)}</p>
            </div>
            <div>
              <p><strong>Y:</strong> {shockData.acceleration.y.toFixed(2)}</p>
              <p><strong>Z:</strong> {shockData.acceleration.z.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

