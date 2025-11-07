// Import Firebase modules (v10 Modular Syntax)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

// ---------------- Firebase Configuration ----------------
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

// Initialize Firebase App and Database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ---------------- Utility: Extract Blog ID ----------------
function getBlogIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// ---------------- Render Blog Content ----------------
function renderBlog(blogData) {
    console.log("[INFO] Blog data:", blogData);

    // Hide loader, show content
    document.getElementById('loading').style.display = 'none';
    document.getElementById('blog-container').style.display = 'block';

    // Title and banner
    document.getElementById('blog-title').textContent = blogData.title || 'Untitled Blog';
    document.getElementById('banner-title').textContent = blogData.title || 'Blog Post';
    document.getElementById('blog-meta').textContent = `Posted on ${new Date().toLocaleDateString()}`;

    // Main image
    if (blogData.mainImage) {
        document.getElementById('blog-main-image').src = blogData.mainImage;
    }

    // Author
    if (blogData.author) {
        document.getElementById('author-name').textContent = blogData.author.name || 'Author';
        document.getElementById('author-bio').textContent = blogData.author.bio || 'Author bio not available';
        if (blogData.author.image) {
            document.getElementById('author-image').src = blogData.author.image;
        }
    }

    // Blog sections
    const sectionsContainer = document.getElementById('sections-container');
    sectionsContainer.innerHTML = '';

    if (blogData.sections && Array.isArray(blogData.sections)) {
        blogData.sections.forEach((section, index) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'blog-content-section';

            // Heading
            if (section.heading) {
                const heading = document.createElement('h2');
                heading.className = 'section-heading';
                heading.textContent = section.heading;
                sectionDiv.appendChild(heading);
            }

            // Image
            if (section.image) {
                const img = document.createElement('img');
                img.className = 'section-image';
                img.src = section.image;
                img.alt = section.heading || `Section ${index + 1}`;
                sectionDiv.appendChild(img);
            }

            // Content
            if (section.content) {
                const content = document.createElement('div');
                content.className = 'section-content';
                content.textContent = section.content;
                sectionDiv.appendChild(content);
            }

            // Key-Value pairs
            if (section.keyValuePairs && typeof section.keyValuePairs === 'object') {
                const detailsDiv = document.createElement('div');
                detailsDiv.className = 'section-details';

                Object.entries(section.keyValuePairs).forEach(([key, value]) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'detail-item';
                    itemDiv.innerHTML = `
                        <span class="detail-label">${key}:</span>
                        <span class="detail-value">${value}</span>
                    `;
                    detailsDiv.appendChild(itemDiv);
                });

                sectionDiv.appendChild(detailsDiv);
            }

            sectionsContainer.appendChild(sectionDiv);
        });
    }
}

// ---------------- Error Display ----------------
function showError(message) {
    console.error("[ERROR]:", message);
    document.getElementById('loading').style.display = 'none';
    const errorDiv = document.getElementById('error');
    errorDiv.innerHTML = `<div class="error"><strong>Error:</strong> ${message}</div>`;
    errorDiv.style.display = 'block';
}

// ---------------- Load Blog Data ----------------
async function loadBlog() {
    const blogId = getBlogIdFromUrl();
    console.log("[INFO] Blog ID:", blogId);

    if (!blogId) {
        showError('No blog ID provided. Use ?id=your-blog-id in the URL.');
        return;
    }

    try {
        const blogRef = ref(database, `blogs/${blogId}`);
        const snapshot = await get(blogRef);

        if (snapshot.exists()) {
            const blogData = snapshot.val();
            renderBlog(blogData);
        } else {
            showError(`Blog with ID "${blogId}" not found.`);
        }
    } catch (error) {
        showError(`Failed to load blog: ${error.message}`);
    }
}

// ---------------- Run on Page Load ----------------
document.addEventListener('DOMContentLoaded', loadBlog);
