import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

function StarRating({ itemType, itemId, title, poster, year }) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchRating = async () => {
      const { data } = await supabase
        .from('ratings')
        .select('rating')
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('item_id', itemId)
        .maybeSingle()

      setRating(data?.rating || 0)
    }

    fetchRating()
  }, [user, itemType, itemId])

  const handleRate = async (value) => {
    if (!user) {
      alert('Please sign in to rate!')
      return
    }

    setLoading(true)

    await supabase
      .from('ratings')
      .upsert(
        {
          user_id: user.id,
          item_type: itemType,
          item_id: itemId,
          title,
          poster,
          year,
          rating: value,
        },
        { onConflict: 'user_id,item_type,item_id' }
      )

    setRating(value)
    setLoading(false)
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          disabled={loading}
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl transition-transform hover:scale-110"
        >
          {(hovered || rating) >= star ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  )
}

export default StarRating