// components/admin/BookGrid.tsx
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"

export enum BookStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

export interface BookDTO {
  id: string
  title: string
  author: string
  genre: string
  description: string
  coverImage: string | null
  status: BookStatus
  publishedDate: Date | null
  createdAt: Date
  updatedAt: Date
  chapters: ChapterDTO[] // Puedes definir esto aparte
  readingProgress: ReadingProgressDTO[] // Puedes definir esto aparte
}
export interface ChapterDTO {
  id: string
  title: string
  content: string
  order: number
  createdAt: Date
  updatedAt: Date
  bookId: string
}
export interface ReadingProgressDTO {
  id: string
  chapterIndex: number
  scrollPosition: number
  createdAt: Date
  updatedAt: Date
  userId: string
  bookId: string
}

interface BookGridProps {
  books: BookDTO[]
  onEdit: (book: BookDTO) => void
  onDelete: (bookId: string) => void
  isLoading?: boolean
}

export default function BookGrid({ books, onEdit, onDelete, isLoading = false }: BookGridProps) {
  const handleDelete = (book: BookDTO) => {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      onDelete(book.id)
    }
  }

  const getStatusColor = (status: BookStatus) => {
    return status === BookStatus.PUBLISHED ? "bg-green-400" : "bg-yellow-400"
  }

  const getStatusText = (status: BookStatus) => {
    return status === BookStatus.PUBLISHED ? "text-green-600" : "text-yellow-600"
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-20 bg-stone-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                  <div className="h-3 bg-stone-200 rounded w-1/2"></div>
                  <div className="h-3 bg-stone-200 rounded w-1/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-medium text-stone-800 mb-2">No books yet</h3>
          <p className="text-stone-600">Start by adding your first book to the library.</p>
        </div>
      </div>
    )
  }

  return (
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
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                  }}
                />
                <div
                  className={`absolute -top-2 -right-2 w-3 h-3 rounded-full ${getStatusColor(book.status)}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-stone-800 mb-1 truncate" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-sm text-stone-600 mb-2 truncate" title={book.author}>
                  by {book.author}
                </p>
                <p className="text-xs text-stone-500 mb-1 truncate" title={book.genre}>
                  {book.genre}
                </p>
                <p className="text-xs text-stone-500 mb-3">
                  Status:{" "}
                  <span className={`font-medium ${getStatusText(book.status)}`}>
                    {book.status === BookStatus.PUBLISHED ? "Published" : "Draft"}
                  </span>
                </p>
                <p className="text-xs text-stone-400 mb-3">
                  {book.chapters?.length || 0} chapters
                </p>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEdit(book)}
                    title="Edit book"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                    onClick={() => handleDelete(book)}
                    title="Delete book"
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
  )
}