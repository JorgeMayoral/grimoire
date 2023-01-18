import Editor, { Monaco } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { editor as monacoEditor } from 'monaco-editor';
import { event, tauri } from '@tauri-apps/api';

function App() {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    let fileLoadUnlisten: Function = () => {};
    event
      .listen<string>('load_file', (ev) => {
        setContent(ev.payload);
      })
      .then((fn) => (fileLoadUnlisten = fn));

    return () => {
      fileLoadUnlisten();
    };
  }, []);

  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor>();

  const handleEditorMount = (
    editor: monacoEditor.IStandaloneCodeEditor,
    _: Monaco,
  ) => {
    editorRef.current = editor;
  };

  const handleChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
      tauri.invoke('sync_editor_content', { content: value });
    }
  };

  return (
    <Editor
      height="90vh"
      defaultLanguage="markdown"
      onMount={handleEditorMount}
      value={content}
      onChange={handleChange}
    />
  );
}

export default App;
