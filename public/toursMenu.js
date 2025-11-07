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
}

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

// ✅ Fetch and display tours dynamically
document.addEventListener("DOMContentLoaded", () => {
  const blogMenu = document.getElementById("blog-menu")
  if (!blogMenu) return

  const toursRef = ref(db, "tours/")

  onValue(toursRef, (snapshot) => {
    const data = snapshot.val()
    blogMenu.innerHTML = ""

    if (!data) {
      blogMenu.innerHTML = `<li><a href="#">No tours available</a></li>`
      return
    }

    Object.entries(data).forEach(([key, tour]) => {
      const title = tour.title || "Untitled Tour"
      const li = document.createElement("li")
      const a = document.createElement("a")
      a.textContent = title
      a.href = `tourblog.html?id=${key}`
      li.appendChild(a)
      blogMenu.appendChild(li)
    })
  })
})

document.addEventListener("DOMContentLoaded", () => {
  const blogNavMenu = document.getElementById("blog-menu-2")
  if (!blogNavMenu) return

  const blogsRef = ref(db, "blogs/")

  onValue(blogsRef, (snapshot) => {
    const data = snapshot.val()
    blogNavMenu.innerHTML = ""

    if (!data) {
      blogNavMenu.innerHTML = `<li><a href="#">No blogs available</a></li>`
      return
    }

    Object.entries(data).forEach(([key, blog]) => {
      const title = blog.title || "Untitled Blog"
      const li = document.createElement("li")
      const a = document.createElement("a")
      a.textContent = title
      a.href = `blog.html?id=${key}`
      li.appendChild(a)
      blogNavMenu.appendChild(li)
    })
  })
})

const toursContainer = document.getElementById("toursContainer")

onValue(ref(db, "tours/"), (snapshot) => {
  const data = snapshot.val()
  if (!data) return

  toursContainer.innerHTML = ""

  Object.entries(data).forEach(([id, tour]) => {
    const card = document.createElement("div")
    card.className = "single-destination item"

    card.innerHTML = `
            <div class="thumb">
                <a href="tourblog.html?id=${id}">
                    <img class="img-fluid" src="${tour.imageLink || "img/default.jpg"}" alt="${tour.title}">
                </a>
            </div>
            <div class="details text-center">
                <h4><a href="tourblog.html?id=${id}">${tour.title}</a></h4>
            </div>
        `
    toursContainer.appendChild(card)
  })

  if ($(toursContainer).find(".owl-carousel").hasClass("owl-loaded")) {
    $(toursContainer).find(".owl-carousel").trigger("destroy.owl.carousel")
    $(toursContainer).find(".owl-carousel").removeClass("owl-loaded")
    $(toursContainer).find(".owl-carousel").find(".owl-stage-outer").children().unwrap()
  }

  $(toursContainer)
    .find(".owl-carousel")
    .owlCarousel({
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
        1000: { items: 3 },
      },
    })
})

const blogsContainer = document.getElementById("blogsContainer")

if (blogsContainer) {
  onValue(ref(db, "blogs/"), (snapshot) => {
    const data = snapshot.val()
    if (!data) return

    blogsContainer.innerHTML = ""

    Object.entries(data).forEach(([id, blog]) => {
      const card = document.createElement("div")
      card.className = "blog-card item"

      card.innerHTML = `
                <div class="blog-thumb">
                    <a href="blog.html?id=${id}">
                        <img class="img-fluid" src="${blog.authorImage || "img/default.jpg"}" alt="${blog.title}">
                    </a>
                </div>
                <div class="blog-details text-center">
                    <h4><a href="blog.html?id=${id}">${blog.title}</a></h4>
                    <p class="author">${blog.authorName || "Anonymous"}</p>
                </div>
            `
      blogsContainer.appendChild(card)
    })

    if ($(blogsContainer).find(".blog-carousel").hasClass("owl-loaded")) {
      $(blogsContainer).find(".blog-carousel").trigger("destroy.owl.carousel")
      $(blogsContainer).find(".blog-carousel").removeClass("owl-loaded")
      $(blogsContainer).find(".blog-carousel").find(".owl-stage-outer").children().unwrap()
    }

    $(blogsContainer)
      .find(".blog-carousel")
      .owlCarousel({
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
          1000: { items: 3 },
        },
      })
  })
}
