'use client';

"use client";

import React from 'react';
import { Button as UIButton } from '@/components/ui/button';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CytoNode as CytoNodeComponent } from '@/lib/cyto';
import { X, Github, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GitHubIssueData {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  user: string | null;
  assignees: string[];
  labels: string[];
  created_at: number;
  updated_at: number;
  closed_at: number | null;
  html_url: string;
  comments: number;
  locked: boolean;
  draft: boolean;
  __typename?: string;
  [key: string]: any;
}

function getStateColor(state: string) {
  return state === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function Button({ data, ...props }: {
  data: GitHubIssueData;
  [key: string]: any;
}) {
  const issueData = typeof data === 'object' ? data : null;
  const issueId = typeof data === 'string' ? data : data?.id;
  
  if (!issueData) {
    return (
      <UIButton
        variant="outline"
        className="h-auto p-2 justify-start gap-2 min-w-0"
        {...props}
      >
        <Github className="w-4 h-4 flex-shrink-0" />
        <span className="truncate text-xs">Issue {issueId}</span>
      </UIButton>
    );
  }

  const displayName = `#${issueData.number} ${issueData.title}`;

  return (
    <UIButton
      variant="outline"
      className="h-auto p-2 justify-start gap-2 min-w-0"
      {...props}
    >
      <Github className="w-4 h-4 flex-shrink-0" />
      <div className="flex flex-col items-start min-w-0 flex-1">
        <span className="truncate text-xs font-medium">{displayName}</span>
        <div className="flex items-center gap-1">
          <Badge className={cn("text-xs", getStateColor(issueData.state))}>
            {issueData.state}
          </Badge>
          {issueData.comments > 0 && (
            <span className="text-xs text-muted-foreground">
              {issueData.comments} comments
            </span>
          )}
        </div>
      </div>
    </UIButton>
  );
}

export function Card({ data, onClose, ...props }: {
  data: GitHubIssueData;
  onClose?: () => void;
  [key: string]: any;
}) {
  const issueData = typeof data === 'object' ? data : null;
  
  if (!issueData && typeof data === 'string') {
    return (
      <UICard className="w-80" {...props}>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            Issue ID: {data}
            <br />
            <span className="text-xs">No additional data available</span>
          </div>
        </CardContent>
      </UICard>
    );
  }

  return (
    <UICard className="w-80" {...props}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-full">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base">Issue #{issueData?.number}</CardTitle>
              <p className="text-sm text-muted-foreground">GitHub Issue</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {issueData?.html_url && (
              <UIButton
                variant="ghost"
                size="sm"
                onClick={() => window.open(issueData.html_url, '_blank')}
                className="h-6 w-6 p-0"
              >
                <ExternalLink className="h-4 w-4" />
              </UIButton>
            )}
            {onClose && (
              <UIButton
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </UIButton>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Title */}
          <div>
            <h3 className="font-medium text-sm mb-1">{issueData?.title}</h3>
          </div>
          
          {/* Status badges */}
          <div className="flex flex-wrap items-center gap-1">
            <Badge className={getStateColor(issueData?.state || 'unknown')}>
              {issueData?.state}
            </Badge>
            {issueData?.locked && (
              <Badge variant="secondary" className="text-xs">Locked</Badge>
            )}
            {issueData?.draft && (
              <Badge variant="outline" className="text-xs">Draft</Badge>
            )}
          </div>
          
          {/* Description */}
          {issueData?.body && (
            <div className="text-xs text-muted-foreground line-clamp-3">
              {issueData.body}
            </div>
          )}
          
          {/* Metadata */}
          <div className="space-y-1 text-xs text-muted-foreground">
            {issueData?.user && (
              <div>Opened by {issueData.user}</div>
            )}
            <div>Created: {formatDate(issueData?.created_at || 0)}</div>
            {issueData?.updated_at && issueData.updated_at !== issueData.created_at && (
              <div>Updated: {formatDate(issueData.updated_at)}</div>
            )}
            {issueData?.closed_at && (
              <div>Closed: {formatDate(issueData.closed_at)}</div>
            )}
            {issueData?.comments && issueData.comments > 0 && (
              <div>{issueData.comments} comments</div>
            )}
          </div>
          
          {/* Labels */}
          {issueData?.labels && issueData.labels.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-1">Labels:</div>
              <div className="flex flex-wrap gap-1">
                {issueData.labels.map((label) => (
                  <Badge key={label} variant="outline" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Assignees */}
          {issueData?.assignees && issueData.assignees.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-1">Assignees:</div>
              <div className="flex flex-wrap gap-1">
                {issueData.assignees.map((assignee) => (
                  <Badge key={assignee} variant="secondary" className="text-xs">
                    {assignee}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </UICard>
  );
}

export function CytoNode({ data, ...props }: {
  data: GitHubIssueData;
  [key: string]: any;
}) {
  const issueData = typeof data === 'object' ? data : null;
  const label = issueData ? `#${issueData.number} ${issueData.title}` : data?.id || 'Issue';
  
  return <CytoNodeComponent {...props} element={{
    id: data.id,
    data: {
      id: data.id,
      label: label,
    },
    ...props?.element,
    classes: cn('github-issue', props.classes)
  }} />;
}
