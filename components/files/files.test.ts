import { useFilesStore } from './store';

describe('FilesStore', () => {
  beforeEach(() => {
    // Очищаем store перед каждым тестом
    useFilesStore.getState().clearAll();
  });

  it('adds files correctly', () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const fileId = useFilesStore.getState().addFile(file);
    
    const files = useFilesStore.getState().uploadingFiles;
    expect(files).toHaveLength(1);
    expect(files[0].name).toBe('test.txt');
    expect(files[0].size).toBe(12);
    expect(files[0].status).toBe('uploading');
  });

  it('updates progress correctly', () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const fileId = useFilesStore.getState().addFile(file);
    
    useFilesStore.getState().updateProgress(fileId, 50);
    
    const files = useFilesStore.getState().uploadingFiles;
    expect(files[0].progress).toBe(50);
  });

  it('completes upload correctly', () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const fileId = useFilesStore.getState().addFile(file);
    
    useFilesStore.getState().completeUpload(fileId, 'server-file-id');
    
    const files = useFilesStore.getState().uploadingFiles;
    expect(files[0].status).toBe('completed');
    expect(files[0].fileId).toBe('server-file-id');
  });

  it('sets error correctly', () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const fileId = useFilesStore.getState().addFile(file);
    
    useFilesStore.getState().setError(fileId, 'Upload failed');
    
    const files = useFilesStore.getState().uploadingFiles;
    expect(files[0].status).toBe('error');
    expect(files[0].error).toBe('Upload failed');
  });

  it('removes files correctly', () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const fileId = useFilesStore.getState().addFile(file);
    
    expect(useFilesStore.getState().uploadingFiles).toHaveLength(1);
    
    useFilesStore.getState().removeFile(fileId);
    
    expect(useFilesStore.getState().uploadingFiles).toHaveLength(0);
  });

  it('clears all files correctly', () => {
    const file1 = new File(['test content 1'], 'test1.txt', { type: 'text/plain' });
    const file2 = new File(['test content 2'], 'test2.txt', { type: 'text/plain' });
    
    useFilesStore.getState().addFile(file1);
    useFilesStore.getState().addFile(file2);
    
    expect(useFilesStore.getState().uploadingFiles).toHaveLength(2);
    
    useFilesStore.getState().clearAll();
    
    expect(useFilesStore.getState().uploadingFiles).toHaveLength(0);
  });
}); 