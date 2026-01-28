import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCurrentTime } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });

    const now = getCurrentTime(req.headers);
    let expires_at = null;
    if (ttl_seconds && ttl_seconds >= 1) {
      expires_at = new Date(now + ttl_seconds * 1000).toISOString();
    }

    const { data, error } = await supabase
      .from('pastes')
      .insert([{ 
        content, 
        max_views: max_views >= 1 ? max_views : null, 
        remaining_views: max_views >= 1 ? max_views : null, 
        expires_at 
      }])
      .select().single();

    if (error) throw error;

    const host = req.headers.get('host');
    return NextResponse.json({
      id: data.id,
      url: `http://${host}/p/${data.id}`
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
}