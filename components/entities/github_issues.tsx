'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, ExternalLink, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface GitHubIssue {
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
}

interface CreateIssueForm {
  title: string;
  body: string;
  labels: string[];
}

export function GitHubIssues() {
  const { data: session } = useSession();
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateIssueForm>({
    title: '',
    body: '',
    labels: []
  });

  // Fetch issues
  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/github/issues', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }
      
      const data = await response.json();
      if (data.success) {
        // Fetch issues from database
        const issuesResponse = await fetch('/api/github/issues', {
          method: 'GET'
        });
        
        if (issuesResponse.ok) {
          const issuesData = await issuesResponse.json();
          setIssues(issuesData.issues || []);
        }
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast.error('Failed to fetch GitHub issues');
    } finally {
      setLoading(false);
    }
  };

  const createIssue = async () => {
    if (!formData.title.trim()) {
      toast.error('Issue title is required');
      return;
    }

    try {
      setCreating(true);
      const response = await fetch('/api/github/issues', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`Issue #${data.issue.number} created successfully`);
        
        // Reset form and hide it
        setFormData({ title: '', body: '', labels: [] });
        setShowCreateForm(false);
        
        // Refresh issues list
        await fetchIssues();
      } else {
        throw new Error(data.error || 'Failed to create issue');
      }
    } catch (error) {
      console.error('Error creating issue:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create issue');
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStateColor = (state: string) => {
    return state === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading GitHub issues...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">GitHub Issues</h2>
          <p className="text-muted-foreground">
            Manage issues for the repository
          </p>
        </div>
        
        {session?.user && (
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Issue
          </Button>
        )}
      </div>

      {/* Create Issue Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Issue</CardTitle>
            <CardDescription>
              Create a new issue in the GitHub repository
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title *
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Issue title"
                disabled={creating}
              />
            </div>
            
            <div>
              <label htmlFor="body" className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Describe the issue..."
                rows={4}
                disabled={creating}
              />
            </div>
            
            <div>
              <label htmlFor="labels" className="block text-sm font-medium mb-2">
                Labels (comma-separated)
              </label>
              <Input
                id="labels"
                value={formData.labels.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  labels: e.target.value.split(',').map(l => l.trim()).filter(Boolean)
                })}
                placeholder="bug, enhancement, help wanted"
                disabled={creating}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={createIssue}
                disabled={creating || !formData.title.trim()}
                className="flex items-center gap-2"
              >
                {creating && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Issue
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ title: '', body: '', labels: [] });
                }}
                disabled={creating}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues List */}
      <div className="space-y-4">
        {issues.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No issues found</p>
            </CardContent>
          </Card>
        ) : (
          issues.map((issue) => (
            <Card key={issue.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStateColor(issue.state)}>
                        {issue.state}
                      </Badge>
                      {issue.locked && (
                        <Badge variant="secondary">Locked</Badge>
                      )}
                      {issue.draft && (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">
                      #{issue.number} {issue.title}
                    </h3>
                    
                    {issue.body && (
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {issue.body}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Opened by {issue.user || 'Unknown'}</span>
                      <span>•</span>
                      <span>{formatDate(issue.created_at)}</span>
                      {issue.comments > 0 && (
                        <>
                          <span>•</span>
                          <span>{issue.comments} comments</span>
                        </>
                      )}
                    </div>
                    
                    {issue.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {issue.labels.map((label) => (
                          <Badge key={label} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(issue.html_url, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
