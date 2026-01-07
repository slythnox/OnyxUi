import { useState } from 'react';
import Navbar from './ui/Navbar';
import SnippetMaker from './features/snippet-maker/SnippetMaker';
import IconMaker from './features/icon-maker/IconMaker';
import ColorSystemMaker from './features/color-system/ColorSystemMaker';

function App() {
  const [activeTab, setActiveTab] = useState<'code' | 'icons' | 'colors'>('code');

  return (
    <div className="min-h-screen bg-black">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="h-[calc(100vh-73px)] overflow-hidden">
        <div className="transition-all duration-400">
          {activeTab === 'code' ? (
            <SnippetMaker />
          ) : activeTab === 'icons' ? (
            <IconMaker />
          ) : (
            <ColorSystemMaker />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;