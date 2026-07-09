import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import BookCard from '../components/BookCard'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import useDebounce from '../hooks/useDebounce'

const BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

function BooksPage() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  const debouncedQuery = useDebounce(query, 800)

  useEffect(() => {
    let cancelled = false

    const fetchBooks = async () => {
      setLoading(true)
      const response = await fetch(
         `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=40&key=${BOOKS_API_KEY}`
          )
      const data = await response.json()

      if (cancelled) return

      setBooks(data.items || [])
      setLoading(false)
    }

    fetchBooks()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!user || !debouncedQuery || debouncedQuery.trim().length < 3) return

    const logSearch = async () => {
      await supabase.from('search_history').insert({
        user_id: user.id,
        query: debouncedQuery.trim(),
        item_type: 'book',
      })
    }

    logSearch()
  }, [debouncedQuery, user])

  const filteredBooks = books.filter((book) =>
    book.volumeInfo.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex flex-col items-center pt-12 gap-8">
      <SearchBar query={query} setQuery={setQuery} placeholder="Search for a book..." accent="gold" />

      {loading ? (
        <p className="text-gray-400">Loading books...</p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center px-6">
          {filteredBooks.map((book) => (
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
  )
}

export default BooksPage