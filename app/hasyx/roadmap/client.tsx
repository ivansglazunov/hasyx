"use client"

import Debug from '@/lib/debug';
import { Cyto, CytoStyle, CytoNode, CytoEdge } from "hasyx/lib/cyto";
import { Card as EntityCard, Button as EntityButton, CytoNode as EntityCytoNode } from '../../../lib/entities';
import { QueriesManager, QueriesRenderer } from 'hasyx/lib/renderer';
import { useCallback, useMemo, useState } from "react";
import projectSchema from '../hasura-schema.json';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from 'hasyx/components/ui/button';
import { useQuery } from 'hasyx';
import { toast } from 'sonner';
import { useToastHandleLoadingError } from 'hasyx/hooks/toasts';
import { parseIssue, generateIssue } from 'hasyx/lib/issues';

const debug = Debug('cyto');

// Styles for Cytoscape
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
    selector: 'node.github-issue',
    style: {
      // 'background-color': '#22c55e',
      'background-opacity': 0,
      'shape': 'round-rectangle',
      'width': 30,
      'height': 20,
      'label': 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'color': 'white',
      'font-size': '10px',
      'font-weight': 'bold',
      'text-outline-width': 1,
      'text-outline-color': '#000',
    }
  },
  {
    selector: 'node.github-issue.closed',
    style: {
      'background-color': '#ef4444',
    }
  },
  {
    selector: 'node.github-issue.pull-request',
    style: {
      'background-color': '#8b5cf6',
      'shape': 'diamond',
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

export const roadmap: Roadstep[] = [
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
  const [isSyncing, setIsSyncing] = useState(false);

  // Queries for QueriesRenderer
  const [queries] = useState<any[]>([
    {
      table: 'github_issues',
      where: {},
      returning: [
        'id', 'github_id', 'number', 'title', 'body', 'state', 'state_reason',
        'locked', 'comments_count', 'author_association', 'user_data', 'assignee_data',
        'assignees_data', 'labels_data', 'milestone_data', 'repository_owner',
        'repository_name', 'url', 'html_url', 'created_at', 'updated_at', 'closed_at'
      ],
      order_by: [{ updated_at: 'desc' }],
    }
  ]);

  const handleSyncGitHubIssues = async () => {
    setIsSyncing(true);
    try {
      debug('🔄 Starting GitHub issues sync...');
      
      const response = await fetch('/api/github/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      debug('✅ GitHub issues sync completed:', result);
      toast.success(`Successfully synced ${result.synced} GitHub issues`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      debug('❌ GitHub issues sync failed:', error);
      console.error('GitHub issues sync error:', error);
      toast.error(`Failed to sync GitHub issues: ${errorMessage}`);
    } finally {
      setIsSyncing(false);
    }
  };

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

  // Example usage of parseIssue and generateIssue
  const exampleIssueBody = `## Problem
Currently, our project's environment variables are managed through npx hasyx assist.

## Solution
Introduce a centralized environment configuration file.

<details>
<summary>Relations</summary>
\`\`\`json
{
  "depends_on": ["issue:123", "commit:abc123"],
  "blocks": ["issue:456"],
  "related_to": ["issue:789"]
}
\`\`\`
</details>`;

  const { content, relations } = parseIssue(exampleIssueBody);
  const regeneratedBody = generateIssue(content, relations);

  return (
    <div className="w-full h-full relative">
      <Cyto
        onLoaded={onGraphLoaded}
        buttons={true}
        layout={layoutConfig}
        leftTop={<>
          <div className="space-y-4">
            {/* Sync Button */}
            <Button 
              onClick={handleSyncGitHubIssues}
              disabled={isSyncing}
              className="w-full"
            >
              {isSyncing ? '🔄 Syncing...' : '🔄 Sync GitHub Issues'}
            </Button>
          </div>
        </>}
      >
        <CytoStyle stylesheet={stylesheet} />
        
        {/* Render GitHub issues using QueriesRenderer */}
        <QueriesRenderer
          queries={queries}
          schema={projectSchema}
          // renderer={customRenderer}
          // onClick={setSelectedEntity}
          // EntityButtonComponent={EntityButton}
        />
        
        {/* Commented out roadmap renderer */}
        {/* <Renderer roadmap={roadmap} /> */}
      </Cyto>

      {/* Modal for entity details */}
      {/* {selectedEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div className='w-1/3' onClick={e => e.stopPropagation()}>
            <EntityCard
              data={selectedEntity}
              onClose={closeModal}
            />
          </div>
        </div>
      )} */}
    </div>
  );
}
