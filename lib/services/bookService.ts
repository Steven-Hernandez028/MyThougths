// lib/services/bookService.ts
import { Book, BookStatus } from "@/lib/entities/Book"

export interface BookCreateData {
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

export interface BookUpdateData extends BookCreateData {}

class BookService {
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async getBooks(): Promise<Book[]> {
    return this.request<Book[]>('/api/books')
  }

  async getBook(id: string): Promise<Book> {
    return this.request<Book>(`/api/books/${id}`)
  }

  async createBook(data: BookCreateData): Promise<Book> {
    
    return this.request<Book>('/api/books', {
      method: 'POST',
      body: JSON.stringify(data),
      
    })
  }

  async updateBook(id: string, data: BookUpdateData): Promise<Book> {
    return this.request<Book>(`/api/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteBook(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/books/${id}`, {
      method: 'DELETE',
    })
  }
}

export const bookService = new BookService()