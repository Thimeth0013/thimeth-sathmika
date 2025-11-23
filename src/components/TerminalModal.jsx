import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Minimize2, Maximize2, Square, Minus, Folder, FileText, ChevronRight } from 'lucide-react';

// Importing Data from your data files
import projectsData from '../data/projects';
import certificatesData from '../data/certificate';
import badgesData from '../data/badges';

const TerminalModal = ({ isOpen = true, onClose = () => {} }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // File System State
  const [currentPath, setCurrentPath] = useState('~');

  // Window States
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (bottomRef.current && !isMinimized) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, isMinimized]);

  // Focus input
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen, isMinimized]);

  const toggleMaximize = () => setIsMaximized(!isMaximized);

  // Helper: Format titles to "filename"
  const getProjectFileName = (title) => title.toLowerCase().replace(/\s+/g, '-');
  const getCertificateFileName = (title) => title.toLowerCase().replace(/\s+/g, '-');
  const getBadgeFileName = (title) => title.toLowerCase().replace(/\s+/g, '-');

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const rawInput = input.trim();
      const args = rawInput.split(' ');
      const cmd = args[0].toLowerCase();
      
      const newHistory = [...history, rawInput];
      setHistory(newHistory);
      setHistoryIndex(-1);

      // Create command line entry
      const cmdLine = (
        <div key={Date.now() + '-cmd'} className="mb-1">
          <span className="text-green-400 font-bold">guest@thimeth-portfolio</span>
          <span className="text-gray-400">:</span>
          <span className="text-blue-400 font-bold">{currentPath}</span>
          <span className="text-gray-400">$</span>{' '}
          <span className="text-gray-100">{rawInput}</span>
        </div>
      );

      let response = null;

      // --- COMMAND LOGIC ---

      switch (cmd) {
        case 'clear':
          setOutput([]);
          setInput('');
          return;
          
        case 'exit':
          onClose();
          setInput('');
          return;

        case 'help':
          response = (
            <div className="mb-2 text-gray-400 text-sm">
              <div>Available commands:</div>
              <div className="grid grid-cols-1 gap-1 mt-1 ml-2">
                <div><span className="text-yellow-400">ls</span>           - List directory content</div>
                <div><span className="text-yellow-400">cd [dir]</span>     - Change directory (projects/certificates/badges)</div>
                <div><span className="text-yellow-400">cat [file]</span>   - View file content</div>
                <div><span className="text-yellow-400">about</span>        - Who am I?</div>
                <div><span className="text-yellow-400">contact</span>      - Contact info</div>
                <div><span className="text-yellow-400">clear</span>        - Clear terminal</div>
                <div><span className="text-yellow-400">exit</span>         - Close terminal</div>
              </div>
            </div>
          );
          break;

        case 'about':
          response = (
            <div className="mb-2">
              <span className="text-purple-400 font-bold">USER_INFO:</span>
              <p className="mt-1 text-gray-300">
                Hi, I'm Thimeth Sathmika.
                I'm a Software Engineering undergrad from Colombo, Sri Lanka, specializing in full-stack development with a strong focus on frontend engineering. Over 3 years of experience working with modern web technologies, creating interactive and detail-oriented UIs, while bridging design and code to deliver seamless user experiences.
              </p>
            </div>
          );
          break;

        case 'contact':
          response = (
            <div className="mb-2">
              <span className="text-pink-400 font-bold">CONTACT_DETAILS:</span>
              <div className="mt-2 ml-4 text-sm text-gray-300 space-y-1">
                <div>📧 Email: <a href="mailto:sathmikakb@gmail.com" className="hover:underline text-blue-400">sathmikakb@gmail.com</a></div>
                <div>🐙 Github: <a href="https://github.com/Thimeth0013" target="_blank" rel="noreferrer" className="hover:underline text-blue-400">Thimeth0013</a></div>
                <div>🎨 Behance: <a href="https://www.behance.net/thimethsathmika" target="_blank" rel="noreferrer" className="hover:underline text-blue-400">thimethsathmika</a></div>
                <div>💼 LinkedIn: <a href="https://www.linkedin.com/in/thimeth-sathmika/" target="_blank" rel="noreferrer" className="hover:underline text-blue-400">thimeth-sathmika</a></div>
              </div>
            </div>
          );
          break;

        // --- FILE SYSTEM COMMANDS ---

        case 'ls':
          if (currentPath === '~') {
            response = (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2 text-sm">
                <span className="text-blue-400 font-bold flex items-center gap-1"><Folder size={14}/> projects/</span>
                <span className="text-blue-400 font-bold flex items-center gap-1"><Folder size={14}/> certificates/</span>
                <span className="text-blue-400 font-bold flex items-center gap-1"><Folder size={14}/> badges/</span>
                <span className="text-gray-300 flex items-center gap-1"><FileText size={14}/> about</span>
                <span className="text-gray-300 flex items-center gap-1"><FileText size={14}/> contact</span>
              </div>
            );
          } else if (currentPath === '~/projects') {
            response = (
              <div className="mb-2">
                <div className="text-gray-400 text-xs mb-2">Total {projectsData.length} projects found:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                  {projectsData.map((p, i) => (
                    <span key={i} className="text-green-400 flex items-center gap-1">
                      <FileText size={14}/> {getProjectFileName(p.title)}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-500">Tip: Type <span className="text-yellow-400">cat [filename]</span> to view details.</div>
              </div>
            );
          } else if (currentPath === '~/certificates') {
            response = (
              <div className="mb-2">
                <div className="text-gray-400 text-xs mb-2">Total {certificatesData.length} certificates found:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                  {certificatesData.map((c, i) => (
                    <span key={i} className="text-green-400 flex items-center gap-1">
                      <FileText size={14}/> {getCertificateFileName(c.title)}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-500">Tip: Type <span className="text-yellow-400">cat [filename]</span> to view details.</div>
              </div>
            );
          } else if (currentPath === '~/badges') {
            response = (
              <div className="mb-2">
                <div className="text-gray-400 text-xs mb-2">Total {badgesData.length} badges found:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                  {badgesData.map((b, i) => (
                    <span key={i} className="text-yellow-400 flex items-center gap-1">
                      <FileText size={14}/> {getBadgeFileName(b.title)}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-500">Tip: Type <span className="text-yellow-400">cat [filename]</span> to view details.</div>
              </div>
            );
          }
          break;

        case 'cd':
          const targetDir = args[1];
          if (!targetDir || targetDir === '~') {
            setCurrentPath('~');
          } else if (targetDir === 'projects' || targetDir === 'projects/') {
            if (currentPath === '~') setCurrentPath('~/projects');
            else response = <div className="text-red-400 mb-2">bash: cd: {targetDir}: No such file or directory</div>;
          } else if (targetDir === 'certificates' || targetDir === 'certificates/') {
            if (currentPath === '~') setCurrentPath('~/certificates');
            else response = <div className="text-red-400 mb-2">bash: cd: {targetDir}: No such file or directory</div>;
          } else if (targetDir === 'badges' || targetDir === 'badges/') {
            if (currentPath === '~') setCurrentPath('~/badges');
            else response = <div className="text-red-400 mb-2">bash: cd: {targetDir}: No such file or directory</div>;
          } else if (targetDir === '..' || targetDir === '../') {
            if (currentPath === '~/projects' || currentPath === '~/certificates' || currentPath === '~/badges') {
              setCurrentPath('~');
            }
          } else if (targetDir === '.') {
            // Current directory - do nothing
          } else {
            response = <div className="text-red-400 mb-2">bash: cd: {targetDir}: No such file or directory</div>;
          }
          break;

        case 'cat':
        case 'open':
        case 'view':
          const fileName = args[1];
          if (!fileName) {
            response = <div className="text-red-400 mb-2">Usage: cat [filename]</div>;
            break;
          }

          if (currentPath === '~') {
            // Handle root files
            if (fileName === 'about') {
                response = (
                  <div className="mb-2">
                    <span className="text-purple-400 font-bold">USER_INFO:</span>
                    <p className="mt-1 text-gray-300">
                      Hi, I'm Thimeth Sathmika.
                      I'm a Software Engineering undergrad from Colombo, Sri Lanka, specializing in full-stack development with a strong focus on frontend engineering. Over 3 years of experience working with modern web technologies, creating interactive and detail-oriented UIs, while bridging design and code to deliver seamless user experiences.
                    </p>
                  </div>
                );
            } else if (fileName === 'contact') {
                response = (
                  <div className="mb-2">
                    <span className="text-pink-400 font-bold">CONTACT_DETAILS:</span>
                    <div className="mt-2 ml-4 text-sm text-gray-300 space-y-1">
                      <div>📧 Email: <a href="mailto:sathmikakb@gmail.com" className="hover:underline text-blue-400">sathmikakb@gmail.com</a></div>
                      <div>🐙 Github: <a href="https://github.com/Thimeth0013" target="_blank" rel="noreferrer" className="hover:underline text-blue-400">Thimeth0013</a></div>
                      <div>🎨 Behance: <a href="https://www.behance.net/thimethsathmika" target="_blank" rel="noreferrer" className="hover:underline text-blue-400">thimethsathmika</a></div>
                      <div>💼 LinkedIn: <a href="https://www.linkedin.com/in/thimeth-sathmika/" target="_blank" rel="noreferrer" className="hover:underline text-blue-400">thimeth-sathmika</a></div>
                    </div>
                  </div>
                );
            } else {
                response = <div className="text-red-400 mb-2">File not found. Try 'ls' to see files or 'cd [folder]' to enter directories.</div>;
            }
          } else if (currentPath === '~/projects') {
            // Find project
            const project = projectsData.find(p => getProjectFileName(p.title) === fileName.toLowerCase());
            
            if (project) {
              response = (
                <div className="mb-4 border border-gray-700 p-4 rounded bg-gray-900/50">
                  <div className="flex items-start justify-between mb-4 border-b border-gray-700 pb-2">
                     <div>
                        <h3 className="text-xl font-bold text-green-400">{project.title}</h3>
                        <div className="flex gap-2 text-xs mt-1">
                            {project.tags && project.tags.map((tag, i) => (
                                <span key={i} className="bg-gray-800 px-2 py-0.5 rounded text-blue-300">{tag}</span>
                            ))}
                        </div>
                     </div>
                     <span className={`text-xs px-2 py-1 rounded ${project.status === 'ongoing' ? 'bg-yellow-900/50 text-yellow-200' : 'bg-green-900/50 text-green-200'}`}>
                        {project.status || 'completed'}
                     </span>
                  </div>

                  <div className="space-y-4 text-sm">
                      <div>
                        <span className="text-blue-400 font-bold block mb-1">Description:</span>
                        <p className="text-gray-300 leading-relaxed">{project.description}</p>
                      </div>

                      {project.problem && (
                        <div>
                            <span className="text-red-400 font-bold block mb-1">The Problem:</span>
                            <p className="text-gray-400 leading-relaxed text-xs">{project.problem}</p>
                        </div>
                      )}

                      {project.impact && (
                        <div>
                            <span className="text-green-400 font-bold block mb-1">Impact:</span>
                            <p className="text-gray-400 leading-relaxed text-xs">{project.impact}</p>
                        </div>
                      )}

                      {project.keyFeatures && (
                        <div>
                            <span className="text-yellow-400 font-bold block mb-1">Key Features:</span>
                            <ul className="list-disc list-inside text-gray-400 text-xs">
                                {project.keyFeatures.map((f, i) => <li key={i}>{f}</li>)}
                            </ul>
                        </div>
                      )}
                  </div>

                  <div className="flex gap-4 text-sm mt-4 border-t border-gray-700 pt-3">
                    {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-green-400 hover:underline flex items-center gap-1"><ChevronRight size={14}/> View Code</a>}
                    {project.liveLink && <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1"><ChevronRight size={14}/> Live Demo</a>}
                    {project.designLink && <a href={project.designLink} target="_blank" rel="noreferrer" className="text-pink-400 hover:underline flex items-center gap-1"><ChevronRight size={14}/> Design</a>}
                  </div>
                </div>
              );
            } else {
              response = <div className="text-red-400 mb-2">bash: cat: {fileName}: No such file or directory</div>;
            }
          } else if (currentPath === '~/certificates') {
            // Find certificate
            const certificate = certificatesData.find(c => getCertificateFileName(c.title) === fileName.toLowerCase());
            
            if (certificate) {
              response = (
                <div className="mb-4 border border-green-700 p-4 rounded bg-gray-900/50">
                  <div className="mb-4 border-b border-gray-700 pb-2">
                    <h3 className="text-xl font-bold text-green-400">{certificate.title}</h3>
                    <div className="text-xs text-gray-500 mt-1">{certificate.company} | {certificate.date}</div>
                  </div>

                  <div className="space-y-3 text-sm">
                    {certificate.description && (
                      <div>
                        <span className="text-blue-400 font-bold block mb-1">Description:</span>
                        <p className="text-gray-300 leading-relaxed">{certificate.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 text-sm mt-4 border-t border-gray-700 pt-3">
                    {certificate.certificateUrl && (
                      <a href={certificate.certificateUrl} target="_blank" rel="noreferrer" className="text-green-400 hover:underline flex items-center gap-1">
                        <ChevronRight size={14}/> View Certificate
                      </a>
                    )}
                    {certificate.companyUrl && (
                      <a href={certificate.companyUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                        <ChevronRight size={14}/> Company Website
                      </a>
                    )}
                  </div>
                </div>
              );
            } else {
              response = <div className="text-red-400 mb-2">bash: cat: {fileName}: No such file or directory</div>;
            }
          } else if (currentPath === '~/badges') {
            // Find badge
            const badge = badgesData.find(b => getBadgeFileName(b.title) === fileName.toLowerCase());
            
            if (badge) {
              response = (
                <div className="mb-4 border border-yellow-700 p-4 rounded bg-gray-900/50">
                  <div className="mb-4 border-b border-gray-700 pb-2">
                    <h3 className="text-xl font-bold text-yellow-400">{badge.title}</h3>
                    <div className="text-xs text-gray-500 mt-1">{badge.issuer} | {badge.dateEarned}</div>
                  </div>

                  <div className="space-y-3 text-sm">
                    {badge.description && (
                      <div>
                        <span className="text-blue-400 font-bold block mb-1">Description:</span>
                        <p className="text-gray-300 leading-relaxed">{badge.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 text-sm mt-4 border-t border-gray-700 pt-3">
                    {badge.badgeUrl && (
                      <a href={badge.badgeUrl} target="_blank" rel="noreferrer" className="text-yellow-400 hover:underline flex items-center gap-1">
                        <ChevronRight size={14}/> View Badge
                      </a>
                    )}
                    {badge.issuerUrl && (
                      <a href={badge.issuerUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                        <ChevronRight size={14}/> Issuer Website
                      </a>
                    )}
                  </div>
                </div>
              );
            } else {
              response = <div className="text-red-400 mb-2">bash: cat: {fileName}: No such file or directory</div>;
            }
          }
          break;

        default:
           if (currentPath === '~/projects' && projectsData.find(p => getProjectFileName(p.title) === cmd)) {
             response = <div className="text-gray-400 mb-2">Did you mean: <span className="text-yellow-400">cat {cmd}</span>?</div>;
           } else if (currentPath === '~/certificates' && certificatesData.find(c => getCertificateFileName(c.title) === cmd)) {
             response = <div className="text-gray-400 mb-2">Did you mean: <span className="text-yellow-400">cat {cmd}</span>?</div>;
           } else if (currentPath === '~/badges' && badgesData.find(b => getBadgeFileName(b.title) === cmd)) {
             response = <div className="text-gray-400 mb-2">Did you mean: <span className="text-yellow-400">cat {cmd}</span>?</div>;
           } else if (rawInput !== '') {
             response = <div className="text-red-400 mb-2">bash: {cmd}: command not found</div>;
           }
      }

      if (rawInput !== 'clear') {
        setOutput((prev) => [...prev, cmdLine, response]);
      }
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const rawInput = input.trim().toLowerCase();
      
      if (currentPath === '~/projects') {
          const args = rawInput.split(' ');
          const partial = args[args.length - 1];
          
          if (partial.length > 0) {
              const matches = projectsData
                .map(p => getProjectFileName(p.title))
                .filter(name => name.startsWith(partial));
                
              if (matches.length === 1) {
                  const prefix = args.slice(0, args.length - 1).join(' ');
                  setInput((prefix ? prefix + ' ' : '') + matches[0]);
              }
          }
      } else if (currentPath === '~/certificates') {
          const args = rawInput.split(' ');
          const partial = args[args.length - 1];
          
          if (partial.length > 0) {
              const matches = certificatesData
                .map(c => getCertificateFileName(c.title))
                .filter(name => name.startsWith(partial));
                
              if (matches.length === 1) {
                  const prefix = args.slice(0, args.length - 1).join(' ');
                  setInput((prefix ? prefix + ' ' : '') + matches[0]);
              }
          }
      } else if (currentPath === '~/badges') {
          const args = rawInput.split(' ');
          const partial = args[args.length - 1];
          
          if (partial.length > 0) {
              const matches = badgesData
                .map(b => getBadgeFileName(b.title))
                .filter(name => name.startsWith(partial));
                
              if (matches.length === 1) {
                  const prefix = args.slice(0, args.length - 1).join(' ');
                  setInput((prefix ? prefix + ' ' : '') + matches[0]);
              }
          }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className={`fixed z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-200
        ${isMaximized ? 'inset-0' : 'inset-0'} 
        ${isMinimized ? 'items-end justify-start pointer-events-none' : ''}`}
    >
      <div 
        className={`bg-[#1a1b26] rounded-lg shadow-2xl border border-gray-700 flex flex-col font-mono overflow-hidden ring-1 ring-white/10 transition-all duration-300
        ${isMaximized ? 'w-full h-full rounded-none' : 'w-full max-w-3xl h-[80vh]'}
        ${isMinimized ? 'h-10 w-64 mb-0 ml-4 pointer-events-auto' : ''}`}
      >
        
        {/* Terminal Header */}
        <div 
            className="bg-[#24283b] px-4 py-2 flex items-center justify-between border-b border-gray-800 select-none cursor-grab active:cursor-grabbing"
            onDoubleClick={toggleMaximize}
        >
          <div className="text-gray-400 text-xs flex items-center gap-2">
            <Terminal size={14} className="text-green-400" />
            <span>guest@thimeth-portfolio:{currentPath}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-700 rounded text-gray-500 hover:text-white transition-colors cursor-default">
                <Minus size={14} />
            </button>
            <button onClick={toggleMaximize} className="p-1 hover:bg-gray-700 rounded text-gray-500 hover:text-white transition-colors">
                {isMaximized ? <Minimize2 size={14} /> : <Square size={12} />}
            </button>
            <button onClick={onClose} className="p-1 hover:bg-red-600 rounded text-gray-500 hover:text-white transition-colors ml-1">
                <X size={16} />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        {!isMinimized && (
            <div 
              className="flex-1 p-4 overflow-y-auto custom-scrollbar"
              onClick={() => inputRef.current?.focus()}
            >
              <div className="mb-6 text-gray-400 text-sm">
                <div className="mb-2">Welcome to Thimeth's Interactive Terminal v1.0.6</div>
                <div className="mb-6 text-gray-400 text-sm">
                  <div className="mb-4">(c) 2025 Thimeth Sathmika. All rights reserved.</div>
<pre className="text-green-400 text-xs md:text-sm leading-tight font-bold mb-0 opacity-75 hidden sm:block">
    {`
████████╗██╗  ██╗██╗███╗   ███╗███████╗████████╗██╗  ██╗
╚══██╔══╝██║  ██║██║████╗ ████║██╔════╝╚══██╔══╝██║  ██║
   ██║   ███████║██║██╔████╔██║█████╗     ██║   ███████║
   ██║   ██╔══██║██║██║╚██╔╝██║██╔══╝     ██║   ██╔══██║
   ██║   ██║  ██║██║██║ ╚═╝ ██║███████╗   ██║   ██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝
    `}
</pre>
                </div>
                <div>Type <span className="text-yellow-400">'help'</span> to see available commands.</div>
              </div>

              <div className="space-y-1">
                {output.map((line, i) => line)}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-400 font-bold">guest@thimeth-portfolio</span>
                <span className="text-gray-400">:</span>
                <span className="text-blue-400 font-bold">{currentPath}</span>
                <span className="text-gray-400">$</span>
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleCommand}
                    autoComplete="off"
                    className="w-full bg-transparent border-none outline-none text-gray-100 font-mono caret-transparent"
                    autoFocus
                  />
                  <div 
                    className="absolute top-0 h-5 w-2.5 bg-gray-400 opacity-50 animate-pulse pointer-events-none"
                    style={{ left: `${input.length}ch` }}
                  ></div>
                </div>
              </div>
              <div ref={bottomRef} />
            </div>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1b26;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #414868;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #565f89;
        }
      `}</style>
    </div>
  );
};

export default TerminalModal;