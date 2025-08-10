"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import { useHasyx, useSubscription } from '../lib';
import { getDeviceInfo, NotificationPermission } from '@/lib/notify/notify';
import { getFirebaseConfig } from '@/lib/notify/notify-firebase';
import { useSession } from '../lib';
import { v4 as uuidv4 } from 'uuid';
import Debug from 'hasyx/lib/debug';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'hasyx/components/ui/card';
import { Button } from 'hasyx/components/ui/button';
import { Input } from 'hasyx/components/ui/input';
import { Textarea } from 'hasyx/components/ui/textarea';
import { Badge } from 'hasyx/components/ui/badge';
import { Skeleton } from 'hasyx/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from 'hasyx/components/ui/alert';
import { Ban, Bell, BellRing, Info, RefreshCw, X, CheckCircle, AlertCircle, AlertTriangle, MessageSquare, History } from 'lucide-react';
import { cn } from 'hasyx/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'hasyx/components/ui/tabs';
import { Checkbox } from 'hasyx/components/ui/checkbox';
import { Label } from 'hasyx/components/ui/label';
import { toast } from 'sonner';
import { useTranslations } from 'hasyx';

const debug = Debug('notify:component');

// Type for notification context data
interface NotificationContextType {
  isSupported: boolean; // Browser supports Notification API and Firebase is configured
  isFcmInitialized: boolean; // Firebase Messaging is initialized
  isEnabled: boolean; // User has granted permission in browser and we have a DB record
  permissionStatus: NotificationPermissionState; // 'default', 'granted', 'denied' (browser level)
  dbPermission: NotificationPermission | null; // Permission record from DB
  deviceToken: string | null; // Current FCM token
  requestPermission: () => Promise<boolean>;
  removePermission: () => Promise<boolean>; // Revokes browser permission & deletes DB record
  sendTestNotification: (title: string, body: string, data?: Record<string, any>) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

// Browser notification permission states
export type NotificationPermissionState = 'default' | 'granted' | 'denied';

// Create notification context
const NotificationContext = createContext<NotificationContextType>({
  isSupported: false,
  isFcmInitialized: false,
  isEnabled: false,
  permissionStatus: 'default',
  dbPermission: null,
  deviceToken: null,
  requestPermission: async () => false,
  removePermission: async () => false,
  sendTestNotification: async () => false,
  loading: true,
  error: null,
});

// Hook to use notification context
export const useNotify = () => useContext(NotificationContext);

// Notification context provider
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const hasyx = useHasyx();
  // Safer retrieval of userId, assuming id is added to the session
  const userId = hasyx?.userId;

  const [isSupported, setIsSupported] = useState<boolean>(false); // Browser support + Firebase config
  const [isFcmInitialized, setIsFcmInitialized] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionState>('default');
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [firebaseApp, setFirebaseApp] = useState<any | null>(null);
  const [firebaseMessaging, setFirebaseMessaging] = useState<any | null>(null); // Firebase Messaging instance
  const firebaseConfig = useMemo(() => getFirebaseConfig(), []);

  // Fetch existing permission from DB
  const { data: dbPermissionData, loading: dbPermissionLoading, error: dbPermissionError } = useSubscription<{ notification_permissions: NotificationPermission[] }>(
    { // Only subscribe if we have these
      table: 'notification_permissions',
      where: { user_id: { _eq: userId }, device_token: { _eq: deviceToken }, provider: { _eq: 'firebase' } },
      limit: 1, // Expect at most one permission for this user/device/token combo
      returning: ['id', 'user_id', 'provider', 'device_token', 'device_info', 'created_at', 'updated_at']
    }, // Pass null if not ready to subscribe
    { skip: !userId || !deviceToken || !isFcmInitialized }
  );

  const currentDbPermission = useMemo(() => {
    if (dbPermissionData?.notification_permissions && dbPermissionData.notification_permissions.length > 0) {
      return dbPermissionData.notification_permissions[0];
    }
    return null;
  }, [dbPermissionData]);

  useEffect(() => {
    if (dbPermissionError) {
      debug('Error subscribing to DB permission:', dbPermissionError);
      setError(prev => prev ? `${prev}\\nFailed to load DB permission: ${dbPermissionError.message}` : `Failed to load DB permission: ${dbPermissionError.message}`);
    }
  }, [dbPermissionError]);

