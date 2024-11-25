'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) throw signInError

      if (data.user) {
        // Get user profile to determine role and redirect accordingly
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profileError) throw profileError

        // Redirect based on user role
        if (profileData.role === 'invitee') {
          window.location.href = '/workflow'
        } else {
          window.location.href = '/dashboard'
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-base-100 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-base-content/60">Sign in to your account</p>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="input input-bordered w-full"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <label className="label">
              <Link href="/forgot-password" className="label-text-alt link link-hover">
                Forgot password?
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            Sign In
          </button>
        </form>

        <div className="divider my-8">OR</div>

        <div className="text-center space-y-4">
          <p className="text-base-content/70">
            Don't have an account?{' '}
            <Link href="/register" className="link link-primary">
              Sign up now
            </Link>
          </p>
          
          <Link 
            href="/workflow/join" 
            className="link link-secondary block"
          >
            Have an invitation code?
          </Link>
        </div>
      </div>
    </div>
  )
}
