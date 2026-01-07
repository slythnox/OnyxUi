import { toPng } from 'html-to-image';

export async function exportToPng(element: HTMLElement, filename: string): Promise<void> {
    try {
        // Ensure the element is visible and properly rendered
        if (!element.offsetParent) {
            throw new Error('Element is not visible');
        }

        const dataUrl = await toPng(element, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: 'transparent',
            cacheBust: true,
            style: {
                transform: 'scale(1)',
                transformOrigin: 'top left',
            },
            filter: (node) => {
                // Exclude any elements that might cause issues
                if (node.classList?.contains('no-export')) {
                    return false;
                }

                // Exclude Google Fonts and other cross-origin stylesheets
                if (node.tagName === 'LINK' &&
                    node instanceof HTMLLinkElement &&
                    node.rel === 'stylesheet' &&
                    (node.href.includes('fonts.googleapis.com') ||
                        node.href.includes('fonts.gstatic.com'))) {
                    return false;
                }

                return true;
            }
        });

        // Validate the data URL
        if (!dataUrl || dataUrl === 'data:,') {
            throw new Error('Failed to generate image data');
        }

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);


    } catch (error) {
        console.error('Error exporting image:', error);
        throw new Error(`Failed to export image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function copyToClipboard(element: HTMLElement): Promise<void> {
    try {
        // Check if clipboard API is available
        if (!navigator.clipboard || !navigator.clipboard.write) {
            throw new Error('Clipboard API not available');
        }

        // Ensure the element is visible and properly rendered
        if (!element.offsetParent) {
            throw new Error('Element is not visible');
        }

        const dataUrl = await toPng(element, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: 'transparent',
            cacheBust: true,
            style: {
                transform: 'scale(1)',
                transformOrigin: 'top left',
            },
            filter: (node) => {
                // Exclude any elements that might cause issues
                if (node.classList?.contains('no-export')) {
                    return false;
                }

                // Exclude Google Fonts and other cross-origin stylesheets
                if (node.tagName === 'LINK' &&
                    node instanceof HTMLLinkElement &&
                    node.rel === 'stylesheet' &&
                    (node.href.includes('fonts.googleapis.com') ||
                        node.href.includes('fonts.gstatic.com'))) {
                    return false;
                }

                return true;
            }
        });

        // Validate the data URL
        if (!dataUrl || dataUrl === 'data:,') {
            throw new Error('Failed to generate image data');
        }

        // Convert data URL to blob
        const response = await fetch(dataUrl);
        if (!response.ok) {
            throw new Error('Failed to convert image data');
        }

        const blob = await response.blob();

        // Copy to clipboard
        await navigator.clipboard.write([
            new ClipboardItem({
                'image/png': blob
            })
        ]);


    } catch (error) {
        console.error('Error copying to clipboard:', error);
        throw new Error(`Failed to copy to clipboard: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
}

export function generateFilename(prefix: string, extension: string = 'png'): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    return `${prefix}-${timestamp}.${extension}`;
}
