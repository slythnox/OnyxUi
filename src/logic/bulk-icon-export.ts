import { toPng } from 'html-to-image';
import JSZip from 'jszip';

/**
 * Export all icons to a ZIP file with the same configuration
 */
export async function exportAllIconsToZip(
    icons: string[],
    IconsLibrary: any,
    settings: {
        size: number;
        strokeWidth: number;
        color: string;
        backgroundColor: string;
        backgroundType: 'none' | 'solid' | 'gradient';
        gradientFrom: string;
        gradientTo: string;
        padding: number;
        borderRadius: number;
    },
    onProgress?: (current: number, total: number) => void
): Promise<void> {
    const zip = new JSZip();
    const total = icons.length;

    for (let i = 0; i < icons.length; i++) {
        const iconName = icons[i];
        const IconComponent = IconsLibrary[iconName];

        if (!IconComponent) continue;

        // Create a temporary container for the icon
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        // Create the icon wrapper with styling
        const wrapper = document.createElement('div');
        wrapper.style.display = 'inline-flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.style.padding = `${settings.padding}px`;
        wrapper.style.borderRadius = `${settings.borderRadius}px`;

        // Apply background styling
        if (settings.backgroundType === 'solid') {
            wrapper.style.backgroundColor = settings.backgroundColor;
        } else if (settings.backgroundType === 'gradient') {
            wrapper.style.background = `linear-gradient(135deg, ${settings.gradientFrom}, ${settings.gradientTo})`;
        }

        // Create SVG element for the icon
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', settings.size.toString());
        svg.setAttribute('height', settings.size.toString());
        svg.setAttribute('viewBox', `0 0 24 24`);
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', settings.color);
        svg.setAttribute('stroke-width', settings.strokeWidth.toString());
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');

        // Render the icon component to get its path data
        const tempDiv = document.createElement('div');
        const root = (window as any).ReactDOM?.createRoot?.(tempDiv);
        if (root) {
            await new Promise<void>((resolve) => {
                root.render(
                    (window as any).React.createElement(IconComponent, {
                        size: 24,
                        strokeWidth: settings.strokeWidth,
                        color: settings.color,
                    })
                );
                setTimeout(() => {
                    const iconSvg = tempDiv.querySelector('svg');
                    if (iconSvg) {
                        // Copy all child elements from the rendered icon
                        Array.from(iconSvg.children).forEach(child => {
                            svg.appendChild(child.cloneNode(true));
                        });
                    }
                    resolve();
                }, 10);
            });
            root.unmount();
        }

        wrapper.appendChild(svg);
        container.appendChild(wrapper);

        try {
            // Convert to PNG
            const dataUrl = await toPng(wrapper, {
                cacheBust: true,
                pixelRatio: 2,
            });

            // Convert data URL to blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();

            // Add to ZIP
            zip.file(`${iconName.toLowerCase()}.png`, blob);

            // Report progress
            if (onProgress) {
                onProgress(i + 1, total);
            }
        } catch (error) {
            console.error(`Failed to export icon: ${iconName}`, error);
        } finally {
            // Clean up
            document.body.removeChild(container);
        }
    }

    // Generate and download ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `icons-${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
