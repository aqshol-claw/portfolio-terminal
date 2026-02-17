import React, { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import './Terminal.css';

interface TerminalProps {
  commandHistory: { command: string; output: string }[];
  onExecute: (cmd: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({ commandHistory, onExecute }) => {
  const [input, setInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      if (input.trim()) {
        onExecute(input);
        setInput('');
      }
    }
  };

  const focusInput = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div className="terminal" ref={terminalRef} onClick={focusInput}>
      {/* Welcome Message */}
      <div className="terminal-line output">
{`
╔════════════════════════════════════════════════════════════════════════╗
║                                                                ║
║   ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗   ║
║   ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗  ║
║      ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║  ║
║      ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║  ║
║      ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║  ║
║      ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝  ║
║                                                                ║
║   Welcome to Portfolio Terminal v1.0.0                        ║
║   Type 'help' to see available commands.                       ║
║   Type 'neofetch' for system information!                     ║
║                                                                ║
╚════════════════════════════════════════════════════════════════════════╝
`}
      </div>

      {/* Command History */}
      {commandHistory.map((item, index) => (
        <div key={index}>
          <div className="terminal-line command">
            <span className="prompt">visitor@portfolio:~$</span> {item.command}
          </div>
          {item.output && (
            <div className={`terminal-line output ${item.output.includes('not found') ? 'error' : ''}`}>
              {item.output}
            </div>
          )}
        </div>
      ))}

      {/* Input Line */}
      <div className="terminal-input-line">
        <span className="terminal-prompt">visitor@portfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
          autoFocus
        />
      </div>
    </div>
  );
};

export default Terminal;
