'use client';

import { useState, useEffect, useRef } from 'react';
import sidebar from "@/app/sidebar";
import { SidebarLayout } from "hasyx/components/sidebar/layout";
import { useQuery, useHasyx, useSubscription } from 'hasyx';
import { toast } from 'sonner';

// Types for files
interface File {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
  isUploaded: boolean;
  uploadedByUserId?: string;
}

// Types for view modes
type ViewMode = 'grid' | 'list' | 'table';

export default function FilesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasyx = useHasyx();

  // Use hasura-storage files table
  const { data: files = [], loading, error } = useSubscription({
    table: 'files', // This should query storage.files via hasura-storage GraphQL
    where: {},
    returning: [
      'id', 'name', 'size', 'mimeType', 'createdAt', 'updatedAt', 
      'isUploaded', 'uploadedByUserId'
    ],
    order_by: [{ createdAt: 'desc' }],
  });

  console.log(files);

  // File upload handler
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
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

        setUploadProgress(((i + 1) / files.length) * 100);
      }

      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh file list
      toast.success(`Successfully uploaded ${files.length} file${files.length !== 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Function to get file icon
  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('text/')) return '📝';
    if (mimeType.includes('application/')) return '📦';
    return '📁';
  };

  // Function to get image preview
  const getImagePreview = (fileId: string, mimeType: string) => {
    if (!mimeType.startsWith('image/')) return null;
    
    // Use GET method to get file content
    return `/api/files/${fileId}`;
  };

  // Function to format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };



  // Function to delete file
  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('File deleted successfully');
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Delete failed');
    }
  };

  if (loading) return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[
      { title: 'Hasyx', link: '/' },
      { title: 'Files', link: '/hasyx/files' }
    ]}>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    </SidebarLayout>
  );
  
  if (error) return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[
      { title: 'Hasyx', link: '/' },
      { title: 'Files', link: '/hasyx/files' }
    ]}>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="text-destructive">Error loading files: {error.message}</div>
        </div>
      </div>
    </SidebarLayout>
  );

  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[
      { title: 'Hasyx', link: '/' },
      { title: 'Files', link: '/hasyx/files' }
    ]}>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">📁 Files</h1>
          <p className="text-muted-foreground">
            Manage and organize your files with drag & drop support
          </p>
        </div>
        
        {/* Control Panel */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0">
            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <span>{isUploading ? '⏳' : '📤'}</span>
              <span>{isUploading ? 'Uploading...' : 'Upload Files'}</span>
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
              disabled={isUploading}
            />

            {/* Drag & Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-border/80'
              }`}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-muted-foreground">
                {dragActive ? 'Drop files here' : 'Drag & drop files here'}
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="w-full sm:w-64">
              <div className="bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="text-sm text-muted-foreground mt-1">{Math.round(uploadProgress)}%</div>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-background text-primary shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🖼️ Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-background text-primary shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              📋 List
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table' 
                  ? 'bg-background text-primary shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              📊 Table
            </button>
          </div>
        </div>

        {/* File Counter */}
        <div className="mb-4 text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg inline-block">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </div>

        {/* Content based on view mode */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {files.map((file) => (
              <div key={file.id} className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-200">
                <div className="text-center">
                  {file.mimeType.startsWith('image/') ? (
                    <div className="mb-4">
                      <img 
                        src={getImagePreview(file.id, file.mimeType)!}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-lg border border-border"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling!.classList.remove('hidden');
                        }}
                      />
                      <div className="text-5xl hidden">{getFileIcon(file.mimeType)}</div>
                    </div>
                  ) : (
                    <div className="text-5xl mb-4">{getFileIcon(file.mimeType)}</div>
                  )}
                  <div className="text-sm font-medium text-foreground truncate mb-2" title={file.name}>
                    {file.name}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {formatFileSize(file.size)}
                  </div>
                  <div className="text-xs text-muted-foreground/70 mb-4">
                    {formatDate(file.createdAt)}
                  </div>
                  
                  {/* Status */}
                  <div className="mb-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      file.isUploaded 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {file.isUploaded ? 'Uploaded' : 'Processing'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center space-x-2">
                    <a
                      href={`/api/files/${file.id}`}
                      download={file.name}
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      📥 Download
                    </a>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="text-destructive hover:text-destructive/80 text-sm font-medium"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

              {viewMode === 'list' && (
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          {files.map((file) => (
              <div key={file.id} className="p-6 border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {file.mimeType.startsWith('image/') ? (
                      <div className="w-12 h-12 flex-shrink-0">
                        <img 
                          src={getImagePreview(file.id, file.mimeType)!}
                          alt={file.name}
                          className="w-full h-full object-cover rounded border border-border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling!.classList.remove('hidden');
                          }}
                        />
                        <span className="text-2xl hidden">{getFileIcon(file.mimeType)}</span>
                      </div>
                    ) : (
                      <span className="text-3xl">{getFileIcon(file.mimeType)}</span>
                    )}
                  <div>
                      <div className="font-medium text-foreground">{file.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                      {!file.isUploaded && ' • ⏳ Processing'}
                    </div>
                  </div>
                </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      file.isUploaded 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {file.isUploaded ? 'Uploaded' : 'Processing'}
                    </span>
                    <a
                      href={`/api/files/${file.id}`}
                      download={file.name}
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      📥 Download
                    </a>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="text-destructive hover:text-destructive/80 text-sm font-medium"
                    >
                      🗑️ Delete
                    </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}

              {viewMode === 'table' && (
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  File
                </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Size
                </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Created
                </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
              </tr>
            </thead>
              <tbody className="bg-card divide-y divide-border/50">
              {files.map((file) => (
                  <tr key={file.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">{getFileIcon(file.mimeType)}</span>
                      <div className="text-sm font-medium text-foreground">{file.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {file.mimeType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(file.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      file.isUploaded 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {file.isUploaded ? 'Uploaded' : 'Processing'}
                    </span>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <a
                          href={`/api/files/${file.id}`}
                          download={file.name}
                          className="text-primary hover:text-primary/80"
                        >
                          📥 Download
                        </a>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

              {files.length === 0 && (
          <div className="text-center py-16 bg-card rounded-xl shadow-sm border border-border">
            <div className="text-8xl mb-6">📁</div>
            <div className="text-2xl text-foreground mb-4">No files yet</div>
            <div className="text-muted-foreground mb-6">Upload your first file to get started</div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              📤 Upload Files
            </button>
        </div>
      )}
      </div>
    </SidebarLayout>
  );
} 