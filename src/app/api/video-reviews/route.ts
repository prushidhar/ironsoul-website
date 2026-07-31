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
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const urlInput = formData.get('url') as string;
        const file = formData.get('videoFile') as File | null;

        if (!title || (!urlInput && !file)) {
            return NextResponse.json({ error: 'Title and either a URL or Video File are required' }, { status: 400 });
        }

        let finalUrl = urlInput;

        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
            
            const { error: uploadError } = await supabase.storage
                .from('videos')
                .upload(filename, buffer, { contentType: file.type });
                
            if (uploadError) throw uploadError;
            
            const { data: publicUrlData } = supabase.storage
                .from('videos')
                .getPublicUrl(filename);
                
            finalUrl = publicUrlData.publicUrl;
        }

        const { data: insertData, error: insertError } = await supabase
            .from('video_reviews')
            .insert([{ title, url: finalUrl }])
            .select();
            
        if (insertError) throw insertError;
        return NextResponse.json(insertData[0], { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to save video review' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const title = formData.get('title') as string;
        const urlInput = formData.get('url') as string;
        const file = formData.get('videoFile') as File | null;

        if (!id || !title) {
            return NextResponse.json({ error: 'ID and title are required' }, { status: 400 });
        }

        let updatePayload: any = { title };

        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
            
            const { error: uploadError } = await supabase.storage
                .from('videos')
                .upload(filename, buffer, { contentType: file.type });
                
            if (uploadError) throw uploadError;
            
            const { data: publicUrlData } = supabase.storage
                .from('videos')
                .getPublicUrl(filename);
                
            updatePayload.url = publicUrlData.publicUrl;
        } else if (urlInput) {
            updatePayload.url = urlInput;
        }

        const { data, error } = await supabase
            .from('video_reviews')
            .update(updatePayload)
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
