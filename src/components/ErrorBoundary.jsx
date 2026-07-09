import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Caught by ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-charcoal text-parchment px-6 text-center">
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="text-parchment/60 max-w-sm">
            An unexpected error occurred. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gold hover:bg-gold/80 transition px-6 py-3 rounded-full text-charcoal font-semibold"
          >
            Back to home
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary