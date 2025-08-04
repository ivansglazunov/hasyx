"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDependencyDrawingStore = void 0;
const zustand_1 = require("zustand");
exports.useDependencyDrawingStore = (0, zustand_1.create)((set, get) => ({
    onDrawingComplete: null,
    currentRelationType: null,
    hasyxInstance: null,
    startDrawing: (relationType, hasyx, onComplete) => {
        set({ onDrawingComplete: onComplete, currentRelationType: relationType, hasyxInstance: hasyx });
    },
    completeDrawing: (sourceIssueData, targetIssueData, relationType) => __awaiter(void 0, void 0, void 0, function* () {
        const { onDrawingComplete, hasyxInstance } = get();
        if (onDrawingComplete && hasyxInstance) {
            yield onDrawingComplete(sourceIssueData, targetIssueData, relationType, hasyxInstance);
            set({ onDrawingComplete: null, currentRelationType: null, hasyxInstance: null });
        }
    }),
    cancelDrawing: () => {
        set({ onDrawingComplete: null, currentRelationType: null, hasyxInstance: null });
    }
}));
