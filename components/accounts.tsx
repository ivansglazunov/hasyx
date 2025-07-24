'use client';

import React, { useState } from 'react';
import { Button } from "hasyx/components/ui/button";
import { useSubscription, useHasyx, useQuery } from 'hasyx';
import { Trash2, Loader2, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "hasyx/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "hasyx/components/ui/dialog";
import { OAuthButtons } from './auth/oauth-buttons';
import { toast } from 'sonner';
import Debug from 'hasyx/lib/debug';
import { useToastHandleLoadingError } from '@/hooks/toasts';

const debug = Debug('accounts');

// Provider icons (same as in user-profile-dropdown.tsx)
function getProviderIcon(provider: string) {
  const iconClass = "h-4 w-4";
  
  switch (provider.toLowerCase()) {
    case 'google':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      );
    case 'github':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      );
    case 'yandex':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path fill="#FC3F1D" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c0 3.123-1.968 4.608-3.744 4.608-.72 0-1.296-.24-1.728-.624v3.696h-1.632V6.72h1.632v.624c.432-.384 1.008-.624 1.728-.624 1.776 0 3.744 1.485 3.744 4.44zm-1.632 0c0-1.968-.96-3.024-2.256-3.024s-2.256 1.056-2.256 3.024.96 3.024 2.256 3.024 2.256-1.056 2.256-3.024z"/>
        </svg>
      );
    case 'telegram':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      );
    default:
      return (
        <div className={`${iconClass} bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600`}>
          {provider.charAt(0).toUpperCase()}
        </div>
      );
  }
}

interface Account {
  id: string;
  provider: string;
  provider_account_id?: string;
  user_id?: string;
}

interface AccountComponentProps {
  account: Account;
  delete: () => void;
  _delete: () => void;
}

function AccountsAccount({ account, delete: handleDelete }: AccountComponentProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        {getProviderIcon(account.provider)}
        <div className="flex flex-col">
          <span className="text-sm font-medium capitalize">{account.provider}</span>
          {account.provider_account_id && (
            <span className="text-xs text-muted-foreground">ID: {account.provider_account_id}</span>
          )}
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface AccountsProps {
  userId?: string;
  AccountComponent?: React.ComponentType<AccountComponentProps>;
}

export function Accounts({ userId, AccountComponent = AccountsAccount }: AccountsProps) {
  const hasyx = useHasyx();
  const effectiveUserId = userId || hasyx.userId;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addAccountDialogOpen, setAddAccountDialogOpen] = useState(false);

  const { data: accounts = [], error, loading, refetch } = useQuery(
    {
      table: 'accounts',
      where: { user_id: { _eq: effectiveUserId } },
      returning: ['id', 'provider', 'provider_account_id', 'user_id'],
    },
    {
      skip: !effectiveUserId,
      role: 'me'
    }
  );


  const handleDeleteWithDialog = (account: Account) => {
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDirect = async (account: Account) => {
    if (!hasyx) return;
    
    setIsDeleting(true);
    try {
      await hasyx.delete({
        table: 'accounts',
        where: { id: { _eq: account.id } },
      });
      
      toast.success(`${account.provider} account disconnected successfully`);
      refetch();
    } catch (error) {
      debug('Error deleting account:', error);
      toast.error('Failed to disconnect account');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = async () => {
    if (!accountToDelete) return;
    
    await handleDeleteDirect(accountToDelete);
    setDeleteDialogOpen(false);
    setAccountToDelete(null);
  };

  if (!effectiveUserId) {
    return <div className="text-sm text-muted-foreground">No user ID available</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center px-2 py-1">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm text-muted-foreground">Loading accounts...</span>
      </div>
    );
  }

  if (accounts.length === 0) {
    return <div className="text-sm text-muted-foreground px-2 py-1">No connected accounts</div>;
  }

  return (
    <>
      <div className="space-y-3">
        {accounts.map((account) => (
          <AccountComponent
            key={account.id}
            account={account}
            delete={() => handleDeleteWithDialog(account)}
            _delete={() => handleDeleteDirect(account)}
          />
        ))}
        
        {/* Add Account Button */}
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2" 
          onClick={() => setAddAccountDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>+ Account</span>
        </Button>
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect your {accountToDelete?.provider} account? 
              This action cannot be undone and you will need to reconnect the account if you want to use it again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Add Account Dialog */}
      <Dialog open={addAccountDialogOpen} onOpenChange={setAddAccountDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Account</DialogTitle>
            <DialogDescription>
              Choose a provider to link a new account to your profile
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <OAuthButtons />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
