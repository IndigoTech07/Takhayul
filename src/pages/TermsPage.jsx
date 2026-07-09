function TermsPage() {
  return (
    <div className="flex flex-col items-center pt-16 px-6 pb-16 gap-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-parchment">Terms of use</h1>

      <div className="text-parchment/70 leading-relaxed flex flex-col gap-4">
        <p>
          Takhayul is a personal, non-commercial project built for learning purposes.
          It is provided as is, without warranties of any kind.
        </p>
        <p>
          Movie and book information is sourced from third-party APIs (The Movie
          Database and Google Books) and may not always be accurate or complete.
        </p>
        <p>
          The AI-generated verdicts and recommendations are opinions produced by a
          language model and should not be taken as professional criticism or
          guaranteed accurate suggestions.
        </p>
        <p>
          By creating an account, you agree to use the service responsibly and not
          attempt to misuse, disrupt, or exploit it.
        </p>
        <p>
          These terms may change as the project evolves. Continued use of the site
          after changes means you accept the updated terms.
        </p>
      </div>
    </div>
  )
}

export default TermsPage