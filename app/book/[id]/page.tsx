"use client"

import { useState, useEffect, useRef } from "react"
import { ViewTransition } from "@/components/view-transition"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { saveReadingProgress, getReadingProgress } from "@/lib/reading-progress"
import { bookService } from "@/lib/services/bookService"
import { useNotification } from "@/hooks/useNotification"
import { Book } from "@/lib/entities/Book"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

export default function BookPage() {
  const params = useParams()
  const router = useRouter()
  const [currentChapter, setCurrentChapter] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [book, setBook] = useState<Book>()

  // Estados para gestos de swipe
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [swipeProgress, setSwipeProgress] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  const { error } = useNotification()

  // Configuración de swipe
  const MIN_SWIPE_DISTANCE = 30
  const SWIPE_THRESHOLD = 120

  const loadBooks = async () => {
    try {
      const fetchedBooks = await bookService.getBooks()
      if (!fetchedBooks || fetchedBooks.length === 0) {
        error("No books found", "Please add some books to your library.")
        return
      }
      const book = fetchedBooks.find((b) => b.id === params.id) as Book
      const orderedBooks = book.chapters.sort((a, b) => a.order - b.order)
      book.chapters = orderedBooks;
      console.log(book)

      setBook(book)
    } catch (err) {
      error("Failed to load books", err instanceof Error ? err.message : "Unknown error")
    }
  }

  useEffect(() => {
    loadBooks()
  }, [])

  // Load reading progress on mount
  useEffect(() => {
    if (book) {
      const progress = getReadingProgress(book.id)
      if (progress) {
        setCurrentChapter(progress.chapterIndex)
        // Restaurar posición de scroll
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.scrollTop = progress.scrollPosition || 0
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
      const timeoutId = setTimeout(saveProgress, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [book, currentChapter])

  // Funciones de navegación con gestión de scroll
  const goToNextChapter = () => {
    if (book && currentChapter < book.chapters.length - 1) {
      setIsTransitioning(true)
      setCurrentChapter(prev => prev + 1)
      // Scroll al inicio para siguiente capítulo
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0
        }
        setIsTransitioning(false)
      }, 300)
    }
  }

  const goToPreviousChapter = () => {
    if (currentChapter > 0) {
      setIsTransitioning(true)
      setCurrentChapter(prev => prev - 1)
      // Scroll al final para capítulo anterior
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0
        }
        setIsTransitioning(false)
      }, 300)
    }
  }

  // Manejo de gestos táctiles
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return

    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    }

    const deltaX = currentTouch.x - touchStart.x
    const deltaY = Math.abs(currentTouch.y - touchStart.y)

    // Solo procesar si es un movimiento horizontal predominante
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > MIN_SWIPE_DISTANCE) {
      const progress = Math.min(Math.abs(deltaX) / SWIPE_THRESHOLD, 1)
      setSwipeProgress(progress)

      if (deltaX > 0 && currentChapter > 0) {
        setSwipeDirection('right')
      } else if (deltaX < 0 && book && currentChapter < book.chapters.length - 1) {
        setSwipeDirection('left')
      } else {
        setSwipeDirection(null)
      }
    }

    setTouchEnd(currentTouch)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const deltaX = touchEnd.x - touchStart.x
    const deltaY = Math.abs(touchEnd.y - touchStart.y)

    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0 && currentChapter > 0) {
        goToPreviousChapter()
      } else if (deltaX < 0 && book && currentChapter < book.chapters.length - 1) {
        goToNextChapter()
      }
    }

    // Reset estados
    setTouchStart(null)
    setTouchEnd(null)
    setSwipeProgress(0)
    setSwipeDirection(null)
  }

  if (!book) {
    return (
             <LoadingSpinner />

    )
  }

  const currentChapterData = book.chapters[currentChapter]
  const nextChapterData = currentChapter < book.chapters.length - 1 ? book.chapters[currentChapter + 1] : null
  const prevChapterData = currentChapter > 0 ? book.chapters[currentChapter - 1] : null

  return (
    <ViewTransition name={`book-${book.id}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
        {/* Header compacto */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-stone-200">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-stone-600 hover:text-gray hover:bg-stone-300"
              >
                <Home className="w-4 h-4 mr-2" />
              </Button>

              <div className="text-center">
                <h1 className="text-base font-medium text-stone-800">{book.title}</h1>
                <p className="text-xs text-stone-600">Por {book.author}</p>
              </div>

              <div className="text-xs text-stone-600">
                {currentChapter + 1}/{book.chapters.length}
              </div>
            </div>
          </div>
        </header>

        {/* Desktop Navigation */}
        <div className="max-w-5xl mx-auto px-4 py-3 hidden md:block">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousChapter}
              disabled={currentChapter === 0}
              className="hover:bg-stone-700 bg-transparent text-stone-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>

            <h2 className="text-lg font-light text-stone-600 text-center px-4">{currentChapterData.title}</h2>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextChapter}
              disabled={currentChapter === book.chapters.length - 1}
              className=" hover:bg-stone-700  text-stone-400 hover:text-white"
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Mobile Chapter Title */}
        <div className="max-w-5xl mx-auto px-4 py-2 md:hidden">
          <h2 className="text-lg font-light text-stone-600 text-center">{currentChapterData.title}</h2>
        </div>

        {/* Content with Book Preview */}
        <div className="relative overflow-hidden">
          {/* Previous Chapter Preview */}
          {swipeDirection === 'right' && swipeProgress > 0 && prevChapterData && (
            <div
              className="absolute left-0 top-0 h-full z-10 bg-gradient-to-br from-slate-50 to-stone-100 backdrop-blur-sm border-r-2 border-stone-100 shadow-2xl transition-all duration-75"
              style={{
                width: `${Math.min(swipeProgress * 80, 70)}%`,
                transform: `translateX(-${100 - swipeProgress * 100}%)`
              }}
            >
              <div className="h-full overflow-hidden p-6 flex flex-col">
                <div className="flex items-center mb-4 text-stone-600">
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  <span className="font-medium">Capítulo {currentChapter}</span>
                </div>
                <h3 className="text-lg font-light text-stone-600 mb-4">{prevChapterData.title}</h3>
                <div className="flex-1 overflow-hidden">
                  <div className="prose prose-gray prose-sm max-w-none">
                    {prevChapterData.content.split("\n\n").slice(-3).map((paragraph, index) => (
                      <p key={index} className="mb-3 text-stone-600 leading-relaxed text-sm opacity-75">
                        {paragraph.length > 150 ? `...${paragraph.slice(-150)}` : paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="text-center mt-4">
                  <div className="inline-block text-stone-300 rounded-full text-sm font-medium">
                    {" <- Desliza para ir al capítulo anterior"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Next Chapter Preview */}
          {swipeDirection === 'left' && swipeProgress > 0 && nextChapterData && (
            <div
              className="absolute right-0 top-0 h-full z-10  bg-gradient-to-br from-slate-50 to-stone-100 backdrop-blur-sm  border-r-2 border-stone-100 shadow-2xl transition-all duration-75"
              style={{
                width: `${Math.min(swipeProgress * 80, 70)}%`,
                transform: `translateX(${100 - swipeProgress * 100}%)`
              }}
            >
              <div className="h-full overflow-hidden p-6 flex flex-col">
                <div className="flex items-center justify-end mb-4 text-stone-600">
                  <span className="font-medium">Capítulo {currentChapter + 2}</span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </div>
                <h3 className="text-lg font-light text-stone-600 mb-4 text-right">{nextChapterData.title}</h3>
                <div className="flex-1 overflow-hidden">
                  <div className="prose prose-gray prose-sm max-w-none">
                    {nextChapterData.content.split("\n\n").slice(0, 3).map((paragraph, index) => (
                      <p key={index} className="mb-3 text-stone-600 leading-relaxed text-sm opacity-75">
                        {paragraph.length > 150 ? `${paragraph.slice(0, 150)}...` : paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="text-center mt-4">
                  <div className="inline-block px-4 py-2 text-stone-300 rounded-full text-sm font-medium">

                    {"Desliza para ir al capítulo Siguiente ->"}

                  </div>
                </div>
              </div>
            </div>
          )}

   
          <div
            ref={contentRef}
            className="max-w-4xl mx-auto px-2 pb-20 max-h-[calc(100vh-140px)] md:max-h-[calc(100vh-180px)] overflow-y-auto scroll-smooth"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#b0b0b2 transparent",
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={`transition-all duration-300 ${isTransitioning
                  ? "opacity-40 transform scale-98"
                  : "opacity-100 transform scale-100"
                }`}
            >
              <div className="prose prose-gray prose-lg max-w-none">
                <div className=" backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200/50">
                  {currentChapterData.content.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-8 text-stone-800 leading-relaxed text-lg md:text-xl font-light">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Navigation Hints */}
            <div className="md:hidden mt-8 flex justify-between items-center text-sm text-stone-400 px-4">
              {currentChapter > 0 && (
                <div className="flex items-center  px-3 py-2 rounded-full">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  <span>Anterior</span>
                </div>
              )}

              {currentChapter < book.chapters.length - 1 && (
                <div className="flex items-center 0 px-3 py-2 rounded-full ml-auto">
                  <span>Siguiente</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Progress bar */}
        <div className="fixed bottom-0 left-0 right-0 h-2 bg-gray-700/50 backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500 shadow-sm"
            style={{ width: `${((currentChapter + 1) / book.chapters.length) * 100}%` }}
          />
        </div>
      </div>
    </ViewTransition>
  )
}