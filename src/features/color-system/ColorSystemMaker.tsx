import { useState, useEffect } from 'react';
import { Palette, Code, AlertCircle, X, Copy, Check } from 'lucide-react';
import { ColorSystemState, ColorPalette } from './types';
import { generateColorPalette, generateCSSCode } from './colorUtils';

export default function ColorSystemMaker() {
    const [colorState, setColorState] = useState<ColorSystemState>({
        saturation: 65, // Default: moderately vivid
        hue: 264, // Default: purple/blue
    });

    const [showCode, setShowCode] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const [palette, setPalette] = useState<ColorPalette>(generateColorPalette(colorState));
    const [codeCopied, setCodeCopied] = useState(false);

    const [demos, setDemos] = useState({
        contrast: false,
        gradient: false,
        highlight: false,
        shadow: false
    });

    const toggleDemo = (key: keyof typeof demos) => {
        setDemos(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Update palette whenever color state changes
    useEffect(() => {
        const newPalette = generateColorPalette(colorState);
        setPalette(newPalette);
    }, [colorState]);

    const handleSaturationChange = (value: number) => {
        setColorState(prev => ({ ...prev, saturation: value }));
    };

    const handleHueChange = (value: number) => {
        setColorState(prev => ({ ...prev, hue: value }));
    };

    const copyCode = () => {
        navigator.clipboard.writeText(generateCSSCode(palette));
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
    };

    return (
        <div
            className="h-full p-3 lg:p-6 overflow-y-auto scrollbar-minimal transition-colors duration-300"
            style={{ backgroundColor: palette.bgDark }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {/* Left Panel - Controls */}
                    <div className="space-y-4">
                        {/* Header */}
                        <div
                            className="rounded-xl p-4 transition-all duration-300 border"
                            style={{
                                backgroundColor: palette.bg,
                                borderColor: palette.borderMuted
                            }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${palette.primary}20` }}
                                >
                                    <Palette className="w-4 h-4" style={{ color: palette.primary }} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg font-bold" style={{ color: palette.text }}>UI Colors</h1>
                                    <span
                                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                                        style={{
                                            backgroundColor: `${palette.primary}20`,
                                            color: palette.primary
                                        }}
                                    >
                                        v1.0
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs" style={{ color: palette.textMuted }}>
                                The only color palette you need to build any UI.
                            </p>
                        </div>

                        {/* Sliders */}
                        <div
                            className="rounded-xl p-4 space-y-4 transition-all duration-300 border"
                            style={{
                                backgroundColor: palette.bg,
                                borderColor: palette.borderMuted
                            }}
                        >
                            {/* Saturation Slider */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-medium" style={{ color: palette.text }}>
                                        Neutral → Vivid
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={colorState.saturation}
                                        onChange={(e) => handleSaturationChange(Number(e.target.value))}
                                        className="w-12 text-[10px] px-1.5 py-0.5 rounded font-mono text-center border"
                                        style={{
                                            color: palette.textMuted,
                                            backgroundColor: palette.bgLight,
                                            borderColor: palette.borderMuted
                                        }}
                                    />
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={colorState.saturation}
                                    onChange={(e) => handleSaturationChange(Number(e.target.value))}
                                    className="w-full h-1.5"
                                    style={{
                                        background: `linear-gradient(to right, 
                      oklch(0.5 0 ${colorState.hue}), 
                      oklch(0.5 0.2 ${colorState.hue}))`
                                    }}
                                />
                            </div>

                            {/* Hue Slider */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-medium" style={{ color: palette.text }}>
                                        Warmer → Cooler
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="360"
                                        value={colorState.hue}
                                        onChange={(e) => handleHueChange(Number(e.target.value))}
                                        className="w-12 text-[10px] px-1.5 py-0.5 rounded font-mono text-center border"
                                        style={{
                                            color: palette.textMuted,
                                            backgroundColor: palette.bgLight,
                                            borderColor: palette.borderMuted
                                        }}
                                    />
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={colorState.hue}
                                    onChange={(e) => handleHueChange(Number(e.target.value))}
                                    className="w-full h-1.5"
                                    style={{
                                        background: `linear-gradient(to right, 
                      oklch(0.5 0.13 0),
                      oklch(0.5 0.13 60),
                      oklch(0.5 0.13 120),
                      oklch(0.5 0.13 180),
                      oklch(0.5 0.13 240),
                      oklch(0.5 0.13 300),
                      oklch(0.5 0.13 360))`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Info Cards - Interactive Demos */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => toggleDemo('contrast')}
                                className="text-left rounded-lg p-3 transition-all duration-300 border relative overflow-hidden group"
                                style={{
                                    backgroundColor: demos.contrast ? palette.bgDark : palette.bg,
                                    borderColor: demos.contrast ? palette.primary : palette.borderMuted
                                }}
                            >
                                <div className="relative z-10">
                                    <h3 className="text-xs font-semibold mb-0.5 flex items-center justify-between" style={{ color: demos.contrast ? palette.primary : palette.text }}>
                                        Contrast
                                        {demos.contrast && <Check className="w-3 h-3" />}
                                    </h3>
                                    <p className="text-[10px] leading-tight" style={{ color: demos.contrast ? palette.text : palette.textMuted }}>
                                        {demos.contrast ? 'High contrast mode active' : 'Click to test contrast'}
                                    </p>
                                </div>
                            </button>

                            <button
                                onClick={() => toggleDemo('gradient')}
                                className="text-left rounded-lg p-3 transition-all duration-300 border relative overflow-hidden"
                                style={{
                                    background: demos.gradient
                                        ? `linear-gradient(135deg, ${palette.bgDark}, ${palette.bgLight})`
                                        : palette.bg,
                                    borderColor: demos.gradient ? 'transparent' : palette.borderMuted,
                                    boxShadow: demos.gradient ? `0 0 20px -5px ${palette.primary}40` : 'none'
                                }}
                            >
                                <h3 className="text-xs font-semibold mb-0.5" style={{ color: palette.text }}>Gradients</h3>
                                <p className="text-[10px] leading-tight" style={{ color: palette.textMuted }}>
                                    {demos.gradient ? 'Gradient background applied' : 'Click to apply gradient'}
                                </p>
                            </button>

                            <button
                                onClick={() => toggleDemo('highlight')}
                                className="text-left rounded-lg p-3 transition-all duration-300 border relative"
                                style={{
                                    backgroundColor: palette.bg,
                                    borderColor: demos.highlight ? palette.highlight : palette.borderMuted,
                                    boxShadow: demos.highlight ? `inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 0 1px ${palette.highlight}` : 'none'
                                }}
                            >
                                <h3 className="text-xs font-semibold mb-0.5" style={{ color: palette.text }}>Highlight</h3>
                                <p className="text-[10px] leading-tight" style={{ color: palette.textMuted }}>
                                    {demos.highlight ? 'Inner highlight active' : 'Click to see highlight'}
                                </p>
                            </button>

                            <button
                                onClick={() => toggleDemo('shadow')}
                                className="text-left rounded-lg p-3 transition-all duration-300 border"
                                style={{
                                    backgroundColor: palette.bg,
                                    borderColor: demos.shadow ? palette.border : palette.borderMuted,
                                    boxShadow: demos.shadow ? `0 10px 25px -5px rgba(0,0,0,0.5), 0 0 0 1px ${palette.borderMuted}` : 'none',
                                    transform: demos.shadow ? 'translateY(-2px)' : 'none'
                                }}
                            >
                                <h3 className="text-xs font-semibold mb-0.5" style={{ color: palette.text }}>Shadows</h3>
                                <p className="text-[10px] leading-tight" style={{ color: palette.textMuted }}>
                                    {demos.shadow ? 'Elevation active' : 'Click to add depth'}
                                </p>
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowCode(!showCode)}
                                className="flex-1 px-3 py-2 rounded-lg font-medium text-xs transition-all duration-300 border"
                                style={{
                                    backgroundColor: showCode ? palette.primary : 'transparent',
                                    color: showCode ? palette.bgDark : palette.text,
                                    borderColor: palette.border,
                                }}
                            >
                                <Code className="w-3.5 h-3.5 inline mr-1.5" />
                                Show Code
                            </button>

                            <button
                                onClick={() => setShowAlerts(!showAlerts)}
                                className="flex-1 px-3 py-2 rounded-lg font-medium text-xs transition-all duration-300"
                                style={{
                                    backgroundColor: palette.primary,
                                    color: palette.bgDark,
                                }}
                            >
                                <AlertCircle className="w-3.5 h-3.5 inline mr-1.5" />
                                Show Alerts
                            </button>
                        </div>
                    </div>

                    {/* Right Panel - Color Swatches */}
                    <div className="space-y-4">
                        <div
                            className="rounded-xl p-4 transition-all duration-300 border"
                            style={{
                                backgroundColor: palette.bg,
                                borderColor: palette.borderMuted
                            }}
                        >
                            <h2 className="text-sm font-bold mb-4" style={{ color: palette.text }}>Live Preview</h2>

                            {/* Background Colors */}
                            <div className="mb-3">
                                <h3 className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider" style={{ color: palette.textMuted }}>
                                    Background
                                </h3>
                                <div className="grid grid-cols-3 gap-1.5">
                                    <ColorSwatch color={palette.bgDark} label="bg-dark" />
                                    <ColorSwatch color={palette.bg} label="bg" />
                                    <ColorSwatch color={palette.bgLight} label="bg-light" />
                                </div>
                            </div>

                            {/* Text Colors */}
                            <div className="mb-3">
                                <h3 className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider" style={{ color: palette.textMuted }}>
                                    Text
                                </h3>
                                <div className="grid grid-cols-2 gap-1.5">
                                    <ColorSwatch color={palette.text} label="text" />
                                    <ColorSwatch color={palette.textMuted} label="text-muted" />
                                </div>
                            </div>

                            {/* Border Colors */}
                            <div className="mb-3">
                                <h3 className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider" style={{ color: palette.textMuted }}>
                                    Border
                                </h3>
                                <div className="grid grid-cols-3 gap-1.5">
                                    <ColorSwatch color={palette.highlight} label="highlight" />
                                    <ColorSwatch color={palette.border} label="border" />
                                    <ColorSwatch color={palette.borderMuted} label="border-muted" />
                                </div>
                            </div>

                            {/* Action Colors */}
                            <div className="mb-3">
                                <h3 className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider" style={{ color: palette.textMuted }}>
                                    Action
                                </h3>
                                <div className="grid grid-cols-2 gap-1.5">
                                    <ColorSwatch color={palette.primary} label="primary" />
                                    <ColorSwatch color={palette.secondary} label="secondary" />
                                </div>
                            </div>

                            {/* Alert Colors */}
                            <div className="mb-3">
                                <h3 className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider" style={{ color: palette.textMuted }}>
                                    Alert
                                </h3>
                                <div className="grid grid-cols-4 gap-1.5">
                                    <ColorSwatch color={palette.danger} label="danger" />
                                    <ColorSwatch color={palette.warning} label="warning" />
                                    <ColorSwatch color={palette.success} label="success" />
                                    <ColorSwatch color={palette.info} label="info" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Code Modal */}
            {showCode && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowCode(false)}
                >
                    <div
                        className="rounded-xl p-5 max-w-xl w-full max-h-[80vh] overflow-y-auto scrollbar-minimal border"
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: palette.bg, borderColor: palette.border }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold" style={{ color: palette.text }}>CSS Variables</h3>
                            <button
                                onClick={() => setShowCode(false)}
                                className="p-1.5 rounded-lg hover:bg-opacity-10 transition-all duration-300"
                                style={{ color: palette.textMuted }}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            onClick={copyCode}
                            className="w-full mb-3 px-3 py-2 rounded-lg font-medium text-xs transition-all duration-300 flex items-center justify-center gap-2"
                            style={{
                                backgroundColor: palette.primary,
                                color: palette.bgDark,
                            }}
                        >
                            {codeCopied ? (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    Copy All
                                </>
                            )}
                        </button>

                        <pre
                            className="text-[10px] overflow-x-auto scrollbar-minimal p-3 rounded-lg font-mono leading-relaxed"
                            style={{ backgroundColor: palette.bgDark, color: palette.text }}
                        >
                            <code>{generateCSSCode(palette)}</code>
                        </pre>
                    </div>
                </div>
            )}

            {/* Alerts Modal */}
            {showAlerts && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowAlerts(false)}
                >
                    <div
                        className="rounded-xl p-5 max-w-md w-full space-y-3 border"
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: palette.bg, borderColor: palette.border }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold" style={{ color: palette.text }}>Alert Examples</h3>
                            <button
                                onClick={() => setShowAlerts(false)}
                                className="p-1.5 rounded-lg hover:bg-opacity-10 transition-all duration-300"
                                style={{ color: palette.textMuted }}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <AlertCard
                            title="Payment failed"
                            message="Your account will be terminated within 48 hours."
                            color={palette.danger}
                        />
                        <AlertCard
                            title="Plan expiring soon"
                            message="Your plan will expire in 3 days."
                            color={palette.warning}
                        />
                        <AlertCard
                            title="Backup complete"
                            message="Your photos were saved successfully!"
                            color={palette.success}
                        />
                        <AlertCard
                            title="Upgrade to Pro"
                            message="Hey there, upgrade now and get 20% off."
                            color={palette.info}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// Color Swatch Component
interface ColorSwatchProps {
    color: string;
    label: string;
}

function ColorSwatch({ color, label }: ColorSwatchProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(color);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            onClick={handleCopy}
            className="group relative rounded-md overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer h-8 w-full"
            style={{
                backgroundColor: color,
                border: `1px solid ${color}`,
            }}
        >
            <div className="h-full w-full" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-[10px] font-medium">
                    {copied ? 'Copied!' : 'Copy'}
                </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/80 backdrop-blur-sm">
                <p className="text-[9px] font-mono text-white truncate">{label}</p>
            </div>
        </button>
    );
}

// Alert Card Component
interface AlertCardProps {
    title: string;
    message: string;
    color: string;
}

function AlertCard({ title, message, color }: AlertCardProps) {
    return (
        <div
            className="p-3 rounded-lg border-l-2 transition-all duration-300"
            style={{
                borderLeftColor: color,
                backgroundColor: `color-mix(in oklch, ${color}, transparent 90%)`,
            }}
        >
            <h4 className="font-semibold text-xs mb-0.5" style={{ color }}>
                {title}
            </h4>
            <p className="text-[10px] opacity-80 leading-tight" style={{ color }}>
                {message}
            </p>
        </div>
    );
}
