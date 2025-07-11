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
      toast.error("Введите JWT токен");
      return;
    }

    try {
      // Save JWT to localStorage
      localStorage.setItem('nextauth_jwt', jwtInput.trim());
      setCurrentJwt(jwtInput.trim());
      toast.success("JWT токен сохранен в localStorage");
      setJwtInput('');
    } catch (error) {
      toast.error("Ошибка при сохранении JWT токена");
    }
  };

  // Handle JWT copy
  const handleCopyJwt = async () => {
    if (!session) {
      toast.error("Для получения JWT токена нужно быть авторизованным");
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
        toast.success("JWT токен скопирован в буфер обмена");
      } else {
        toast.error("Не удалось получить JWT токен");
      }
    } catch (error) {
      toast.error("Ошибка при получении JWT токена");
    } finally {
      setCopyLoading(false);
    }
  };

  // Handle JWT clear
  const handleClearJwt = () => {
    localStorage.removeItem('nextauth_jwt');
    setCurrentJwt(null);
    toast.success("JWT токен удален из localStorage");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>JWT Debug</CardTitle>
        <CardDescription>Инструменты для работы с JWT авторизацией</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="generate">Генерация</TabsTrigger>
            <TabsTrigger value="current">Текущий</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="jwt-input">JWT Token</Label>
                <Input
                  id="jwt-input"
                  type="text"
                  placeholder="Введите JWT токен..."
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
                {isLoading ? 'Вход...' : 'Войти с JWT'}
              </Button>
              <p className="text-sm text-muted-foreground">
                Введите JWT токен для входа. Токен будет сохранен в localStorage.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="generate" className="mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Статус авторизации:</p>
                <CodeBlock value={session ? 'Авторизован' : 'Не авторизован'} />
              </div>
              {session && (
                <div>
                  <p className="text-sm font-medium mb-2">Пользователь:</p>
                  <CodeBlock value={session.user?.email || 'Не указан'} />
                </div>
              )}
              <Button 
                onClick={handleCopyJwt}
                disabled={copyLoading || !session}
                className="w-full"
              >
                {copyLoading ? 'Генерация...' : 'Скопировать JWT в буфер'}
              </Button>
              <p className="text-sm text-muted-foreground">
                Создает JWT токен для текущего авторизованного пользователя и копирует его в буфер обмена.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="current" className="mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">JWT в localStorage:</p>
                <CodeBlock value={currentJwt || 'Не найден'} />
              </div>
              {currentJwt && (
                <Button 
                  onClick={handleClearJwt}
                  variant="destructive"
                  className="w-full"
                >
                  Очистить JWT
                </Button>
              )}
              <p className="text-sm text-muted-foreground">
                Текущий JWT токен в localStorage. Обновляется автоматически.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 