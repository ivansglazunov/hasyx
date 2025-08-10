import { useCallback } from 'react';
import { useFilesStore } from './store';

export function useFilesUpload() {
  const { addFile, updateProgress, completeUpload, setError } = useFilesStore();

  const handleFilesSelected = useCallback((files: File[]) => {
    files.forEach(file => {
      const fileId = addFile(file);
      
      // Simulate upload progress
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }
          updateProgress(fileId, progress);
        }, 200);
      };
      
      simulateProgress();
    });
  }, [addFile, updateProgress]);

  const handleUploadComplete = useCallback((fileId: string) => {
    // Find the file by name (since we don't have a direct link)
    // In a real app, this logic should be improved
    const uploadingFiles = useFilesStore.getState().uploadingFiles;
    const file = uploadingFiles.find(f => f.status === 'uploading');
    if (file) {
      completeUpload(file.id, fileId);
    }
  }, [completeUpload]);

  const handleUploadError = useCallback((error: string) => {
    const uploadingFiles = useFilesStore.getState().uploadingFiles;
    const file = uploadingFiles.find(f => f.status === 'uploading');
    if (file) {
      setError(file.id, error);
    }
  }, [setError]);

  return {
    handleFilesSelected,
    handleUploadComplete,
    handleUploadError
  };
} 