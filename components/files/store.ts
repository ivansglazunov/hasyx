import { create } from 'zustand';

export interface UploadingFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  fileId?: string; // ID файла после загрузки на сервер
}

interface FilesStore {
  uploadingFiles: UploadingFile[];
  addFile: (file: File) => string;
  updateProgress: (id: string, progress: number) => void;
  completeUpload: (id: string, fileId: string) => void;
  setError: (id: string, error: string) => void;
  removeFile: (id: string) => void;
  clearAll: () => void;
}

export const useFilesStore = create<FilesStore>((set, get) => ({
  uploadingFiles: [],
  
  addFile: (file: File) => {
    const id = Math.random().toString(36).substr(2, 9);
    const uploadingFile: UploadingFile = {
      id,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading'
    };
    
    set((state) => ({
      uploadingFiles: [...state.uploadingFiles, uploadingFile]
    }));
    
    return id;
  },
  
  updateProgress: (id: string, progress: number) => {
    set((state) => ({
      uploadingFiles: state.uploadingFiles.map(file => 
        file.id === id ? { ...file, progress } : file
      )
    }));
  },
  
  completeUpload: (id: string, fileId: string) => {
    set((state) => ({
      uploadingFiles: state.uploadingFiles.map(file => 
        file.id === id ? { ...file, status: 'completed', fileId } : file
      )
    }));
  },
  
  setError: (id: string, error: string) => {
    set((state) => ({
      uploadingFiles: state.uploadingFiles.map(file => 
        file.id === id ? { ...file, status: 'error', error } : file
      )
    }));
  },
  
  removeFile: (id: string) => {
    set((state) => ({
      uploadingFiles: state.uploadingFiles.filter(file => file.id !== id)
    }));
  },
  
  clearAll: () => {
    set({ uploadingFiles: [] });
  }
})); 