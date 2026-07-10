import { Link } from 'react-router-dom'

function MovieCard({ id, title, year, blurb, poster }) {
  return (
    <Link to={`/movie/${id}`}>
      <div className="bg-charcoal border-2 border-wine/40 rounded-xl overflow-hidden w-36 sm:w-44 md:w-56 shadow-lg hover:scale-105 hover:border-wine transition-all cursor-pointer">
        <img
          src={poster}
          alt={title}
          className="w-full h-52 sm:h-64 md:h-80 object-cover"
        />
        <div className="p-3 md:p-4">
          <h3 className="font-bold text-sm md:text-lg text-parchment line-clamp-1">{title}</h3>
          <p className="text-parchment/60 text-xs md:text-sm mb-1 md:mb-2">{year}</p>
          <p className="text-parchment/70 text-xs md:text-sm hidden sm:block">{blurb}</p>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
