// Polyfill for Promise.withResolvers
if (typeof Promise.withResolvers === 'undefined') {
    // @ts-ignore
    Promise.withResolvers = function <T>() {
        let resolve!: (value: T | PromiseLike<T>) => void;
        let reject!: (reason?: any) => void;
        const promise = new Promise<T>((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return { promise, resolve, reject };
    };
}

const pdfParseLib = require('pdf-parse');
// Handle potential different export styles (CommonJS, ES modules, or bundled)
const PDFParse = pdfParseLib.PDFParse || pdfParseLib.default || pdfParseLib;

export async function extractTextFromPDF(file: File): Promise<string> {
    try {
        console.log(`PDF Extraction start. Lib type: ${typeof pdfParseLib}, PDFParse type: ${typeof PDFParse}`);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Check if PDFParse is a class/constructor or a function that returns a promise
        let data;
        if (PDFParse.prototype && PDFParse.prototype.constructor) {
            // It looks like a class (as used locally)
            const parser = new PDFParse({ data: buffer });
            data = await parser.getText();
            if (parser.destroy) await parser.destroy();
        } else if (typeof PDFParse === 'function') {
            // Standard pdf-parse function usage: pdf(buffer)
            data = await PDFParse(buffer);
        } else {
            throw new Error(`Unknown PDFParse type: ${typeof PDFParse}`);
        }

        return data.text;
    } catch (error) {
        console.error('PDF Extraction Error:', error);
        throw new Error('Failed to extract text from PDF');
    }
}
