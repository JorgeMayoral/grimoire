import { create } from 'zustand';

interface ContentStore {
	content: string;
	setContent: (content: string | undefined) => void;
}

export const useContentStore = create<ContentStore>()((set) => ({
	content: '',
	setContent: (content) => set({ content: content ?? '' }),
}));
