import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="w-full bg-charcoal border-t border-wine/30 px-8 py-10 mt-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
         <div className="max-w-sm">
           <h3 className="text-xl font-bold text-parchment mb-2">Takhayul</h3>
           <p className="text-parchment/50 text-sm leading-relaxed">
             Every day brings more shows, movies, and books than anyone could get
             through. Takhayul learns what you actually enjoy and gives you an honest
             verdict before you commit your time, so you spend less time scrolling
             and more time watching or reading something worth it.
           </p>
         </div>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="text-parchment/40 uppercase text-xs tracking-widest mb-1">Explore</span>
          <Link to="/movies" className="text-parchment/70 hover:text-gold transition">Movies</Link>
          <Link to="/books" className="text-parchment/70 hover:text-gold transition">Books</Link>
          <Link to="/recommendations" className="text-parchment/70 hover:text-gold transition">For you</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="text-parchment/40 uppercase text-xs tracking-widest mb-1">Legal</span>
          <Link to="/terms" className="text-parchment/70 hover:text-gold transition">Terms of use</Link>
          <Link to="/privacy" className="text-parchment/70 hover:text-gold transition">Privacy policy</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm max-w-xs">
          <span className="text-parchment/40 uppercase text-xs tracking-widest mb-1">Sources</span>
          <p className="text-parchment/50">
            Movie data from The Movie Database (TMDb). Book data from Google Books.
            This product uses the TMDb API but is not endorsed or certified by TMDb.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer