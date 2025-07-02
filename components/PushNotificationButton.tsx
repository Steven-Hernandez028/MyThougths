import { useEffect, useState } from 'react';

export function PushNotificationButton() {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          if (subscription) setSubscribed(true);
        });
      });
    }
  }, []);

  const subscribe = async () => {
    const registration = await navigator.serviceWorker.ready;

    const response = await fetch('/api/notifications');
    const { publicKey } = await response.json();

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    await fetch('/api/notifications', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setSubscribed(true);
  };

  return (
    <button onClick={subscribe} disabled={subscribed}>
      {subscribed ? 'Suscrito a notificaciones' : 'Activar notificaciones'}
    </button>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}
