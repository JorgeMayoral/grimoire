import Editor, { Monaco } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { editor as monacoEditor } from 'monaco-editor';
import { open, save } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api';

function App() {
	const [content, setContent] = useState<string>('');
	const [filename, setFilename] = useState<string>('');
	const editorRef = useRef<monacoEditor.IStandaloneCodeEditor>();

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

	const handleEditorMount = (
		editor: monacoEditor.IStandaloneCodeEditor,
		_: Monaco,
	) => {
		editorRef.current = editor;
	};

	const handleChange = (value: string | undefined) => {
		if (value !== undefined) {
			setContent(value);
		}
	};

	const handleNew = () => {
		setContent('');
		setFilename('');
	};

	const handleOpen = async () => {
		const selected = await open({
			multiple: false,
			filters: [
				{
					name: 'Markdown',
					extensions: ['md'],
				},
				{
					name: "Yorch's binary file",
					extensions: ['ybf'],
				},
			],
		});
		const selectedFile = Array.isArray(selected) ? selected[0] : selected;
		setFilename(selectedFile ?? '');
	};

	const handleSave = async () => {
		const selected = await save({
			defaultPath: filename,
			filters: [
				{
					name: 'Markdown',
					extensions: ['md'],
				},
				{
					name: "Yorch's binary file",
					extensions: ['ybf'],
				},
			],
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
			<Editor
				height="90vh"
				defaultLanguage="markdown"
				onMount={handleEditorMount}
				value={content}
				onChange={handleChange}
			/>
		</>
	);
}

export default App;
