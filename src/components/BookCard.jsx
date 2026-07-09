import { Link } from 'react-router-dom'

function BookCard({ bookId, title, author, year, cover }) {
  const displayCover = cover || 'https://placehold.co/300x450?text=No+Cover'

  return (
    <Link to={`/book/${bookId}`}>
      <div className="bg-charcoal border-2 border-gold/40 rounded-xl overflow-hidden w-56 shadow-lg hover:scale-105 hover:border-gold transition-all cursor-pointer">
        <img src={displayCover} alt={title} className="w-full h-80 object-cover" />
        <div className="p-4">
          <h3 className="font-bold text-lg text-parchment">{title}</h3>
          <p className="text-parchment/60 text-sm mb-2">{author} {year ? `- ${year}` : ''}</p>
        </div>
      </div>
    </Link>
  )
}

export default BookCard