import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import MovieCard from '../components/MovieCard'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import useDebounce from '../hooks/useDebounce'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

function HomePage() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  const debouncedQuery = useDebounce(query, 800)

 useEffect(() => {
  const fetchMovies = async () => {
    setLoading(true)

    const [page1Res, page2Res] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`),
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=2`),
    ])

    const page1 = await page1Res.json()
    const page2 = await page2Res.json()

    setMovies([...(page1.results || []), ...(page2.results || [])])
    setLoading(false)
  }

  fetchMovies()
}, [])

  useEffect(() => {
    if (!user || !debouncedQuery || debouncedQuery.trim().length < 3) return

    const logSearch = async () => {
      await supabase.from('search_history').insert({
        user_id: user.id,
        query: debouncedQuery.trim(),
        item_type: 'movie',
      })
    }

    logSearch()
  }, [debouncedQuery, user])

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  )
  

  return (
    <div className="flex flex-col items-center pt-12 gap-8">
      <SearchBar query={query} setQuery={setQuery} placeholder="Search for a movie..." accent="wine" />

      {loading ? (
        <p className="text-gray-400">Loading movies...</p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center px-6">
          {filteredMovies.map((movie) => (
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
  )
}

export default HomePage