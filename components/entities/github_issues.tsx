"use client";

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useQuery } from 'hasyx';
import { Button as UIButton } from 'hasyx/components/ui/button';
import { Card as UICard, CardContent, CardHeader, CardTitle } from 'hasyx/components/ui/card';
import { Badge } from 'hasyx/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from 'hasyx/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'hasyx/components/ui/tooltip';
import { X, GitBranch, MessageCircle, Calendar, User, Tag, ExternalLink, Link, ArrowRight, Pencil } from 'lucide-react';
import { CytoNode as CytoNodeComponent, CytoEdge } from 'hasyx/lib/cyto';
import { cn } from 'hasyx/lib/utils';
import { parseIssue } from 'hasyx/lib/issues';
import { useDependencyDrawingStore } from '@/hooks/dependency-drawing-store';
import { updateIssueRelations } from 'hasyx/lib/issue-relations';
import { useGraph } from 'hasyx/lib/cyto';
import { useHasyx } from 'hasyx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from 'hasyx/components/ui/dialog';
import { MarkdownEditor } from 'hasyx/lib/wysiwyg';
import { Input } from 'hasyx/components/ui/input';
import { toast } from 'sonner';
import { useTranslations } from 'hasyx';

interface GitHubIssueData {
  id?: string;
  github_id?: number;
  number?: number;
  title?: string;
  body?: string;
  state?: string;
  state_reason?: string;
  locked?: boolean;
  comments_count?: number;
  author_association?: string;
  user_data?: {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    type?: string;
    user_view_type?: string;
    node_id?: string;
    gists_url?: string;
    repos_url?: string;
    events_url?: string;
    site_admin?: boolean;
    gravatar_id?: string;
    starred_url?: string;
    followers_url?: string;
    following_url?: string;
    organizations_url?: string;
    subscriptions_url?: string;
    received_events_url?: string;
  };
  assignee_data?: {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    type?: string;
    user_view_type?: string;
    node_id?: string;
    gists_url?: string;
    repos_url?: string;
    events_url?: string;
    site_admin?: boolean;
    gravatar_id?: string;
    starred_url?: string;
    followers_url?: string;
    following_url?: string;
    organizations_url?: string;
    subscriptions_url?: string;
    received_events_url?: string;
  } | null;
  assignees_data?: Array<{
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    type?: string;
    user_view_type?: string;
    node_id?: string;
    gists_url?: string;
    repos_url?: string;
    events_url?: string;
    site_admin?: boolean;
    gravatar_id?: string;
    starred_url?: string;
    followers_url?: string;
    following_url?: string;
    organizations_url?: string;
    subscriptions_url?: string;
    received_events_url?: string;
  }>;
  labels_data?: Array<{
    id: number;
    name: string;
    color: string;
    description?: string;
    default?: boolean;
    node_id?: string;
    url?: string;
  }>;
  milestone_data?: {
    id: number;
    title: string;
    description?: string;
    state: string;
  } | null;
  pull_request_data?: any | null;
  repository_owner?: string;
  repository_name?: string;
  url?: string;
  html_url?: string;
  created_at?: number;
  updated_at?: number;
  closed_at?: number | null;
  __typename?: string;
  [key: string]: any;
}

// Function to extract issue references from body text and relations
function extractIssueReferences(body: string | null, relations: any = {}): { issueNumbers: number[], relationTypes: { [issueNumber: number]: string[] } } {
  const issueNumbers: number[] = [];
  const relationTypes: { [issueNumber: number]: string[] } = {};
  
  if (!body) return { issueNumbers, relationTypes };

  // Match patterns like #123, #456 in body text
  const issuePattern = /#(\d+)/g;
  let match;

  while ((match = issuePattern.exec(body)) !== null) {
    const issueNumber = parseInt(match[1], 10);
    issueNumbers.push(issueNumber);
    if (!relationTypes[issueNumber]) relationTypes[issueNumber] = [];
    relationTypes[issueNumber].push('mentioned');
  }

  // Extract issue references from all relation types
  Object.entries(relations).forEach(([relationType, relationIds]: [string, any]) => {
    if (Array.isArray(relationIds)) {
      relationIds.forEach((id: string) => {
        if (typeof id === 'string' && id.startsWith('issue:')) {
          const issueNumber = parseInt(id.split(':')[1], 10);
          if (!isNaN(issueNumber)) {
            if (!issueNumbers.includes(issueNumber)) {
              issueNumbers.push(issueNumber);
            }
            if (!relationTypes[issueNumber]) relationTypes[issueNumber] = [];
            relationTypes[issueNumber].push(relationType);
          }
        }
      });
    }
  });

  return { 
    issueNumbers: [...new Set(issueNumbers)], // Remove duplicates
    relationTypes 
  };
}

