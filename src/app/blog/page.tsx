import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0;

export default async function BlogPage() {
    const { data: posts } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });

    return (
        <div style={{ padding: '8rem 2rem 4rem', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3rem', color: 'var(--accent-gold)', margin: 0 }}>The IronSoul Blog</h1>
                    <Link href="/" style={{ padding: '0.5rem 1rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--text-main)', textDecoration: 'none' }}>
                        &larr; Back Home
                    </Link>
                </div>
                
                {(!posts || posts.length === 0) ? (
                    <p style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.7 }}>No articles published yet. Check back soon!</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {posts.map((post: any) => (
                            <Link href={`/blog/${post.slug}`} key={post.id} style={{ textDecoration: 'none' }}>
                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '15px', padding: '2rem', height: '100%', transition: 'transform 0.3s, box-shadow 0.3s' }} className="blog-card">
                                    <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>{post.title}</h2>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', opacity: 0.7, marginBottom: '1.5rem' }}>
                                        By {post.author} • {new Date(post.created_at).toLocaleDateString()}
                                    </p>
                                    <p style={{ color: 'var(--text-main)', opacity: 0.9, lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                        {post.content}
                                    </p>
                                    <p style={{ color: 'var(--accent-gold)', marginTop: '1rem', fontWeight: 'bold' }}>Read more &rarr;</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                .blog-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    border-color: var(--accent-gold) !important;
                }
            `}} />
        </div>
    );
}
