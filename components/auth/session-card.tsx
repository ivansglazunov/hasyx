'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "hasyx/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "hasyx/components/ui/card";
import { CodeBlock } from 'hasyx/components/code-block';
import { GetAuthStatus } from "./get-auth-status";
import { SocketAuthStatus } from "./socket-auth-status";
import { Session } from "next-auth";
import React from "react";
import { useHasyx } from "hasyx";
import { useTranslations } from 'hasyx';

interface SessionCardProps {
  serverSession: Session | null;
}

function HasyxSessionTab() {
  const hasyx = useHasyx();
  const tSess = useTranslations('session');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{tSess('hasyx.title')}</CardTitle>
        <CardDescription>{tSess('hasyx.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">{tSess('hasyx.userId')}</p>
            <CodeBlock value={hasyx.userId || 'null'} />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">{tSess('hasyx.user')}</p>
            <CodeBlock value={JSON.stringify(hasyx.user, null, 2)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SessionCard({ serverSession }: SessionCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const tSess = useTranslations('session');
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tSess('title')}</CardTitle>
        <CardDescription>{tSess('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ssr">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ssr">{tSess('tabs.ssr')}</TabsTrigger>
            <TabsTrigger value="get">{tSess('tabs.get')}</TabsTrigger>
            <TabsTrigger value="socket">{tSess('tabs.socket')}</TabsTrigger>
            <TabsTrigger value="hasyx">{tSess('tabs.hasyx')}</TabsTrigger>
          </TabsList>
          <TabsContent value="ssr" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{tSess('ssr.title')}</CardTitle>
                <CardDescription>{tSess('ssr.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                {serverSession ? (
                  <CodeBlock value={JSON.stringify(serverSession, null, 2)} />
                ) : (
                  <p>{tSess('ssr.empty')}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="get" className="mt-4">
            {/* Mount GetAuthStatus only when tab is active */}
            <GetAuthStatus />
          </TabsContent>
          <TabsContent value="socket" className="mt-4">
             {/* Mount SocketAuthStatus only when tab is active */}
            <SocketAuthStatus />
          </TabsContent>
          <TabsContent value="hasyx" className="mt-4">
            {/* Mount HasyxSessionTab only when tab is active */}
            <HasyxSessionTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 