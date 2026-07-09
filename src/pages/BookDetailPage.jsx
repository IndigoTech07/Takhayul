import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import FavoriteButton from '../components/FavoriteButton'
import StarRating from '../components/StarRating'

const BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

function BookDetailPage() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [verdict, setVerdict] = useState('')
  const [verdictLoading, setVerdictLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchBook = async () => {
      setLoading(true)
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${id}?key=${BOOKS_API_KEY}`
      )
      const data = await response.json()

      if (cancelled) return

      setBook(data)
      setLoading(false)
    }

    fetchBook()

    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!book) return

    let cancelled = false

    const fetchVerdict = async () => {
      setVerdictLoading(true)

      const rawDescription = book.volumeInfo.description || ''
      const cleanedForPrompt =
        rawDescription.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() ||
        'No description available.'

      const prompt = `You are a book critic. In 2-3 short sentences, give a spoiler-free "worth reading?" verdict for the book "${book.volumeInfo.title}" by ${book.volumeInfo.authors?.[0] || 'an unknown author'}. Here's its description: ${cleanedForPrompt}. Be honest, opinionated, and concise.`

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
  }, [book])

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-32">
        <p className="text-parchment/60">Loading...</p>
      </div>
    )
  }

  const info = book.volumeInfo
  const cover = info.imageLinks?.thumbnail || 'https://placehold.co/400x600?text=No+Cover'
  const cleanDescription = info.description
    ? info.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    : 'No description available.'

  return (
    <div className="flex flex-col items-center pt-12 px-6 gap-6 pb-16 max-w-6xl mx-auto">
      <Link to="/books" className="self-start text-gold hover:underline">
        Back to books
      </Link>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-parchment">{info.title}</h1>
        <p className="text-parchment/60 mt-1">
          {info.authors?.[0] || 'Unknown'} {info.publishedDate ? `- ${info.publishedDate.slice(0, 4)}` : ''}
        </p>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-4 w-full md:w-56 shrink-0 mx-auto">
          <img src={cover} alt={info.title} className="w-56 rounded-xl shadow-lg" />
          <FavoriteButton
            itemType="book"
            itemId={id}
            title={info.title}
            poster={cover}
            year={info.publishedDate?.slice(0, 4)}
          />
          <StarRating
            itemType="book"
            itemId={id}
            title={info.title}
            poster={cover}
            year={info.publishedDate?.slice(0, 4)}
          />
        </div>

        <div className="flex-1">
          <h2 className="text-parchment/50 text-xs uppercase tracking-widest mb-2">Overview</h2>
          <p className="text-parchment/80 leading-relaxed">{cleanDescription}</p>
        </div>

        <div className="w-full md:w-72 shrink-0 bg-charcoal rounded-xl p-6 border-2 border-gold">
          <p className="text-gold/70 text-xs uppercase tracking-widest mb-1">Takhayul verdict</p>
          <h2 className="text-parchment font-bold text-lg mb-3">Worth reading?</h2>
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

export default BookDetailPage