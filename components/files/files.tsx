'use client';

import React, { useState, useRef, useCallback, ReactNode } from 'react';
import { cn } from 'hasyx/lib/utils';

export interface FilesProps {
  children?: ReactNode;
  onFilesSelected?: (files: File[]) => void;
  onUploadComplete?: (fileId: string) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  dragActiveClassName?: string;
}

export default function Files({
  children,
  onFilesSelected,
  onUploadComplete,
  onUploadError,
  accept,
  multiple = false,
  disabled = false,
  className,
  dragActiveClassName
}: FilesProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Вызываем callback если предоставлен
    if (onFilesSelected) {
      onFilesSelected(fileArray);
    }

    // Если есть onUploadComplete, загружаем файлы на сервер
    if (onUploadComplete) {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('isPublic', 'false');

          const response = await fetch('/api/files', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Upload failed for ${file.name}`);
          }

          const result = await response.json();
          onUploadComplete(result.file.id);
        } catch (error) {
          console.error('Upload error:', error);
          if (onUploadError) {
            onUploadError(`Failed to upload ${file.name}`);
          }
        }
      }
    }
  }, [onFilesSelected, onUploadComplete, onUploadError]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  return (
    <div
      className={cn(
        'relative',
        dragActive && dragActiveClassName,
        className
      )}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />
      {children}
    </div>
  );
} 