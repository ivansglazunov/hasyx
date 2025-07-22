'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "hasyx/components/ui/card";
import { Button } from "hasyx/components/ui/button";
import { Input } from "hasyx/components/ui/input";
import { Label } from "hasyx/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "hasyx/components/ui/tabs";
import { CodeBlock } from 'hasyx/components/code-block';
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useJwt } from "hasyx/components/jwt-auth";
import { useState, useEffect } from "react";

export function JwtDebugCard() {
  const { data: session } = useSession();
  const jwtClient = useJwt();
  const [jwtInput, setJwtInput] = useState('');
  const [currentJwt, setCurrentJwt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);

  // Check current JWT in localStorage
  useEffect(() => {
    const checkJwt = () => {
      if (typeof window !== 'undefined') {
        const jwt = localStorage.getItem('nextauth_jwt');
        setCurrentJwt(jwt);
      }
    };
    
    checkJwt();
    
    // Listen for storage changes
    const handleStorageChange = () => checkJwt();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle JWT login
  const handleJwtLogin = () => {
    if (!jwtInput.trim()) {
      toast.error("Please enter JWT token");
      return;
    }

    try {
      // Save JWT to localStorage
      localStorage.setItem('nextauth_jwt', jwtInput.trim());
      setCurrentJwt(jwtInput.trim());
      toast.success("JWT token saved to localStorage");
      setJwtInput('');
    } catch (error) {
      toast.error("Error saving JWT token");
    }
  };

  // Handle JWT copy
  const handleCopyJwt = async () => {
    if (!session) {
      toast.error("You need to be authenticated to get JWT token");
      return;
    }

    setCopyLoading(true);
    try {
      const response = await fetch('/api/auth/get-jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get JWT token');
      }

      const data = await response.json();
      
      if (data.jwt) {
        await navigator.clipboard.writeText(data.jwt);
        toast.success("JWT token copied to clipboard");
      } else {
        toast.error("Failed to get JWT token");
      }
    } catch (error) {
      toast.error("Error getting JWT token");
    } finally {
      setCopyLoading(false);
    }
  };

  // Handle JWT clear
  const handleClearJwt = () => {
    localStorage.removeItem('nextauth_jwt');
    setCurrentJwt(null);
    toast.success("JWT token removed from localStorage");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>JWT Debug</CardTitle>
        <CardDescription>Tools for working with JWT authentication</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="current">Current</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="jwt-input">JWT Token</Label>
                <Input
                  id="jwt-input"
                  type="text"
                  placeholder="Enter JWT token..."
                  value={jwtInput}
                  onChange={(e) => setJwtInput(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button 
                onClick={handleJwtLogin}
                disabled={isLoading || !jwtInput.trim()}
                className="w-full"
              >
                {isLoading ? 'Logging in...' : 'Login with JWT'}
              </Button>
              <p className="text-sm text-muted-foreground">
                Enter JWT token to login. Token will be saved to localStorage.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="generate" className="mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Authorization status:</p>
                <CodeBlock value={session ? 'Authenticated' : 'Not authenticated'} />
              </div>
              {session && (
                <div>
                  <p className="text-sm font-medium mb-2">User:</p>
                  <CodeBlock value={session.user?.email || 'Not specified'} />
                </div>
              )}
              <Button 
                onClick={handleCopyJwt}
                disabled={copyLoading || !session}
                className="w-full"
              >
                {copyLoading ? 'Generating...' : 'Copy JWT to clipboard'}
              </Button>
              <p className="text-sm text-muted-foreground">
                Creates JWT token for current authenticated user and copies it to clipboard.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="current" className="mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">JWT in localStorage:</p>
                <CodeBlock value={currentJwt || 'Not found'} />
              </div>
              {currentJwt && (
                <Button 
                  onClick={handleClearJwt}
                  variant="destructive"
                  className="w-full"
                >
                  Clear JWT
                </Button>
              )}
              <p className="text-sm text-muted-foreground">
                Current JWT token in localStorage. Updates automatically.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 