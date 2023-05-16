self.addEventListener('push', event => {
    let notificationData = {};
  
    if (event.data) {
      notificationData = event.data.json();
    }
  
    const options = {
      body: notificationData.body || 'Nouvelle notification',
      icon: 'icon/icon.png',
      badge: 'icon/icon.png',
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      data: {
        url: notificationData.url || '/',
      },
    };
  
    event.waitUntil(
      self.registration.showNotification(notificationData.title, options)
    );
  });
  
  self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    const action = event.action;
  
    if (action === 'close') {
      notification.close();
    } else {
      event.waitUntil(
        clients.openWindow(notification.data.url)
      );
      notification.close();
    }
  });
  