import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;
        
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert([{ email }]);
            
        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Already subscribed!' }, { status: 400 });
            }
            throw error;
        }
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return NextResponse.json(data);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
