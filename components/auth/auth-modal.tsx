"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: "login" | "register"
}

export function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4">
        {mode === "login" ? (
          <LoginForm onToggleMode={() => setMode("register")} />
        ) : (
          <RegisterForm onToggleMode={() => setMode("login")} />
        )}
      </div>
    </div>
  )
}
