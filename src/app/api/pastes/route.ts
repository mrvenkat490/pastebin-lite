import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCurrentTime } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    // Content lekapothe error ivvali
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const now = getCurrentTime(req.headers);
    let expires_at = null;
    
    // Expiry calculation (seconds to timestamp)
    if (ttl_seconds && typeof ttl_seconds === 'number' && ttl_seconds >= 1) {
      expires_at = new Date(now + ttl_seconds * 1000).toISOString();
    }

    // Database loki data insert cheyadam
    const { data, error } = await supabase
      .from('pastes')
      .insert([
        { 
          content, 
          max_views: (max_views && max_views >= 1) ? max_views : null, 
          remaining_views: (max_views && max_views >= 1) ? max_views : null, 
          expires_at 
        }
      ])
      .select()
      .single();

    if (error) throw error;

    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 'http';

    // Unique ID and shareable URL return chestunnam
    return NextResponse.json({
      id: data.id,
      url: `${protocol}://${host}/p/${data.id}`
    }, { status: 201 });

  } catch (err: any) {
    console.error("Post Error:", err.message);
    return NextResponse.json({ error: "Failed to create paste" }, { status: 400 });
  }
}