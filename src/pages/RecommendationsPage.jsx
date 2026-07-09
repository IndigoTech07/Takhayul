import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import MovieCard from '../components/MovieCard'
import BookCard from '../components/BookCard'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

function RecommendationsPage() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [movies, setMovies] = useState([])
  const [books, setBooks] = useState([])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const buildRecommendations = async () => {
      setLoading(true)
      setError('')

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

        const { data: ratings } = await supabase
          .from('ratings')
          .select('title, item_type, rating')
          .eq('user_id', user.id)
          .gte('rating', 4)
          .limit(10)

        const genres = profile?.favorite_genres || 'no specific genres set'
        const favTitles = (favorites || []).map((f) => `${f.title} (${f.item_type})`).join(', ') || 'none yet'
        const highRated = (ratings || []).map((r) => `${r.title} (${r.item_type}, rated ${r.rating}/5)`).join(', ') || 'none yet'

        const prompt = `You are a taste-based recommendation engine. Based on this user's preferences, suggest exactly 6 movies and 6 books they would likely enjoy.

Favorite genres: ${genres}
Favorited titles: ${favTitles}
Highly rated titles (4-5 stars): ${highRated}

Respond with ONLY valid JSON, no other text, no markdown formatting, in exactly this shape:
{"movies": ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5", "Title 6"], "books": ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5", "Title 6"]}

Do not recommend any titles that are already in the favorited or highly rated lists above.`

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

        const bookResults = await Promise.all(
          (suggestions.books || []).map(async (title) => {
            const res = await fetch(
              `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&maxResults=1&key=${BOOKS_API_KEY}`
            )
            const data = await res.json()
            return data.items?.[0] || null
          })
        )

        setMovies(movieResults.filter(Boolean))
        setBooks(bookResults.filter(Boolean))
      } catch (err) {
        console.error(err)
        setError('Could not generate recommendations right now.')
      }

      setLoading(false)
    }

    buildRecommendations()
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center pt-32">
        <p className="text-parchment/60">Building your recommendations...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center pt-32">
        <p className="text-parchment/60">Sign in to see personalized recommendations.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center pt-32">
        <p className="text-parchment/60">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center pt-12 gap-12 pb-16 px-6">
      <h1 className="text-3xl font-bold text-parchment">Recommended for you</h1>

      {movies.length > 0 && (
        <div className="w-full flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold text-wine">Movies</h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {movies.map((movie) => (
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
        </div>
      )}

      {books.length > 0 && (
        <div className="w-full flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold text-gold">Books</h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {books.map((book) => (
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
        </div>
      )}
    </div>
  )
}

export default RecommendationsPage