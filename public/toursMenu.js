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
  measurementId: "G-TBMB0R0ED6",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ Fetch and display tours dynamically (menu)
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
      a.href = `tourblog.html?id=${key}`;
      li.appendChild(a);
      blogMenu.appendChild(li);
    });
  });
});

// ✅ Fetch and display blogs dynamically (menu)
document.addEventListener("DOMContentLoaded", () => {
  const blogNavMenu = document.getElementById("blog-menu-2");
  if (!blogNavMenu) return;

  const blogsRef = ref(db, "blogs/");

  onValue(blogsRef, (snapshot) => {
    const data = snapshot.val();
    blogNavMenu.innerHTML = "";

    if (!data) {
      blogNavMenu.innerHTML = `<li><a href="#">No blogs available</a></li>`;
      return;
    }

    Object.entries(data).forEach(([key, blog]) => {
      const title = blog.title || "Untitled Blog";
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = title;
      a.href = `blog.html?id=${key}`;
      li.appendChild(a);
      blogNavMenu.appendChild(li);
    });
  });
});

// ✅ Tours Section – Display horizontally with sliding
// ✅ Tours Section – Display horizontally with sliding
const toursContainer = document.getElementById("toursContainer");

onValue(ref(db, "tours/"), (snapshot) => {
  const data = snapshot.val();
  if (!data || !toursContainer) return;

  // ✅ Clear and recreate carousel wrapper
  toursContainer.innerHTML = `<div class="owl-carousel tours-carousel"></div>`;
  const carousel = toursContainer.querySelector(".tours-carousel");

  Object.entries(data).forEach(([id, tour]) => {
    const card = document.createElement("div");
    card.className = "single-destination item";

    card.innerHTML = `
      <div class="thumb">
        <a href="tourblog.html?id=${id}">
          <img class="img-fluid" src="${tour.imageLink || "img/default.jpg"}" alt="${tour.title}">
        </a>
      </div>
      <div class="details text-center">
        <h4><a href="tourblog.html?id=${id}">${tour.title}</a></h4>
      </div>
    `;
    carousel.appendChild(card);
  });

  // ✅ Destroy existing Owl Carousel cleanly before initializing new
  const $carousel = $(carousel);
  if ($carousel.hasClass("owl-loaded")) {
    $carousel.trigger("destroy.owl.carousel");
    $carousel.removeClass("owl-loaded");
    $carousel.find(".owl-stage-outer").children().unwrap();
  }

  // ✅ Initialize Owl Carousel (horizontal single-row slide)
  $carousel.owlCarousel({
    loop: true,
    margin: 30,
    // nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 },
    },
  });
});

// ✅ Blogs Section
const blogsContainer = document.getElementById("blogsContainer");

if (blogsContainer) {
  onValue(ref(db, "blogs/"), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // Create proper carousel wrapper
    blogsContainer.innerHTML = `<div class="owl-carousel blog-carousel"></div>`;
    const carousel = blogsContainer.querySelector(".blog-carousel");

    // Build cards
    Object.entries(data).forEach(([id, blog]) => {
      const fullText = blog.authorSummary || "No description available.";
      const words = fullText.split(" ");
      const shortText =
        words.length > 20 ? words.slice(0, 20).join(" ") + "..." : fullText;

      const card = document.createElement("div");
      card.className = "single-destination item";

      card.innerHTML = `
        <div class="thumb">
          <a href="blog.html?id=${id}">
            <img class="img-fluid" src="${blog.mainImage || "img/default.jpg"}" alt="${blog.title}">
          </a>
        </div>
        <div class="details">
          <div class="tags">
            <ul>
              <li><a href="#">${blog.category1 || "General"}</a></li>
              ${blog.category2 ? `<li><a href="#">${blog.category2}</a></li>` : ""}
            </ul>
          </div>
          <a href="blog.html?id=${id}">
            <h4 class="title">${blog.title || "Untitled Blog"}</h4>
          </a>
          <p class="blog-summary" data-full="${fullText}">
            ${shortText}
            ${
              words.length > 20
                ? `<span class="show-more" style="color:#007bff; cursor:pointer;">Show more</span>`
                : ""
            }
          </p>
        </div>
      `;

      carousel.appendChild(card);
    });

    // Show more / less
    blogsContainer.querySelectorAll(".show-more").forEach((btn) => {
      btn.addEventListener("click", function toggle(e) {
        const p = e.target.closest(".blog-summary");
        const fullText = p.getAttribute("data-full");
        const words = fullText.split(" ");

        if (p.textContent.includes("...")) {
          p.innerHTML = `${fullText} <span class="show-more" style="color:#007bff; cursor:pointer;">Show less</span>`;
        } else {
          const shortText =
            words.length > 20 ? words.slice(0, 20).join(" ") + "..." : fullText;
          p.innerHTML = `${shortText} <span class="show-more" style="color:#007bff; cursor:pointer;">Show more</span>`;
        }
        p.querySelector(".show-more").addEventListener("click", toggle);
      });
    });

    // Destroy old instance safely
    if ($(carousel).hasClass("owl-loaded")) {
      $(carousel).trigger("destroy.owl.carousel");
      $(carousel).removeClass("owl-loaded");
      $(carousel).find(".owl-stage-outer").children().unwrap();
    }

    // Initialize sliding carousel
    $(carousel).owlCarousel({
      loop: true,
      margin: 30,
      // nav: true,
      dots: true,
      autoplay: true,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 }
      }
    });
  });
}

