import { NextRequest } from 'next/server';
import { handleVerifyTelegramWebApp, handleVerifyTelegramWebAppOptions } from 'hasyx/lib/auth/verify-telegram-webapp';

export async function POST(request: NextRequest) { return handleVerifyTelegramWebApp(request); }
export async function OPTIONS(request: NextRequest) { return handleVerifyTelegramWebAppOptions(request); } 