const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();
console.log('Clé publique :', vapidKeys.publicKey);
console.log('Clé privée :', vapidKeys.privateKey);
