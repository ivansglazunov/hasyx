import { NextRequest } from 'next/server';
import { handleIssuesPOST, handleIssuesPUT, handleIssuesGET } from 'hasyx/lib/github/issues-api';
import authOptions from '@/app/options';

export async function POST(request: NextRequest) { return handleIssuesPOST(request, authOptions); }
export async function PUT(request: NextRequest) { return handleIssuesPUT(request, authOptions); }
export async function GET() { return handleIssuesGET(); }
