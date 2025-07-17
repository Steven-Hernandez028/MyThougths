"use client"

import { useState, useEffect } from "react"
import { ViewTransition } from "@/components/view-transition"
import { BookCard } from "@/components/book-card"
import { useAuth } from "@/hooks/useAuth"
import { AuthModal } from "@/components/auth/auth-modal"
import { bookService } from "@/lib/services/bookService"
import { useNotification } from "@/hooks/useNotification"
import { Book } from "@/lib/types"
import { usePushNotification } from "@/lib/provider/PushNotificationContextType"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { user, loading, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { success, error } = useNotification()
  const [notifiedBookIds, setNotifiedBookIds] = useState<Set<string>>(new Set());
  const { isSubscribed, subscribe, unsubscribe, isLoading: IsNotificationPushLoading, error: pushErrors } = usePushNotification()

  const [books, setBooks] = useState<Book[]>([])
  const [bookNotified, setBookNotified] = useState<number>(0)


  useEffect(() => {
    if (user) {
      setShowAuthModal(false)
    }
  }, [user])

  useEffect(() => {
    if (user && books?.length > 0) {
      loadNotifiedBooks();

    }
  }, [user, books])

  useEffect(() => {
    console.log("intentando desuscribir...", bookNotified, books?.length)
    if (books?.length > 0 && bookNotified === 0) {
      console.log("Desuscribiendo...", bookNotified, books?.length)
      unsubscribe();
    }

    if(!isSubscribed && bookNotified > 0)
    {
      subscribe();
    }
  }, [bookNotified])


  const loadNotifiedBooks = async () => {
    try {
      const res = await fetch("/api/books/notifications", { credentials: "include" });
      if (!res.ok) return;
      const data: { id: string }[] = await res.json();

      if (data && data?.length > 0) {
        const ids = new Set(data.map(book => book.id));

        if (ids) {
          if (!isSubscribed) {
            await subscribe();
          }
        }
        if (!IsNotificationPushLoading) {
          setNotifiedBookIds(ids)
          setBookNotified(ids.size)
        }
      }
    } catch (err) {
      console.error("Error loading notified books", err);
    }
  }

  const AddNumberToNotifiedBooks = (value: number): void => {

    console.log(bookNotified)
    setBookNotified((a) => a - value)
  }


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

              <h1 className="text-xl   text-stone-800  tracking-wide animate-fade-in-left">Hola {user?.firstName}</h1>
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    {
                      !user.isAdmin && (<>
                        <button
                          onClick={logout}
                          className="text-sm text-stone-600 hover:text-stone-800 transition-colors duration-200"
                        >
                          Cerrar sesión
                        </button>

                      </>
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
              <BookCard key={book.id} book={book} index={index} isNotified={notifiedBookIds.has(book.id)} decreaseNumber={AddNumberToNotifiedBooks} />
            ))}
          </div>

          {filteredBooks.length === 0 && !isLoaded && (
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

