'use server'

import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:notifications@propiedadesdelcariberd.com', 
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)


interface NotificationPayload {
  subscription: webpush.PushSubscription
  payload: {
    title: string
    body: string
    icon: string
    data?: {
      url: string
    }
  }
}

export async function sendBulkNotifications(notifications: NotificationPayload[]) {
  const results = []

  for (const { subscription, payload } of notifications) {
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify(payload)
      )
      results.push({ success: true })
    } catch (error) {
      console.error('Error sending push notification:', error)
      results.push({ success: false, error: error?.toString() })
    }
  }

  return results
}
