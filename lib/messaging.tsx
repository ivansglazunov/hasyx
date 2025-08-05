"use client"

import Debug from './debug';
import { useSession } from 'hasyx';
import { SidebarLayout } from 'hasyx/components/sidebar/layout';
import { MessagingClient } from './messaging-client';

const debug = Debug('messaging');

interface MessagingProps {
  serverSession?: any;
  sidebarData?: any;
}

export default function Messaging({ serverSession, sidebarData }: MessagingProps) {
  const { data: session } = useSession();

  debug('🔧 Rendering Messaging component', { session, serverSession });

  return (
    <SidebarLayout 
      sidebarData={sidebarData}
    >
      <MessagingClient />
    </SidebarLayout>
  );
} 