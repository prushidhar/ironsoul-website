import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Map database fields to our frontend names
        const events = data.map(ev => ({
            id: ev.id,
            title: ev.title,
            description: ev.description,
            imagePath: ev.image_path,
            date: ev.created_at
        }));
        
        return NextResponse.json(events);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const file = formData.get('image') as File | null;

        if (!title || !file) {
            return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('events')
            .upload(filename, buffer, { contentType: file.type });
            
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
            .from('events')
            .getPublicUrl(filename);
            
        const imagePath = publicUrlData.publicUrl;

        const { data: insertData, error: insertError } = await supabase
            .from('events')
            .insert([{ title, description, image_path: imagePath }])
            .select();
            
        if (insertError) throw insertError;

        const newEvent = {
            id: insertData[0].id,
            title: insertData[0].title,
            description: insertData[0].description,
            imagePath: insertData[0].image_path,
            date: insertData[0].created_at
        };

        return NextResponse.json(newEvent, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to save event' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const file = formData.get('image') as File | null;

        if (!id || !title) {
            return NextResponse.json({ error: 'ID and title are required' }, { status: 400 });
        }

        let updatePayload: any = { title, description };

        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
            
            const { error: uploadError } = await supabase.storage
                .from('events')
                .upload(filename, buffer, { contentType: file.type });
                
            if (uploadError) throw uploadError;
            
            const { data: publicUrlData } = supabase.storage
                .from('events')
                .getPublicUrl(filename);
                
            updatePayload.image_path = publicUrlData.publicUrl;
        }

        const { data, error } = await supabase
            .from('events')
            .update(updatePayload)
            .eq('id', id)
            .select();
            
        if (error) throw error;

        const updatedEvent = {
            id: data[0].id,
            title: data[0].title,
            description: data[0].description,
            imagePath: data[0].image_path,
            date: data[0].created_at
        };

        return NextResponse.json(updatedEvent);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }
}
