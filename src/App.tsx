import { useEffect, useState } from 'react';
import { open, save } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api';
import Markdown from 'react-markdown';
import { Editor } from './components/Editor';
import { FILE_FORMATS } from './utils/constants';
import { useContentStore } from './hooks/useContentStore';
import { EditorMode, useAppStore } from './hooks/useAppStore';

function App() {
	const [filename, setFilename] = useState<string>('');

	const { editorMode, switchEditorMode } = useAppStore((state) => state);
	const { content, setContent } = useContentStore((state) => state);

	useEffect(() => {
		if (filename === '') return;
		if (filename.endsWith('.ybf')) {
			invoke('open_ybf', { filename, password: '1234' }).then((content) =>
				setContent(content as string),
			);
		} else {
			invoke('open_md', { filename }).then((content) =>
				setContent(content as string),
			);
		}
	}, [filename]);

	const handleNew = () => {
		setContent('');
		setFilename('');
	};

	const handleOpen = async () => {
		const selected = await open({
			multiple: false,
			filters: FILE_FORMATS,
		});
		const selectedFile = Array.isArray(selected) ? selected[0] : selected;
		setFilename(selectedFile ?? '');
	};

	const handleSave = async () => {
		const selected = await save({
			defaultPath: filename,
			filters: FILE_FORMATS,
		});
		const selectedFile = Array.isArray(selected) ? selected[0] : selected;
		if (selectedFile === undefined) return;
		if (selectedFile.endsWith('.ybf')) {
			invoke('save_ybf', {
				filename: selectedFile,
				content,
				// TODO: ask for password
				password: '1234',
			}).then(() => {
				console.log('saved');
			});
		} else {
			invoke('save_md', { filename: selectedFile, content }).then(() => {
				console.log('saved');
			});
		}
	};

	return (
		<>
			<button onClick={handleNew}>New</button>
			<button onClick={handleOpen}>Open</button>
			<button onClick={handleSave}>Save</button>
			<button onClick={switchEditorMode}>
				{editorMode === EditorMode.Edit ? 'Preview' : 'Edit'}
			</button>
			{editorMode === EditorMode.Preview ? (
				<Markdown>{content}</Markdown>
			) : (
				<Editor />
			)}
		</>
	);
}

export default App;
