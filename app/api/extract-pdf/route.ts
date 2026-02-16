import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/pdf-utils';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const text = await extractTextFromPDF(file);

        return NextResponse.json({ text });
    } catch (error) {
        console.error('PDF extraction error:', error);
        return NextResponse.json(
            { error: 'Failed to extract PDF text' },
            { status: 500 }
        );
    }
}
