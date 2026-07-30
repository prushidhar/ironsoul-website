import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const VALID_ACCOUNTS: Record<string, string> = {
    'bhanu': 'founder',
    'thushitha': 'president',
    'santhosh': 'coordinator',
    'kaveri': 'cfo',
    'likhitha': 'hr',
    'joshna': 'developer',
};

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        
        const safeUser = username?.toLowerCase().trim() || '';
        const safePass = password?.toLowerCase().trim() || '';

        const envAdminUser = (process.env.ADMIN_USERNAME || 'ironsoul_admin').toLowerCase();
        const envAdminPass = (process.env.ADMIN_PASSWORD || 'admin').toLowerCase();

        let isValid = false;

        // Check if it's the master admin account
        if (safeUser === envAdminUser && safePass === envAdminPass) {
            isValid = true;
        } 
        // Check if it's one of the team members
        else if (VALID_ACCOUNTS[safeUser] && VALID_ACCOUNTS[safeUser] === safePass) {
            isValid = true;
        }
        
        if (isValid) {
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
