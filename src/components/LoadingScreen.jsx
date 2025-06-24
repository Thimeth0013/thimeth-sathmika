import { useEffect, useState } from 'react';

export const LoadingScreen = ({ onComplete }) => {
  const [text, setText] = useState('');
  const [fullText, setFullText] = useState('');

  const loadingMessages = [
    "Gathering assets...",
    "Initializing...",
    "Waking up components...",
    "Loading resources...",
    "Establishing connection...",
    "Booting system...",
    "Compiling magic...",
    "Rendering UI...",
    "Summoning React...",
  ];

  useEffect(() => {
    // Pick a random message from the list
    const randomText = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    setFullText(randomText);

    let index = 0;
    const interval = setInterval(() => {
      setText(randomText.substring(0, index));
      index++;

      if (index > randomText.length) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black text-gray-100 flex flex-col items-center justify-center">
      <div className="mb-4 text-sm font-mono font-bold text-blue-500">
        {text}
      </div>
      <div className="w-[200px] h-[2px] bg-gray-800 rounded relative overflow-hidden">
        <div className="w-[40%] h-full bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-loading-bar"></div>
      </div>
    </div>
  );
};
