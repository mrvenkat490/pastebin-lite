import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCurrentTime } from '@/lib/utils';

// Type ni Promise ga marchali
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Ikkada await thappakunda cheyali
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const now = getCurrentTime(req.headers);

    const { data: paste, error } = await supabase
      .from('pastes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !paste) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json({
      content: paste.content,
      expires_at: paste.expires_at
    });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}