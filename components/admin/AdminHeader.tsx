// components/admin/AdminHeader.tsx
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Home, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminHeaderProps {
  onAddBook: () => void
  onLogout: () => void
}

export default function AdminHeader({ onAddBook, onLogout }: AdminHeaderProps) {
  const router = useRouter()
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex  flex-col sm:flex-row  items-center justify-between ">
          <h1 className="text-3xl font-light text-stone-800">Admin Panel</h1>
          <div className="flex gap-4">
            <Button
              onClick={onAddBook}
              className="bg-stone-800 hover:bg-stone-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </Button>
            <Button variant="outline" onClick={onLogout}>
              Sign Out
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-stone-600 hover:text-stone-800"
            >
              <Home className="w-4 h-4 mr-2" />
              Library
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}