function IssueButton({ data, ...props }: {
  data: GitHubIssueData;
  [key: string]: any;
}) {
  const issueData = data;
  const tActions = useTranslations('actions');
  const tSuccess = useTranslations('success');
  const tErrors = useTranslations('errors');
  const tCommon = useTranslations('common');

  const displayTitle = issueData?.title || `Issue #${issueData?.number}`;
  const stateColor = issueData?.state === 'open' ? 'bg-green-500' : 'bg-red-500';

  return (
    <UIButton
      variant="outline"
      className="h-auto p-2 justify-start gap-2 min-w-0"
      {...props}
    >
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${stateColor}`} />
      <span className="truncate text-xs">#{issueData?.number} {displayTitle}</span>
    </UIButton>
  );
}

export function Card({ data, onClose, ...props }: {
  data: GitHubIssueData;
  onClose?: () => void;
  [key: string]: any;
}) {
  const issueData = data;
  const tActions = useTranslations('actions');
  const tSuccess = useTranslations('success');
  const tErrors = useTranslations('errors');
  const tCommon = useTranslations('common');
  const { startDrawing, onDrawingComplete, currentRelationType } = useDependencyDrawingStore();
  const graphContext = useGraph();
  const toggleDrawMode = graphContext?.toggleDrawMode;
  const hasyx = useHasyx();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState<string>(issueData.title || "");
  const [editBody, setEditBody] = useState<string>(issueData.body || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditOpen) {
      setEditTitle(issueData.title || "");
      setEditBody(issueData.body || "");
    }
  }, [isEditOpen, issueData.title, issueData.body]);

  const isPR = !!issueData.pull_request_data;
  
  const handleStartDrawing = useCallback((relationType: string) => {
    // Активируем режим рисования
    toggleDrawMode?.();
    
    startDrawing(relationType, hasyx, async (sourceIssueData, targetIssueData, relationType, hasyx) => {
      await updateIssueRelations(sourceIssueData, targetIssueData, relationType, hasyx);
    });
  }, [startDrawing, toggleDrawMode, hasyx]);

  return (
    <div className="relative group pointer-events-none">
      {/* Labels zone above card - always present with minimum height */}
      <div className="min-h-[2em] p-3 relative">
        {/* Dotted texture background for grab hint */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none rounded-xl"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px),
              radial-gradient(circle at 5px 5px, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '6px 6px',
            backgroundPosition: '0 0, 2px 2px',
            height: '150%',
          }}
        />
        
        {/* Labels container */}
        {issueData.labels_data && issueData.labels_data.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap relative z-10">
            {issueData.labels_data.map((label) => (
              <Badge
                key={label.id}
                variant="outline"
                className="text-xs pointer-events-auto"
                style={{
                  backgroundColor: `#${label.color}20`,
                  borderColor: `#${label.color}`,
                  color: `#${label.color}`
                }}
              >
                {label.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <UICard className="w-80 relative gap-1 z-1 pointer-events-auto" {...props}>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2 min-w-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${issueData.state === 'open' ? 'bg-green-500' : 'bg-red-500'}`}>
                {issueData.assignees_data && issueData.assignees_data.length > 0 && (
                  <div className="absolute left-0 top-5 flex flex-col gap-1 z-10 -ml-4">
                    {issueData.assignees_data.map((assignee, index) => (
                      <Tooltip key={assignee.id}>
                        <TooltipTrigger asChild>
                          <Avatar className="w-8 h-8 border-2 border-white shadow-sm cursor-pointer">
                            <AvatarImage src={assignee.avatar_url} />
                            <AvatarFallback className="text-xs">
                              {assignee.login.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                          <p>{assignee.login}</p>
                          {issueData.author_association && <p className="text-muted-foreground">{issueData.author_association}</p>}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>
              {issueData.html_url ? (
                <a
                  href={issueData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:underline hover:text-white transition-colors"
                >
                  {issueData.title}
                </a>
              ) : (
                <CardTitle className="text-sm">
                  {issueData.title}
                </CardTitle>
              )}
            </div>
            {onClose && (
              <UIButton variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
                <X className="w-4 h-4" />
              </UIButton>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Body preview - limited to 3 lines */}
          {issueData.body && (
            <div className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {parseIssue(issueData.body).content}
            </div>
          )}
        </CardContent>
      </UICard>
      <div className="absolute group-hover:top-[100%] top-[50%] z-0 transition-all delay-500 left-0 w-full px-2 pt-1 flex justify-between">
        {/* Dependency buttons */}
        <div className="flex gap-1 pointer-events-auto">
          <UIButton 
            variant="ghost" 
            size="sm" 
            onClick={() => handleStartDrawing('contains')}
            className={cn(
              onDrawingComplete && "bg-blue-500 text-white"
            )}
          >
            <Link className="w-3 h-3" />
          </UIButton>
          <UIButton 
            variant="ghost" 
            size="sm" 
            onClick={() => handleStartDrawing('requires')}
            className={cn(
              onDrawingComplete && "bg-orange-500 text-white"
            )}
          >
            <ArrowRight className="w-3 h-3" />
          </UIButton>
          <UIButton 
            variant="ghost" 
            size="sm" 
            onClick={() => handleStartDrawing('related')}
            className={cn(
              onDrawingComplete && "bg-green-500 text-white"
            )}
          >
            <GitBranch className="w-3 h-3" />
          </UIButton>
        </div>
        
        {/* Comments button in bottom right corner */}
        <div className="flex gap-1 pointer-events-auto">
          <UIButton
            variant="ghost"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="text-xs"
          >
            <Pencil className="w-3 h-3 mr-1" />
            {tActions('edit')}
          </UIButton>
          {issueData.comments_count !== undefined && (
            <UIButton
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              {issueData.comments_count}
            </UIButton>
          )}
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{tActions('edit')} Issue</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Title</label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <MarkdownEditor value={editBody} onChange={setEditBody} minHeight={220} />
            </div>
          </div>
          <DialogFooter>
            <UIButton variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>{tActions('cancel')}</UIButton>
            <UIButton
              onClick={async () => {
                if (!issueData.id) return;
                setIsSaving(true);
                try {
                  await hasyx.update({
                    table: 'github_issues',
                    where: { id: { _eq: issueData.id } },
                    _set: { title: editTitle, body: editBody, updated_at: Date.now() },
                    returning: ['id'],
                  });
                  toast.success(tSuccess('issueUpdated'));
                  setIsEditOpen(false);
                } catch (e: any) {
                  toast.error(e?.message || tErrors('updateFailed'));
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving || !editTitle?.trim()}
            >
              {isSaving ? tCommon('saving') : tActions('save')}
            </UIButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CytoNode({ data, availableIssues, ...props }: {
  data: GitHubIssueData;
  availableIssues?: GitHubIssueData[]; // Optional list of available issues for edge creation
  [key: string]: any;
}) {
  const title = data?.title || `Issue #${data?.number}`;
  const stateColor = data?.state === 'open' ? '#22c55e' : '#ef4444';
  const isPR = !!data?.pull_request_data;

  // Parse issue body and extract relations
  const { content, relations } = useMemo(() => {
    return parseIssue(data?.body || '');
  }, [data?.body]);

  // Extract issue references from body and relations for creating edges
  const { issueNumbers, relationTypes } = useMemo(() => {
    return extractIssueReferences(content, relations);
  }, [content, relations]);

  // Generate edges to referenced issues (only to those that exist in availableIssues)
  const edges = useMemo(() => {
    if (!issueNumbers.length || !availableIssues) {
      return [];
    }

    // Create a map of issue numbers to github_ids for quick lookup
    const issueNumberToGithubId = new Map();
    availableIssues.forEach(issue => {
      if (issue.number && issue.github_id) {
        issueNumberToGithubId.set(issue.number, issue.github_id);
      }
    });

    const filteredIssues = issueNumbers.filter(issueNumber => issueNumberToGithubId.has(issueNumber));

    return filteredIssues
      .map((issueNumber) => {
        const targetGithubId = issueNumberToGithubId.get(issueNumber);
        const relationTypesForIssue = relationTypes[issueNumber] || [];
        
        // Create only one edge per issue
        const edgeId = `edge-github_issue${data.github_id}-github_issue${targetGithubId}`;
        
        // Use the first relation type as primary, or 'related' if none
        const primaryRelationType = relationTypesForIssue.length > 0 ? relationTypesForIssue[0] : 'related';
        
        return {
          id: edgeId,
          source: `github_issue${data.github_id}`,
          target: `github_issue${targetGithubId}`,
          relationType: primaryRelationType,
          classes: [primaryRelationType]
        };
      });
  }, [issueNumbers, relationTypes, data.github_id, availableIssues]);

  return (
    <>
      {/* Single node with GitHub ID as main ID */}
      <CytoNodeComponent {...props}
        element={{
          id: `github_issue${data.github_id}`, // Use GitHub ID as main node ID
          data: {
            id: `github_issue${data.github_id}`,
            label: `#${data.number}`,
            title: title,
            state: data.state,
            isPR: isPR,
            github_id: data.github_id,
            database_id: data.id, // Keep database ID for reference
          },
          ...props?.element,
          classes: cn(
            'entity',
            'github-issue',
            // data.state,
            { 'pull-request': isPR },
            props.classes,
          )
        }}
        // Always visible children (not optionally opened like users)
        children={<Card data={data} />}
      />
      
      {/* Render edges to referenced issues */}
      {edges.map((edge) => (
        <CytoEdge
          key={edge.id}
          element={{
            id: edge.id,
            data: {
              id: edge.id,
              source: edge.source,
              target: edge.target,
              relationType: edge.relationType,
            },
            classes: edge.classes,
          }}
        />
      ))}
    </>
  );
}