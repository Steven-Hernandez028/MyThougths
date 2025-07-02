"use client"
import { sendNotification, subscribeUser, unsubscribeUser } from "@/app/actions"
import { useEffect, useState } from "react"

export default function PushNotificationManager() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      registerServiceWorker()
    }
TryToGetSubscriptionFromUser();
  }, [])

  const TryToGetSubscriptionFromUser = async () => {
    try {

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        setSubscription(sub);
      }


    } catch (error) {
      console.log(error)
    }

  }

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
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          publicKey
        ),
      })
      setSubscription(sub)
      const serializedSub = JSON.parse(JSON.stringify(sub))
      await SaveSuscriptionByUser(serializedSub)

    } catch (error) {
    }

  }

  async function SaveSuscriptionByUser(payload: string) {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ payload }),
      })
    } catch (e) {
      console.log(e)
    }
  }

  async function RemoveSuscriptionFromUser() {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ IsRemoved: 1 }),
      })
    } catch (e) {
      console.log(e)
    }
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await RemoveSuscriptionFromUser()
  }




  return (
    <div>
      {subscription ? (
        <>
          <button className="text-sm text-stone-600 hover:text-stone-800 transition-colors duration-200" onClick={unsubscribeFromPush}>Desuscribirse</button>

        </>
      ) : (
        <>
          <button className="text-sm text-stone-600 hover:text-stone-800 transition-colors duration-200" onClick={subscribeToPush}>Subscribirse</button>
        </>
      )}
    </div>
  )
}