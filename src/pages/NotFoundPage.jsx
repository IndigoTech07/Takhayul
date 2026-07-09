import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center pt-32 gap-4 text-center px-6">
      <h1 className="text-6xl font-bold text-gold">404</h1>
      <p className="text-parchment/70 max-w-sm">
        This page does not exist, it might be a story yet to be imagined.
      </p>
      <Link
        to="/"
        className="bg-gold hover:bg-gold/80 transition px-6 py-3 rounded-full text-charcoal font-semibold"
      >
        Back to home
      </Link>
    </div>
  )
}

export default NotFoundPage