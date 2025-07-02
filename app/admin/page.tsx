"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useNotification } from "@/hooks/useNotification"
import { bookService, BookCreateData, BookUpdateData } from "@/lib/services/bookService"
import { Book } from "@/lib/entities/Book"

// Components
import AdminHeader from "@/components/admin/AdminHeader"
import BookForm from "@/components/admin/BookForm"
import BookGrid from "@/components/admin/BookGrid"
import LoginForm from "@/components/admin/LoginForm"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

export default function AdminPage() {
  const { user, loading: authLoading, logout } = useAuth()
  const { success, error } = useNotification()

  // State
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  const [showAuthModal, setShowAuthModal] = useState(true)
  const isAuthenticated = user?.isAdmin || false

  // Load books
  const loadBooks = async () => {
    try {
      setLoading(true)
      const fetchedBooks = await bookService.getBooks()
      setBooks(fetchedBooks)
    } catch (err) {
      error("Failed to load books", err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Effects
  useEffect(() => {
    if (isAuthenticated) {
      loadBooks()
    }
  }, [isAuthenticated])

  // Handlers
  const handleLogin = () => {
    // Redirect to main page to sign in
    window.location.href = "/"
  }

  const handleAddBook = () => {
    setShowAddForm(true)
    setEditingBook(null)
  }

  const handleEditBook = (book: Book) => {
    setEditingBook(book)
    setShowAddForm(false)
  }

  const handleFormSubmit = async (data: BookCreateData | BookUpdateData) => {
    try {
      setActionLoading(true)

      if (editingBook) {
        const updatedBook = await bookService.updateBook(editingBook.id, data as BookUpdateData)
        setBooks(prev => prev.map(book =>
          book.id === editingBook.id ? updatedBook : book
        ))
        success("Book updated successfully")
      } else {
        const newBook = await bookService.createBook(data as BookCreateData)
        setBooks(prev => [newBook, ...prev])
        success("Book created successfully")
      }

      handleCancelForm()
    } catch (err) {
      error(
        editingBook ? "Failed to update book" : "Failed to create book",
        err instanceof Error ? err.message : "Unknown error"
      )
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteBook = async (bookId: string) => {
    try {
      setActionLoading(true)
      await bookService.deleteBook(bookId)
      setBooks(prev => prev.filter(book => book.id !== bookId))
      success("Book deleted successfully")
    } catch (err) {
      error("Failed to delete book", err instanceof Error ? err.message : "Unknown error")
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancelForm = () => {
    setShowAddForm(false)
    setEditingBook(null)
  }

  // Loading state
  if (authLoading) {
    return <LoadingSpinner />
  }

  // Not authenticated
  if (!isAuthenticated) {
    handleLogin();
    //return <LoginForm onLogin={handleLogin} />
    return <></>// <AuthModal isOpen={showAuthModal} onClose={()=>setShowAuthModal(false)} IsClosingOutside={false} />
  }

  // Main admin interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      <AdminHeader onAddBook={handleAddBook} onLogout={logout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Book Form */}
        {(showAddForm || editingBook) && (
          <BookForm
            book={editingBook}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            isLoading={actionLoading}
          />
        )}

        {/* Books Grid */}
        <BookGrid
          books={books}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          isLoading={loading}
        />
      </main>
    </div>
  )
}