import type { ReadingProgress } from "./types"

const STORAGE_KEY = "book-reading-progress"

export function saveReadingProgress(bookId: string, chapterIndex: number, scrollPosition: number) {
  if (typeof window === "undefined") return

  const progress: ReadingProgress = {
    bookId,
    chapterIndex,
    scrollPosition,
    lastRead: new Date().toISOString(),
  }

  const allProgress = getAllReadingProgress()
  const existingIndex = allProgress.findIndex((p) => p.bookId === bookId)

  if (existingIndex >= 0) {
    allProgress[existingIndex] = progress
  } else {
    allProgress.push(progress)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress))
}

export function getReadingProgress(bookId: string): ReadingProgress | null {
  if (typeof window === "undefined") return null

  const allProgress = getAllReadingProgress()
  return allProgress.find((p) => p.bookId === bookId) || null
}

export function getAllReadingProgress(): ReadingProgress[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function isBookNew(publishedDate?: string): boolean {
  if (!publishedDate) return false

  const published = new Date(publishedDate)
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)

  return published > twoDaysAgo
}
