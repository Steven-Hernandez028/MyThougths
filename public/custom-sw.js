self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || '/icon.png',
      data: data.data, 
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener("notificationclick", function (event) {
  event.notification.close()

  const targetUrl = event.notification.data?.url || "/"

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Si ya hay una ventana abierta, redirige esa
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl)
          return client.focus()
        }
      }
      // Si no hay ventanas abiertas, abre una nueva
      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }
    })
  )
})
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Fuerza la activación inmediata
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim()); // Reclama el control de las pestañas actuales
});
