import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", 
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com", 
  projectId: "YOUR_PROJECT_ID", 
  storageBucket: "YOUR_PROJECT_ID.appspot.com", 
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", 
  appId: "YOUR_APP_ID", 
  measurementId: "YOUR_MEASUREMENT_ID" 
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

document.getElementById("getInfos").addEventListener("click", function () {
    fetch('https://ipinfo.io/?token=YOUR_TOKEN') //// --> Replace YOUR_TOKEN by your API Key of Ipinfo.io \\\\
        .then(response => response.json())
        .then(data => {

            let orgWebSite = data.org && data.country ? `${data.org}.${data.country.toLowerCase()}` : "N/A";
            const currentTime = new Date();
            const nav = getFilteredBrowser(navigator.userAgent);
            const device = getDeviceInformation(navigator.platform);
            const vpn = data.privacy.vpn ? true : false;

            if (!data.org) {
                data.org = "N/A";
                orgWebSite = "N/A"
            }

            // SHOW USER INFORMATIONS
            document.getElementById("infos").innerHTML = `
                <h1><strong>Thank you! Your personal information has been successfully recorded in our database.</strong></h1>
                <p><strong>- Your IP Address: ${data.ip}</strong></p>
                <p><strong>- Your Country: ${data.country}</strong></p>
                <p><strong>- Your Region: ${data.region}</strong></p>
                <p><strong>- Your City: ${data.city}</strong></p>
                <p><strong>- Your Latitude and Longitude: ${data.loc}</strong></p>
                <p><strong>- Your Postal Code: ${data.postal}</strong></p>
                <p><strong>- Your Timezone: ${data.timezone}</strong></p>
                <p><strong>- Your Internet Service Provider: ${data.org}</strong></p>
                <p><strong>- Internet Service Provider Website: ${orgWebSite}</strong></p>
                <p><strong>- Your Web Browser: ${nav}</strong></p>
                <p><strong>- Device Brand: ${device}</strong></p>
                <p><strong>- VPN Usage: ${vpn}</strong></p>
            `;

            addDoc(collection(firestore, 'IPinformations'), {
                localisation: {
                    ip: data.ip,
                    country: data.country,
                    region: data.region,
                    city: data.city,
                    loc: data.loc,
                    postal: data.postal,
                    timezone: data.timezone,
                },
                Device: {
                    org: data.org,
                    orgWebSite: orgWebSite,
                    navigateur: nav,
                    device: device,
                },
                Autres: {
                    vpn: vpn,
                },
                stockageTime: currentTime.toISOString()
            })
            .then(docRef => {
                console.log("Data saved via ClientID:", docRef.id);
            })
            .catch(error => {
                console.error("Error saving data:", error);
            });
        })
        .catch(error => {
            console.error("An error occurred ...", error);
        });
});

function getFilteredBrowser(userAgent) {
    const browserRegex = /(Chrome|Edge|Safari|Firefox)/i;
    const matched = userAgent.match(browserRegex);
    return matched ? matched[0] : "N/A";
}

function getDeviceInformation(platform) {
    if (platform.match(/Win/i)) {
        return "Windows PC";
    } else if (platform.match(/Mac/i)) {
        return "Mac";
    } else if (platform.match(/iPhone|iPod/i)) {
        return "iPhone";
    } else if (platform.match(/iPad/i)) {
        return "iPad";
    } else if (platform.match(/Android/i)) {
        return "Android";
    } else {
        return "N/A";
    }
}
