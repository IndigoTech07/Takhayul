import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const GENRES = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Romance',
  'Sci-Fi', 'Fantasy', 'Mystery', 'Thriller', 'Documentary',
]

function OnboardingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])
  const [saving, setSaving] = useState(false)

  const toggleGenre = (genre) => {
    setSelected((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    )
  }

  const handleContinue = async () => {
    if (!user) return
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
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center pt-16 px-6 gap-8 pb-16">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-parchment">What do you love?</h1>
        <p className="text-parchment/60">
          Pick a few genres you enjoy, this helps Takhayul learn your taste.
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
        onClick={handleContinue}
        disabled={selected.length === 0 || saving}
        className="bg-wine hover:bg-wine/80 transition rounded-full px-8 py-3 font-semibold text-parchment disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Continue'}
      </button>
    </div>
  )
}

export default OnboardingPage