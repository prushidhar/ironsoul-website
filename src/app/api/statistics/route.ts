import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('statistics')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { label, value } = body;

        if (!label || value === undefined) {
            return NextResponse.json({ error: 'Label and value are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('statistics')
            .insert([{ label, value: Number(value) }])
            .select();
            
        if (error) throw error;
        return NextResponse.json(data[0], { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to save statistic' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const { error } = await supabase.from('statistics').delete().eq('id', id);
        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete statistic' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, label, value } = body;

        if (!id || !label || value === undefined) {
            return NextResponse.json({ error: 'ID, label, and value are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('statistics')
            .update({ label, value: Number(value) })
            .eq('id', id)
            .select();
            
        if (error) throw error;
        return NextResponse.json(data[0]);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to update statistic' }, { status: 500 });
    }
}
