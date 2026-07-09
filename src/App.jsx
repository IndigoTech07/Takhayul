import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import MovieDetailPage from './pages/MovieDetailPage'
import BooksPage from './pages/BooksPage'
import BookDetailPage from './pages/BookDetailPage'
import AuthPage from './pages/AuthPage'
import FavoritesPage from './pages/FavoritesPage'
import OnboardingPage from './pages/OnboardingPage'
import ProfilePage from './pages/ProfilePage'
import RecommendationsPage from './pages/RecommendationsPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import ErrorBoundary from './components/ErrorBoundary'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
  <ErrorBoundary>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="movies" element={<HomePage />} />
            <Route path="movie/:id" element={<MovieDetailPage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="book/:id" element={<BookDetailPage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ErrorBoundary>
  )
}

export default App