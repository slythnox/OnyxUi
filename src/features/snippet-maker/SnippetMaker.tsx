import React, { useState, useRef, useCallback } from 'react';
import { Download, Copy, Check, AlertCircle } from 'lucide-react';
import { CodeSettings } from './types';
import { ExportState } from '../../types';
import { CODE_THEMES, BACKGROUND_OPTIONS, LANGUAGES, DEFAULT_CODE } from '../../logic/constants';
import { highlightCode } from '../../logic/syntax-highlighter';
import { exportToPng, copyToClipboard, generateFilename } from '../../logic/image-export';


export default function SnippetMaker() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState<CodeSettings>({
    theme: 'amoled',
    background: 'purple',
    padding: 32,
    showLineNumbers: true,
    showWindowControls: true,
    language: 'javascript',
    fontFamily: 'JetBrains Mono',
    fontSize: 14
  });
  const [exportState, setExportState] = useState<ExportState>({
    isExporting: false,
    success: false,
    error: null
  });

  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resetExportState = useCallback(() => {
    setTimeout(() => {
      setExportState({ isExporting: false, success: false, error: null });
    }, 2000);
  }, []);

  const handleExport = async () => {
    if (!previewRef.current) return;

    setIsEditing(false);

    setTimeout(async () => {
      setExportState({ isExporting: true, success: false, error: null });

      try {
        const filename = generateFilename('code-snippet');
        await exportToPng(previewRef.current!, filename);
        setExportState({ isExporting: false, success: true, error: null });
        resetExportState();
      } catch (error) {
        setExportState({ isExporting: false, success: false, error: 'Failed to export image' });
        resetExportState();
      }
    }, 100);
  };

  const handleCopyToClipboard = async () => {
    if (!previewRef.current) return;

    setIsEditing(false);

    setTimeout(async () => {
      setExportState({ isExporting: true, success: false, error: null });

      try {
        await copyToClipboard(previewRef.current!);
        setExportState({ isExporting: false, success: true, error: null });
        resetExportState();
      } catch (error) {
        setExportState({ isExporting: false, success: false, error: 'Failed to copy to clipboard' });
        resetExportState();
      }
    }, 100);
  };

  const updateSettings = (key: keyof CodeSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleCodeClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleCodeBlur = () => {
    setIsEditing(false);
  };

  const selectedTheme = CODE_THEMES.find(t => t.value === settings.theme);
  const selectedBackground = BACKGROUND_OPTIONS.find(b => b.value === settings.background);
  const highlightedCode = highlightCode(code);

  return (
    <div className="h-full flex flex-col">
      {/* Mobile Layout - Full Height Management */}
      <div className="lg:hidden h-full flex flex-col">
        {/* Controls Section - Flexible Height, Scrollable */}
        <div className="flex-shrink-0 max-h-[45vh] bg-zinc-950 border border-zinc-800/50 rounded-2xl m-4 mb-2 overflow-hidden flex flex-col">
          <div className="h-full overflow-y-auto scrollbar-minimal p-4">
            <div className="space-y-4">
              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {CODE_THEMES.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => updateSettings('theme', theme.value)}
                      className={`w-full p-2 rounded-xl border transition-all duration-300 text-left group ${settings.theme === theme.value
                        ? 'border-primary bg-zinc-900 shadow-lg '
                        : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-xs">{theme.name}</span>
                        <div
                          className="w-3 h-3 rounded border border-zinc-700 shadow-inner flex-shrink-0"
                          style={{ backgroundColor: theme.background }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Background</label>
                <div className="grid grid-cols-3 gap-2">
                  {BACKGROUND_OPTIONS.map((bg) => (
                    <button
                      key={bg.value}
                      onClick={() => updateSettings('background', bg.value)}
                      className={`p-2 rounded-xl border transition-all duration-300 group ${settings.background === bg.value
                        ? 'border-primary ring-1 ring-primary shadow-lg '
                        : 'border-zinc-800 hover:border-zinc-700'
                        }`}
                    >
                      <div
                        className="w-full h-3 rounded mb-1 shadow-inner"
                        style={{ background: bg.gradient }}
                      />
                      <span className="text-xs text-zinc-400 group-hover:text-white transition-colors block truncate">
                        {bg.name.replace(' Gradient', '')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language and Controls Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSettings('language', e.target.value)}
                    className="w-full select-field text-sm"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value} className="bg-gray-900/90">
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs font-medium text-white">Lines</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings.showLineNumbers}
                        onChange={(e) => updateSettings('showLineNumbers', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-8 h-4 rounded-full transition-all duration-300 ${settings.showLineNumbers
                        ? 'bg-gradient-to-r bg-primary shadow-lg'
                        : 'bg-white/20'
                        }`}>
                        <div className={`w-3 h-3 bg-white rounded-full shadow-lg transform transition-transform duration-300 mt-0.5 ${settings.showLineNumbers ? 'translate-x-4' : 'translate-x-0.5'
                          }`} />
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs font-medium text-white">Window</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings.showWindowControls}
                        onChange={(e) => updateSettings('showWindowControls', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-8 h-4 rounded-full transition-all duration-300 ${settings.showWindowControls
                        ? 'bg-gradient-to-r bg-primary shadow-lg'
                        : 'bg-white/20'
                        }`}>
                        <div className={`w-3 h-3 bg-white rounded-full shadow-lg transform transition-transform duration-300 mt-0.5 ${settings.showWindowControls ? 'translate-x-4' : 'translate-x-0.5'
                          }`} />
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-white">Padding</label>
                    <span className="text-xs text-zinc-400 font-mono bg-zinc-900 px-1.5 py-0.5 rounded">
                      {settings.padding}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="64"
                    value={settings.padding}
                    onChange={(e) => updateSettings('padding', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-white">Font Size</label>
                    <span className="text-xs text-zinc-400 font-mono bg-zinc-900 px-1.5 py-0.5 rounded">
                      {settings.fontSize}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="20"
                    value={settings.fontSize}
                    onChange={(e) => updateSettings('fontSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Export Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                <button
                  onClick={handleExport}
                  disabled={exportState.isExporting}
                  className="w-full btn-glass-primary flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300"
                >
                  {exportState.isExporting ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : exportState.success ? (
                    <Check className="w-3 h-3" />
                  ) : exportState.error ? (
                    <AlertCircle className="w-3 h-3" />
                  ) : (
                    <Download className="w-3 h-3" />
                  )}
                  <span className="font-medium text-xs">
                    {exportState.isExporting ? 'Export...' :
                      exportState.success ? 'Done!' :
                        exportState.error ? 'Failed' : 'Export'}
                  </span>
                </button>

                <button
                  onClick={handleCopyToClipboard}
                  disabled={exportState.isExporting}
                  className="w-full btn-glass-secondary flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300"
                >
                  {exportState.isExporting ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : exportState.success ? (
                    <Check className="w-3 h-3" />
                  ) : exportState.error ? (
                    <AlertCircle className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span className="font-medium text-xs">Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section - Takes Remaining Height */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <div className="w-full max-w-full overflow-auto">
            <div
              ref={previewRef}
              className="inline-block rounded-xl shadow-2xl cursor-pointer w-full max-w-full"
              style={{
                background: selectedBackground?.gradient,
                padding: `${Math.max(8, settings.padding * 0.5)}px`
              }}
              onClick={handleCodeClick}
            >
              <div
                className={`rounded-lg overflow-hidden shadow-xl theme-${settings.theme} relative w-full`}
                style={{
                  backgroundColor: selectedTheme?.background,
                  fontFamily: settings.fontFamily,
                  fontSize: `${Math.max(10, settings.fontSize - 3)}px`
                }}
              >
                {/* Window Controls */}
                {settings.showWindowControls && (
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-sm" />
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm" />
                    </div>
                    <div className="text-xs text-white/60 font-medium">
                      {LANGUAGES.find(l => l.value === settings.language)?.name}
                    </div>
                  </div>
                )}

                {/* Code Content */}
                <div className="relative">
                  <div className="flex">
                    {/* Line Numbers */}
                    {settings.showLineNumbers && (
                      <div className="px-2 py-3 text-white/40 text-right select-none border-r border-white/10 flex-shrink-0 text-xs leading-relaxed">
                        {code.split('\n').map((_, index) => (
                          <div key={index}>
                            {index + 1}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Code Content Container */}
                    <div className="flex-1 relative">
                      {/* Live Editor Textarea */}
                      {isEditing && (
                        <textarea
                          ref={textareaRef}
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          onBlur={handleCodeBlur}
                          className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white font-mono resize-none outline-none z-10 px-3 py-3 leading-relaxed text-xs"
                          style={{
                            fontFamily: settings.fontFamily,
                            fontSize: `${Math.max(10, settings.fontSize - 3)}px`,
                            lineHeight: '1.7'
                          }}
                          spellCheck={false}
                        />
                      )}

                      {/* Highlighted Code Display */}
                      <div
                        className={`px-3 py-3 code-editor leading-relaxed overflow-x-auto min-w-0 text-xs ${isEditing ? 'pointer-events-none' : ''}`}
                        style={{
                          fontFamily: settings.fontFamily,
                          fontSize: `${Math.max(10, settings.fontSize - 3)}px`,
                          lineHeight: '1.7'
                        }}
                        dangerouslySetInnerHTML={{ __html: highlightedCode }}
                      />
                    </div>
                  </div>

                  {/* Click to Edit Hint */}
                  {!isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5">
                        <span className="text-white/90 text-xs font-medium">Tap to edit</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Side by Side */}
      <div className="hidden lg:flex h-full gap-6 p-6">
        {/* Left Sidebar - Controls */}
        <div className="w-80 glass-minimal rounded-2xl p-6 overflow-y-auto scrollbar-custom flex-shrink-0 max-h-[calc(100vh-120px)]">
          <div className="space-y-8">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-4">Theme</label>
              <div className="space-y-2">
                {CODE_THEMES.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => updateSettings('theme', theme.value)}
                    className={`w-full p-3 rounded-xl border transition-all duration-300 text-left group ${settings.theme === theme.value
                      ? 'border-white/30 bg-white/10 shadow-lg'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white/90 font-medium">{theme.name}</span>
                      <div
                        className="w-5 h-5 rounded-lg border border-white/20 shadow-inner"
                        style={{ backgroundColor: theme.background }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Selection */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-4">Background</label>
              <div className="grid grid-cols-2 gap-3">
                {BACKGROUND_OPTIONS.map((bg) => (
                  <button
                    key={bg.value}
                    onClick={() => updateSettings('background', bg.value)}
                    className={`p-3 rounded-xl border transition-all duration-300 group ${settings.background === bg.value
                      ? 'border-white/30 ring-2 ring-white/20 shadow-lg'
                      : 'border-white/10 hover:border-white/20'
                      }`}
                  >
                    <div
                      className="w-full h-10 rounded-lg mb-2 shadow-inner"
                      style={{ background: bg.gradient }}
                    />
                    <span className="text-xs text-white/70 group-hover:text-white/90 transition-colors">
                      {bg.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-4">Language</label>
              <select
                value={settings.language}
                onChange={(e) => updateSettings('language', e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-3 text-white/90 focus:ring-2 focus:ring-white/20 transition-all duration-300"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value} className="bg-gray-900/90">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Padding Slider */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-white/90">Padding</label>
                <span className="text-sm text-white/60 font-mono bg-white/10 px-2 py-1 rounded">
                  {settings.padding}px
                </span>
              </div>
              <input
                type="range"
                min="16"
                max="64"
                value={settings.padding}
                onChange={(e) => updateSettings('padding', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Font Size Slider */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-white/90">Font Size</label>
                <span className="text-sm text-white/60 font-mono bg-white/10 px-2 py-1 rounded">
                  {settings.fontSize}px
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="20"
                value={settings.fontSize}
                onChange={(e) => updateSettings('fontSize', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Toggle Options */}
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                  Line Numbers
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.showLineNumbers}
                    onChange={(e) => updateSettings('showLineNumbers', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-all duration-300 ${settings.showLineNumbers
                    ? 'bg-gradient-to-r bg-primary shadow-lg'
                    : 'bg-white/20'
                    }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 mt-0.5 ${settings.showLineNumbers ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                  Window Controls
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.showWindowControls}
                    onChange={(e) => updateSettings('showWindowControls', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-all duration-300 ${settings.showWindowControls
                    ? 'bg-gradient-to-r bg-primary shadow-lg'
                    : 'bg-white/20'
                    }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 mt-0.5 ${settings.showWindowControls ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </div>
                </div>
              </label>
            </div>

            {/* Export Buttons */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              <button
                onClick={handleExport}
                disabled={exportState.isExporting}
                className="w-full btn-glass-primary flex items-center justify-center gap-3 py-3 rounded-xl transition-all duration-300"
              >
                {exportState.isExporting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : exportState.success ? (
                  <Check className="w-4 h-4" />
                ) : exportState.error ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {exportState.isExporting ? 'Exporting...' :
                    exportState.success ? 'Exported!' :
                      exportState.error ? 'Export Failed' : 'Export PNG'}
                </span>
              </button>

              <button
                onClick={handleCopyToClipboard}
                disabled={exportState.isExporting}
                className="w-full btn-glass-secondary flex items-center justify-center gap-3 py-3 rounded-xl transition-all duration-300"
              >
                {exportState.isExporting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : exportState.success ? (
                  <Check className="w-4 h-4" />
                ) : exportState.error ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span className="font-medium">Copy to Clipboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Live Preview */}
        <div className="flex-1 flex items-center justify-center">
          <div
            ref={previewRef}
            className="inline-block rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 cursor-pointer"
            style={{
              background: selectedBackground?.gradient,
              padding: `${settings.padding}px`
            }}
            onClick={handleCodeClick}
          >
            <div
              className={`rounded-xl overflow-hidden shadow-xl theme-${settings.theme} relative`}
              style={{
                backgroundColor: selectedTheme?.background,
                fontFamily: settings.fontFamily,
                fontSize: `${settings.fontSize}px`
              }}
            >
              {/* Window Controls */}
              {settings.showWindowControls && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
                  </div>
                  <div className="text-xs text-white/60 font-medium">
                    {LANGUAGES.find(l => l.value === settings.language)?.name}
                  </div>
                </div>
              )}

              {/* Code Content with Live Editor */}
              <div className="relative">
                <div className="flex">
                  {/* Line Numbers */}
                  {settings.showLineNumbers && (
                    <div className="px-6 py-6 text-white/40 text-right select-none border-r border-white/10 leading-relaxed">
                      {code.split('\n').map((_, index) => (
                        <div key={index}>
                          {index + 1}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Code Content Container */}
                  <div className="flex-1 relative">
                    {/* Live Editor Textarea (when editing) */}
                    {isEditing && (
                      <textarea
                        ref={textareaRef}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onBlur={handleCodeBlur}
                        className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white font-mono resize-none outline-none z-10 px-6 py-6 leading-relaxed"
                        style={{
                          fontFamily: settings.fontFamily,
                          fontSize: `${settings.fontSize}px`,
                          lineHeight: '1.7'
                        }}
                        spellCheck={false}
                      />
                    )}

                    {/* Highlighted Code Display */}
                    <div
                      className={`px-6 py-6 overflow-x-auto code-editor leading-relaxed ${isEditing ? 'pointer-events-none' : ''}`}
                      style={{
                        fontFamily: settings.fontFamily,
                        fontSize: `${settings.fontSize}px`,
                        lineHeight: '1.7'
                      }}
                      dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    />
                  </div>
                </div>

                {/* Click to Edit Hint */}
                {!isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2">
                      <span className="text-white/90 text-sm font-medium">Click to edit code</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
