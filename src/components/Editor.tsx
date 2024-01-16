import MonacoEditor, { Monaco } from '@monaco-editor/react';
import { editor as monacoEditor } from 'monaco-editor';
import { useRef } from 'react';
import { useContentStore } from '../hooks/useContentStore';

export const Editor = () => {
	const editorRef = useRef<monacoEditor.IStandaloneCodeEditor>();

	const handleEditorMount = (
		editor: monacoEditor.IStandaloneCodeEditor,
		_: Monaco,
	) => {
		editorRef.current = editor;
	};

	const { content, setContent } = useContentStore((state) => state);

	return (
		<MonacoEditor
			className="w-full pt-4"
			defaultLanguage="markdown"
			onMount={handleEditorMount}
			value={content}
			onChange={setContent}
		/>
	);
};
