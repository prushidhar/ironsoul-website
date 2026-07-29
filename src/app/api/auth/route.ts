import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        
        const validPassword = process.env.ADMIN_PASSWORD || 'admin';
        
        if (password === validPassword) {
            const cookieStore = await cookies();
            cookieStore.set('admin_session', 'true', { secure: process.env.NODE_ENV === 'production', httpOnly: true });
            return NextResponse.json({ success: true });
        }
        
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
