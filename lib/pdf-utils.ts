// Polyfill environment if needed
if (typeof Promise.withResolvers === 'undefined') {
    if (typeof global.Promise.withResolvers === 'undefined') {
        // basic shim if needed, or rely on Node 20
    }
}
// Polyfills for browser APIs missing in Node.js (kept for safety)
if (typeof global.DOMMatrix === 'undefined') {
    (global as any).DOMMatrix = class DOMMatrix { };
}
if (typeof global.ImageData === 'undefined') {
    (global as any).ImageData = class ImageData {
        constructor(public width: number, public height: number, public data?: Uint8ClampedArray) { }
    };
}
if (typeof global.Path2D === 'undefined') {
    (global as any).Path2D = class Path2D { };
}

const { PDFParse } = require('pdf-parse');

export async function extractTextFromPDF(file: File): Promise<string> {
    try {
        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parse PDF using v2 API (class-based)
        const parser = new PDFParse({ data: buffer });
        const data = await parser.getText();
        await parser.destroy(); // free memory
        return data.text;
    } catch (error) {
        console.error('PDF Extraction Error:', error);
        throw new Error('Failed to extract text from PDF');
    }
}
