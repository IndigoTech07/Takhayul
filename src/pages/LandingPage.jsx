import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import MovieCard from '../components/MovieCard'
import BookCard from '../components/BookCard'
import HeroBackground from '../components/HeroBackground'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

function LandingPage() {
  const { user } = useAuth()
  const [movies, setMovies] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  const [recMovies, setRecMovies] = useState([])
  const [recLoading, setRecLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchPreview = async () => {
      setLoading(true)

      const movieRes = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`
      )
      const movieData = await movieRes.json()

      const bookRes = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=fantasy&maxResults=8&key=${BOOKS_API_KEY}`
      )
      const bookData = await bookRes.json()

      if (cancelled) return

      setMovies((movieData.results || []).slice(0, 8))
      setBooks(bookData.items || [])
      setLoading(false)
    }

    fetchPreview()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!user) return

    let cancelled = false

    const fetchTeaserRecs = async () => {
      setRecLoading(true)

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('favorite_genres')
          .eq('user_id', user.id)
          .maybeSingle()

        const { data: favorites } = await supabase
          .from('favorites')
          .select('title, item_type')
          .eq('user_id', user.id)
          .limit(10)

        const genres = profile?.favorite_genres || 'no specific genres set'
        const favTitles = (favorites || []).map((f) => `${f.title} (${f.item_type})`).join(', ') || 'none yet'

        const prompt = `Based on this user's preferences, suggest exactly 4 movies they would likely enjoy.

Favorite genres: ${genres}
Favorited titles: ${favTitles}

Respond with ONLY valid JSON, no other text, in exactly this shape:
{"movies": ["Title 1", "Title 2", "Title 3", "Title 4"]}`

        const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
        const aiData = await aiResponse.json()
        const rawText = aiData.choices?.[0]?.message?.content || '{}'
        const cleanedText = rawText.replace(/```json|```/g, '').trim()
        const suggestions = JSON.parse(cleanedText)

        const movieResults = await Promise.all(
          (suggestions.movies || []).map(async (title) => {
            const res = await fetch(
              `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`
            )
            const data = await res.json()
            return data.results?.[0] || null
          })
        )

        if (cancelled) return
        setRecMovies(movieResults.filter(Boolean))
      } catch (err) {
        console.error('Teaser recommendation error:', err)
      }

      setRecLoading(false)
    }

    fetchTeaserRecs()

    return () => {
      cancelled = true
    }
  }, [user])

  return (
    <div className="flex flex-col items-center gap-16 pb-16 px-6">
      <div
        className="relative w-full flex flex-col items-center justify-end text-center overflow-hidden"
        style={{ minHeight: '90vh' }}
      >
        <HeroBackground
          posters={movies.map((m) => `https://image.tmdb.org/t/p/w780${m.poster_path}`)}
        />

        <div className="relative max-w-xl pb-32 px-6">
          <h1
          className="text-8xl font-bold mb-4 uppercase tracking-wider bg-gradient-to-r from-gold to-wine bg-clip-text text-transparent"
          style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.8))' }}
        >
         Takhayul
       </h1>
          <p className="text-parchment/80 text-lg mb-8">
            Know what is worth your time before you spend it.
          </p>

          {user ? (
            <Link
              to="/recommendations"
              className="inline-block bg-gold hover:bg-gold/80 transition px-8 py-3 rounded-full text-charcoal font-semibold"
            >
              See your picks
            </Link>
          ) : (
            <Link
              to="/auth"
              className="inline-block bg-gold hover:bg-gold/80 transition px-8 py-3 rounded-full text-charcoal font-semibold"
            >
              Get started
            </Link>
          )}
        </div>
      </div>

      {user && (
        <div className="w-full max-w-5xl flex flex-col items-center gap-4">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gold">Recommended for you</h2>
            <Link to="/recommendations" className="text-parchment/60 hover:text-parchment transition text-sm">
              See all
            </Link>
          </div>

          {recLoading ? (
            <p className="text-parchment/60 text-sm">Thinking of picks for you...</p>
          ) : recMovies.length > 0 ? (
            <div className="flex flex-wrap gap-6 justify-center">
              {recMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  year={movie.release_date?.slice(0, 4)}
                  blurb={movie.overview?.slice(0, 100) + '...'}
                  poster={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                />
              ))}
            </div>
          ) : (
            <p className="text-parchment/50 text-sm">
              Favorite a few things to unlock personalized picks.
            </p>
          )}
        </div>
      )}

      <div className="w-full max-w-5xl flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-xl font-semibold text-wine">Popular movies</h2>
          <Link to="/movies" className="text-parchment/60 hover:text-parchment transition text-sm">
            See all
          </Link>
        </div>

        {loading ? (
          <p className="text-parchment/60">Loading...</p>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {movies.slice(0, 4).map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                year={movie.release_date?.slice(0, 4)}
                blurb={movie.overview?.slice(0, 100) + '...'}
                poster={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-5xl flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gold">Popular books</h2>
          <Link to="/books" className="text-parchment/60 hover:text-parchment transition text-sm">
            See all
          </Link>
        </div>

        {loading ? (
          <p className="text-parchment/60">Loading...</p>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {books.slice(0, 4).map((book) => (
              <BookCard
                key={book.id}
                bookId={book.id}
                title={book.volumeInfo.title}
                author={book.volumeInfo.authors?.[0] || 'Unknown'}
                year={book.volumeInfo.publishedDate?.slice(0, 4)}
                cover={book.volumeInfo.imageLinks?.thumbnail}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LandingPage