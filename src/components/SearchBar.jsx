function SearchBar({ query, setQuery, placeholder = 'Search...', accent = 'gold' }) {
  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const focusClass = accent === 'wine' ? 'focus:border-wine' : 'focus:border-gold'

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-5 py-3 rounded-full bg-charcoal text-parchment placeholder-parchment/40 border border-wine/30 ${focusClass} transition`}
      />
    </form>
  )
}

export default SearchBar