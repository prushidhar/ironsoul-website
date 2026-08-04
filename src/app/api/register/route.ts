import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, event_name } = body;
        
        if (!name || !email || !phone || !event_name) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('event_registrations')
            .insert([{ name, email, phone, event_name }]);
            
        if (error) throw error;
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('event_registrations')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return NextResponse.json(data);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
