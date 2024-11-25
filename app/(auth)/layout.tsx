'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Get user profile to determine role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        // Redirect based on role
        if (profile?.role === 'invitee') {
          router.replace('/workflow')
        } else {
          router.replace('/dashboard')
        }
      }
    }

    checkUser()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          {/* Add your logo here */}
          <h1 className="text-3xl font-bold">Onboard System</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
