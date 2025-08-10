import { z } from 'zod';

// Server-side Firebase Admin SDK credentials
export const firebaseAdminSchema = z.object({
  projectId: z.string()
    .min(1, 'Please enter a valid Firebase Project ID')
    .describe('Firebase Project ID (server) - From service account JSON: project_id'),
  clientEmail: z.string()
    .email('Please enter a valid email')
    .describe('Firebase Client Email (server) - From service account JSON: client_email'),
  privateKey: z.string()
    .min(1, 'Please enter a valid Firebase Private Key')
    .describe('Firebase Private Key (server) - From service account JSON: private_key'),
  credentialsPath: z.string()
    .optional()
    .describe('Path to Google credentials JSON file for Admin SDK (GOOGLE_APPLICATION_CREDENTIALS)')
}).meta({
  type: 'firebase-config',
  title: 'Firebase (Admin SDK) Configuration',
  description: 'Configure Firebase Admin SDK credentials from your service account JSON (server-side).',
  envMapping: {
    projectId: 'FIREBASE_PROJECT_ID',
    clientEmail: 'FIREBASE_CLIENT_EMAIL',
    privateKey: 'FIREBASE_PRIVATE_KEY',
    credentialsPath: 'GOOGLE_APPLICATION_CREDENTIALS'
  }
});

// Client-side Firebase Web SDK public config
export const firebasePublicSchema = z.object({
  apiKey: z.string().min(1, 'Please enter a valid Firebase API Key').describe('Firebase Web API Key (NEXT_PUBLIC_FIREBASE_API_KEY)'),
  authDomain: z.string().min(1, 'Please enter a valid Auth Domain').describe('Firebase Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)'),
  projectId: z.string().min(1, 'Please enter a valid Project ID').describe('Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID)'),
  storageBucket: z.string().min(1, 'Please enter a valid Storage Bucket').describe('Firebase Storage Bucket (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)'),
  messagingSenderId: z.string().min(1, 'Please enter a valid Messaging Sender ID').describe('Firebase Messaging Sender ID (NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)'),
  appId: z.string().min(1, 'Please enter a valid App ID').describe('Firebase App ID (NEXT_PUBLIC_FIREBASE_APP_ID)'),
  vapidKey: z.string().min(1, 'Please enter a valid VAPID Key').describe('Firebase VAPID Key (NEXT_PUBLIC_FIREBASE_VAPID_KEY)'),
}).meta({
  type: 'firebase-public-config',
  title: 'Firebase (Web SDK) Public Configuration',
  description: 'Configure Firebase Web SDK public keys for client-side usage.',
  envMapping: {
    apiKey: 'NEXT_PUBLIC_FIREBASE_API_KEY',
    authDomain: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    projectId: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    storageBucket: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    appId: 'NEXT_PUBLIC_FIREBASE_APP_ID',
    vapidKey: 'NEXT_PUBLIC_FIREBASE_VAPID_KEY'
  }
});



