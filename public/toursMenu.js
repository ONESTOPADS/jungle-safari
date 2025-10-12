import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

// ✅ Firebase configuration
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

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ Fetch and display tours dynamically
document.addEventListener("DOMContentLoaded", () => {
    const blogMenu = document.getElementById("blog-menu");
    if (!blogMenu) return;

    const toursRef = ref(db, "tours/");

    onValue(toursRef, (snapshot) => {
        const data = snapshot.val();
        blogMenu.innerHTML = "";

        if (!data) {
            blogMenu.innerHTML = `<li><a href="#">No tours available</a></li>`;
            return;
        }

        Object.entries(data).forEach(([key, tour]) => {
            const title = tour.title || "Untitled Tour";
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.textContent = title;
            a.href = `tourblog.html?id=${key}`; // navigate to tour detail page
            li.appendChild(a);
            blogMenu.appendChild(li);
        });
    });
});

const toursContainer = document.getElementById('toursContainer');

onValue(ref(db, 'tours/'), snapshot => {
    const data = snapshot.val();
    if (!data) return;

    toursContainer.innerHTML = ""; // clear previous

    Object.entries(data).forEach(([id, tour]) => {
        const card = document.createElement('div');
        card.className = 'single-destination item'; // 'item' is required for Owl Carousel

        card.innerHTML = `
            <div class="thumb">
                <a href="tourblog.html?id=${id}">
                    <img class="img-fluid" src="${tour.imageLink || 'img/default.jpg'}" alt="${tour.title}">
                </a>
            </div>
            <div class="details text-center">
                <h4><a href="tourblog.html?id=${id}">${tour.title}</a></h4>
            </div>
        `;
        toursContainer.appendChild(card);
    });

    // Destroy existing OwlCarousel if already initialized (prevents re-init bug)
    if ($('.owl-carousel').hasClass('owl-loaded')) {
        $('.owl-carousel').trigger('destroy.owl.carousel');
        $('.owl-carousel').removeClass('owl-loaded');
        $('.owl-carousel').find('.owl-stage-outer').children().unwrap();
    }

    // Initialize Owl Carousel
    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
            0: { items: 1 },
            600: { items: 2 },
            1000: { items: 3 } // You can increase this to 4 or 5 if needed
        }
    });
});