import React, { useState, useRef, useMemo } from 'react';
import { Download, Copy, Check, AlertCircle, Search, Package } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { IconSettings } from './types';
import { ExportState } from '../../types';
import { exportToPng, copyToClipboard, generateFilename } from '../../logic/image-export';
import { exportAllIconsToZip } from '../../logic/bulk-icon-export';

// Get all icon names from Lucide
const ALL_ICONS = Object.keys(LucideIcons)
  .filter(key => key !== 'createLucideIcon' && key !== 'default' && /^[A-Z]/.test(key))
  .sort();

export default function IconMaker() {
  const [selectedIcon, setSelectedIcon] = useState('Heart');
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState<IconSettings>({
    size: 48,
    strokeWidth: 2,
    color: '#8b5cf6',
    backgroundColor: '#ffffff',
    backgroundType: 'solid',
    gradientFrom: '#8b5cf6',
    gradientTo: '#ec4899',
    padding: 16,
    borderRadius: 12
  });
  const [exportState, setExportState] = useState<ExportState>({
    isExporting: false,
    success: false,
    error: null
  });
  const [bulkExportState, setBulkExportState] = useState<{
    isExporting: boolean;
    progress: number;
    total: number;
  }>({ isExporting: false, progress: 0, total: 0 });

  const previewRef = useRef<HTMLDivElement>(null);

  const resetExportState = () => {
    setTimeout(() => {
      setExportState({ isExporting: false, success: false, error: null });
    }, 2000);
  };

  const handleExport = async () => {
    if (!previewRef.current) {
      console.error('Preview element not found');
      return;
    }

    setExportState({ isExporting: true, success: false, error: null });

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const filename = generateFilename(`icon-${selectedIcon.toLowerCase()}`);
      await exportToPng(previewRef.current, filename);
      setExportState({ isExporting: false, success: true, error: null });
      resetExportState();
    } catch (error) {
      console.error('Export error:', error);
      setExportState({ isExporting: false, success: false, error: 'Failed to export image' });
      resetExportState();
    }
  };

  const handleCopyToClipboard = async () => {
    if (!previewRef.current) {
      console.error('Preview element not found');
      return;
    }

    setExportState({ isExporting: true, success: false, error: null });

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      await copyToClipboard(previewRef.current);
      setExportState({ isExporting: false, success: true, error: null });
      resetExportState();
    } catch (error) {
      console.error('Copy error:', error);
      setExportState({ isExporting: false, success: false, error: 'Failed to copy to clipboard' });
      resetExportState();
    }
  };

  const updateSettings = (key: keyof IconSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleBulkExport = async () => {
    setBulkExportState({ isExporting: true, progress: 0, total: ALL_ICONS.length });

    try {
      await exportAllIconsToZip(
        ALL_ICONS,
        LucideIcons,
        settings,
        (current, total) => {
          setBulkExportState({ isExporting: true, progress: current, total });
        }
      );
      setBulkExportState({ isExporting: false, progress: 0, total: 0 });
      setExportState({ isExporting: false, success: true, error: null });
      resetExportState();
    } catch (error) {
      console.error('Bulk export error:', error);
      setBulkExportState({ isExporting: false, progress: 0, total: 0 });
      setExportState({ isExporting: false, success: false, error: 'Failed to export all icons' });
      resetExportState();
    }
  };

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!searchTerm) return ALL_ICONS;
    return ALL_ICONS.filter(icon =>
      icon.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Safely get the icon component
  const IconComponent = (LucideIcons as any)[selectedIcon];

  const getBackgroundStyle = () => {
    switch (settings.backgroundType) {
      case 'solid':
        return { backgroundColor: settings.backgroundColor };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${settings.gradientFrom}, ${settings.gradientTo})`
        };
      default:
        return { backgroundColor: 'transparent' };
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Icon Selection - Top */}
        <div className="flex-shrink-0 glass-minimal rounded-2xl m-4 p-4 max-h-[35vh] overflow-y-auto scrollbar-custom">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search icons..."
              className="w-full pl-10 glass-input rounded-lg px-4 py-2.5 text-white/90 placeholder-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300"
            />
          </div>

          {/* Category Tabs - REMOVED */}

          {/* Icon Grid - Horizontal Scroll */}
          <div className="overflow-x-auto scrollbar-custom">
            <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
              {filteredIcons
                .slice(0, 50)
                .map((name) => {
                  const IconComp = (LucideIcons as any)[name];
                  if (!IconComp) return null;

                  return (
                    <button
                      key={name}
                      onClick={() => setSelectedIcon(name)}
                      className={`flex-shrink-0 p-2.5 rounded-lg transition-all duration-300 group ${selectedIcon === name
                        ? 'bg-gradient-to-r bg-primary shadow-lg scale-105'
                        : 'bg-white/5 hover:bg-white/20 hover:scale-105'
                        }`}
                      title={name}
                    >
                      <IconComp
                        size={18}
                        className={`transition-colors duration-300 ${selectedIcon === name ? 'text-white' : 'text-white/70 group-hover:text-white'
                          }`}
                      />
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Preview and Controls - Bottom */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Preview */}
          <div className="flex-shrink-0 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white/90 mb-1">{selectedIcon}</h2>
                <p className="text-white/60 text-sm">Customize and export</p>
              </div>

              <div className="mb-6 flex items-center justify-center">
                <div
                  ref={previewRef}
                  className="inline-flex items-center justify-center transform hover:scale-105 transition-transform duration-300 shadow-2xl"
                  style={{
                    ...getBackgroundStyle(),
                    padding: `${settings.padding}px`,
                    borderRadius: `${settings.borderRadius}px`,
                    minWidth: `${settings.size + (settings.padding * 2)}px`,
                    minHeight: `${settings.size + (settings.padding * 2)}px`,
                    ...(settings.backgroundType !== 'none' ? {
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                    } : {})
                  }}
                >
                  {IconComponent ? (
                    <IconComponent
                      size={settings.size}
                      strokeWidth={settings.strokeWidth}
                      color={settings.color}
                      style={{
                        display: 'block',
                        flexShrink: 0
                      }}
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center text-white/50"
                      style={{
                        width: settings.size,
                        height: settings.size
                      }}
                    >
                      <AlertCircle size={settings.size * 0.6} />
                    </div>
                  )}
                </div>
              </div>

              {/* Export Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleExport}
                  disabled={exportState.isExporting || !IconComponent}
                  className="w-full btn-glass-primary flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={exportState.isExporting || !IconComponent}
                  className="w-full btn-glass-secondary flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* Bulk Export Button */}
              <button
                onClick={handleBulkExport}
                disabled={bulkExportState.isExporting}
                className="w-full mt-3 bg-primary text-white flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium hover:brightness-110"
              >
                {bulkExportState.isExporting ? (
                  <>
                    <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>
                      {bulkExportState.progress}/{bulkExportState.total}
                    </span>
                  </>
                ) : (
                  <>
                    <Package className="w-3 h-3" />
                    <span>Export All</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Controls - Scrollable */}
          <div className="flex-1 glass-minimal rounded-2xl m-4 mt-0 p-4 overflow-y-auto scrollbar-custom min-h-0">
            <div className="space-y-4">
              {/* Size and Stroke */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-white/90">Size</label>
                    <span className="text-xs text-white/60 font-mono bg-white/10 px-1.5 py-0.5 rounded">
                      {settings.size}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="96"
                    value={settings.size}
                    onChange={(e) => updateSettings('size', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-white/90">Stroke</label>
                    <span className="text-xs text-white/60 font-mono bg-white/10 px-1.5 py-0.5 rounded">
                      {settings.strokeWidth}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.5"
                    value={settings.strokeWidth}
                    onChange={(e) => updateSettings('strokeWidth', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Icon Color */}
              <div>
                <label className="block text-xs font-medium text-white/90 mb-2">Icon Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.color}
                    onChange={(e) => updateSettings('color', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={settings.color}
                    onChange={(e) => updateSettings('color', e.target.value)}
                    className="flex-1 glass-input rounded-lg px-3 py-2 text-white/90 font-mono text-xs"
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>

              {/* Background Type */}
              <div>
                <label className="block text-xs font-medium text-white/90 mb-2">Background</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { name: 'None', value: 'none' },
                    { name: 'Solid', value: 'solid' },
                    { name: 'Gradient', value: 'gradient' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateSettings('backgroundType', type.value)}
                      className={`p-2 rounded-lg text-xs transition-all duration-300 font-medium ${settings.backgroundType === type.value
                        ? 'bg-gradient-to-r bg-primary text-white shadow-lg'
                        : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                        }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>

                {/* Background Color */}
                {settings.backgroundType === 'solid' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => updateSettings('backgroundColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={settings.backgroundColor}
                      onChange={(e) => updateSettings('backgroundColor', e.target.value)}
                      className="flex-1 glass-input rounded-lg px-3 py-2 text-white/90 font-mono text-xs"
                      placeholder="#ffffff"
                    />
                  </div>
                )}

                {/* Gradient Colors */}
                {settings.backgroundType === 'gradient' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/70 w-8 font-medium">From</span>
                      <input
                        type="color"
                        value={settings.gradientFrom}
                        onChange={(e) => updateSettings('gradientFrom', e.target.value)}
                        className="w-8 h-8 rounded border border-white/20 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={settings.gradientFrom}
                        onChange={(e) => updateSettings('gradientFrom', e.target.value)}
                        className="flex-1 glass-input rounded px-2 py-1.5 text-white/90 font-mono text-xs"
                        placeholder="#8b5cf6"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/70 w-8 font-medium">To</span>
                      <input
                        type="color"
                        value={settings.gradientTo}
                        onChange={(e) => updateSettings('gradientTo', e.target.value)}
                        className="w-8 h-8 rounded border border-white/20 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={settings.gradientTo}
                        onChange={(e) => updateSettings('gradientTo', e.target.value)}
                        className="flex-1 glass-input rounded px-2 py-1.5 text-white/90 font-mono text-xs"
                        placeholder="#ec4899"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Padding and Border Radius */}
              {settings.backgroundType !== 'none' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-white/90">Padding</label>
                      <span className="text-xs text-white/60 font-mono bg-white/10 px-1.5 py-0.5 rounded">
                        {settings.padding}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="48"
                      value={settings.padding}
                      onChange={(e) => updateSettings('padding', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-white/90">Radius</label>
                      <span className="text-xs text-white/60 font-mono bg-white/10 px-1.5 py-0.5 rounded">
                        {settings.borderRadius}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={settings.borderRadius}
                      onChange={(e) => updateSettings('borderRadius', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full gap-6 p-6">
        {/* Left Sidebar - Icon Selection */}
        <div className="w-80 glass-minimal rounded-2xl p-6 flex-shrink-0 flex flex-col max-h-[calc(100vh-120px)]">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search icons..."
              className="w-full pl-12 glass-input rounded-xl px-4 py-3 text-white/90 placeholder-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300"
            />
          </div>

          {/* Category Tabs - REMOVED */}

          {/* Icon Grid */}
          <div className="flex-1 overflow-y-auto scrollbar-custom max-h-[calc(100vh-300px)]">
            <div className="grid grid-cols-6 gap-2">
              {filteredIcons
                .slice(0, 500)
                .map((name) => {
                  const IconComp = (LucideIcons as any)[name];
                  if (!IconComp) return null;

                  return (
                    <button
                      key={name}
                      onClick={() => setSelectedIcon(name)}
                      className={`p-3 rounded-xl transition-all duration-300 group ${selectedIcon === name
                        ? 'bg-gradient-to-r bg-primary shadow-lg scale-105'
                        : 'bg-white/5 hover:bg-white/20 hover:scale-105'
                        }`}
                      title={name}
                    >
                      <IconComp
                        size={20}
                        className={`mx-auto transition-colors duration-300 ${selectedIcon === name ? 'text-white' : 'text-white/70 group-hover:text-white'
                          }`}
                      />
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Center Content - Preview and Controls */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* Preview Section */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-0">
            <div className="text-center w-full max-w-md">
              {/* Selected Icon Name */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white/90 mb-2">{selectedIcon}</h2>
                <p className="text-white/60 text-sm">Customize and export your icon</p>
              </div>

              {/* Icon Preview Container */}
              <div className="mb-8 flex items-center justify-center">
                <div
                  ref={previewRef}
                  className="inline-flex items-center justify-center transform hover:scale-105 transition-transform duration-300 shadow-2xl"
                  style={{
                    ...getBackgroundStyle(),
                    padding: `${settings.padding}px`,
                    borderRadius: `${settings.borderRadius}px`,
                    minWidth: `${settings.size + (settings.padding * 2)}px`,
                    minHeight: `${settings.size + (settings.padding * 2)}px`,
                    ...(settings.backgroundType !== 'none' ? {
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                    } : {})
                  }}
                >
                  {IconComponent ? (
                    <IconComponent
                      size={settings.size}
                      strokeWidth={settings.strokeWidth}
                      color={settings.color}
                      style={{
                        display: 'block',
                        flexShrink: 0
                      }}
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center text-white/50"
                      style={{
                        width: settings.size,
                        height: settings.size
                      }}
                    >
                      <AlertCircle size={settings.size * 0.6} />
                    </div>
                  )}
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleExport}
                  disabled={exportState.isExporting || !IconComponent}
                  className="px-6 btn-glass-primary flex items-center justify-center gap-3 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={exportState.isExporting || !IconComponent}
                  className="px-6 btn-glass-secondary flex items-center justify-center gap-3 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* Bulk Export Button */}
              <button
                onClick={handleBulkExport}
                disabled={bulkExportState.isExporting}
                className="w-full mt-4 px-4 bg-primary text-white flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium hover:brightness-110"
              >
                {bulkExportState.isExporting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>
                      Exporting {bulkExportState.progress}/{bulkExportState.total}
                    </span>
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    <span>Export All as ZIP</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Sidebar - Controls */}
          <div className="w-80 glass-minimal rounded-2xl p-6 overflow-y-auto scrollbar-custom flex-shrink-0 max-h-[calc(100vh-120px)]">
            <div className="space-y-8">
              {/* Icon Size */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-white/90">Size</label>
                  <span className="text-sm text-white/60 font-mono bg-white/10 px-2 py-1 rounded">
                    {settings.size}px
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="16"
                    max="96"
                    value={settings.size}
                    onChange={(e) => updateSettings('size', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/50 mt-1">
                    <span>16px</span>
                    <span>96px</span>
                  </div>
                </div>
              </div>

              {/* Stroke Width */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-white/90">Stroke Width</label>
                  <span className="text-sm text-white/60 font-mono bg-white/10 px-2 py-1 rounded">
                    {settings.strokeWidth}px
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.5"
                    value={settings.strokeWidth}
                    onChange={(e) => updateSettings('strokeWidth', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/50 mt-1">
                    <span>1px</span>
                    <span>4px</span>
                  </div>
                </div>
              </div>

              {/* Icon Color */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-4">Icon Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.color}
                    onChange={(e) => updateSettings('color', e.target.value)}
                    className="w-12 h-12 rounded-xl border border-white/20 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={settings.color}
                    onChange={(e) => updateSettings('color', e.target.value)}
                    className="flex-1 glass-input rounded-xl px-4 py-3 text-white/90 font-mono text-sm"
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>

              {/* Background Type */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-4">Background</label>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[
                    { name: 'None', value: 'none' },
                    { name: 'Solid', value: 'solid' },
                    { name: 'Gradient', value: 'gradient' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateSettings('backgroundType', type.value)}
                      className={`p-3 rounded-xl text-xs transition-all duration-300 font-medium ${settings.backgroundType === type.value
                        ? 'bg-gradient-to-r bg-primary text-white shadow-lg'
                        : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                        }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>

                {/* Background Color */}
                {settings.backgroundType === 'solid' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => updateSettings('backgroundColor', e.target.value)}
                      className="w-12 h-12 rounded-xl border border-white/20 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={settings.backgroundColor}
                      onChange={(e) => updateSettings('backgroundColor', e.target.value)}
                      className="flex-1 glass-input rounded-xl px-4 py-3 text-white/90 font-mono text-sm"
                      placeholder="#ffffff"
                    />
                  </div>
                )}

                {/* Gradient Colors */}
                {settings.backgroundType === 'gradient' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/70 w-12 font-medium">From</span>
                      <input
                        type="color"
                        value={settings.gradientFrom}
                        onChange={(e) => updateSettings('gradientFrom', e.target.value)}
                        className="w-12 h-12 rounded-xl border border-white/20 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={settings.gradientFrom}
                        onChange={(e) => updateSettings('gradientFrom', e.target.value)}
                        className="flex-1 glass-input rounded-xl px-4 py-3 text-white/90 font-mono text-sm"
                        placeholder="#8b5cf6"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/70 w-12 font-medium">To</span>
                      <input
                        type="color"
                        value={settings.gradientTo}
                        onChange={(e) => updateSettings('gradientTo', e.target.value)}
                        className="w-12 h-12 rounded-xl border border-white/20 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={settings.gradientTo}
                        onChange={(e) => updateSettings('gradientTo', e.target.value)}
                        className="flex-1 glass-input rounded-xl px-4 py-3 text-white/90 font-mono text-sm"
                        placeholder="#ec4899"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Padding */}
              {settings.backgroundType !== 'none' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-white/90">Padding</label>
                    <span className="text-sm text-white/60 font-mono bg-white/10 px-2 py-1 rounded">
                      {settings.padding}px
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="48"
                      value={settings.padding}
                      onChange={(e) => updateSettings('padding', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-white/50 mt-1">
                      <span>0px</span>
                      <span>48px</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Border Radius */}
              {settings.backgroundType !== 'none' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-white/90">Border Radius</label>
                    <span className="text-sm text-white/60 font-mono bg-white/10 px-2 py-1 rounded">
                      {settings.borderRadius}px
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={settings.borderRadius}
                      onChange={(e) => updateSettings('borderRadius', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-white/50 mt-1">
                      <span>0px</span>
                      <span>32px</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
