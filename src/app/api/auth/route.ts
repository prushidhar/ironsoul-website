import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const { password } = await request.json();
    
    // In a production app, use environment variables and hashing.
    // For this demonstration, we use a simple hardcoded password: "admin"
    if (password === 'admin') {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'true', { secure: process.env.NODE_ENV === 'production', httpOnly: true });
        return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}

export async function GET() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (session?.value === 'true') {
        return NextResponse.json({ authenticated: true });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
}
