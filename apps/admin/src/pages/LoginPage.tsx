import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HirraMark } from '@/components/HirraMark';
import { setApiKey } from '@/lib/api';

export function LoginPage() {
  const navigate = useNavigate();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setApiKey(key.trim());

    try {
      const res = await fetch('/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${key.trim()}` },
      });
      if (!res.ok) throw new Error('Invalid API key');
      navigate('/');
    } catch {
      setError('Invalid API key. Check ADMIN_API_KEY matches apps/api/.env');
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-cream px-4">
      <div className="w-full max-w-md rounded-card border border-walnut/10 bg-whisper p-8 shadow-card">
        <div className="flex items-center gap-3 text-emerald mb-8">
          <HirraMark className="h-10 w-10" />
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-[0.1em] text-walnut">
              HIRRA
            </h1>
            <p className="text-xs uppercase tracking-[0.18em] text-brass font-semibold">
              Operations dashboard
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-walnut/55">
              Admin API key
            </span>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-walnut/15 bg-cream px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/30"
              placeholder="Paste ADMIN_API_KEY"
              required
            />
          </label>
          {error ? <p className="text-sm text-signal">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald text-cream py-3 text-sm font-semibold hover:bg-emerald-dark transition"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
