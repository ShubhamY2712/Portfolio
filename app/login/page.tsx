"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleLogin(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main id="main" className="min-h-screen flex items-center justify-center bg-paper px-5">
      <form
        onSubmit={handleLogin}
        className="card p-6 sm:p-8 w-full max-w-sm"
      >
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Admin login</h1>
        <p className="text-ink-soft text-sm mb-6">Only you should have these credentials.</p>

        <label htmlFor="email" className="block text-sm text-ink-soft mb-1">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className="admin-input mb-4"
        />

        <label htmlFor="password" className="block text-sm text-ink-soft mb-1">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          className="admin-input mb-4"
        />

        {error && <p role="alert" className="text-sm text-red-400 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-paper py-2 rounded-md text-sm font-medium hover:bg-accent-light transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
