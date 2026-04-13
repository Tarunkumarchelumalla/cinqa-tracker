'use client'

import { useState, Suspense } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(urlError === 'auth_failed' ? 'Authentication failed. Please try again.' : '')
  const [success, setSuccess] = useState('')

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const supabase = createClient()

    if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (signUpError) {
        setError(signUpError.message)
      } else {
        setSuccess('Check your email to confirm your account, then sign in.')
        setMode('signin')
      }
      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060B18] px-4">
      <div className="w-full max-w-[380px]">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="relative h-16 w-16">
            <Image
              src="/logo.png"
              alt="Cinqa"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-white">Cinqa Tracker</h1>
            <p className="mt-0.5 text-[11px] uppercase tracking-widest text-white/25">
              AI Workflows &amp; Creative Automation
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0D1220] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_48px_rgba(0,0,0,0.5)]">

          {/* Alerts */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/[0.08] px-3 py-2.5 text-xs text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/[0.08] px-3 py-2.5 text-xs text-green-400">
              {success}
            </div>
          )}

          {/* Email form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/40">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full rounded-lg border border-white/[0.08] bg-[#0A0F1E] px-3 py-2.5 text-sm text-white placeholder:text-white/20 transition-colors focus:border-[#1A6BFF] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/40">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/[0.08] bg-[#0A0F1E] px-3 py-2.5 text-sm text-white placeholder:text-white/20 transition-colors focus:border-[#1A6BFF] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-[#060B18] transition-all hover:bg-[#E8EAEF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </form>

          {/* Toggle sign in / sign up */}
          <p className="mt-3 text-center text-xs text-white/30">
            {mode === 'signin' ? (
              <>No account?{' '}
                <button onClick={() => { setMode('signup'); setError('') }} className="text-[#5B9BFF] hover:text-[#1A6BFF] transition-colors">
                  Create one
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => { setMode('signin'); setError('') }} className="text-[#5B9BFF] hover:text-[#1A6BFF] transition-colors">
                  Sign in
                </button>
              </>
            )}
          </p>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 border-t border-white/[0.06]" />
            <span className="text-xs text-white/20">or</span>
            <div className="flex-1 border-t border-white/[0.06]" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] py-2.5 text-sm font-medium text-white/80 transition-all hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="mt-5 text-center text-[11px] text-white/20">
          Internal use only · cinqa.space
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
