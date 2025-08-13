"use client"

import Debug from 'hasyx/lib/debug';
import { Cyto, CytoStyle, CytoNode, CytoEdge, useGraph } from "hasyx/lib/cyto";
import { Card as EntityCard, Button as EntityButton, CytoNode as EntityCytoNode } from '../../../lib/entities';
import { QueriesManager, QueriesRenderer } from 'hasyx/lib/renderer';
import React, { useCallback, useMemo, useState, useRef } from "react";
import projectSchema from '../hasura-schema.json';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from 'hasyx/components/ui/card';
import { Button } from 'hasyx/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from 'hasyx/components/ui/dialog';
import { Input } from 'hasyx/components/ui/input';
import { Textarea } from 'hasyx/components/ui/textarea';
import { MarkdownEditor } from 'hasyx/lib/wysiwyg';
import { useQuery, useHasyx } from 'hasyx';
import { toast } from 'sonner';
import { useToastHandleLoadingError } from 'hasyx/hooks/toasts';
import { parseIssue, generateIssue } from 'hasyx/lib/issues';
import { Tag } from 'lucide-react';
import { MultiSelect } from 'hasyx/components/ui/multi-select';
import { useTranslations } from 'hasyx';
import { useDependencyDrawingStore } from 'hasyx/hooks/dependency-drawing-store';

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
  },
  // Relation type styles
  {
    selector: 'edge.mentioned',
    style: {
      'width': 1,
      'line-color': '#6b7280',
      'target-arrow-color': '#6b7280',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'line-style': 'solid'
    }
  },
  {
    selector: 'edge.depends_on',
    style: {
      'width': 2,
      'line-color': '#dc2626',
      'target-arrow-color': '#dc2626',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'line-style': 'solid'
    }
  },
  {
    selector: 'edge.blocks',
    style: {
      'width': 2,
      'line-color': '#ea580c',
      'target-arrow-color': '#ea580c',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'line-style': 'solid'
    }
  },
  {
    selector: 'edge.related_to',
    style: {
      'width': 1.5,
      'line-color': '#059669',
      'target-arrow-color': '#059669',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'line-style': 'solid'
    }
  },
  {
    selector: 'edge.duplicates',
    style: {
      'width': 1.5,
      'line-color': '#7c3aed',
      'target-arrow-color': '#7c3aed',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'line-style': 'solid'
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

// Create Issue Dialog Component
function CreateIssueDialog({ 
  open, 
  onOpenChange, 
  onIssueCreated 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onIssueCreated?: (issue: any) => void; 
}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const hasyx = useHasyx();
  const tIssues = useTranslations('issues');
  const tForms = useTranslations('forms');
  const tSuccess = useTranslations('success');

  // Get all issues to extract unique labels
  const { data: allIssues = [] } = useQuery({
    table: 'github_issues',
    where: {},
    returning: ['labels_data'],
  });

  // Extract unique labels from all issues
  const uniqueLabels = useMemo(() => {
    const labelMap = new Map<string, { name: string; color: string }>();
    
    allIssues.forEach(issue => {
      if (issue.labels_data && Array.isArray(issue.labels_data)) {
        issue.labels_data.forEach((label: any) => {
          if (label.name && label.color) {
            labelMap.set(label.name, {
              name: label.name,
              color: label.color
            });
          }
        });
      }
    });

    return Array.from(labelMap.values()).map(label => ({
      value: label.name,
      label: label.name,
      color: label.color,
      icon: Tag
    }));
  }, [allIssues]);

  const handleCreateIssue = async () => {
    if (!title.trim()) {
      toast.error(tIssues('titleRequired'));
      return;
    }

    setIsCreating(true);
    try {
      debug('🔄 Creating GitHub issue via hasyx.insert...', { title, body });
      
      // Convert selected labels to GitHub label format
      const selectedLabelObjects = selectedLabels.map(labelName => {
        const labelInfo = uniqueLabels.find(l => l.value === labelName);
        return {
          id: 0, // Will be set by GitHub
          name: labelName,
          color: labelInfo?.color || '0366d6', // Default GitHub blue
          description: null,
          default: false,
          node_id: '',
          url: ''
        };
      });

      // Use hasyx.insert to create issue in database
      // This will trigger the event handler which will create the issue in GitHub
      const issueData = {
        title: title.trim(),
        body: body.trim() || undefined,
        state: 'open',
        created_at: Date.now(),
        updated_at: Date.now(),
        // These will be filled by the event handler
        github_id: null, // Will be set by event handler
        number: null, // Will be set by event handler
        node_id: '', // Will be set by event handler
        html_url: '', // Will be set by event handler
        url: '', // Will be set by event handler
        repository_owner: process.env.NEXT_PUBLIC_GITHUB_OWNER || '',
        repository_name: process.env.NEXT_PUBLIC_GITHUB_REPO || '',
        locked: false,
        active_lock_reason: null,
        comments_count: 0,
        author_association: 'NONE',
        user_data: null, // Will be set by event handler
        assignee_data: null,
        assignees_data: [],
        labels_data: selectedLabelObjects, // Include selected labels
        milestone_data: null,
        pull_request_data: null,
        closed_by_data: null,
        closed_at: null,
      };

      // Insert into database - this will trigger the event handler
      const result = await hasyx.insert({
        table: 'github_issues',
        object: issueData
      });

      debug('✅ Issue inserted into database:', result);
      toast.success(tSuccess('issueCreated'));
      
      // Reset form
      setTitle('');
      setBody('');
      onOpenChange(false);
      
      // Notify parent component
      if (onIssueCreated) {
        onIssueCreated(result);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      debug('❌ Failed to create GitHub issue:', error);
      console.error('Create issue error:', error);
      toast.error(tIssues('failedToCreate', { message: errorMessage }));
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setBody('');
    setSelectedLabels([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{tIssues('createGitHubIssue')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="issue-title" className="text-sm font-medium">
              {tIssues('title')} *
            </label>
            <Input
              id="issue-title"
              placeholder={tForms('placeholders.issueTitle')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isCreating}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="issue-labels" className="text-sm font-medium">
              {tIssues('labels')}
            </label>
            <MultiSelect
              options={uniqueLabels}
              onValueChange={setSelectedLabels}
              defaultValue={selectedLabels}
              placeholder={tForms('placeholders.selectLabels')}
              variant="default"
              animation={0.5}
              maxCount={5}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="issue-body" className="text-sm font-medium">
              {tIssues('description')}
            </label>
            <MarkdownEditor
              value={body}
              onChange={setBody}
              placeholder={tForms('placeholders.issueDescription')}
              minHeight={160}
              className="w-full"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isCreating}
          >
            {useTranslations('actions')('cancel')}
          </Button>
          <Button
            onClick={handleCreateIssue}
            disabled={isCreating || !title.trim()}
          >
            {isCreating ? tIssues('creating') : tIssues('createIssue')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
  const [createIssueDialogOpen, setCreateIssueDialogOpen] = useState(false);
  const { onDrawingComplete, cancelDrawing } = useDependencyDrawingStore();
  const graphContext = useGraph();
  const toggleDrawMode = graphContext?.toggleDrawMode;

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

  // Get all issues for availableIssues
  const { data: availableIssues = [] } = useQuery({
    table: 'github_issues',
    where: {},
    returning: [
      'id', 'github_id', 'number', 'title', 'body', 'state', 'state_reason',
      'locked', 'comments_count', 'author_association', 'user_data', 'assignee_data',
      'assignees_data', 'labels_data', 'milestone_data', 'repository_owner',
      'repository_name', 'url', 'html_url', 'created_at', 'updated_at', 'closed_at'
    ],
    order_by: [{ updated_at: 'desc' }],
  });

  const tIssues = useTranslations('issues');
  const tSuccess = useTranslations('success');
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
      toast.success(tSuccess('issuesSynced', { count: result.synced }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      debug('❌ GitHub issues sync failed:', error);
      console.error('GitHub issues sync error:', error);
      toast.error(tIssues('failedToSync', { message: errorMessage }));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleIssueCreated = useCallback((issue: any) => {
    debug('🎉 Issue created:', issue);
    // Additional logic can be added here, e.g., refresh issues list
  }, []);

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
              {isSyncing ? tIssues('syncing') : tIssues('sync')}
            </Button>
          </div>
        </>}
        rightTop={<>
          <div className="space-y-4">
            {/* Create Issue Button */}
            <Button 
              onClick={() => setCreateIssueDialogOpen(true)}
              className="w-full"
              variant="default"
            >
              ➕ {tIssues('createIssue')}
            </Button>
            
            {/* Cancel Drawing Mode Button */}
            {onDrawingComplete && (
              <Button 
                onClick={() => {
                  cancelDrawing();
                  toggleDrawMode?.(); // Disable drawing mode
                }}
                className="w-full"
                variant="destructive"
              >
                {tIssues('cancelDrawing')}
              </Button>
            )}
          </div>
        </>}
      >
        <CytoStyle stylesheet={stylesheet} />
        
        {/* Render GitHub issues using QueriesRenderer */}
        <QueriesRenderer
          queries={queries}
          schema={projectSchema}
          availableIssues={availableIssues}
          // renderer={customRenderer}
          // onClick={setSelectedEntity}
          // EntityButtonComponent={EntityButton}
        />
        
        {/* Commented out roadmap renderer */}
        {/* <Renderer roadmap={roadmap} /> */}
      </Cyto>

      {/* Create Issue Dialog */}
      <CreateIssueDialog
        open={createIssueDialogOpen}
        onOpenChange={setCreateIssueDialogOpen}
        onIssueCreated={handleIssueCreated}
      />

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
