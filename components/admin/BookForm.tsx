"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, X, Save } from "lucide-react"
import { BookDTO, BookStatus } from "./BookGrid"

interface BookFormData {
  title: string
  author: string
  genre: string
  description: string
  coverImage: string
  status: BookStatus
  chapters: Array<{
    title: string
    content: string
  }>
}

interface BookFormProps {
  book?: BookDTO | null
  onSubmit: (data: BookFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function BookForm({ book, onSubmit, onCancel, isLoading = false }: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>({
    title: book?.title || "",
    author: book?.author || "",
    genre: book?.genre || "",
    description: book?.description || "",
    coverImage: book?.coverImage || "",
    status: book?.status || BookStatus.DRAFT,
    chapters: book?.chapters?.map(ch => ({ title: ch.title, content: ch.content, order: ch.order })).sort((a,b) => a.order - b.order) || [{ title: "", content: "", order: 0 }],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const addChapter = () => {
    setFormData(prev => ({
      ...prev,
      chapters: [...prev.chapters, { title: "", content: "" }],
    }))
  }

  const removeChapter = (index: number) => {
    if (formData.chapters.length > 1) {
      setFormData(prev => ({
        ...prev,
        chapters: prev.chapters.filter((_, i) => i !== index),
      }))
    }
  }

  const updateChapter = (index: number, field: 'title' | 'content', value: string) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.map((chapter, i) =>
        i === index ? { ...chapter, [field]: value } : chapter
      ),
    }))
  }

  const updateField = (field: keyof BookFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{book ? "Edit Book" : "Add New Book"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => updateField('author', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) => updateField('genre', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => updateField('status', e.target.value as BookStatus)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400"
                disabled={isLoading}
              >
                <option value={BookStatus.DRAFT}>Draft</option>
                <option value={BookStatus.PUBLISHED}>Published</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) => updateField('coverImage', e.target.value)}
                placeholder="https://..."
                disabled={isLoading}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Chapters Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Chapters</Label>
              <Button
                type="button"
                onClick={addChapter}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Chapter
              </Button>
            </div>

            {formData.chapters.map((chapter, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="font-medium">Chapter {index + 1}</Label>
                  {formData.chapters.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeChapter(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {book ? "Update Book" : "Add Book"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}