import { ColorPalette, ColorSystemState } from './types';

/**
 * Generates a complete color palette based on saturation and hue values
 * Uses OKLCH color space for perceptually uniform colors
 */
export function generateColorPalette(state: ColorSystemState): ColorPalette {
    const { saturation, hue } = state;

    // Convert saturation from 0-100 to 0-0.2 range for OKLCH
    const sat = (saturation / 100) * 0.2;

    return {
        // Background colors - darker lightness values
        bgDark: `oklch(0.1 ${sat} ${hue})`,
        bg: `oklch(0.15 ${sat} ${hue})`,
        bgLight: `oklch(0.2 ${sat} ${hue})`,

        // Text colors - high lightness values
        text: `oklch(0.96 ${sat * 0.5} ${hue})`,
        textMuted: `oklch(0.76 ${sat * 0.5} ${hue})`,

        // Border colors - medium lightness values
        highlight: `oklch(0.5 ${sat} ${hue})`,
        border: `oklch(0.4 ${sat} ${hue})`,
        borderMuted: `oklch(0.3 ${sat} ${hue})`,

        // Action colors
        primary: `oklch(0.68 ${sat} ${hue})`,
        secondary: `oklch(0.76 ${sat} ${(hue + 180) % 360})`, // Complementary color

        // Alert colors - fixed hues with dynamic saturation
        danger: `oklch(0.7 ${sat} 30)`,
        warning: `oklch(0.7 ${sat} 100)`,
        success: `oklch(0.7 ${sat} 160)`,
        info: `oklch(0.7 ${sat} 260)`,
    };
}

/**
 * Generates CSS code string for the current palette
 */
export function generateCSSCode(palette: ColorPalette): string {
    return `:root {
  /* Background Colors */
  --bg-dark: ${palette.bgDark};
  --bg: ${palette.bg};
  --bg-light: ${palette.bgLight};

  /* Text Colors */
  --text: ${palette.text};
  --text-muted: ${palette.textMuted};

  /* Border Colors */
  --highlight: ${palette.highlight};
  --border: ${palette.border};
  --border-muted: ${palette.borderMuted};

  /* Action Colors */
  --primary: ${palette.primary};
  --secondary: ${palette.secondary};

  /* Alert Colors */
  --danger: ${palette.danger};
  --warning: ${palette.warning};
  --success: ${palette.success};
  --info: ${palette.info};
}`;
}
