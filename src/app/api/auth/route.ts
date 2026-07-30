import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        
        const validUsername = process.env.ADMIN_USERNAME || 'ironsoul_admin';
        const validPassword = process.env.ADMIN_PASSWORD || 'admin';
        
        if (username === validUsername && password === validPassword) {
            const cookieStore = await cookies();
            cookieStore.set('admin_session', 'true', { secure: process.env.NODE_ENV === 'production', httpOnly: true });
            return NextResponse.json({ success: true });
        }
        
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

export async function GET() {
    const cookieStore = await cookies();
    if (cookieStore.has('admin_session')) {
        return NextResponse.json({ authenticated: true });
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
