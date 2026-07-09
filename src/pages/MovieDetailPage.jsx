import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import FavoriteButton from '../components/FavoriteButton'
import StarRating from '../components/StarRating'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

function MovieDetailPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [verdict, setVerdict] = useState('')
  const [verdictLoading, setVerdictLoading] = useState(false)

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true)
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`
      )
      const data = await response.json()
      setMovie(data)
      setLoading(false)
    }

    fetchMovie()
  }, [id])

  useEffect(() => {
    if (!movie) return

    let cancelled = false

    const fetchVerdict = async () => {
      setVerdictLoading(true)
      const prompt = `You are a movie critic. In 2-3 short sentences, give a spoiler-free "worth watching?" verdict for the movie "${movie.title}" (${movie.release_date?.slice(0, 4)}). Here's its synopsis: ${movie.overview}. Be honest, opinionated, and concise.`

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await response.json()

      if (cancelled) return

      const text = data.choices?.[0]?.message?.content
      setVerdict(text || 'Could not generate a verdict right now.')
      setVerdictLoading(false)
    }

    fetchVerdict()

    return () => {
      cancelled = true
    }
  }, [movie])

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-32">
        <p className="text-parchment/60">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center pt-12 px-6 gap-6 pb-16 max-w-6xl mx-auto">
      <Link to="/movies" className="self-start text-wine hover:underline">
        Back to search
      </Link>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-parchment">{movie.title}</h1>
        <p className="text-parchment/60 mt-1">
          {movie.release_date?.slice(0, 4)} - {movie.runtime} min
        </p>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-4 w-full md:w-56 shrink-0 mx-auto">
          <img
            src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
            alt={movie.title}
            className="w-56 rounded-xl shadow-lg"
          />
          <FavoriteButton
            itemType="movie"
            itemId={String(movie.id)}
            title={movie.title}
            poster={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            year={movie.release_date?.slice(0, 4)}
          />
          <StarRating
            itemType="movie"
            itemId={String(movie.id)}
            title={movie.title}
            poster={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            year={movie.release_date?.slice(0, 4)}
          />
        </div>

        <div className="flex-1">
          <h2 className="text-parchment/50 text-xs uppercase tracking-widest mb-2">Overview</h2>
          <p className="text-parchment/80 leading-relaxed">{movie.overview}</p>
        </div>

        <div className="w-full md:w-72 shrink-0 bg-charcoal rounded-xl p-6 border-2 border-wine">
          <p className="text-wine/70 text-xs uppercase tracking-widest mb-1">Takhayul verdict</p>
          <h2 className="text-parchment font-bold text-lg mb-3">Worth watching?</h2>
          {verdictLoading ? (
            <p className="text-parchment/60 text-sm">Thinking...</p>
          ) : (
            <p className="text-parchment/90 text-sm leading-relaxed">{verdict}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieDetailPage