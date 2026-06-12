"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function GoogleSuccessPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function exchangeToken() {
      try {
        const res = await fetch('/api/auth/google-to-django');
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || 'Unable to authenticate with Django');
        }

        if (data.access) {
          router.replace('/listings');
          return;
        }

        throw new Error('Django JWT was not returned');
      } catch (err) {
        console.error('Google auth exchange failed', err);
        setError(err instanceof Error ? err.message : String(err));
        signOut({ callbackUrl: '/' });
      }
    }

    exchangeToken();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 text-center">
      <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/40">
        <h1 className="text-2xl font-bold mb-4">Signing in with Google...</h1>
        <p className="text-slate-600 mb-4">Please wait while we finish connecting your account.</p>
        {error ? <p className="text-sm text-red-600">{error}</p> : <p className="text-sm text-slate-500">If you are not redirected automatically, please refresh.</p>}
      </div>
    </div>
  );
}
