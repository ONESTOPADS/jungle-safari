import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCubWp41GtwfaI3hc341PecYAKtPS69q98",
    authDomain: "jungle-hue.firebaseapp.com",
    databaseURL: "https://jungle-hue-default-rtdb.firebaseio.com",
    projectId: "jungle-hue",
    storageBucket: "jungle-hue.firebasestorage.app",
    messagingSenderId: "281070360249",
    appId: "1:281070360249:web:2b9ce67d7af5b7415e2d68",
    measurementId: "G-TBMB0R0ED6"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// References to HTML
const tourTitle = document.getElementById('reserveHeading');
const tourLocation = document.getElementById('locationText');
const dayBlocks = {
    day1: document.getElementById('day1Block'),
    day2: document.getElementById('day2Block'),
    day3: document.getElementById('day3Block'),
    day4: document.getElementById('day4Block')
};
const packageIncludesBlock = document.getElementById('packageIncludes');
const exclusionsBlock = document.getElementById('exclusions');

// Helper: populate itinerary and package
function showTour(tour) {
    tourTitle.textContent = tour.title || "Trip Itinerary";
    tourLocation.textContent = tour.location || "";

    ["day1", "day2", "day3", "day4"].forEach(day => {
        dayBlocks[day].innerHTML = "";
        if (tour[day] && tour[day].length) {
            tour[day].forEach(activity => {
                const li = document.createElement("li");
                li.textContent = activity;
                dayBlocks[day].appendChild(li);
            });
        }
    });

    packageIncludesBlock.innerHTML = "";
    if (tour.packageIncludes && tour.packageIncludes.length) {
        tour.packageIncludes.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            packageIncludesBlock.appendChild(li);
        });
    }

    exclusionsBlock.innerHTML = "";
    if (tour.exclusions && tour.exclusions.length) {
        tour.exclusions.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            exclusionsBlock.appendChild(li);
        });
    }
}

// ✅ Get tour ID from URL
const params = new URLSearchParams(window.location.search);
const tourId = params.get('id'); // e.g., "-ObNDOkYc2Y9TKZV66-m"

if (tourId) {
    // Fetch only this specific tour
    onValue(ref(db, `tours/${tourId}`), (snapshot) => {
        const tour = snapshot.val();
        if (tour) {
            showTour(tour);
        } else {
            alert("Tour not found!");
        }
    });
} else {
    alert("No tour ID provided in URL!");
}
