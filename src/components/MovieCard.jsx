import { Link } from 'react-router-dom'

function MovieCard({ id, title, year, blurb, poster }) {
  return (
    <Link to={`/movie/${id}`}>
      <div className="bg-charcoal border-2 border-wine/40 rounded-xl overflow-hidden w-56 shadow-lg hover:scale-105 hover:border-wine transition-all cursor-pointer">
        <img
          src={poster}
          alt={title}
          className="w-full h-80 object-cover"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg text-parchment">{title}</h3>
          <p className="text-parchment/60 text-sm mb-2">{year}</p>
          <p className="text-parchment/70 text-sm">{blurb}</p>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard