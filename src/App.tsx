import React, { useState } from 'react';
import Terminal from './components/Terminal';
import DesktopIcon from './components/DesktopIcon';
import Window from './components/Window';
import './App.css';

interface CommandHistoryItem {
  command: string;
  output: string;
}

interface WindowState {
  id: number;
  title: string;
  component: string;
  isOpen: boolean;
  isMinimize: boolean;
  zIndex: number;
}

interface Files {
  [key: string]: string;
}

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 1, title: 'Terminal', component: 'Terminal', isOpen: true, isMinimize: false, zIndex: 1 }
  ]);
  const [activeWindow, setActiveWindow] = useState<number>(1);
  const [files] = useState<Files>({
    'about.txt': 'Hi! I\'m a passionate developer who loves building cool projects.\nThis terminal portfolio showcases my skills in a fun, interactive way!',
    'skills.txt': 'Languages: JavaScript, TypeScript, Python, React, Node.js\nFrameworks: React Native, Express, Next.js\nTools: Git, Docker, AWS',
    'projects.txt': '1. Urban Flow Tracker - React Native driving app\n2. Portfolio Terminal - This portfolio!\n3. More coming soon...',
    'contact.txt': 'Email: your@email.com\nGitHub: github.com/yourusername\nTwitter: @yourhandle',
    'socials.txt': 'GitHub: github.com/yourusername\nLinkedIn: linkedin.com/in/yourname\nTwitter: @yourhandle'
  });
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([
    { command: 'help', output: 'Available commands: help, ls, cat, clear, whoami, date, echo, pwd, uname, neofetch' },
    { command: 'ls', output: Object.keys(files).join('  ') },
    { command: 'cat about.txt', output: files['about.txt'] }
  ]);

  const bringToFront = (id: number): void => {
    const maxZ = Math.max(...windows.map(w => w.zIndex));
    setWindows(windows.map(w => 
      w.id === id ? { ...w, zIndex: maxZ + 1, isMinimize: false } : w
    ));
    setActiveWindow(id);
  };

  const minimizeWindow = (id: number): void => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMinimize: true } : w
    ));
  };

  const closeWindow = (id: number): void => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const openTerminal = (): void => {
    const newId = Math.max(...windows.map(w => w.id)) + 1;
    setWindows([...windows, { 
      id: newId, 
      title: 'Terminal', 
      component: 'Terminal', 
      isOpen: true, 
      isMinimize: false, 
      zIndex: Math.max(...windows.map(w => w.zIndex)) + 1 
    }]);
    setActiveWindow(newId);
  };

  const executeCommand = (cmd: string): void => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    let output = '';

    switch (command) {
      case 'help':
        output = `Available commands:
  help     - Show this help message
  ls       - List files
  cat      - Display file contents
  clear    - Clear terminal
  whoami   - Display current user
  date     - Show current date and time
  echo     - Print text
  pwd      - Print working directory
  uname    - System information
  neofetch - System info with ASCII art
  open     - Open an application
  cls      - Clear screen
  exit     - Close terminal

Try 'neofetch' for a cool system info!`;
        break;
      case 'ls':
      case 'dir':
        output = Object.keys(files).join('  ');
        break;
      case 'cat':
        if (args[0] && files[args[0]]) {
          output = files[args[0]];
        } else if (args[0]) {
          output = `cat: ${args[0]}: No such file or directory`;
        } else {
          output = 'usage: cat <filename>';
        }
        break;
      case 'clear':
      case 'cls':
        setCommandHistory([]);
        return;
      case 'whoami':
        output = 'visitor@portfolio';
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'echo':
        output = args.join(' ');
        break;
      case 'pwd':
        output = '/home/visitor';
        break;
      case 'uname':
        if (args[0] === '-a') {
          output = 'PortfolioOS 1.0.0 x86_64 GNU/Linux';
        } else {
          output = 'PortfolioOS';
        }
        break;
      case 'neofetch':
        output = `
        .--.
       |o_o |
       |:_/ |
      //   \\ \\
     (|     | )
    /'\\_   _/\`\\
    \\___)=(___/

   Portfolio Terminal v1.0
   -----------------------
   OS: PortfolioOS
   Host: Web Browser
   Kernel: JavaScript
   Shell: Custom Terminal
   Terminal: React
   CPU: Your Imagination
   Memory: Unlimited Potential`;
        break;
      case 'open':
        if (args[0] === 'terminal') {
          openTerminal();
          output = 'Opening new terminal...';
        } else {
          output = `open: ${args[0]}: Command not found`;
        }
        break;
      case 'exit':
        output = 'To close terminal, click the X button or type close';
        break;
      case '':
        output = '';
        break;
      default:
        output = `${command}: command not found. Type 'help' for available commands.`;
    }

    setCommandHistory([...commandHistory, { command: cmd, output }]);
  };

  return (
    <div className="app">
      {/* Desktop Icons */}
      <div className="desktop">
        <DesktopIcon 
          name="Terminal" 
          icon="💻" 
          onClick={openTerminal}
        />
        <DesktopIcon 
          name="About" 
          icon="👤" 
          onClick={() => executeCommand('cat about.txt')}
        />
        <DesktopIcon 
          name="Projects" 
          icon="📁" 
          onClick={() => executeCommand('cat projects.txt')}
        />
        <DesktopIcon 
          name="Contact" 
          icon="✉️" 
          onClick={() => executeCommand('cat contact.txt')}
        />
      </div>

      {/* Windows */}
      {windows.filter(w => !w.isMinimize).map(window => (
        <Window
          key={window.id}
          window={window}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onFocus={() => bringToFront(window.id)}
          activeWindow={activeWindow === window.id}
        >
          {window.component === 'Terminal' && (
            <Terminal 
              commandHistory={commandHistory}
              onExecute={executeCommand}
            />
          )}
        </Window>
      ))}

      {/* Taskbar */}
      <div className="taskbar">
        <div className="start-button">🪟 Start</div>
        <div className="taskbar-items">
          {windows.map(w => (
            <div 
              key={w.id}
              className={`taskbar-item ${activeWindow === w.id ? 'active' : ''} ${w.isMinimize ? 'minimize' : ''}`}
              onClick={() => w.isMinimize ? bringToFront(w.id) : minimizeWindow(w.id)}
            >
              {w.title}
            </div>
          ))}
        </div>
        <div className="clock">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default App;
