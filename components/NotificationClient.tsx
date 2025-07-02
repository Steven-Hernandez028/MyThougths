"use client"
import { sendNotification, subscribeUser, unsubscribeUser } from "@/app/actions"
import { useEffect, useState } from "react"

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )
  const [message, setMessage] = useState('')

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/custom-sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready
      const data = await fetch("/api/notifications")
      const { publicKey } = await data.json();
      console.log(publicKey, registration)
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          publicKey
        ),
      })
      setSubscription(sub)
      const serializedSub = JSON.parse(JSON.stringify(sub))
      await subscribeUser(serializedSub)
    } catch (error) {
    }

  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message)
      setMessage('')
    }
  }



  return (
    <div>
      {subscription ? (
        <>
          <button className="text-sm text-stone-600 hover:text-stone-800 transition-colors duration-200" onClick={unsubscribeFromPush}>Desuscribirse</button>
          {/* <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          /> */}
          {/* <button onClick={sendTestNotification}>Send Test</button>
  */}
        </>
      ) : (
        <>
          <button className="text-sm text-stone-600 hover:text-stone-800 transition-colors duration-200" onClick={subscribeToPush}>Subscribirse</button>
        </>
      )}
    </div>
  )
}