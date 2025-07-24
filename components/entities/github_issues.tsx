"use client";

import React, { useMemo } from 'react';
import { useQuery } from 'hasyx';
import { Button as UIButton } from 'hasyx/components/ui/button';
import { Card as UICard, CardContent, CardHeader, CardTitle } from 'hasyx/components/ui/card';
import { Badge } from 'hasyx/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from 'hasyx/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'hasyx/components/ui/tooltip';
import { X, GitBranch, MessageCircle, Calendar, User, Tag, ExternalLink } from 'lucide-react';
import { CytoNode as CytoNodeComponent, CytoEdge } from 'hasyx/lib/cyto';
import { cn } from 'hasyx/lib/utils';

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

// Function to extract issue references from body text
function extractIssueReferences(body: string | null): number[] {
  if (!body) return [];

  // Match patterns like #123, #456
  const issuePattern = /#(\d+)/g;
  const matches: any = [];
  let match;

  while ((match = issuePattern.exec(body)) !== null) {
    matches.push(parseInt(match[1], 10));
  }

  return matches;
}

export function Button({ data, ...props }: {
  data: GitHubIssueData;
  [key: string]: any;
}) {
  const issueData = data;

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

  const isPR = !!issueData.pull_request_data;

  return (
    <div className="relative group pointer-events-none">
      {/* Labels above card */}
      {issueData.labels_data && issueData.labels_data.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap pb-3">
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
              {issueData.body}
            </div>
          )}
        </CardContent>
      </UICard>
      <div className="absolute group-hover:top-[100%] top-[50%] z-0 transition-all delay-500 left-0 w-full px-2 pt-1 flex justify-end">
        {/* Comments button in bottom right corner */}
        {issueData.comments_count !== undefined && (
          <UIButton
            variant="ghost"
            className="text-xs pointer-events-auto"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            {issueData.comments_count}
          </UIButton>
        )}
      </div>
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

  // Extract issue references from body for creating edges
  const referencedIssues = useMemo(() => {
    return extractIssueReferences(data?.body || '');
  }, [data?.body]);

  // Generate edges to referenced issues (only to those that exist in availableIssues)
  const edges = useMemo(() => {
    if (!referencedIssues.length || !availableIssues) return [];

    // Create a map of issue numbers to github_ids for quick lookup
    const issueNumberToGithubId = new Map();
    availableIssues.forEach(issue => {
      if (issue.number && issue.github_id) {
        issueNumberToGithubId.set(issue.number, issue.github_id);
      }
    });

    return referencedIssues
      .filter(issueNumber => issueNumberToGithubId.has(issueNumber)) // Only create edges to existing issues
      .map((issueNumber) => {
        const targetGithubId = issueNumberToGithubId.get(issueNumber);
        return (
          <CytoEdge
            key={`edge-github_issue${data.github_id}-github_issue${targetGithubId}`}
            element={{
              id: `edge-github_issue${data.github_id}-github_issue${targetGithubId}`,
              data: {
                id: `edge-github_issue${data.github_id}-github_issue${targetGithubId}`,
                source: `github_issue${data.github_id}`,
                target: `github_issue${targetGithubId}`,
              },
            }}
          />
        );
      });
  }, [referencedIssues, data.github_id, availableIssues]);

  return (
    <>
      <CytoNodeComponent {...props}
        element={{
          id: `github_issue${data.github_id}`, // Use numeric github_id as specified
          data: {
            id: `github_issue${data.github_id}`,
            label: `#${data.number}`,
            title: title,
            state: data.state,
            isPR: isPR,
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
      {edges}
    </>
  );
}
