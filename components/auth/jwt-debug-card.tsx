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
  const t = useTranslations();
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
      toast.error(t('jwt.enterToken'));
      return;
    }

    try {
      // Save JWT to localStorage
      localStorage.setItem('nextauth_jwt', jwtInput.trim());
      setCurrentJwt(jwtInput.trim());
      toast.success(t('jwt.tokenSaved'));
      setJwtInput('');
    } catch (error) {
      toast.error(t('jwt.errorSaving'));
    }
  };

  // Handle JWT copy
  const handleCopyJwt = async () => {
    if (!session) {
      toast.error(t('jwt.needAuth'));
      return;
    }

    setCopyLoading(true);
    try {
      const token = await hasyx.jwt();
      
      if (token) {
        await navigator.clipboard.writeText(token);
        toast.success(t('jwt.copied'));
      } else {
        toast.error(t('jwt.failedGet'));
      }
    } catch (error) {
      toast.error(t('jwt.errorGetting'));
    } finally {
      setCopyLoading(false);
    }
  };

  // Handle JWT clear
  const handleClearJwt = () => {
    localStorage.removeItem('nextauth_jwt');
    setCurrentJwt(null);
    toast.success(t('jwt.removed'));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('jwt.title')}</CardTitle>
        <CardDescription>{t('jwt.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">{t('jwt.tabs.login')}</TabsTrigger>
            <TabsTrigger value="generate">{t('jwt.tabs.generate')}</TabsTrigger>
            <TabsTrigger value="current">{t('jwt.tabs.current')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="jwt-input">{t('jwt.jwtToken')}</Label>
                <Input
                  id="jwt-input"
                  type="text"
                  placeholder={t('jwt.placeholder')}
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
                {isLoading ? t('jwt.loggingIn') : t('jwt.loginWithJwt')}
              </Button>
              <p className="text-sm text-muted-foreground">
                {t('jwt.enterJwtToLogin')}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="generate" className="mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">{t('jwt.authStatus')}</p>
                <CodeBlock value={session ? t('jwt.authenticated') : t('jwt.notAuthenticated')} />
              </div>
              {session && (
                <div>
                  <p className="text-sm font-medium mb-2">{t('jwt.user')}</p>
                  <CodeBlock value={session.user?.email || t('jwt.notSpecified')} />
                </div>
              )}
              <Button 
                onClick={handleCopyJwt}
                disabled={copyLoading || !session}
                className="w-full"
              >
                {copyLoading ? t('jwt.generating') : t('jwt.copyJwt')}
              </Button>
              <p className="text-sm text-muted-foreground">
                {t('jwt.copyDescription')}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="current" className="mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">{t('jwt.jwtLocalStorage')}</p>
                <CodeBlock value={currentJwt || t('jwt.notFound')} />
              </div>
              {currentJwt && (
                <Button 
                  onClick={handleClearJwt}
                  variant="destructive"
                  className="w-full"
                >
                  {t('jwt.clearJwt')}
                </Button>
              )}
              <p className="text-sm text-muted-foreground">
                {t('jwt.updatedAutomatically')}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 