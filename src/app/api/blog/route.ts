import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    try {
        if (slug) {
            const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
            if (error) throw error;
            return NextResponse.json(data);
        } else {
            const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return NextResponse.json(data);
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_session')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { title, content, author } = body;
        
        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const { data, error } = await supabase
            .from('blog_posts')
            .insert([{ title, slug, content, author: author || 'IronSoul Team' }])
            .select();
            
        if (error) {
             if (error.code === '23505') return NextResponse.json({ error: 'A post with this title already exists.' }, { status: 400 });
             throw error;
        }
        return NextResponse.json(data[0], { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_session')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { id, title, content, author } = body;
        if (!id || !title || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const { error } = await supabase
            .from('blog_posts')
            .update({ title, slug, content, author })
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_session')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    try {
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
