import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import { useSocket } from './contexts/SocketContext';

const App: React.FC = () => {
  const [code, setCode] = useState('');
  const socket = useSocket();

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    socket.emit('codeChange', { room: 'room-id', code: newCode });
  };

  return (
    <div>
      <CodeEditor language="javascript" value={code} onChange={handleCodeChange} />
    </div>
  );
};

export default App;
