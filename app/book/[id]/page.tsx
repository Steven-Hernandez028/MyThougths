"use client"

import { useState, useEffect, useRef } from "react"
import { ViewTransition } from "@/components/view-transition"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Home } from "lucide-react"
import { books } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { saveReadingProgress, getReadingProgress } from "@/lib/reading-progress"

export default function BookPage() {
  const params = useParams()
  const router = useRouter()
  const [currentChapter, setCurrentChapter] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const lastScrollTop = useRef(0)
  const scrollDirection = useRef<"up" | "down" | null>(null)

  const book = books.find((b) => b.id === params.id)

  // Load reading progress on mount
  useEffect(() => {
    if (book) {
      const progress = getReadingProgress(book.id)
      if (progress) {
        setCurrentChapter(progress.chapterIndex)
        // Restore scroll position after a short delay
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.scrollTop = progress.scrollPosition
          }
        }, 100)
      }
    }
  }, [book])

  // Save progress when chapter or scroll changes
  useEffect(() => {
    if (book && contentRef.current) {
      const saveProgress = () => {
        saveReadingProgress(book.id, currentChapter, contentRef.current?.scrollTop || 0)
      }

      const timeoutId = setTimeout(saveProgress, 1000) // Debounce saves
      return () => clearTimeout(timeoutId)
    }
  }, [book, currentChapter])

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling || !contentRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = contentRef.current

      // Determine scroll direction
      if (scrollTop > lastScrollTop.current) {
        scrollDirection.current = "down"
      } else if (scrollTop < lastScrollTop.current) {
        scrollDirection.current = "up"
      }
      lastScrollTop.current = scrollTop

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // More responsive scroll detection
      scrollTimeoutRef.current = setTimeout(() => {
        // Check for top scroll (previous chapter)
        if (scrollTop <= 10 && scrollDirection.current === "up" && currentChapter > 0) {
          setIsScrolling(true)
          setCurrentChapter((prev) => prev - 1)
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.scrollTop = contentRef.current.scrollHeight - contentRef.current.clientHeight - 100
            }
            setIsScrolling(false)
          }, 300)
        }
        // Check for bottom scroll (next chapter)
        else if (
          scrollTop >= scrollHeight - clientHeight - 10 &&
          scrollDirection.current === "down" &&
          book &&
          currentChapter < book.chapters.length - 1
        ) {
          setIsScrolling(true)
          setCurrentChapter((prev) => prev + 1)
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.scrollTop = 100
            }
            setIsScrolling(false)
          }, 300)
        }
      }, 100) // Reduced timeout for more responsiveness
    }

    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll, { passive: true })
      return () => {
        contentElement.removeEventListener("scroll", handleScroll)
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
      }
    }
  }, [currentChapter, isScrolling, book])

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500">Book not found</p>
      </div>
    )
  }

  const currentChapterData = book.chapters[currentChapter]

  return (
    <ViewTransition name={`book-${book.id}`}>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-stone-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-stone-600 hover:text-stone-800"
              >
                <Home className="w-4 h-4 mr-2" />
                Library
              </Button>

              <div className="text-center">
                <h1 className="text-lg font-medium text-stone-800">{book.title}</h1>
                <p className="text-sm text-stone-500">by {book.author}</p>
              </div>

              <div className="text-sm text-stone-500">
                Chapter {currentChapter + 1} of {book.chapters.length}
              </div>
            </div>
          </div>
        </header>

        {/* Chapter Navigation */}
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
              disabled={currentChapter === 0}
              className="bg-white/80 hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <h2 className="text-xl font-light text-stone-800 text-center">{currentChapterData.title}</h2>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentChapter(Math.min(book.chapters.length - 1, currentChapter + 1))}
              disabled={currentChapter === book.chapters.length - 1}
              className="bg-white/80 hover:bg-white"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="max-w-4xl mx-auto px-4 pb-16 max-h-[calc(100vh-200px)] overflow-y-auto scroll-smooth"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d6d3d1 transparent",
          }}
        >
          <div
            className={`transition-all duration-500 ${isScrolling ? "opacity-50 transform translate-y-2" : "opacity-100 transform translate-y-0"}`}
          >
            <div className="prose prose-stone max-w-none">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
                {currentChapterData.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-6 text-stone-700 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll hints */}
          {currentChapter > 0 && (
            <div className="text-center py-4 text-sm text-stone-400 animate-pulse">Scroll up for previous chapter</div>
          )}
          {currentChapter < book.chapters.length - 1 && (
            <div className="text-center py-4 text-sm text-stone-400 animate-pulse">Scroll down for next chapter</div>
          )}
        </div>

        {/* Progress bar */}
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-stone-200">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-300"
            style={{ width: `${((currentChapter + 1) / book.chapters.length) * 100}%` }}
          />
        </div>
      </div>
    </ViewTransition>
  )
}
