const express = require('express');
const webpush = require('web-push');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');


const app = express();

// Middleware pour analyser les données de la demande HTTP
app.use(bodyParser.json());

// Chemin vers les ressources statiques
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de web-push
const vapidKeys = {
  publicKey: 'BHl2BiJj0y3TYkqBGocmtMezA2bGxCkgmTF3_8zUW_-lshqSZXnh05rTCh6Z3Ahyz5qm6vznXnZneCilv_VN2mE',
  privateKey: 'CCC0pr04Qho-wywemWlsENgulleBOAYaR2MIl_WAbbc',
};

webpush.setVapidDetails(
  'mailto:votre@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);




var subscriptions = []

if(fs.existsSync("subscriptions.json")){
    subscriptions = JSON.parse(fs.readFileSync("subscriptions.json"))
}

function saveSubscription(subscription){
    subscriptions.push(subscription)
    fs.writeFileSync("subscriptions.json",JSON.stringify(subscriptions))
}

function getSubscriptionFromDatabase(){
    return subscriptions[subscriptions.length-1]
}

// Route pour l'abonnement aux notifications
app.post('/subscribe', (req, res) => {
  const subscription = req.body;

  // Enregistrement de l'abonnement dans votre base de données
  saveSubscription(subscription)

  res.status(201).json({});

  // Envoi d'une notification d'exemple à l'abonnement
  const payload = JSON.stringify({ title: 'Notification de test' });

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error('Erreur lors de l\'envoi de la notification:', error);
  });
});

app.get('/sub',(req,res)=>{
    res.send(JSON.stringify(subscriptions))
})

// Route pour déclencher l'envoi d'une notification
app.get('/send', (req, res) => {
    // Récupérez l'abonnement à partir de votre base de données ou d'une autre source

    subscriptions.forEach(subscription => {
        console.log(subscription)
        console.log("sending")
        const payload = JSON.stringify({ title: 'Notification déclenchée depuis le serveur' });
    
        webpush.sendNotification(subscription, payload).catch(error => {
            console.error('Erreur lors de l\'envoi de la notification:', error);
        });
    })
  
    res.status(200).json({});
  });


// Démarrage du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});


const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
  };

  // Création du serveur HTTPS
const server = https.createServer(options, app);

// Démarrage du serveur
server.listen(4443, () => {
  console.log('Serveur en cours d\'écoute sur le port 443 en utilisant SSL');
});