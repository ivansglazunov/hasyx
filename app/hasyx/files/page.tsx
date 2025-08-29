'use client';

import { useState } from 'react';
import sidebar from "@/app/sidebar";
import pckg from "../../../package.json";
import { SidebarLayout } from "hasyx/components/sidebar/layout";
import { useSubscription, useHasyx } from 'hasyx';
import { toast } from 'sonner';
import { Files, FilesZone, useFilesUpload, useFilesStore } from 'hasyx/components/files';
import { Button } from 'hasyx/components/ui/button';
import { Status } from 'hasyx/components/hasyx/status';
import { useChoose } from 'hasyx/hooks/choose';
import { Checkbox } from 'hasyx/components/ui/checkbox';
import { useTranslations } from 'hasyx';

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
  const t = useTranslations();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { handleFilesSelected, handleUploadComplete, handleUploadError } = useFilesUpload();
  const { choose, setChoose, toggleChoose, clearChoose, isChosen } = useChoose();
  const hasyx = useHasyx();
  const filesStore = useFilesStore();

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
    if (!confirm(t('files.confirm.deleteOne'))) return;

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(t('files.toast.deleteSuccessOne'));
      } else {
        throw new Error(t('files.toast.deleteFailed'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(t('files.toast.deleteFailed'));
    }
  };

  // Function to delete selected files
  const handleDeleteSelected = async () => {
    if (!choose || choose.length === 0) return;
    
    if (!confirm(t('files.confirm.deleteMany', { count: choose.length }))) return;

    try {
      await hasyx.delete({ 
        table: 'deleteFiles',
        where: { id: { _in: choose } }
      });
      
      toast.success(t('files.toast.deleteSuccessMany', { count: choose.length }));
      clearChoose(); // Очищаем выбор после удаления
    } catch (error) {
      console.error('Delete selected files error:', error);
      toast.error(useTranslations('files')('toast.deleteFailedMany'));
    }
  };

  // Function to select all files
  const handleSelectAll = () => {
    const allFileIds = files.map(file => file.id);
    setChoose(allFileIds);
  };

  // Показываем ошибку только если она есть и данные не загружены
  if (error && !files.length) {
    return (
      <SidebarLayout sidebarData={sidebar} breadcrumb={[
        { title: pckg.name, link: '/' },
        { title: t('nav.files'), link: '/hasyx/files' }
      ]}>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="text-destructive">{t('files.toast.errorLoading', { message: error.message })}</div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[
      { title: pckg.name, link: '/' },
      { title: t('nav.files'), link: '/hasyx/files' }
    ]}>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{t('pages.files.title')}</h1>
          <p className="text-muted-foreground">{t('pages.files.description')}</p>
        </div>
        
        {/* Upload Zone */}
        <Files
          onFilesSelected={handleFilesSelected}
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          multiple
          className="mb-6 bg-card p-8 rounded-xl shadow-sm border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer"
          dragActiveClassName="border-primary bg-primary/10"
        >
          <div className="text-center space-y-4">
            <div className="text-6xl">📁</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{t('files.example.dropHere')}</h2>
              <p className="text-muted-foreground">{t('files.example.orClick')}</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto">
              <span>{t('files.example.uploadFiles')}</span>
            </Button>
          </div>
          
          {/* FilesZone inside the upload area */}
          <div className="mt-6">
            <FilesZone 
              onRemove={(id) => filesStore.removeFile(id)}
              renderRemoveButton={(id) => (
                <button
                  onClick={e => { e.stopPropagation(); filesStore.removeFile(id); }}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  title={t('files.removeFile')}
                  type="button"
                >
                  ✕
                </button>
              )}
            />
          </div>
        </Files>

        {/* File Counter and Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg">
            {loading ? (
              <div className="flex items-center space-x-2">
                <Status status="connecting" label={t('common.loading')} />
              </div>
            ) : (
              t('files.items', { count: files.length })
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Choose Controls */}
            {choose ? (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  {t('actions.delete')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {t('common.yes')}
                </Button>
                <span className="text-sm font-medium text-primary">
                  {t('files.selected', { count: choose.length })}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearChoose}
                >
                  {t('actions.cancel')}
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setChoose([])}
              >
                {t('actions.select')}
              </Button>
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
                🖼️ {t('files.view.grid')}
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-background text-primary shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                📋 {t('files.view.list')}
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-background text-primary shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                📊 {t('files.view.table')}
              </button>
            </div>
          </div>
        </div>

        {/* Loading indicator for files */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Status status="connecting" label={t('files.loadingFiles')} />
          </div>
        )}

        {/* Content based on view mode */}
        {!loading && viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {files.map((file) => (
              <div key={file.id} className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-200 relative">
                {/* Checkbox for selection */}
                {choose && (
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={isChosen(file.id)}
                      onCheckedChange={() => toggleChoose(file.id)}
                    />
                  </div>
                )}
                
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
                      {file.isUploaded ? t('files.status.uploaded') : t('files.status.processing')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center space-x-2">
                    <a
                      href={`/api/files/${file.id}`}
                      download={file.name}
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      📥 {t('actions.download')}
                    </a>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="text-destructive hover:text-destructive/80 text-sm font-medium"
                    >
                      🗑️ {t('actions.delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && viewMode === 'list' && (
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          {files.map((file) => (
              <div key={file.id} className="p-6 border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Checkbox for selection */}
                    {choose && (
                      <Checkbox
                        checked={isChosen(file.id)}
                        onCheckedChange={() => toggleChoose(file.id)}
                      />
                    )}
                    
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
                    {file.isUploaded ? t('files.status.uploaded') : t('files.status.processing')}
                    </span>
                    <a
                      href={`/api/files/${file.id}`}
                      download={file.name}
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                    📥 {t('actions.download')}
                    </a>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="text-destructive hover:text-destructive/80 text-sm font-medium"
                    >
                    🗑️ {t('actions.delete')}
                    </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
              )}

        {!loading && viewMode === 'table' && (
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {choose && (
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('files.table.select')}
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('files.table.file')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('files.table.size')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('files.table.type')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('files.table.created')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('files.table.status')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('files.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border/50">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-muted/50 transition-colors">
                  {choose && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Checkbox
                        checked={isChosen(file.id)}
                        onCheckedChange={() => toggleChoose(file.id)}
                      />
                    </td>
                  )}
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


      </div>
    </SidebarLayout>
  );
} 