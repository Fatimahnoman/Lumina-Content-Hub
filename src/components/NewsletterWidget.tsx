import { useState } from 'react';
import { Mail, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function NewsletterWidget() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    const { error } = await supabase
      .from('subscriptions')
      .insert({ email: email.trim() });

    if (error) {
      if (error.code === '23505') {
        setErrorMsg('You are already subscribed!');
        setStatus('error');
      } else {
        setErrorMsg('Something went wrong. Please try again.');
        setStatus('error');
      }
    } else {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-indigo-500/[0.08] via-purple-500/[0.05] to-transparent backdrop-blur-xl p-8 sm:p-12">
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 mb-4">
              <Mail className="w-6 h-6 text-indigo-300" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Stay in the loop
            </h2>
            <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
              Get the latest articles on AI engineering, architecture, and web development
              delivered straight to your inbox. No spam, ever.
            </p>

            {status === 'success' ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
                <Check className="w-4 h-4" />
                Subscribed! Check your inbox for a welcome message.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-400/40 focus:bg-white/[0.06] transition-all"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 disabled:opacity-60"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="mt-3 text-sm text-rose-400">{errorMsg}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
