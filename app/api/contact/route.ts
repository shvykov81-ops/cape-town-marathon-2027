import { NextRequest, NextResponse } from 'next/server';

const SPLITFORMS_ENDPOINT = "https://splitforms.com/api/submit";
const ACCESS_KEY = "6db59e302b064cc5a72fd0b167e2e93a";

export async function POST(request: NextRequest) {
    try {
        const { name, email, subject, message } = await request.json();

        if (!name || !email || !email.includes('@') || !message) {
            return NextResponse.json(
                { error: 'Name, valid email, and message are required' },
                { status: 400 }
            );
        }

        const params = new URLSearchParams();
        params.append('access_key', ACCESS_KEY);
        params.append('subject', `Contact: ${subject || 'General Inquiry'} -- Cape Town Marathon 2027`);
        params.append('name', name);
        params.append('email', email);
        params.append('message', message);
        params.append('phone', '');
        params.append('package', subject || 'General');
        params.append('target time', 'N/A');

        const response = await fetch(SPLITFORMS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('SplitForms error:', errorText);
            throw new Error('Failed to submit to SplitForms');
        }

        return NextResponse.json(
            { message: 'Message sent successfully!' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Contact error:', error);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again later.' },
            { status: 500 }
        );
    }
}