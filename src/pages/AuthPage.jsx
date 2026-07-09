import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password })

      setLoading(false)

      if (error) {
        setError(error.message)
      } else if (data?.user && data.user.identities?.length === 0) {
        setError('This email is already registered. Try logging in instead.')
      } else {
        setCheckEmail(true)
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      setLoading(false)

      if (error) {
        setError(error.message)
      } else {
        navigate('/')
      }
    }
  }

  if (checkEmail) {
    return (
      <div className="flex flex-col items-center pt-20 gap-4 px-6 text-center">
        <h1 className="text-3xl font-bold text-parchment">Check your email</h1>
        <p className="text-parchment/60 max-w-sm">
          We sent you a confirmation link. Click it, then come back and log in
          to finish setting up your taste profile.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center pt-20 gap-6 px-6">
      <h1 className="text-3xl font-bold text-parchment">
        {isSignUp ? 'Create your account' : 'Welcome back'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="px-4 py-3 rounded-lg bg-charcoal border border-wine/30 text-parchment placeholder-parchment/40 focus:outline-none focus:border-gold"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
          className="px-4 py-3 rounded-lg bg-charcoal border border-wine/30 text-parchment placeholder-parchment/40 focus:outline-none focus:border-gold"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-gold hover:bg-gold/80 transition rounded-lg py-3 font-semibold text-charcoal disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isSignUp ? 'Sign up' : 'Log in'}
        </button>
      </form>

      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-gold text-sm hover:underline"
      >
        {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </button>
    </div>
  )
}

export default AuthPage
