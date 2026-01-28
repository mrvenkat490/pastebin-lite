'use client';
import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const createPaste = async () => {
    if (!content.trim()) return alert("Please enter some content!");
    
    setLoading(true);
    setUrl('');
    setCopied(false);

    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content, 
          ttl_seconds: 3600 // 1 hour expiry
        }),
      });
      
      const data = await res.json();
      if (data.url) {
        setUrl(data.url);
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">🤭💞 Pastebin Lite 💞🤭</h1>
        <p className="text-gray-500 text-center mb-8">Type karoo, Link create , Share karoo!</p>
        
        <textarea
          className="w-full h-35 p-5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 font-mono text-sm shadow-inner bg-gray-50"
          placeholder="Please Enter The Text..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <div className="mt-6 flex flex-col items-center">
          <button
            onClick={createPaste}
            disabled={loading}
            className={`w-full md:w-auto px-10 py-3 rounded-full font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
            }`}
          >
            {loading ? 'Creating...' : 'Create Secret Paste'}
          </button>

          {url && (
            <div className="mt-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 overflow-hidden w-full">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Mee Shareable Link:</p>
                  <p className="text-sm text-gray-700 truncate font-mono bg-white p-2 border rounded border-blue-100">{url}</p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`w-full md:w-auto px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-md ${
                    copied ? 'bg-green-500 text-white' : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  {copied ? 'Copied! ✅' : 'Copy Link'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <footer className="mt-12 text-center text-gray-400 text-sm">
        Build by Mr incredible | Protected with Supabase 🛡️
      </footer>
    </main>
  );
}