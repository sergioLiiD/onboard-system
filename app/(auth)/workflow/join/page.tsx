'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function JoinWorkflowPage() {
  const [formData, setFormData] = useState({
    email: '',
    accessCode: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      // First check if the access code is valid
      const { data: assignment, error: assignmentError } = await supabase
        .from('workflow_assignments')
        .select('id, workflow_id')
        .eq('access_code', formData.accessCode)
        .is('invitee_id', null)
        .single()

      if (assignmentError) throw new Error('Invalid access code')

      // Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Create the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            role: 'invitee',
          })

        if (profileError) throw profileError

        // Update the workflow assignment
        const { error: updateError } = await supabase
          .from('workflow_assignments')
          .update({
            invitee_id: authData.user.id,
            status: 'in_progress'
          })
          .eq('id', assignment.id)

        if (updateError) throw updateError

        // Redirect to workflow
        window.location.href = `/workflow/${assignment.workflow_id}`
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
          <h1 className="text-4xl font-bold mb-2">Join Workflow</h1>
          <p className="text-base-content/60">Enter your access code to get started</p>
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
              <span className="label-text">Access Code</span>
            </label>
            <input
              type="text"
              placeholder="Enter your access code"
              className="input input-bordered w-full"
              value={formData.accessCode}
              onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
              required
            />
          </div>

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
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            Join Workflow
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="link link-hover">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
