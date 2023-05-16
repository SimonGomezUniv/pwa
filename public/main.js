function log(text){
    document.getElementById('log').innerHTML += text + "<br />"
}


// Vérification de la prise en charge des notifications par le navigateur
log("testing notif")
log('Notification' in window)
log('serviceWorker' in navigator)


const registerServiceWorker = async () => {
    const swRegistration = await navigator.serviceWorker.register('service-worker.js');
    return swRegistration;
}

const main = async () => {
    
    Notification.requestPermission().then(async function() {
        registration = await registerServiceWorker()
        log("service worker registered")
        try{

            registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey:"BHl2BiJj0y3TYkqBGocmtMezA2bGxCkgmTF3_8zUW_-lshqSZXnh05rTCh6Z3Ahyz5qm6vznXnZneCilv_VN2mE" }).then(subscription => {
                log("subscription")
                // Envoi de l'abonnement au serveur
                fetch('/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(subscription)
                }).then(res => {
                    log("sent")
                    document.getElementById("enable-notifications").remove();
                    localStorage.setItem("notifications-enabled", true);
                });
            });
        }catch(e){
            log(e)
        }
        });
}
if(localStorage.getItem("notifications-enabled") == "true"){
    log("notifications already enabled")
}else {
    document.body.innerHTML+='<button id="enable-notifications">Enable notifications</button>'
    document.getElementById("enable-notifications").addEventListener("click", () => {
        main();
    });
}
/*

if ('Notification' in window && 'serviceWorker' in navigator) {

    // Demande de permission pour les notifications
    log("request permission")
    Notification.requestPermission().then(permission => {
        log("permission " + permission)
        if (permission === 'granted') {
            // Enregistrement du service worker
            navigator.serviceWorker.register('service-worker.js').then(registration => {
            // Enregistrement de l'abonnement aux notifications
                registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey:"BHl2BiJj0y3TYkqBGocmtMezA2bGxCkgmTF3_8zUW_-lshqSZXnh05rTCh6Z3Ahyz5qm6vznXnZneCilv_VN2mE" }).then(subscription => {
                // Envoi de l'abonnement au serveur
                    fetch('/subscribe', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(subscription)
                    });
                });
            });
        }
    });
}

*/