import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const GENRES = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Romance',
  'Sci-Fi', 'Fantasy', 'Mystery', 'Thriller', 'Documentary',
]

function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('favorite_genres')
        .eq('user_id', user.id)
        .maybeSingle()

      if (data?.favorite_genres) {
        setSelected(data.favorite_genres.split(','))
      }
      setLoading(false)
    }

    fetchProfile()
  }, [user])

  const toggleGenre = (genre) => {
    setSelected((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    )
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)

    await supabase.from('profiles').upsert(
      {
        user_id: user.id,
        favorite_genres: selected.join(','),
        onboarding_completed: true,
      },
      { onConflict: 'user_id' }
    )

    setSaving(false)
    setSaved(true)
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center pt-32">
        <p className="text-parchment/60">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center pt-32">
        <p className="text-parchment/60">Sign in to view your taste profile.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center pt-16 px-6 gap-8 pb-16">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-parchment">Your taste profile</h1>
        <p className="text-parchment/60">
          Update your favorite genres any time, Takhayul adapts as you do.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center max-w-xl">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`px-5 py-2 rounded-full border transition ${
              selected.includes(genre)
                ? 'bg-gold border-gold text-charcoal font-semibold'
                : 'bg-charcoal border-wine/30 text-parchment/70 hover:border-gold/50'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-wine hover:bg-wine/80 transition rounded-full px-8 py-3 font-semibold text-parchment disabled:opacity-50"
      >
        {saving ? 'Saving...' : saved ? 'Saved' : 'Save changes'}
      </button>
    </div>
  )
}

export default ProfilePage