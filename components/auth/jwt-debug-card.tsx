'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "hasyx/components/ui/card";
import { Button } from "hasyx/components/ui/button";
import { Input } from "hasyx/components/ui/input";
import { Label } from "hasyx/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "hasyx/components/ui/tabs";
import { CodeBlock } from 'hasyx/components/code-block';
import { toast } from "sonner";
import { useTranslations } from 'hasyx';
import { useJwt } from "hasyx/components/jwt-auth";
import { useState, useEffect } from "react";
import { useHasyx , useSession } from "hasyx";

export function JwtDebugCard() {
  const hasyx = useHasyx();
  const { data: session } = useSession();
  const jwtClient = useJwt();
  const tJwt = useTranslations('jwt');
  const tCommon = useTranslations('common');
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
      toast.error(tJwt('enterToken'));
      return;
    }

    try {
      // Save JWT to localStorage
      localStorage.setItem('nextauth_jwt', jwtInput.trim());
      setCurrentJwt(jwtInput.trim());
      toast.success(tJwt('tokenSaved'));
      setJwtInput('');
    } catch (error) {
      toast.error(tJwt('errorSaving'));
    }
  };

  // Handle JWT copy
  const handleCopyJwt = async () => {
    if (!session) {
      toast.error(tJwt('needAuth'));
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
        throw new Error(tJwt('failedGet'));
      }

      const data = await response.json();
      
      if (data.jwt) {
        await navigator.clipboard.writeText(data.jwt);
        toast.success(tJwt('copied'));
      } else {
        toast.error(tJwt('failedGet'));
      }
    } catch (error) {
      toast.error(tJwt('errorGetting'));
    } finally {
      setCopyLoading(false);
    }
  };

  // Handle JWT clear
  const handleClearJwt = () => {
    localStorage.removeItem('nextauth_jwt');
    setCurrentJwt(null);
    toast.success(tJwt('removed'));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tJwt('title')}</CardTitle>
        <CardDescription>{tJwt('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">{tJwt('tabs.login')}</TabsTrigger>
            <TabsTrigger value="generate">{tJwt('tabs.generate')}</TabsTrigger>
            <TabsTrigger value="current">{tJwt('tabs.current')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="jwt-input">{tJwt('jwtToken')}</Label>
                <Input
                  id="jwt-input"
                  type="text"
                  placeholder={tJwt('placeholder')}
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
                {isLoading ? tJwt('loggingIn') : tJwt('loginWithJwt')}
              </Button>
              <p className="text-sm text-muted-foreground">
                {tJwt('enterJwtToLogin')}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="generate" className="mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">{tJwt('authStatus')}</p>
                <CodeBlock value={session ? tJwt('authenticated') : tJwt('notAuthenticated')} />
              </div>
              {session && (
                <div>
                  <p className="text-sm font-medium mb-2">{tJwt('user')}</p>
                  <CodeBlock value={session.user?.email || tJwt('notSpecified')} />
                </div>
              )}
              <Button 
                onClick={handleCopyJwt}
                disabled={copyLoading || !session}
                className="w-full"
              >
                {copyLoading ? tJwt('generating') : tJwt('copyJwt')}
              </Button>
              <p className="text-sm text-muted-foreground">
                {tJwt('copyDescription')}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="current" className="mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">{tJwt('jwtLocalStorage')}</p>
                <CodeBlock value={currentJwt || tJwt('notFound')} />
              </div>
              {currentJwt && (
                <Button 
                  onClick={handleClearJwt}
                  variant="destructive"
                  className="w-full"
                >
                  {tJwt('clearJwt')}
                </Button>
              )}
              <p className="text-sm text-muted-foreground">
                {tJwt('updatedAutomatically')}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 