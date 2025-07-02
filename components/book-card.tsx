"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Book } from "@/lib/types"
import { ViewTransition } from "@/components/view-transition"
import { getReadingProgress, isBookNew } from "@/lib/reading-progress"

interface BookCardProps {
  book: Book
  index: number
  isNotified: boolean

}

export function BookCard({ book, index, isNotified }: BookCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [readingProgress, setReadingProgress] = useState<number>(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isNotificationActive, setIsNotificationActive] = useState(isNotified) // Estado para la campanita
  const [isUpdatingNotification, setIsUpdatingNotification] = useState(false) // Loading state

  useEffect(() => {
    const progress = getReadingProgress(book.id)
    if (progress) {
      const progressPercentage = ((progress.chapterIndex + 1) / book.chapters.length) * 100
      setReadingProgress(progressPercentage)
    }
  }, [book.id, book.chapters.length])

  useEffect(() => {
    setIsUpdatingNotification(true)
    setIsNotificationActive(isNotified)
    setIsUpdatingNotification(false)
  }, [isNotified])




  const handleClick = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
    router.push(`/book/${book.id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  const handleBellClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isUpdatingNotification) return

    setIsUpdatingNotification(true)

    try {
      const response = await fetch('/api/books/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId: book.id }),
      })

      if (response.ok) {
        setIsNotificationActive((prev) => !prev)
        if (navigator.vibrate) navigator.vibrate(30)
      } else {
        console.error('Error al actualizar notificación:', response.statusText)
      }
    } catch (error) {
      console.error('Error en la llamada al endpoint:', error)
    } finally {
      setIsUpdatingNotification(false)
    }
  }
  const isNew = isBookNew(book.publishedDate?.toString())

  return (
    <ViewTransition name={`book-${book.id}`}>
      <div
        className={`
          group cursor-pointer transition-all duration-500 ease-out
          ${isHovered ? "transform -translate-y-2 scale-105" : ""}
          focus-within:ring-2 focus-within:ring-stone-500 focus-within:ring-offset-2 rounded-2xl
          inline-block
        `}
        style={{
          animationDelay: `${index * 100}ms`,
          animation: "fadeInUp 0.6s ease-out forwards",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Leer libro: ${book.title} por ${book.author}`}
      >
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
          {isNew && (
            <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-emerald-400 to-cyan-400 text-white text-xs font-medium px-3 py-1.5 rounded-full animate-pulse shadow-lg">
              NUEVO
            </div>
          )}

          <div
            className={`
              absolute top-3 ${isNew ? 'right-20' : 'right-3'} z-20 
              cursor-pointer transition-all duration-300 ease-out
              ${isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}
              ${isUpdatingNotification ? 'pointer-events-none' : ''}
            `}
            onClick={handleBellClick}
            role="button"
            aria-label={`${isNotificationActive ? 'Desactivar' : 'Activar'} notificaciones para ${book.title}`}
          >
            <div className={`
              bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transition-all duration-200
              ${isUpdatingNotification ? 'opacity-50' : 'hover:bg-white hover:scale-110'}
            `}>
              {isUpdatingNotification ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-500"></div>
              ) : isNotificationActive ? (
                <svg
                  className="w-5 h-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2C7.8 2 6 3.8 6 6c0 2.9-1.3 3.7-2.9 5.6-.3.4-.1 1.4.9 1.4h12c1 0 1.2-1 .9-1.4C15.3 9.7 14 8.9 14 6c0-2.2-1.8-4-4-4zm1 15h-2c0 1.1.9 2 2 2s2-.9 2-2z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-600 hover:text-yellow-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              )}
            </div>
          </div>

          <div className="relative overflow-hidden">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-500"></div>
              </div>
            )}

            {!imageError ? (
              <img
                src={book.coverImage || "/placeholder.svg"}
                alt={`Portada del libro ${book.title}`}
                className={`
                  w-auto h-auto max-w-full transition-all duration-700 ease-out
                  group-hover:scale-110 
                  ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                `}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true)
                  setImageLoaded(true)
                }}
                loading="lazy"
              />
            ) : (
              <div className="w-60 h-80 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs">Sin imagen</p>
                </div>
              </div>
            )}
          </div>

          <div className={`
            absolute inset-0 flex flex-col justify-end
            bg-gradient-to-t from-black/90 via-black/60 to-transparent
            transition-all duration-500 ease-out
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}
          `}>
            <div className="p-6 text-white transform transition-all duration-500 ease-out delay-100">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2 line-clamp-2 leading-tight">
                  {book.title}
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <p className="text-white/90 text-sm font-medium">
                    por {book.author}
                  </p>
                  <span className="text-white/80 text-xs uppercase tracking-wider bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    {book.genre}
                  </span>
                </div>

                <p className="text-white/85 text-sm line-clamp-3 leading-relaxed mb-4">
                  {book.description}
                </p>
              </div>

              {readingProgress > 0 && (
                <div className="mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/90 text-sm font-medium">Progreso de lectura</span>
                    <span className="text-white bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
                      {Math.round(readingProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${readingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div className="flex items-center text-white/80">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">
                    {book.chapters.length} Capítulo{book.chapters.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div onClick={handleClick} className="flex items-center text-white font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
                  <span className="mr-2 text-sm">
                    {readingProgress > 0 ? "Continuar" : "Leer ahora"}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ViewTransition>
  )
}