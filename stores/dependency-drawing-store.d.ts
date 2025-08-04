interface DependencyDrawingState {
    onDrawingComplete: ((sourceIssueData: any, targetIssueData: any, relationType: string, hasyx: any) => Promise<void>) | null;
    currentRelationType: string | null;
    hasyxInstance: any | null;
    startDrawing: (relationType: string, hasyx: any, onComplete: (sourceIssueData: any, targetIssueData: any, relationType: string, hasyx: any) => Promise<void>) => void;
    completeDrawing: (sourceIssueData: any, targetIssueData: any, relationType: string) => Promise<void>;
    cancelDrawing: () => void;
}
export declare const useDependencyDrawingStore: import("zustand").UseBoundStore<import("zustand").StoreApi<DependencyDrawingState>>;
export {};
