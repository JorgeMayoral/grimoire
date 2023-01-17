import Editor, { Monaco } from '@monaco-editor/react';
import { useRef } from 'react';
import { editor as monacoEditor } from 'monaco-editor';

function App() {
  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor>();

  const handleEditorMount = (
    editor: monacoEditor.IStandaloneCodeEditor,
    _: Monaco,
  ) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      height="90vh"
      defaultLanguage="markdown"
      onMount={handleEditorMount}
    />
  );
}

export default App;
