import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api';
import Markdown from 'react-markdown';
import { Editor } from './components/Editor';
import { useContentStore } from './hooks/useContentStore';
import { EditorMode, useAppStore } from './hooks/useAppStore';
import { MenuBar } from './components/MenuBar';

function App() {
	const { editorMode, currentFile } = useAppStore((state) => state);
	const { content, setContent } = useContentStore((state) => state);

	useEffect(() => {
		if (currentFile === '') return;
		if (currentFile.endsWith('.ybf')) {
			invoke('open_ybf', { filename: currentFile, password: '1234' }).then(
				(content) => setContent(content as string),
			);
		} else {
			invoke('open_md', { filename: currentFile }).then((content) =>
				setContent(content as string),
			);
		}
	}, [currentFile]);

	return (
		<>
			<MenuBar />
			{editorMode === EditorMode.Preview ? (
				<Markdown>{content}</Markdown>
			) : (
				<Editor />
			)}
		</>
	);
}

export default App;
