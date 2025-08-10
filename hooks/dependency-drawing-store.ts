import { create } from 'zustand';

interface DependencyDrawingState {
  onDrawingComplete: ((sourceIssueData: any, targetIssueData: any, relationType: string, hasyx: any) => Promise<void>) | null;
  currentRelationType: string | null;
  hasyxInstance: any | null;
  
  startDrawing: (relationType: string, hasyx: any, onComplete: (sourceIssueData: any, targetIssueData: any, relationType: string, hasyx: any) => Promise<void>) => void;
  completeDrawing: (sourceIssueData: any, targetIssueData: any, relationType: string) => Promise<void>;
  cancelDrawing: () => void;
}

export const useDependencyDrawingStore = create<DependencyDrawingState>((set, get) => ({
  onDrawingComplete: null,
  currentRelationType: null,
  hasyxInstance: null,
  
  startDrawing: (relationType, hasyx, onComplete) => {
    set({ onDrawingComplete: onComplete, currentRelationType: relationType, hasyxInstance: hasyx });
  },
  
  completeDrawing: async (sourceIssueData, targetIssueData, relationType) => {
    const { onDrawingComplete, hasyxInstance } = get();
    if (onDrawingComplete && hasyxInstance) {
      await onDrawingComplete(sourceIssueData, targetIssueData, relationType, hasyxInstance);
      set({ onDrawingComplete: null, currentRelationType: null, hasyxInstance: null });
    }
  },
  
  cancelDrawing: () => {
    set({ onDrawingComplete: null, currentRelationType: null, hasyxInstance: null });
  }
})); 