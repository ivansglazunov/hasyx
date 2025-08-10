'use client';

import React from 'react';
import { useFilesStore, UploadingFile } from './store';
import { cn } from 'hasyx/lib/utils';
import { useTranslations } from 'hasyx';

export interface FilesZoneProps {
  className?: string;
  showCompleted?: boolean;
  onFileComplete?: (fileId: string) => void;
  onRemove?: (id: string) => void;
  renderRemoveButton?: (id: string) => React.ReactNode;
}

export default function FilesZone({ 
  className,
  showCompleted = true,
  onFileComplete,
  onRemove,
  renderRemoveButton
}: FilesZoneProps) {
  const tFiles = useTranslations('files');
  const { uploadingFiles, removeFile } = useFilesStore();

  const displayFiles = showCompleted 
    ? uploadingFiles 
    : uploadingFiles.filter(file => file.status !== 'completed');

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('text/')) return '📝';
    if (mimeType.includes('application/')) return '📦';
    return '📁';
  };

  const getStatusColor = (status: UploadingFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: UploadingFile['status']) => {
    switch (status) {
      case 'uploading':
        return tFiles('status.uploading');
      case 'completed':
        return tFiles('status.completed');
      case 'error':
        return tFiles('status.error');
      default:
        return tFiles('status.unknown');
    }
  };

  if (displayFiles.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {displayFiles.map((file) => (
        <div
          key={file.id}
          className="bg-card rounded-lg border border-border p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              {/* File Icon */}
              <div className="text-2xl flex-shrink-0">
                {getFileIcon('application/octet-stream')}
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </h4>
                  {file.fileId && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      ID: {file.fileId}
                    </span>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground mb-2">
                  {formatFileSize(file.size)}
                </div>
                
                {/* Progress Bar */}
                {file.status === 'uploading' && (
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
                
                {/* Status Badge */}
                <span className={cn(
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  getStatusColor(file.status)
                )}>
                  {getStatusText(file.status)}
                </span>
                
                {/* Error Message */}
                {file.status === 'error' && file.error && (
                  <div className="text-xs text-red-600 mt-1">
                    {file.error}
                  </div>
                )}
              </div>
            </div>
            
            {/* Remove Button */}
            {renderRemoveButton ? (
              renderRemoveButton(file.id)
            ) : (
              <button
                onClick={e => { e.stopPropagation(); (onRemove ?? removeFile)(file.id); }}
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
                title={tFiles('removeFile')}
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 