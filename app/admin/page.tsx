"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Lock, Plus, Edit, Trash2, X, Save } from "lucide-react"
import { books } from "@/lib/data"
import type { Book, Chapter } from "@/lib/types"
import { useAuth } from "@/hooks/useAuth"

export default function AdminPage() {
  const { user, loading, logout } = useAuth()
  const isAuthenticated = user?.isAdmin || false
  const [showAddBook, setShowAddBook] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    coverImage: "",
    status: "draft" as "draft" | "published",
    chapters: [{ id: "1", title: "", content: "" }] as Chapter[],
  })

  const handleLogin = () => {
    // Redirect to main page to sign in
    window.location.href = "/"
  }

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault()
    const bookData = {
      ...newBook,
      id: Date.now().toString(),
      createdDate: new Date().toISOString(),
      publishedDate: newBook.status === "published" ? new Date().toISOString() : undefined,
    }
    console.log("Adding book:", bookData)
    setShowAddBook(false)
    resetNewBook()
  }

  const handleEditBook = (book: Book) => {
    setEditingBook(book)
    setNewBook({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      coverImage: book.coverImage,
      status: book.status,
      chapters: [...book.chapters],
    })
  }

  const handleUpdateBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBook) return

    const updatedBook = {
      ...editingBook,
      ...newBook,
      publishedDate:
        newBook.status === "published" && editingBook.status === "draft"
          ? new Date().toISOString()
          : editingBook.publishedDate,
    }
    console.log("Updating book:", updatedBook)
    setEditingBook(null)
    resetNewBook()
  }

  const handleDeleteBook = (bookId: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      console.log("Deleting book:", bookId)
    }
  }

  const resetNewBook = () => {
    setNewBook({
      title: "",
      author: "",
      genre: "",
      description: "",
      coverImage: "",
      status: "draft",
      chapters: [{ id: "1", title: "", content: "" }],
    })
  }

  const addChapter = () => {
    const newChapter: Chapter = {
      id: (newBook.chapters.length + 1).toString(),
      title: "",
      content: "",
    }
    setNewBook((prev) => ({
      ...prev,
      chapters: [...prev.chapters, newChapter],
    }))
  }

  const removeChapter = (index: number) => {
    if (newBook.chapters.length > 1) {
      setNewBook((prev) => ({
        ...prev,
        chapters: prev.chapters.filter((_, i) => i !== index),
      }))
    }
  }

  const updateChapter = (index: number, field: keyof Chapter, value: string) => {
    setNewBook((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter, i) => (i === index ? { ...chapter, [field]: value } : chapter)),
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-stone-600" />
            </div>
            <CardTitle className="text-2xl font-light">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="Enter username" required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter password" required />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <p className="text-sm text-stone-500 text-center">Please sign in as an admin to access this panel</p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-light text-stone-800">Admin Panel</h1>
            <div className="flex gap-4">
              <Button onClick={() => setShowAddBook(true)} className="bg-stone-800 hover:bg-stone-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Book
              </Button>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {(showAddBook || editingBook) && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingBook ? "Edit Book" : "Add New Book"}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddBook(false)
                    setEditingBook(null)
                    resetNewBook()
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingBook ? handleUpdateBook : handleAddBook} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newBook.title}
                      onChange={(e) => setNewBook((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={newBook.author}
                      onChange={(e) => setNewBook((prev) => ({ ...prev, author: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                      id="genre"
                      value={newBook.genre}
                      onChange={(e) => setNewBook((prev) => ({ ...prev, genre: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={newBook.status}
                      onChange={(e) =>
                        setNewBook((prev) => ({ ...prev, status: e.target.value as "draft" | "published" }))
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="coverImage">Cover Image URL</Label>
                    <Input
                      id="coverImage"
                      value={newBook.coverImage}
                      onChange={(e) => setNewBook((prev) => ({ ...prev, coverImage: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newBook.description}
                      onChange={(e) => setNewBook((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Chapters Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">Chapters</Label>
                    <Button type="button" onClick={addChapter} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Chapter
                    </Button>
                  </div>

                  {newBook.chapters.map((chapter, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="font-medium">Chapter {index + 1}</Label>
                        {newBook.chapters.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeChapter(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`chapter-title-${index}`}>Chapter Title</Label>
                          <Input
                            id={`chapter-title-${index}`}
                            value={chapter.title}
                            onChange={(e) => updateChapter(index, "title", e.target.value)}
                            placeholder="Enter chapter title"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`chapter-content-${index}`}>Chapter Content</Label>
                          <Textarea
                            id={`chapter-content-${index}`}
                            value={chapter.content}
                            onChange={(e) => updateChapter(index, "content", e.target.value)}
                            placeholder="Enter chapter content"
                            rows={6}
                            required
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    {editingBook ? "Update Book" : "Add Book"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddBook(false)
                      setEditingBook(null)
                      resetNewBook()
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="group hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={book.coverImage || "/placeholder.svg"}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div
                      className={`absolute -top-2 -right-2 w-3 h-3 rounded-full ${book.status === "published" ? "bg-green-400" : "bg-yellow-400"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-stone-800 mb-1">{book.title}</h3>
                    <p className="text-sm text-stone-600 mb-2">by {book.author}</p>
                    <p className="text-xs text-stone-500 mb-1">{book.genre}</p>
                    <p className="text-xs text-stone-500 mb-3">
                      Status:{" "}
                      <span
                        className={`font-medium ${book.status === "published" ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                      </span>
                    </p>
                    <p className="text-xs text-stone-400 mb-3">{book.chapters.length} chapters</p>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="outline" onClick={() => handleEditBook(book)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
