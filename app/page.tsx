"use client"

import { useState, useEffect } from "react"
import { ViewTransition } from "@/components/view-transition"
import { BookCard } from "@/components/book-card"
import { SearchBar } from "@/components/search-bar"
import { books } from "@/lib/data"
import { useAuth } from "@/hooks/useAuth"
import { AuthModal } from "@/components/auth/auth-modal"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [isLoaded, setIsLoaded] = useState(false)
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Only show published books
  const publishedBooks = books.filter((book) => book.status === "published")

  const filteredBooks = publishedBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  const genres = ["all", ...Array.from(new Set(publishedBooks.map((book) => book.genre)))]

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
      </div>
    )
  }

  return (
    <ViewTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
        <header
          className={`sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-stone-200 transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-light text-stone-800 tracking-wide animate-fade-in-left">Library</h1>
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <span className="text-sm text-stone-600">Welcome, {user.firstName}</span>
                    {user.isAdmin && (
                      <a
                        href="/admin"
                        className="text-sm text-stone-600 hover:text-stone-800 transition-colors duration-200"
                      >
                        Admin
                      </a>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="text-sm text-stone-600 hover:text-stone-800 transition-colors duration-200"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>

            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            >
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search books or authors..." />

              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-2 rounded-full border border-stone-300 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all duration-200 hover:shadow-md"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre === "all" ? "All Genres" : genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-stone-500 text-lg">No books found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </ViewTransition>
  )
}
