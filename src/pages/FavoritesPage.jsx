import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

function FavoritesPage() {
  const { user, loading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchFavorites = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setFavorites(data || [])
      setLoading(false)
    }

    fetchFavorites()
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center pt-32">
        <p className="text-parchment/60">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center pt-32 gap-4">
        <p className="text-parchment/60">Sign in to see your favorites.</p>
        <Link to="/auth" className="text-gold hover:underline">
          Go to sign in
        </Link>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="flex items-center justify-center pt-32">
        <p className="text-parchment/60">No favorites yet, go save something.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center pt-12 gap-8 pb-16">
      <h1 className="text-3xl font-bold text-parchment">Your favorites</h1>

      <div className="flex flex-wrap gap-6 justify-center px-6">
        {favorites.map((fav) => {
          const linkTo =
            fav.item_type === 'movie'
              ? `/movie/${fav.item_id}`
              : `/book/${fav.item_id}`

          const accent = fav.item_type === 'movie' ? 'border-wine/20 hover:border-wine/50' : 'border-gold/20 hover:border-gold/50'

          return (
            <Link key={fav.id} to={linkTo}>
              <div className={`bg-charcoal border ${accent} rounded-xl overflow-hidden w-56 shadow-lg hover:scale-105 transition-all cursor-pointer`}>
                <img
                  src={fav.poster}
                  alt={fav.title}
                  className="w-full h-80 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg text-parchment">{fav.title}</h3>
                  <p className="text-parchment/60 text-sm">
                    {fav.item_type === 'movie' ? 'Movie' : 'Book'} {fav.year ? `- ${fav.year}` : ''}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default FavoritesPage