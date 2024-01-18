import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api';
import { Editor } from './components/Editor';
import { useContentStore } from './hooks/useContentStore';
import { EditorMode, useAppStore } from './hooks/useAppStore';
import { MenuBar } from './components/MenuBar';
import { Preview } from './components/Preview';
import { OPEN_PASSWORD_PROMPT_MSG } from './utils/constants';

function App() {
	const { editorMode, currentFile } = useAppStore((state) => state);
	const { setContent } = useContentStore((state) => state);

	useEffect(() => {
		if (currentFile === '') return;
		if (currentFile.endsWith('.ybf')) {
			invoke('open_ybf', {
				filename: currentFile,
				password: window.prompt(OPEN_PASSWORD_PROMPT_MSG) ?? '',
			}).then((content) => setContent(content as string));
		} else {
			invoke('open_md', { filename: currentFile }).then((content) =>
				setContent(content as string),
			);
		}
	}, [currentFile]);

	return (
		<div className="h-screen w-screen">
			<MenuBar />
			{editorMode === EditorMode.Preview ? <Preview /> : <Editor />}
		</div>
	);
}

export default App;
