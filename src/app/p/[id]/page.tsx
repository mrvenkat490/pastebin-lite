import { notFound } from 'next/navigation';

// Next.js 15+ lo params anedhi Promise, so Promise type vaadaali
export default async function ViewPaste({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. Ikkada await chesthe asalu ID bayataki vasthundi
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // 2. Fetch chesthunnam
  const res = await fetch(`${baseUrl}/api/pastes/${id}`, { 
    cache: 'no-store' 
  });

  if (!res.ok) {
    return notFound();
  }

  const data = await res.json();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Paste Content</h1>
          {data.expires_at && (
            <span className="text-sm text-red-500 font-medium">
              Expires at: {new Date(data.expires_at).toLocaleString()}
            </span>
          )}
        </div>
        
        <pre className="p-4 bg-gray-100 rounded text-gray-700 font-mono whitespace-pre-wrap wrap-break-word">
          {data.content}
        </pre>
        
        <div className="mt-6">
          <a href="/" className="text-blue-500 hover:underline text-sm">
            ← Create New Paste
          </a>
        </div>
      </div>
    </div>
  );
}