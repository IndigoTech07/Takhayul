import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-gold border-b-2 border-gold pb-1 transition'
      : 'text-parchment/70 hover:text-gold border-b-2 border-transparent pb-1 transition'

  const mobileLinkClass = ({ isActive }) =>
    isActive
      ? 'text-gold text-lg py-2'
      : 'text-parchment/80 text-lg py-2'

  return (
    <nav className="w-full bg-charcoal/80 backdrop-blur sticky top-0 z-20 border-b border-wine/30">
      <div className="flex items-center justify-between px-6 md:px-8 py-4">
        <Link to="/" className="text-2xl font-bold text-parchment tracking-wide outline-none">
          Takhayul
        </Link>

        <div className="hidden md:flex gap-6 text-sm items-center">
          <NavLink to="/movies" className={linkClass}>Movies</NavLink>
          <NavLink to="/books" className={linkClass}>Books</NavLink>

          {user ? (
            <>
              <NavLink to="/favorites" className={linkClass}>Favorites</NavLink>
              <NavLink to="/profile" className={linkClass}>Profile</NavLink>
              <NavLink to="/recommendations" className={linkClass}>For you</NavLink>
              <span className="text-parchment/50">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-wine hover:bg-wine/80 transition px-4 py-2 rounded-full text-parchment"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/auth" className="bg-gold hover:bg-gold/80 transition px-4 py-2 rounded-full text-charcoal font-semibold">
              Sign in
            </Link>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-parchment"
          aria-label="Toggle menu"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col px-6 pb-6 gap-1 border-t border-wine/20">
          <NavLink to="/movies" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Movies</NavLink>
          <NavLink to="/books" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Books</NavLink>

          {user ? (
            <>
              <NavLink to="/favorites" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Favorites</NavLink>
              <NavLink to="/profile" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Profile</NavLink>
              <NavLink to="/recommendations" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>For you</NavLink>
              <p className="text-parchment/50 text-sm pt-2">{user.email}</p>
              <button
                onClick={handleSignOut}
                className="bg-wine hover:bg-wine/80 transition px-4 py-3 rounded-full text-parchment mt-2"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMenuOpen(false)}
              className="bg-gold hover:bg-gold/80 transition px-4 py-3 rounded-full text-charcoal font-semibold text-center mt-2"
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