  // Initialize Firebase and check for notification support
  useEffect(() => {
    async function initializeNotifications() {
      setLoading(true);
      try {
        // Check if notifications are supported in the browser
        if (typeof window !== 'undefined' && ('Notification' in window)) {
          debug('Browser Notification API supported.');

          // Check if Firebase is configured
          if (!firebaseConfig) {
            debug('Firebase is not configured in environment variables');
            setError("Firebase configuration is missing. Push notifications disabled.");
            setIsSupported(false);
            setLoading(false);
            return;
          }
          setIsSupported(true);

          // Dynamically import Firebase only on the client
          const { initializeApp: initApp, getApps: getAppsFn, deleteApp: deleteAppFn } = await import('firebase/app');
          const { getMessaging: getMsg, getToken: getTok, onMessage: onMsg, deleteToken: delTok, isSupported: isSupportedFcm } = await import('firebase/messaging');

          // Initialize Firebase
          let app: any;
          const apps = getAppsFn();
          if (apps.length > 0) {
            app = apps[0]!;
            debug('Using existing Firebase app.');
          } else {
            app = initApp(firebaseConfig);
            debug('Initialized new Firebase app.');
          }
          setFirebaseApp(app);

          if (await isSupportedFcm()) {
            const messaging = getMsg(app);
            setFirebaseMessaging(messaging);
            setIsFcmInitialized(true);
            debug('Firebase Messaging initialized.');

            // Set current browser permission status
            setPermissionStatus(Notification.permission as NotificationPermissionState);

            // If permission is already granted, get the device token
            if (Notification.permission === 'granted') {
              debug('Browser permission already granted, attempting to get token.');
              try {
                const currentToken = await getTok(messaging, { vapidKey: firebaseConfig.vapidKey });
                if (currentToken) {
                  debug('Device token received:', currentToken);
                  setDeviceToken(currentToken);
                } else {
                  debug('Failed to get device token (getToken returned null/undefined).');
                  // This can happen if service worker is not registered/active yet or other issues
                  setError("Could not retrieve notification token. Ensure service worker is active.");
                }
              } catch (tokenError: any) {
                debug('Error while getting device token:', tokenError);
                setError(`Failed to get device token: ${tokenError.message}`);
              }
            }

            // Setup incoming message handler when the app is in focus
            onMsg(messaging, (payload) => {
              debug('Message received in focus:', payload);
              // Can show a custom notification or update UI
              if (payload.notification) {
                // Example: Show a simple alert or use a custom in-app notification component
                alert(`In-app: ${payload.notification.title}\n${payload.notification.body}`);
              }
            });
          } else {
            debug('Firebase Cloud Messaging is not supported in this browser/environment (e.g., missing service worker).');
            setError("Push notifications (FCM) are not supported in this browser. Ensure a service worker is registered.");
            setIsFcmInitialized(false);
            setIsSupported(false); // If FCM not supported, overall support is off
          }
        } else {
          debug('Notifications are not supported in this browser (Notification API missing).');
          setIsSupported(false);
          setError("Browser does not support Notification API.");
        }
      } catch (err: any) {
        debug('Error initializing notifications:', err);
        setError(`Error initializing notifications: ${err.message}`);
        setIsSupported(false);
      } finally {
        setLoading(false);
      }
    }

    initializeNotifications();

    // Cleanup Firebase app on unmount if it was initialized by this component
    // return () => {
    //   if (firebaseApp && getApps().includes(firebaseApp) && getApps().length === 1) { // Only delete if it's the one we made and it's the only one
    //     debug("Cleaning up Firebase app instance.");
    //     deleteApp(firebaseApp).catch(e => debug("Error deleting Firebase app:", e));
    //   }
    // };
  }, [firebaseConfig]); // firebaseConfig is stable due to useMemo

