// components/ui/LoadingSpinner.tsx
"use client"

import React from "react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 border-stone-800 ${sizeClasses[size]} ${className}`}></div>
    </div>
  )
}