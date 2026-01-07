import { Code, Palette, Pipette } from 'lucide-react';

interface NavbarProps {
    activeTab: 'code' | 'icons' | 'colors';
    onTabChange: (tab: 'code' | 'icons' | 'colors') => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
    return (
        <header className="border-b border-zinc-800/50 backdrop-blur-sm bg-black/80 sticky top-0 z-50">
            <div className="container mx-auto px-4 lg:px-6 py-2">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center overflow-hidden">
                            <img src="/logo.png" alt="OnyxUi Logo" className="w-full h-full object-cover scale-[2.0]" />
                        </div>
                        <div>
                            <h1 className="text-sm lg:text-base font-bold text-white tracking-tight">OnyxUi</h1>
                            <p className="text-[10px] lg:text-xs text-zinc-400 hidden sm:block">Beautiful code snippets</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center gap-2">
                        <button
                            onClick={() => onTabChange('code')}
                            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg transition-all duration-300 text-xs lg:text-sm ${activeTab === 'code'
                                ? 'bg-primary-active'
                                : 'bg-zinc-900/50 text-zinc-300 hover:text-white hover:bg-zinc-800/50 border border-zinc-800'
                                }`}
                        >
                            <Code className="w-4 h-4" />
                            <span className="hidden sm:inline">Code</span>
                        </button>
                        <button
                            onClick={() => onTabChange('icons')}
                            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg transition-all duration-300 text-xs lg:text-sm ${activeTab === 'icons'
                                ? 'bg-primary-active'
                                : 'bg-zinc-900/50 text-zinc-300 hover:text-white hover:bg-zinc-800/50 border border-zinc-800'
                                }`}
                        >
                            <Palette className="w-4 h-4" />
                            <span className="hidden sm:inline">Icons</span>
                        </button>
                        <button
                            onClick={() => onTabChange('colors')}
                            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg transition-all duration-300 text-xs lg:text-sm ${activeTab === 'colors'
                                ? 'bg-primary-active'
                                : 'bg-zinc-900/50 text-zinc-300 hover:text-white hover:bg-zinc-800/50 border border-zinc-800'
                                }`}
                        >
                            <Pipette className="w-4 h-4" />
                            <span className="hidden sm:inline">Colors</span>
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
}