  // Function to request permission to send notifications
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !isFcmInitialized || !userId || !firebaseMessaging || !firebaseConfig) {
      setError('Notifications are not supported, Firebase not ready, or user not authenticated.');
      debug('Request permission prerequisites not met:', { isSupported, isFcmInitialized, userId: !!userId, firebaseMessaging: !!firebaseMessaging, firebaseConfig: !!firebaseConfig });
      return false;
    }
    setLoading(true);
    setError(null);

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission as NotificationPermissionState);

      if (permission !== 'granted') {
        debug('User denied notification permission in browser.');
        setError('Notification permission denied. Please allow in browser settings.');
        setLoading(false);
        return false;
      }

      // Get device token
      const { getToken: getTok } = await import('firebase/messaging');
      const token = await getTok(firebaseMessaging, { vapidKey: firebaseConfig.vapidKey });

      if (!token) {
        setError('Failed to get device token after permission grant.');
        debug('Failed to get token even after permission was granted.');
        setLoading(false);
        return false;
      }
      setDeviceToken(token);
      debug('Device token received after permission grant:', token);

      // Check if permission already exists for this token and user
      // This uses the client directly, which might cause a re-render if its context changes, but it's a one-off check.
      const existingPermissions = await hasyx.select<NotificationPermission[]>({
        table: 'notification_permissions',
        where: { user_id: { _eq: userId }, device_token: { _eq: token } },
        returning: ['id']
      });

      // If permission already exists, do not create a new one
      if (existingPermissions && existingPermissions.length > 0) {
        debug('Permission for this device and user already exists in DB.');
        setLoading(false);
        return true;
      }

      // Create permission record in the DB
      const deviceInfo = getDeviceInfo();
      const newPermissionRecord: Partial<NotificationPermission> = {
        id: uuidv4(),
        user_id: userId,
        provider: 'firebase',
        device_token: token,
        device_info: deviceInfo as any, // Cast needed if DeviceInfo type doesn't perfectly match jsonb expectations
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await hasyx.insert({
        table: 'notification_permissions',
        object: newPermissionRecord,
      });

      debug('Notification permission created in DB:', newPermissionRecord);
      // The useSubscription for dbPermission should pick this up.
      setLoading(false);
      return true;
    } catch (err: any) {
      debug('Error requesting permission or saving to DB:', err);
      setError(err.message || 'Unknown error during permission request.');
      setLoading(false);
      return false;
    }
  }, [isSupported, isFcmInitialized, userId, hasyx, firebaseMessaging, firebaseConfig]);

  // Function to remove notification permission
  const removePermission = useCallback(async (): Promise<boolean> => {
    if (!userId || !deviceToken || !hasyx || !firebaseMessaging) {
      setError("Cannot remove permission: missing user, token, client or Firebase messaging instance.");
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      // Delete FCM token from Firebase
      if (firebaseMessaging) {
        const { deleteToken: deleteTokenFcmFn } = await import('firebase/messaging');
        await deleteTokenFcmFn(firebaseMessaging);
        debug('FCM token deleted from Firebase.');
      } else {
        debug('Firebase messaging not initialized. Skipping FCM token deletion.');
      }
      setDeviceToken(null); // Clear local token
      setPermissionStatus('default'); // Reset browser permission status optimistically

      // Delete permission from DB
      if (currentDbPermission) {
        await hasyx.delete({
          table: 'notification_permissions',
          where: { id: { _eq: currentDbPermission.id } }
        });
        debug('Notification permission removed from DB for ID:', currentDbPermission.id);
      } else {
        debug('No DB permission record found to remove (currentDbPermission is null).');
      }

      setLoading(false);
      return true;
    } catch (err: any) {
      debug('Error removing permission:', err);
      setError(err.message || 'Unknown error during permission removal.');
      setLoading(false);
      return false;
    }
  }, [userId, deviceToken, hasyx, currentDbPermission, firebaseMessaging]);

  // Function to send a test notification (creates records in DB, actual sending is by backend worker)
  const sendTestNotification = useCallback(async (
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<boolean> => {
    if (!currentDbPermission || !userId || !hasyx) {
      setError('No permission to send notifications or user not authenticated.');
      debug('Send test notification prerequisites not met:', { currentDbPermission: !!currentDbPermission, userId: !!userId, client: !!hasyx });
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      // Create message for notification
      const messageId = uuidv4();
      const messageRecord: any = { // Type any for now, should be imported from Hasura types
        id: messageId,
        user_id: userId, // The sender of the test message is the current user
        title,
        body,
        data: data || { test: true },
        created_at: new Date().toISOString(),
      };
      await hasyx.insert({
        table: 'notification_messages',
        object: messageRecord,
      });
      debug('Test notification message created in DB.');

      // Create notification, linked to the message and permission
      await hasyx.insert({
        table: 'notifications',
        object: {
          id: uuidv4(),
          message_id: messageId,
          permission_id: currentDbPermission.id,
          status: 'pending', // Backend worker will pick this up
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      debug('Test notification created in DB, pending backend processing.');
      setLoading(false);
      return true;
    } catch (err: any) {
      debug('Error sending test notification (creating DB records):', err);
      setError(err.message || 'Unknown error sending test notification.');
      setLoading(false);
      return false;
    }
  }, [userId, hasyx, currentDbPermission]);

  const isEnabled = permissionStatus === 'granted' && !!currentDbPermission;

  return (
    <NotificationContext.Provider value={{
      isSupported,
      isFcmInitialized,
      isEnabled,
      permissionStatus,
      dbPermission: currentDbPermission,
      deviceToken,
      requestPermission,
      removePermission,
      sendTestNotification,
      loading: loading || dbPermissionLoading,
      error
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

// Enhanced notification card component with multi-provider support
export function NotificationCard() {
  const hasyx = useHasyx();
  const userId = hasyx?.userId;
  const tN = useTranslations('notifications');
  
  const [notificationTitle, setNotificationTitle] = useState('Test Notification');
  const [notificationBody, setNotificationBody] = useState('This is a test notification!');
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  
  // Fetch all notification permissions for the user
  const { data: permissionsData, loading: permissionsLoading, error: permissionsError } = useSubscription<{ notification_permissions: NotificationPermission[] }>(
    {
      table: 'notification_permissions',
      where: { user_id: { _eq: userId } },
      returning: ['id', 'user_id', 'provider', 'device_token', 'device_info', 'created_at', 'updated_at']
    },
    { skip: !userId }
  );
  
  // Fetch recent notifications for the user
  const { data: notificationsData, loading: notificationsLoading } = useSubscription<{ 
    notifications: Array<{
      id: string;
      status: string;
      error?: string;
      created_at: string;
      updated_at: string;
      notification_message: {
        title: string;
        body: string;
      };
      notification_permission: {
        provider: string;
      };
    }>
  }>(
    {
      table: 'notifications',
      where: { 
        notification_permission: { 
          user_id: { _eq: userId } 
        } 
      },
      order_by: [{ created_at: 'desc' }],
      limit: 30,
      returning: [
        'id', 'status', 'error', 'created_at', 'updated_at',
        { notification_message: ['title', 'body'] },
        { notification_permission: ['provider'] }
      ]
    },
    { skip: !userId }
  );
  
  const permissions = permissionsData?.notification_permissions || [];
  const notifications = notificationsData?.notifications || [];
  
  // Handle provider selection
  const handleProviderToggle = (providerId: string, checked: boolean) => {
    if (checked) {
      setSelectedProviders(prev => [...prev, providerId]);
    } else {
      setSelectedProviders(prev => prev.filter(id => id !== providerId));
    }
  };
  
  // Handle "Select All" toggle
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProviders(permissions.map(p => p.id));
    } else {
      setSelectedProviders([]);
    }
  };
  
  // Send notification
  const handleSendNotification = async () => {
    if (!selectedProviders.length || !notificationTitle.trim() || !notificationBody.trim()) {
      toast.error('Please select providers and enter notification content');
      return;
    }
    
    setIsSending(true);
    try {
      // Create notification message
      const messageResult = await hasyx.insert({
        table: 'notification_messages',
        object: {
          title: notificationTitle.trim(),
          body: notificationBody.trim(),
          user_id: userId,
          created_at: new Date().toISOString()
        },
        returning: ['id']
      });
      
      if (!messageResult?.id) {
        throw new Error('Failed to create notification message');
      }
      
      // Create notification records for each selected provider
      const notificationPromises = selectedProviders.map(permissionId => 
        hasyx.insert({
          table: 'notifications',
          object: {
            message_id: messageResult.id,
            permission_id: permissionId,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          returning: ['id']
        })
      );
      
      await Promise.all(notificationPromises);
      
      toast.success(`Notification created and sent to ${selectedProviders.length} provider(s)`);
      
      // Reset form
      setNotificationTitle('Test Notification');
      setNotificationBody('This is a test notification!');
      setSelectedProviders([]);
      
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification: ' + (error as Error).message);
    } finally {
      setIsSending(false);
    }
  };
  
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'firebase':
        return <Bell className="h-4 w-4" />;
      case 'telegram_bot':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'firebase':
        return 'Web Push (Firebase)';
      case 'telegram_bot':
        return 'Telegram Bot';
      default:
        return provider;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">Sent</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (!userId) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{tN('loginRequiredTitle')}</CardTitle>
          <CardDescription>{tN('loginRequiredDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{tN('pleaseLogin')}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          {tN('title')}
          {permissions.length > 0 && (
            <Badge variant="outline" className="ml-2 bg-green-100 text-green-700 border-green-300">
              {tN('providersCount', { count: permissions.length })}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {tN('description')}
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mx-6">
          <TabsTrigger value="send">{tN('tabs.send')}</TabsTrigger>
          <TabsTrigger value="history">{tN('tabs.historyWithCount', { count: notifications.length })}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="send" className="space-y-4 p-6 pt-4">
          {permissionsError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{tN('permissionsErrorTitle')}</AlertTitle>
              <AlertDescription>{tN('permissionsErrorDescription', { message: permissionsError.message })}</AlertDescription>
            </Alert>
          )}
          
          {permissionsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : permissions.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>{tN('noProvidersTitle')}</AlertTitle>
              <AlertDescription>
                {tN('noProvidersDescription')}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{tN('availableMethods')}</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="select-all"
                      checked={selectedProviders.length === permissions.length && permissions.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="select-all" className="text-sm">{tN('selectAll')}</Label>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox 
                        id={permission.id}
                        checked={selectedProviders.includes(permission.id)}
                        onCheckedChange={(checked) => handleProviderToggle(permission.id, checked as boolean)}
                      />
                      <div className="flex items-center space-x-2 flex-1">
                        {getProviderIcon(permission.provider)}
                        <div className="flex-1">
                          <Label htmlFor={permission.id} className="font-medium cursor-pointer">
                            {getProviderName(permission.provider)}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {permission.provider === 'telegram_bot' ? 
                              `${tN('labels.chatId')}: ${permission.device_token}` :
                              `${tN('labels.token')}: ${permission.device_token.substring(0, 20)}...`
                            }
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {new Date(permission.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">{tN('content')}</h4>
                <Input
                  placeholder={tN('titlePlaceholder')}
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  disabled={isSending}
                />
                <Textarea
                  placeholder={tN('bodyPlaceholder')}
                  value={notificationBody}
                  onChange={(e) => setNotificationBody(e.target.value)}
                  disabled={isSending}
                  rows={3}
                />
                <Button
                  onClick={handleSendNotification}
                  disabled={isSending || selectedProviders.length === 0 || !notificationTitle.trim() || !notificationBody.trim()}
                  className="w-full"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> {tN('sending')}
                    </>
                  ) : (
                    <>
                      <BellRing className="mr-2 h-4 w-4" /> 
                      {tN('sendToProviders', { count: selectedProviders.length })}
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 p-6 pt-4">
          <div className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <h4 className="font-medium">{tN('recent')}</h4>
          </div>
          
          {notificationsLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>{tN('historyEmptyTitle')}</AlertTitle>
              <AlertDescription>
                {tN('historyEmptyDescription')}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{notification.notification_message.title}</h5>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.notification_message.body}
                      </p>
                    </div>
                    {getStatusBadge(notification.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      {getProviderIcon(notification.notification_permission.provider)}
                      <span>{getProviderName(notification.notification_permission.provider)}</span>
                    </div>
                    <span>{new Date(notification.created_at).toLocaleString()}</span>
                  </div>
                  {notification.error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertTriangle className="h-3 w-3" />
                      <AlertDescription className="text-xs">{notification.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
} 