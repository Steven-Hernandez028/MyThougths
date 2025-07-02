"use client"

import { useState, useEffect } from "react"
import { ViewTransition } from "@/components/view-transition"
import { BookCard } from "@/components/book-card"
import { SearchBar } from "@/components/search-bar"
import { useAuth } from "@/hooks/useAuth"
import { AuthModal } from "@/components/auth/auth-modal"
import { Book } from "@/lib/entities/Book"
import { bookService } from "@/lib/services/bookService"
import { useNotification } from "@/hooks/useNotification"
import PushNotificationManager from "@/components/NotificationClient"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { user, loading,logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { success, error } = useNotification()

  const [books, setBooks] = useState<Book[]>([])


  useEffect(()=>{
    if(user)
    setShowAuthModal(false)
  },[user])


  // Load books
  const loadBooks = async () => {
    try {
      setIsLoaded(true)
      const fetchedBooks = await bookService.getBooks()
      setBooks(fetchedBooks)
    } catch (err) {
      error("Failed to load books", err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoaded(true)
    }
  }
  const publishedBooks = books.filter((book) => book.status === "published")

  const filteredBooks = publishedBooks;

  useEffect(() => {
    loadBooks();
  }, [])

  useEffect(() => {
    if (loading) return

    setShowAuthModal(false)
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
            <div className="flex items-center justify-between ">
              <h1 className="text-3xl font-light text-stone-800 tracking-wide animate-fade-in-left">Bienvenido</h1>
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <PushNotificationManager />
                    <span className="text-sm text-stone-600">Hola {user.firstName}</span>
                    {
                      !user.isAdmin && (
                        <button
                          onClick={logout}
                          className="text-sm text-stone-600 hover:text-stone-800 transition-colors duration-200"
                        >
                          Cerrar sesión
                        </button>
                      )
                    }
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
                    Entrar
                  </button>
                )}
              </div>
            </div>

            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            >

            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {filteredBooks.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>

          {filteredBooks.length  === 0 && !isLoaded && (
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
