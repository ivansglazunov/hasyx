import { useCallback } from 'react';
import { useFilesStore } from './store';

export function useFilesUpload() {
  const { addFile, updateProgress, completeUpload, setError } = useFilesStore();

  const handleFilesSelected = useCallback((files: File[]) => {
    files.forEach(file => {
      const fileId = addFile(file);
      
      // Симулируем прогресс загрузки
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
    // Находим файл по имени (так как у нас нет прямой связи)
    // В реальном приложении нужно будет улучшить эту логику
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