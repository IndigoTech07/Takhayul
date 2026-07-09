import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

function Layout() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (loading || !user) return

    const allowedWithoutOnboarding = ['/onboarding', '/auth', '/terms', '/privacy']
    if (allowedWithoutOnboarding.includes(location.pathname)) return

    const checkOnboarding = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!data?.onboarding_completed) {
        navigate('/onboarding')
      }
    }

    checkOnboarding()
  }, [user, loading, location.pathname])

  return (
    <div className="min-h-screen bg-charcoal text-parchment font-sans flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Layout
