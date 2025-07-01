"use client"

import Debug from '@/lib/debug';
import { Cyto, CytoStyle, CytoNode, CytoEdge } from "hasyx/lib/cyto";
import { Card as EntityCard, Button as EntityButton } from '../../../lib/entities';
import { QueriesManager, QueriesRenderer } from 'hasyx/lib/renderer';
import { useCallback, useMemo, useState } from "react";
import projectSchema from '../hasura-schema.json';
import generatedRoadmap from '../../../lib/roadmap.json';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const debug = Debug('cyto');

// Стили для Cytoscape
const stylesheet = [
  {
    selector: 'node',
    style: {
      'background-color': 'var(--foreground)',
      'background-opacity': 0.6,
      'shape': 'circle',
      'width': 10,
      'height': 10,
      'border-radius': 10,
      'color': 'var(--foreground)',
    }
  },
  {
    selector: 'node.roadstep',
    style: {
      'width': 20,
      'height': 20,
      'background-opacity': 0,
      'shape': 'circle',
      'label': 'data(label)',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'text-margin-y': -17,
      'text-wrap': 'wrap',
    }
  },
  {
    selector: 'node.opened',
    style: {
      'background-opacity': 0,
      'shape': 'rectangle',
    }
  },
  {
    selector: 'node.ghost',
    style: {
      'opacity': 0.3,
      'width': 5,
      'height': 5,
      'label': '',
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': 'var(--foreground)',
      'target-arrow-color': 'var(--foreground)',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier'
    }
  },
  {
    selector: 'edge.required',
    style: {
      'width': 2,
      'line-color': 'var(--foreground)',
      'target-arrow-color': 'var(--foreground)',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier'
    }
  },
  {
    selector: 'edge.available',
    style: {
      'width': 2,
      'line-color': '#888888',
      'target-arrow-color': '#888888',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'line-style': 'dashed !important',
      'line-dash-pattern': [10, 5],
      'line-dash-offset': 0
    }
  }
];

interface Roadstep {
  symbol: string;
  name: string;
  required?: string[];
  available?: string[];
}

// Ручной roadmap для сравнения (старый)
export const manualRoadmap: Roadstep[] = [
  {
    symbol: '🟢',
    name: 'nextjs',
    required: [],
    available: ['cli'],
  },
  {
    symbol: '🟢',
    name: 'lib',
    required: ['nextjs'],
  },
  {
    symbol: '🟢',
    name: 'cli',
    required: [],
  },
  {
    symbol: '🟢',
    name: 'components Cyto',
    available: ['lib'],
  },
  {
    symbol: '🟢',
    name: 'generator-hasyx',
    required: ['class-hasura'],
    available: ['lib'],
  },
  {
    symbol: '🟢',
    name: 'migrations',
    required: ['class-hasura'],
    available: ['cli'],
  },
  {
    symbol: '🟢',
    name: 'apollo',
    required: ['class-hasura'],
    available: ['lib'],
  },
  {
    symbol: '🟢',
    name: 'next-auth',
    required: ['class-hasyx'],
  },
  {
    symbol: '🟢',
    name: 'google-auth',
    required: ['next-auth'],
  },
  {
    symbol: '🟢',
    name: 'yandex-auth',
    required: ['next-auth'],
  },
  {
    symbol: '🟢',
    name: 'vk-auth',
    required: ['next-auth'],
  },
  {
    symbol: '🟢',
    name: 'telegram-auth',
    required: ['next-auth'],
  },
  {
    symbol: '🟠',
    name: 'telegram-miniapp-auth',
    required: ['next-auth'],
  },
  {
    symbol: '🟢',
    name: 'class-hasyx',
    required: ['generator-hasyx', 'apollo'],
    available: ['lib'],
  },
  {
    symbol: '🟢',
    name: 'class-hasura',
    required: ['lib'],
  },
  {
    symbol: '🟡',
    name: 'graphql-proxy',
    required: ['next-auth', 'telegram-miniapp-auth', 'apollo'],
  },
  {
    symbol: '🟠',
    name: 'PWA',
    required: ['server-client'],
  },
  {
    symbol: '🟢',
    name: 'server-client',
    required: ['nextjs'],
    available: ['cli'],
  },
  {
    symbol: '🟡',
    name: 'auth-jwt',
    required: [],
  },
  {
    symbol: '🟢',
    name: 'client',
    required: ['nextjs'],
    available: ['cli'],
  },
  {
    symbol: '🟡',
    name: 'capacitor',
    required: ['auth-jwt', 'client'],
  },
  {
    symbol: '🟡',
    name: 'android',
    required: ['capacitor'],
    available: ['cli'],
  },
  {
    symbol: '🟡',
    name: 'ios',
    required: ['capacitor'],
    available: ['cli'],
  },
  {
    symbol: '🟡',
    name: 'windows',
    required: ['capacitor'],
    available: ['cli'],
  },
  {
    symbol: '🟡',
    name: 'macos',
    required: ['capacitor'],
    available: ['cli'],
  },
  {
    symbol: '🔴',
    name: 'electron-nextjs-server',
    required: ['server-client'],
    available: ['cli'],
  },
  {
    symbol: '🟡',
    name: 'electron',
    required: ['auth-jwt', 'electron-nextjs-server'],
  },
  {
    symbol: '🟡',
    name: 'linux',
    required: ['electron-nextjs-server'],
    available: ['cli'],
  },
  {
    symbol: '🟡',
    name: 'chrome-extension',
    required: ['auth-jwt', 'client'],
    available: ['cli'],
  },
  {
    symbol: '🔴',
    name: 'vscode-extension',
    required: ['auth-jwt', 'client'],
    available: ['cli'],
  },
];

