"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface PushNotificationContextType {
  subscription: PushSubscription | null
  isSubscribed: boolean
  isLoading: boolean
  error: string | null
  subscribe: () => Promise<void>
  unsubscribe: () => Promise<void>
  checkSubscription: () => Promise<void>
}

interface PushNotificationProviderProps {
  children: ReactNode
}

const PushNotificationContext = createContext<PushNotificationContextType | undefined>(undefined)

export function PushNotificationProvider({ children }: PushNotificationProviderProps) {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initializePushNotifications()
  }, [])

  const initializePushNotifications = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        await registerServiceWorker()
        await checkSubscription()
      } else {
        setError('Las notificaciones push no están soportadas en este navegador')
      }
    } catch (err) {
      console.error('Error inicializando notificaciones push:', err)
      setError('Error al inicializar las notificaciones push')
    } finally {
      setIsLoading(false)
    }
  }

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/custom-sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      if(registration.active)
        console.log('Service Worker registrado exitosamente:',registration)
    } catch (err) {
      console.error('Error registrando Service Worker:', err)
      throw new Error('Error al registrar el Service Worker')
    }
  }

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
    } catch (err) {
      console.error('Error verificando suscripción:', err)
      setError('Error al verificar la suscripción')
    }
  }

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  const subscribe = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const registration = await navigator.serviceWorker.ready
      
      const response = await fetch("/api/notifications")
      if (!response.ok) {
        throw new Error('Error al obtener la clave pública del servidor')
      }
      
      const { publicKey } = await response.json()
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      await saveSuscriptionToDatabase(sub)
      
      setSubscription(sub)
    } catch (err) {
      console.error('Error al suscribirse:', err)
      setError('Error al crear la suscripción')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const saveSuscriptionToDatabase = async (subscription: PushSubscription) => {
    try {
      const serializedSub = JSON.parse(JSON.stringify(subscription))
      const response = await fetch("/api/notifications", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: serializedSub }),
      })

      if (!response.ok) {
        throw new Error('Error al guardar la suscripción en la base de datos')
      }
    } catch (err) {
      console.error('Error guardando suscripción en BD:', err)
      throw new Error('Error al guardar la suscripción en la base de datos')
    }
  }

  const removeSuscriptionFromDatabase = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ IsRemoved: 1 }),
      })

      if (!response.ok) {
        throw new Error('Error al remover la suscripción de la base de datos')
      }
    } catch (err) {
      console.error('Error removiendo suscripción de BD:', err)
      throw new Error('Error al remover la suscripción de la base de datos')
    }
  }

  const unsubscribe = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!subscription) {
        throw new Error('No hay suscripción activa para remover')
      }
      console.log(subscription)
      await removeSuscriptionFromDatabase()
      await subscription.unsubscribe()
      setSubscription(null)
    } catch (err) {
      console.error('Error al desuscribirse:', err)
      setError('Error al remover la suscripción')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const value: PushNotificationContextType = {
    subscription,
    isSubscribed: !!subscription,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    checkSubscription,
  }

  return (
    <PushNotificationContext.Provider value={value}>
      {children}
    </PushNotificationContext.Provider>
  )
}

// Custom Hook
export function usePushNotification() {
  const context = useContext(PushNotificationContext)
  
  if (context === undefined) {
    throw new Error('usePushNotification debe usarse dentro de un PushNotificationProvider')
  }
  
  return context
}

// Funciones adicionales del hook para facilitar el uso
export function usePushNotificationActions() {
  const { subscribe, unsubscribe, checkSubscription } = usePushNotification()
  
  return {
    subscribe,
    unsubscribe,
    checkSubscription,
  }
}

export function usePushNotificationState() {
  const { subscription, isSubscribed, isLoading, error } = usePushNotification()
  
  return {
    subscription,
    isSubscribed,
    isLoading,
    error,
  }
}