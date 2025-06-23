"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Book } from "@/lib/types"
import { ViewTransition } from "@/components/view-transition"
import { getReadingProgress, isBookNew } from "@/lib/reading-progress"

interface BookCardProps {
  book: Book
  index: number
}

export function BookCard({ book, index }: BookCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [readingProgress, setReadingProgress] = useState<number>(0)

  useEffect(() => {
    const progress = getReadingProgress(book.id)
    if (progress) {
      const progressPercentage = ((progress.chapterIndex + 1) / book.chapters.length) * 100
      setReadingProgress(progressPercentage)
    }
  }, [book.id, book.chapters.length])

  const handleClick = () => {
    router.push(`/book/${book.id}`)
  }

  const isNew = isBookNew(book.publishedDate)

  return (
    <ViewTransition name={`book-${book.id}`}>
      <div
        className={`group cursor-pointer transition-all duration-500 ${isHovered ? "transform -translate-y-2 scale-105" : ""}`}
        style={{
          animationDelay: `${index * 100}ms`,
          animation: "fadeInUp 0.6s ease-out forwards",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
          {/* New Badge */}
          {isNew && (
            <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-emerald-400 to-cyan-400 text-white text-xs font-medium px-2 py-1 rounded-full animate-pulse">
              NEW
            </div>
          )}

          <div className="aspect-[3/4] overflow-hidden relative">
            <img
              src={book.coverImage || "/placeholder.svg"}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Reading Progress Overlay */}
            {readingProgress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                <div className="flex items-center justify-between mb-1">
                  <span>Progress</span>
                  <span>{Math.round(readingProgress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-orange-400 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-6">
            <h3 className="text-lg font-medium text-stone-800 mb-2 line-clamp-2 group-hover:text-stone-900 transition-colors">
              {book.title}
            </h3>
            <p className="text-stone-600 text-sm mb-3">by {book.author}</p>
            <p className="text-stone-500 text-xs uppercase tracking-wide mb-3">{book.genre}</p>
            <p className="text-stone-600 text-sm line-clamp-3 leading-relaxed">{book.description}</p>
          </div>

          <div className="px-6 pb-6">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent mb-4" />
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>{book.chapters.length} chapters</span>
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                {readingProgress > 0 ? "Continue reading →" : "Read now →"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ViewTransition>
  )
}