// Автоматически сгенерированный roadmap из комментариев
export const roadmap: Roadstep[] = generatedRoadmap;

export function Renderer({ roadmap }: { roadmap: Roadstep[] }) {
  return <>
    {roadmap.map((step) => (
      <CytoNode 
        key={step.name}
        element={{
          id: step.name,
          data: {
            id: step.name,
            label: `${step.symbol}
${step.name}`,
          },
          classes: ['roadstep'],
        }}
      />
    ))}
    {roadmap.map((step) => (<>
      {(step.required || []).map((required) => (
        <CytoEdge 
          key={`${step.name}-${required}`}
          element={{
            id: `${step.name}-${required}`,
            data: {
              id: `${step.name}-${required}`,
              source: step.name,
              target: required,
            },
            classes: ['required'],
          }} 
        />
      ))}
      {(step.available || []).map((available) => (
        <CytoEdge 
          key={`${step.name}-${available}`}
          element={{
            id: `${step.name}-${available}`,
            data: {
              id: `${step.name}-${available}`,
              source: step.name,
              target: available,
            },
            classes: ['available'],
          }}
        />
      ))}
    </>))}
  </>;
}

export default function Client() {
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  const onGraphLoaded = useCallback((cy) => {
    if (global) (global as any).cy = cy;
    cy.zoom(1);
    cy.center();
  }, []);

  const layoutConfig = useMemo(() => ({
    name: 'klay',
    nodeDimensionsIncludeLabels: true,
    fit: false,
    klay: {
      spacing: 40,
      direction: 'LEFT'
    }
  }), []);

  const closeModal = useCallback(() => setSelectedEntity(null), []);

  return (
    <div className="w-full h-full relative">
      <Cyto
        onLoaded={onGraphLoaded}
        buttons={true}
        layout={layoutConfig}
        leftTop={<>
          <Card className="w-xs">
            <CardHeader>
              <CardTitle>� Auto-generated Roadmap</CardTitle>
              <CardDescription>Generated from /*😈{...}*/ comments</CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                <li>✅ Parse roadmap comments from files</li>
                <li>✅ Generate roadmap.json automatically</li>
                <li>🔄 Add more features to roadmap</li>
                <li>📋 Sync with GitHub issues</li>
              </ul>
            </CardContent>
          </Card>
        </>}
      >
        <CytoStyle stylesheet={stylesheet} />
        <Renderer roadmap={roadmap} />
      </Cyto>
    </div>
  );
}
