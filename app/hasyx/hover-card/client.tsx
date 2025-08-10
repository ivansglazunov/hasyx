"use client";

import React, { useState, useEffect } from 'react';
import { HoverCard } from '../../../components/hover-card';
import { useDeviceOrientationPermissions } from '../../../hooks/device-permissions';

type ForceLevel = 'low' | 'medium' | 'high';

interface ForceConfig {
  force: number;
  maxRotation: number;
  maxLift: number;
  title: string;
  description: string;
}

const forceConfigs: Record<ForceLevel, ForceConfig> = {
  low: {
    force: 0.3,
    maxRotation: 10,
    maxLift: 15,
    title: 'Gentle',
    description: 'Subtle movements',
  },
  medium: {
    force: 0.6,
    maxRotation: 15,
    maxLift: 30,
    title: 'Medium',
    description: 'Balanced response',
  },
  high: {
    force: 1.3,
    maxRotation: 25,
    maxLift: 50,
    title: 'Strong',
    description: 'Dynamic movement',
  }
};

export function HoverCardClient() {
  const [activeLevel, setActiveLevel] = useState<ForceLevel>('medium');
  const [useOrientation, setUseOrientation] = useState(true);
  const [orientationSensitivity, setOrientationSensitivity] = useState(0.8);
  const [orientationData, setOrientationData] = useState<{
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
    timestamp: number;
    isSupported: boolean;
    isActive: boolean;
  } | null>(null);
  const devicePermissions = useDeviceOrientationPermissions(false);
  const [, forceUpdate] = useState({});
  const config = forceConfigs[activeLevel];

  // Force re-render to update time since last orientation event
  useEffect(() => {
    const interval = setInterval(() => forceUpdate({}), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-neutral-100">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold">HoverCard Demo</h1>
        <p className="text-neutral-400 text-sm">Simple demo in neutral Vercel-like style</p>
      </div>

      {/* Level Tabs */}
      <div className="mb-8">
        <nav className="flex gap-2 p-1 rounded-md bg-neutral-900 border border-neutral-800">
          {Object.keys(forceConfigs).map((level) => (
            <button
              key={level}
              onClick={() => setActiveLevel(level as ForceLevel)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                activeLevel === level
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              {level}
            </button>
          ))}
        </nav>
      </div>

      {/* Controls */}
      <div className="mb-6 p-4 rounded-lg bg-neutral-900 border border-neutral-800">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useOrientation}
              onChange={(e) => setUseOrientation(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Enable device orientation</span>
          </label>

          {useOrientation && (
            <div className="flex items-center gap-2">
              <span className="text-sm">Sensitivity:</span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={orientationSensitivity}
                onChange={(e) => setOrientationSensitivity(parseFloat(e.target.value))}
              />
              <span className="text-xs w-10 text-right">{orientationSensitivity}</span>
            </div>
          )}
        </div>
      </div>

      {/* Diagnostics */}
      {orientationData && (
        <div className="mb-6 p-4 rounded-lg bg-neutral-900 border border-neutral-800 w-[320px]">
          <div className="grid grid-cols-2 gap-3 text-xs text-neutral-300">
            <div>
              <p><strong>Supported:</strong> {orientationData.isSupported ? 'Yes' : 'No'}</p>
              <p><strong>Active:</strong> {orientationData.isActive ? 'Yes' : 'No'}</p>
              <p><strong>Permission:</strong> {devicePermissions.permissionStatus}</p>
              <p><strong>Time:</strong> {new Date(orientationData.timestamp).toLocaleTimeString()}</p>
            </div>
            <div>
              <p><strong>Alpha:</strong> {orientationData.alpha !== null ? orientationData.alpha.toFixed(2) : 'null'}</p>
              <p><strong>Beta:</strong> {orientationData.beta !== null ? orientationData.beta.toFixed(2) : 'null'}</p>
              <p><strong>Gamma:</strong> {orientationData.gamma !== null ? orientationData.gamma.toFixed(2) : 'null'}</p>
              <p><strong>Δt:</strong> {Math.round((Date.now() - orientationData.timestamp) / 100) / 10}s</p>
            </div>
          </div>
          {orientationData.isSupported && devicePermissions.permissionStatus !== 'granted' && (
            <div className="mt-3 text-center">
              <button
                onClick={devicePermissions.requestPermission}
                className="px-3 py-2 rounded-md bg-neutral-100 text-neutral-900 text-sm"
              >
                Grant orientation permission
              </button>
            </div>
          )}
        </div>
      )}

      {/* Demo Card */}
      <HoverCard 
        force={config.force}
        maxRotation={config.maxRotation}
        maxLift={config.maxLift}
        useDeviceOrientation={useOrientation}
        orientationSensitivity={orientationSensitivity}
        onOrientationData={setOrientationData}
      >
        <div className="w-[300px] h-[420px] rounded-xl shadow border border-neutral-800 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-1">{config.title}</h2>
            <p className="text-sm text-neutral-400 mb-4">{config.description}</p>
            <p className="text-xs text-neutral-500">Force: {config.force} | MaxRot: {config.maxRotation}° | Lift: {config.maxLift}px</p>
          </div>
        </div>
      </HoverCard>
    </div>
  );
}

