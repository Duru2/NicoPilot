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

// @ts-ignore
import PDFParser from 'pdf2json';

export async function extractTextFromPDF(file: File): Promise<string> {
    try {
        console.log('PDF Extraction start (pdf2json)');

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const pdfParser = new PDFParser(null, true); // true = enable raw text parsing

        return new Promise((resolve, reject) => {
            pdfParser.on("pdfParser_dataError", (errData: any) => {
                console.error("pdf2json error:", errData.parserError);
                reject(new Error(errData.parserError));
            });

            pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
                try {
                    // pdf2json returns raw text in a specific structure
                    // The raw text is usually in pdfParser.getRawTextContent()
                    const text = pdfParser.getRawTextContent();
                    console.log(`PDF extracted successfully. Length: ${text.length}`);
                    resolve(text);
                } catch (e) {
                    reject(e);
                }
            });

            pdfParser.parseBuffer(buffer);
        });
    } catch (error) {
        console.error('PDF Extraction Error:', error);
        throw new Error('Failed to extract text from PDF');
    }
}
