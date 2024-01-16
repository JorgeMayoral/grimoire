import { create } from 'zustand';

export enum EditorMode {
	Edit,
	Preview,
}

interface AppStore {
	editorMode: EditorMode;
	setEditorMode: (mode: EditorMode) => void;
	switchEditorMode: () => void;

	currentFile: string;
	setCurrentFile: (file: string) => void;
}

export const useAppStore = create<AppStore>()((set) => ({
	editorMode: EditorMode.Edit,
	setEditorMode: (mode) => set({ editorMode: mode }),
	switchEditorMode: () =>
		set((state) => ({
			editorMode:
				state.editorMode === EditorMode.Edit
					? EditorMode.Preview
					: EditorMode.Edit,
		})),
	currentFile: '',
	setCurrentFile: (file) => set({ currentFile: file }),
}));
