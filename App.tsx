import React, { useState } from 'react';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import { AppView } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.GENERATE);

  const NavButton: React.FC<{
    currentView: AppView;
    targetView: AppView;
    onClick: (view: AppView) => void;
    children: React.ReactNode;
    icon: React.ReactNode;
  }> = ({ currentView, targetView, onClick, children, icon }) => (
    <button
      onClick={() => onClick(targetView)}
      className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition ${
        currentView === targetView
          ? 'bg-cyan-500 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {icon}
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-600">
            AI Image Studio
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Create stunning images and edit any image with the power of AI.
          </p>
        </header>

        <nav className="flex justify-center gap-4 mb-8">
          <NavButton
            currentView={view}
            targetView={AppView.GENERATE}
            onClick={setView}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>}
          >
            Image Generator
          </NavButton>
          <NavButton
            currentView={view}
            targetView={AppView.EDIT}
            onClick={setView}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>}
          >
            AI Image Editor
          </NavButton>
        </nav>

        <main className="flex justify-center">
          {view === AppView.GENERATE ? <ImageGenerator /> : <ImageEditor />}
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by AI Image Studio</p>
        </footer>
      </div>
    </div>
  );
};

export default App;