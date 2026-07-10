import { Link } from 'react-router-dom'

function BookCard({ bookId, title, author, year, cover }) {
  const displayCover = cover || 'https://placehold.co/300x450?text=No+Cover'

  return (
    <Link to={`/book/${bookId}`}>
      <div className="bg-charcoal border-2 border-gold/40 rounded-xl overflow-hidden w-36 sm:w-44 md:w-56 shadow-lg hover:scale-105 hover:border-gold transition-all cursor-pointer">
        <img src={displayCover} alt={title} className="w-full h-52 sm:h-64 md:h-80 object-cover" />
        <div className="p-3 md:p-4">
          <h3 className="font-bold text-sm md:text-lg text-parchment line-clamp-1">{title}</h3>
          <p className="text-parchment/60 text-xs md:text-sm mb-1 md:mb-2">{author} {year ? `- ${year}` : ''}</p>
        </div>
      </div>
    </Link>
  )
}

export default BookCard
