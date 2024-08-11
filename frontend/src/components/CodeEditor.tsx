import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript'; // Import language modes
import { useSocket } from '../contexts/SocketContext';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  useEffect(() => {
    if (!editorRef.current) return;

    // Create the initial editor state
    const state = EditorState.create({
      doc: value,
      extensions: [basicSetup, javascript()],
    });

    // Create the editor view and attach it to the DOM
    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    // Update editor content when `value` prop changes
    const updateEditor = () => {
      const currentDoc = view.state.doc.toString();
      if (currentDoc !== value) {
        view.dispatch({
          changes: { from: 0, to: currentDoc.length, insert: value }
        });
      }
    };

    updateEditor();

    // Handle code changes and emit them through the socket
    const updateListener = () => {
      const newValue = view.state.doc.toString();
      onChange(newValue);
      socket.emit('codeChange', { room: 'room-id', code: newValue });
    };

    // Listen for updates in the editor
    view.update = () => {
      updateListener();
    };

    // Handle incoming code updates from the server
    socket.on('codeUpdate', (code: string) => {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: code }
      });
    });

    return () => {
      view.destroy();
    };
  }, [value, onChange, socket]);

  return <div ref={editorRef} style={{ height: '500px', border: '1px solid #ccc' }} />;
};

export default CodeEditor;
