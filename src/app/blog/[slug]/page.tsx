import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const { data: post } = await supabase.from('blog_posts').select('*').eq('slug', params.slug).single();
    if (!post) return { title: 'Post Not Found - IronSoul' };
    return {
        title: `${post.title} - IronSoul Blog`,
        description: post.content.substring(0, 150) + '...',
    };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
    const { data: post, error } = await supabase.from('blog_posts').select('*').eq('slug', params.slug).single();
    
    if (error || !post) {
        notFound();
    }

    return (
        <div style={{ padding: '8rem 2rem 4rem', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link href="/blog" style={{ display: 'inline-block', marginBottom: '2rem', padding: '0.5rem 1rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--text-main)', textDecoration: 'none' }}>
                    &larr; Back to Blog
                </Link>
                
                <h1 style={{ fontSize: '3.5rem', color: 'var(--accent-gold)', marginBottom: '1rem', lineHeight: 1.2 }}>{post.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '2rem' }}>
                    <div style={{ background: 'var(--accent-gold)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                        {post.author.charAt(0)}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>{post.author}</p>
                        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                <div style={{ fontSize: '1.1rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                    {post.content}
                </div>
            </div>
        </div>
    );
}
