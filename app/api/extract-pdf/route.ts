import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/pdf-utils';

export async function POST(request: NextRequest) {
    console.log('API Request received: /api/extract-pdf');
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            console.error('File not found in formData');
            return NextResponse.json({ error: 'No valid file provided' }, { status: 400 });
        }

        console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size}`);

        const text = await extractTextFromPDF(file);
        console.log(`Extraction successful. Length: ${text.length}`);

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error('Detailed PDF extraction error:', error);
        // Return detailed error message for debugging
        return NextResponse.json(
            { error: error.message || 'Failed to extract PDF text', details: String(error) },
            { status: 500 }
        );
    }
}
