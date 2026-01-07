export interface ColorSystemState {
    saturation: number; // 0-100 (Neutral to Vivid)
    hue: number; // 0-360 (Warmer to Cooler)
}

export interface ColorPalette {
    bgDark: string;
    bg: string;
    bgLight: string;
    text: string;
    textMuted: string;
    highlight: string;
    border: string;
    borderMuted: string;
    primary: string;
    secondary: string;
    danger: string;
    warning: string;
    success: string;
    info: string;
}
