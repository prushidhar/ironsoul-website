import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('video_reviews')
            .select('*')
            .order('created_at', { ascending: false });

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
        const { title, url } = body;

        if (!title || !url) {
            return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('video_reviews')
            .insert([{ title, url }])
            .select();
            
        if (error) throw error;
        return NextResponse.json(data[0], { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to save video review' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, url } = body;

        if (!id || !title || !url) {
            return NextResponse.json({ error: 'ID, title, and URL are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('video_reviews')
            .update({ title, url })
            .eq('id', id)
            .select();
            
        if (error) throw error;
        return NextResponse.json(data[0]);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to update video review' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const { error } = await supabase.from('video_reviews').delete().eq('id', id);
        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete video review' }, { status: 500 });
    }
}
