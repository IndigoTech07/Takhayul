import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-gold border-b-2 border-gold pb-1 transition'
      : 'text-parchment/70 hover:text-gold border-b-2 border-transparent pb-1 transition'

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 border-b border-wine/30 bg-charcoal/80 backdrop-blur  sticky top-0 z-10">
      <Link to="/" className="text-2xl font-bold text-parchment tracking-wide outline-none">
        TAKHAYUL
      </Link>
      <div className="flex gap-6 text-sm items-center">
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
    </nav>
  )
}

export default Navbar