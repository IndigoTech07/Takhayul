import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

function FavoriteButton({ itemType, itemId, title, poster, year }) {
  const { user } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    const checkFavorite = async () => {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('item_id', itemId)
        .maybeSingle()

      setIsFavorited(!!data)
    }

    checkFavorite()
  }, [user, itemType, itemId])

  const toggleFavorite = async () => {
    if (!user) {
      alert('Please sign in to save favorites.')
      return
    }

    setLoading(true)

    if (isFavorited) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('item_id', itemId)

      setIsFavorited(false)
    } else {
      await supabase.from('favorites').insert({
        user_id: user.id,
        item_type: itemType,
        item_id: itemId,
        title,
        poster,
        year,
      })

      setIsFavorited(true)
    }

    setLoading(false)
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`px-5 py-2 rounded-full font-semibold transition ${
        isFavorited
          ? 'bg-wine hover:bg-wine/80 text-parchment'
          : 'bg-charcoal hover:bg-wine/20 text-parchment/70 border border-wine/30'
      }`}
    >
      {isFavorited ? 'Favorited' : 'Add to favorites'}
    </button>
  )
}

export default FavoriteButton