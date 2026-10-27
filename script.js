
const photos = [
  {
    title: "Into the Wild",
    category: "nature",
    image: "photo-1441974231531-c6227db76b6e"
  },
  {
    title: "Mountain Dreams",
    category: "nature",
    image: "photo-1464822759023-fed622ff2c3b"
  },
  {
    title: "Golden Horizons",
    category: "nature",
    image: "photo-1470770841072-f978cf4d019e"
  },
  {
    title: "Urban Geometry",
    category: "architecture",
    image: "photo-1487958449943-2429e8be8625"
  },
  {
    title: "City Lines",
    category: "architecture",
    image: "photo-1511818966892-d7d671e672a2"
  },
  {
    title: "Concrete Poetry",
    category: "architecture",
    image: "photo-1518005020951-eccb494ad742"
  },
  {
    title: "Quiet Moments",
    category: "people",
    image: "photo-1534528741775-53994a69daeb"
  },
  {
    title: "Natural Light",
    category: "people",
    image: "photo-1500648767791-00dcc994a43e"
  },
  {
    title: "The Wanderer",
    category: "people",
    image: "photo-1506794778202-cad84cf45f1d"
  },
  {
    title: "Forest Trails",
    category: "nature",
    image: "photo-1448375240586-882707db888b"
  },
  {
    title: "Modern Forms",
    category: "architecture",
    image: "photo-1486406146926-c627a92ad1ab"
  },
  {
    title: "Portrait Study",
    category: "people",
    image: "photo-1524504388940-b1c1722653e1"
  }
];

const grid = document.getElementById("galleryGrid");
const count = document.getElementById("imageCount");
const filters = document.querySelectorAll(".filter");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxPosition = document.getElementById("lightboxPosition");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let visiblePhotos = [...photos];
let currentIndex = 0;
let lastFocusedElement = null;

function getImageUrl(photo, width = 800) {
  return `https://images.unsplash.com/${photo.image}?auto=format&fit=crop&w=${width}&q=85`;
}

function renderGallery(category = "all") {
  visiblePhotos = category === "all"
    ? [...photos]
    : photos.filter(photo => photo.category === category);

  count.textContent =
    `${visiblePhotos.length} photograph${visiblePhotos.length === 1 ? "" : "s"}`;

  grid.innerHTML = visiblePhotos.map((photo, index) => `
    <article class="photo-card" tabindex="0"
      role="button" aria-label="View ${photo.title}" data-index="${index}">
      <div class="photo-image">
        <img
          src="${getImageUrl(photo, 650)}"
          alt="${photo.title}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/650x500/191a17/d9ed8a?text=FRAME+Gallery'">
        <div class="photo-overlay">
          <span class="view-label">View photograph ↗</span>
        </div>
      </div>
      <div class="photo-info">
        <div>
          <h3>${photo.title}</h3>
          <p>${photo.category}</p>
        </div>
        <span class="photo-number">${String(index + 1).padStart(2, "0")}</span>
      </div>
    </article>
  `).join("");
}

function openLightbox(index) {
  if (!visiblePhotos.length) return;

  currentIndex = index;
  lastFocusedElement = document.activeElement;
  updateLightbox();

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeBtn.focus();
}

function updateLightbox() {
  const photo = visiblePhotos[currentIndex];

  lightboxImage.src = getImageUrl(photo, 1600);
  lightboxImage.alt = photo.title;
  lightboxTitle.textContent = photo.title;
  lightboxPosition.textContent =
    `${currentIndex + 1} / ${visiblePhotos.length}`;
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (lastFocusedElement) lastFocusedElement.focus();
}

function showNext() {
  currentIndex = (currentIndex + 1) % visiblePhotos.length;
  updateLightbox();
}

function showPrevious() {
  currentIndex =
    (currentIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
  updateLightbox();
}

filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(filter => filter.classList.remove("active"));
    button.classList.add("active");
    renderGallery(button.dataset.category);
  });
});

grid.addEventListener("click", event => {
  const card = event.target.closest(".photo-card");
  if (card) openLightbox(Number(card.dataset.index));
});

grid.addEventListener("keydown", event => {
  const card = event.target.closest(".photo-card");

  if (card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openLightbox(Number(card.dataset.index));
  }
});

closeBtn.addEventListener("click", closeLightbox);
prevBtn.addEventListener("click", showPrevious);
nextBtn.addEventListener("click", showNext);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") showNext();
  if (event.key === "ArrowLeft") showPrevious();
});

renderGallery();
