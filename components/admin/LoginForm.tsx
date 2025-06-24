// components/admin/LoginForm.tsx
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"

interface LoginFormProps {
  onLogin: () => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-stone-600" />
          </div>
          <CardTitle className="text-2xl font-light">Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Enter username" 
                required 
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter password" 
                required 
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            <p className="text-sm text-stone-500 text-center">
              Please sign in as an admin to access this panel
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}