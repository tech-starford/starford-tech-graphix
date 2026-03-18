// ===== STARFIELD ANIMATION =====
class StarfieldAnimation {
    constructor() {
        this.canvas = document.getElementById('starCanvas');
        this.ctx = null;
        this.stars = [];
        this.colors = ['#4361ee', '#4cc9f0', '#b5179e', '#f9c74f'];
        this.animationId = null;
        this.resizeTimeout = null;
        
        this.init();
    }

    init() {
        if (!this.canvas) {
            console.warn('Star canvas not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.createStars();
        this.startAnimation();
        this.setupResizeHandler();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStars() {
        this.stars = [];
        const starCount = Math.min(400, Math.floor((window.innerWidth * window.innerHeight) / 2500));

        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 3,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }
    }

    drawStar(x, y, points, outerRadius, innerRadius, color, opacity) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        this.ctx.globalAlpha = opacity;
        
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * i) / points;
            this.ctx.lineTo(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius
            );
        }
        
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.restore();
    }

    animate = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const time = Date.now() * 0.001;
        
        this.stars.forEach(star => {
            star.x += star.speedX;
            star.y += star.speedY;
            
            if (star.x < -50) star.x = this.canvas.width + 50;
            if (star.x > this.canvas.width + 50) star.x = -50;
            if (star.y < -50) star.y = this.canvas.height + 50;
            if (star.y > this.canvas.height + 50) star.y = -50;
            
            star.opacity = 0.3 + Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3;
            
            const points = Math.floor(Math.random() * 2) + 4;
            const outerRadius = star.size;
            const innerRadius = star.size * 0.4;
            
            this.drawStar(star.x, star.y, points, outerRadius, innerRadius, star.color, star.opacity);
        });
        
        this.animationId = requestAnimationFrame(this.animate);
    }

    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.animate();
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.setupCanvas();
                this.createStars();
            }, 250);
        });
    }
}

// ===== SEARCH DATA (for header search) =====
const searchData = [
    { title: "Movie Poster", category: "Posters", url: "./templates/posters/movie-poster.html", tags: ["movie", "film", "cinema"] },
    { title: "Event Poster", category: "Posters", url: "./templates/posters/event-poster.html", tags: ["event", "festival", "concert"] },
    { title: "Motivational Poster", category: "Posters", url: "./templates/posters/motivational-poster.html", tags: ["motivational", "inspirational", "quote"] },
    { title: "Advertising Poster", category: "Posters", url: "./templates/posters/advertising-poster.html", tags: ["advertising", "marketing", "promotion"] },
    { title: "Music Poster", category: "Posters", url: "./templates/posters/music-poster.html", tags: ["music", "concert", "band"] },
    { title: "Educational Poster", category: "Posters", url: "./templates/posters/educational-poster.html", tags: ["educational", "school", "learning"] },
    { title: "Travel Poster", category: "Posters", url: "./templates/posters/travel-poster.html", tags: ["travel", "vacation", "destination"] },
    { title: "Minimal Poster", category: "Posters", url: "./templates/posters/minimal-poster.html", tags: ["minimal", "clean", "simple"] }
];

// ===== POSTER DATA (12 complete items) =====
const posters = {
    1: {
        id: 1,
        title: "Movie Poster – Action",
        subtitle: "High‑energy design for blockbuster films",
        description: "A dramatic movie poster template with bold typography, dynamic composition, and space for cast/crew credits. Perfect for action or thriller films.",
        designDetails: "Dark gradient background, spotlight effect, large title area, credits block at bottom.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi, CMYK.",
        designInspiration: "Hollywood movie posters, film noir.",
        practicalApplications: "Film festivals, cinema releases, streaming thumbnails.",
        thumbnailUrl: "https://picsum.photos/id/1043/600/400",
        fullImageUrl: "https://picsum.photos/id/1043/1200/800",
        posterType: "Movie Poster",
        category: "movie",
        categories: ["movie", "event"],
        fileFormats: ["PSD", "PDF", "PNG", "JPG"],
        dimensions: "27×40 in | 3240×4800 px",
        orientation: "portrait",
        downloadCount: 3842,
        likes: 1423,
        printReady: "Yes",
        colors: ["#1E1E1E", "#C62828", "#F5F5F5", "#FFB74D", "#42A5F5"],
        colorNames: ["Black", "Red", "White", "Orange", "Blue"],
        tags: ["movie", "film", "action", "cinema"],
        features: ["Layered PSD", "Credit block", "Spotlight effect", "Print ready"],
        videoUrl: "https://www.youtube.com/watch?v=T6LMWAxnm-s&t=57s"  // first tutorial link
    },
    2: {
        id: 2,
        title: "Music Festival Poster",
        subtitle: "Colorful design for concerts and festivals",
        description: "Capture the energy of your music event with this vibrant festival poster. Includes line‑up grid, stages, and sponsor areas.",
        designDetails: "Bold colors, overlapping geometric shapes, artist line‑up, date/location prominence.",
        materialsSpecs: "Print‑ready PDF + AI/EPS, 300dpi.",
        designInspiration: "Music festivals, psychedelic art.",
        practicalApplications: "Concerts, festivals, club nights.",
        thumbnailUrl: "https://picsum.photos/id/1044/600/400",
        fullImageUrl: "https://picsum.photos/id/1044/1200/800",
        posterType: "Music Poster",
        category: "music",
        categories: ["music", "event"],
        fileFormats: ["AI", "EPS", "PSD", "PDF", "PNG"],
        dimensions: "18×24 in | 2160×2880 px",
        orientation: "portrait",
        downloadCount: 2975,
        likes: 1092,
        printReady: "Yes",
        colors: ["#F94144", "#F8961E", "#F9C74F", "#90BE6D", "#577590"],
        colorNames: ["Red", "Orange", "Yellow", "Green", "Blue"],
        tags: ["music", "festival", "concert", "event"],
        features: ["Line‑up grid", "Multiple stages", "Sponsor area", "Print ready"],
        videoUrl: "https://www.youtube.com/watch?v=FW2-byfMRbI&t=284s"  // second tutorial link
    },
    3: {
        id: 3,
        title: "Motivational Quote Poster",
        subtitle: "Inspirational design with powerful quotes",
        description: "A clean, typographic poster featuring a motivational quote. Perfect for offices, gyms, or home decor.",
        designDetails: "Serif/sans‑serif combination, subtle texture, focal quote, author attribution.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi.",
        designInspiration: "Minimalist typography, vintage posters.",
        practicalApplications: "Office walls, gyms, classrooms, home decor.",
        thumbnailUrl: "https://picsum.photos/id/1045/600/400",
        fullImageUrl: "https://picsum.photos/id/1045/1200/800",
        posterType: "Motivational Poster",
        category: "motivational",
        categories: ["motivational", "minimal"],
        fileFormats: ["PSD", "PDF", "PNG", "JPG"],
        dimensions: "18×24 in | 2160×2880 px",
        orientation: "portrait",
        downloadCount: 2563,
        likes: 894,
        printReady: "Yes",
        colors: ["#2C3E50", "#ECF0F1", "#E67E22", "#BDC3C7", "#FFFFFF"],
        colorNames: ["Dark Blue", "Clouds", "Orange", "Silver", "White"],
        tags: ["motivational", "inspirational", "quote", "typography"],
        features: ["Editable text", "Texture overlay", "Multiple layouts", "Print ready"],
        videoUrl: null
    },
    4: {
        id: 4,
        title: "Product Advertising Poster",
        subtitle: "Sleek design for product launches",
        description: "Showcase your product with this professional advertising poster. Large product area, key features, and call‑to‑action.",
        designDetails: "Minimal layout, product spotlight, feature icons, brand logo area.",
        materialsSpecs: "Print‑ready PDF + PSD, 300dpi, CMYK.",
        designInspiration: "Apple product ads, modern minimalism.",
        practicalApplications: "Product launches, trade shows, retail displays.",
        thumbnailUrl: "https://picsum.photos/id/1046/600/400",
        fullImageUrl: "https://picsum.photos/id/1046/1200/800",
        posterType: "Advertising Poster",
        category: "advertising",
        categories: ["advertising", "business"],
        fileFormats: ["PSD", "AI", "PDF", "PNG", "JPG"],
        dimensions: "18×24 in | 2160×2880 px",
        orientation: "portrait",
        downloadCount: 2104,
        likes: 745,
        printReady: "Yes",
        colors: ["#F5F5F5", "#212121", "#1976D2", "#FFC107", "#FFFFFF"],
        colorNames: ["Off White", "Black", "Blue", "Amber", "White"],
        tags: ["advertising", "product", "promotion", "business"],
        features: ["Product spotlight", "Feature icons", "CTA button", "Print ready"],
        videoUrl: null
    },
    5: {
        id: 5,
        title: "Travel Poster – Vintage",
        subtitle: "Retro travel poster for destinations",
        description: "Evoke wanderlust with this vintage‑style travel poster. Perfect for travel agencies, airlines, or decor.",
        designDetails: "Retro illustration style, muted colors, destination name, classic typography.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi.",
        designInspiration: "1930s travel posters, Art Deco.",
        practicalApplications: "Travel agencies, tourism boards, wall art.",
        thumbnailUrl: "https://picsum.photos/id/1047/600/400",
        fullImageUrl: "https://picsum.photos/id/1047/1200/800",
        posterType: "Travel Poster",
        category: "travel",
        categories: ["travel", "vintage"],
        fileFormats: ["PSD", "PDF", "PNG", "JPG"],
        dimensions: "18×24 in | 2160×2880 px",
        orientation: "portrait",
        downloadCount: 1876,
        likes: 634,
        printReady: "Yes",
        colors: ["#8B4513", "#CD853F", "#F4A460", "#DEB887", "#2E5E4E"],
        colorNames: ["Brown", "Peru", "Sandy Brown", "Tan", "Forest"],
        tags: ["travel", "vintage", "retro", "destination"],
        features: ["Illustration style", "Editable text", "Distressed texture", "Print ready"],
        videoUrl: null
    },
    6: {
        id: 6,
        title: "Educational Infographic Poster",
        subtitle: "Informative design for classrooms",
        description: "Make learning engaging with this educational poster template. Perfect for science, history, or language subjects.",
        designDetails: "Infographic elements, icons, timelines, clear sections.",
        materialsSpecs: "Print‑ready PDF + editable AI, 300dpi.",
        designInspiration: "Educational charts, textbook design.",
        practicalApplications: "Schools, museums, training centers.",
        thumbnailUrl: "https://picsum.photos/id/1048/600/400",
        fullImageUrl: "https://picsum.photos/id/1048/1200/800",
        posterType: "Educational Poster",
        category: "educational",
        categories: ["educational", "infographic"],
        fileFormats: ["AI", "EPS", "PDF", "PNG", "JPG"],
        dimensions: "24×36 in | 2880×4320 px",
        orientation: "portrait",
        downloadCount: 1532,
        likes: 521,
        printReady: "Yes",
        colors: ["#1E88E5", "#FFC107", "#43A047", "#E53935", "#8E24AA"],
        colorNames: ["Blue", "Amber", "Green", "Red", "Purple"],
        tags: ["educational", "infographic", "school", "learning"],
        features: ["Icons set", "Timeline", "Data charts", "Print ready"],
        videoUrl: null
    },
    7: {
        id: 7,
        title: "Minimal Typography Poster",
        subtitle: "Clean, modern design for any message",
        description: "A versatile minimalist poster that lets your message shine. Great for quotes, announcements, or art.",
        designDetails: "Large negative space, refined typography, subtle grid.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi.",
        designInspiration: "Swiss design, modern minimalism.",
        practicalApplications: "Art prints, corporate messaging, events.",
        thumbnailUrl: "https://picsum.photos/id/1049/600/400",
        fullImageUrl: "https://picsum.photos/id/1049/1200/800",
        posterType: "Minimal Poster",
        category: "minimal",
        categories: ["minimal", "typography"],
        fileFormats: ["PSD", "PDF", "PNG", "JPG"],
        dimensions: "18×24 in | 2160×2880 px",
        orientation: "portrait",
        downloadCount: 2451,
        likes: 878,
        printReady: "Yes",
        colors: ["#FFFFFF", "#000000", "#757575", "#F5F5F5", "#BDBDBD"],
        colorNames: ["White", "Black", "Gray", "Off White", "Light Gray"],
        tags: ["minimal", "typography", "clean", "modern"],
        features: ["Editable text", "Grid overlay", "Multiple fonts", "Print ready"],
        videoUrl: null
    },
    8: {
        id: 8,
        title: "Charity Event Poster",
        subtitle: "Heartfelt design for fundraising events",
        description: "Promote your charity gala, run, or auction with this warm and inviting poster. Space for mission statement, sponsors, and call to action.",
        designDetails: "Warm color palette, heart icon, photo area, donor recognition.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi.",
        designInspiration: "Non‑profit campaigns, community events.",
        practicalApplications: "Galas, walks/runs, donation drives.",
        thumbnailUrl: "https://picsum.photos/id/1050/600/400",
        fullImageUrl: "https://picsum.photos/id/1050/1200/800",
        posterType: "Event Poster",
        category: "event",
        categories: ["event", "advertising"],
        fileFormats: ["PSD", "PDF", "PNG", "JPG"],
        dimensions: "18×24 in | 2160×2880 px",
        orientation: "portrait",
        downloadCount: 1687,
        likes: 602,
        printReady: "Yes",
        colors: ["#E91E63", "#FFC107", "#2196F3", "#4CAF50", "#9C27B0"],
        colorNames: ["Pink", "Amber", "Blue", "Green", "Purple"],
        tags: ["charity", "event", "fundraiser", "nonprofit"],
        features: ["Photo ready", "Sponsor logos", "Mission statement", "Print ready"],
        videoUrl: null
    },
    9: {
        id: 9,
        title: "Science Fair Poster",
        subtitle: "Fun, engaging design for school events",
        description: "Attract students and parents to your science fair with this colorful, kid‑friendly poster. Includes space for event details and sponsors.",
        designDetails: "Bright colors, science icons, playful typography.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi.",
        designInspiration: "Children’s education, science museums.",
        practicalApplications: "School fairs, science competitions.",
        thumbnailUrl: "https://picsum.photos/id/1051/600/400",
        fullImageUrl: "https://picsum.photos/id/1051/1200/800",
        posterType: "Educational Poster",
        category: "educational",
        categories: ["educational", "event"],
        fileFormats: ["PSD", "PDF", "PNG", "JPG"],
        dimensions: "18×24 in | 2160×2880 px",
        orientation: "portrait",
        downloadCount: 1432,
        likes: 498,
        printReady: "Yes",
        colors: ["#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#92A8D1"],
        colorNames: ["Coral", "Purple", "Green", "Pink", "Blue"],
        tags: ["science", "fair", "school", "education"],
        features: ["Science icons", "Event details", "Sponsor area", "Print ready"],
        videoUrl: null
    },
    10: {
        id: 10,
        title: "Fashion Event Poster",
        subtitle: "Chic design for fashion shows and retail",
        description: "Make a statement with this elegant fashion poster. Perfect for runway shows, store openings, or lookbooks.",
        designDetails: "Sophisticated serif, elegant lines, model photo area, brand logo.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi, CMYK.",
        designInspiration: "High‑end fashion magazines, runway branding.",
        practicalApplications: "Fashion shows, boutique openings, lookbooks.",
        thumbnailUrl: "https://picsum.photos/id/1052/600/400",
        fullImageUrl: "https://picsum.photos/id/1052/1200/800",
        posterType: "Event Poster",
        category: "event",
        categories: ["event", "advertising"],
        fileFormats: ["PSD", "PDF", "PNG", "JPG"],
        dimensions: "18×24 in | 2160×2880 px",
        orientation: "portrait",
        downloadCount: 1923,
        likes: 687,
        printReady: "Yes",
        colors: ["#000000", "#FFFFFF", "#D4AF37", "#C0C0C0", "#800020"],
        colorNames: ["Black", "White", "Gold", "Silver", "Burgundy"],
        tags: ["fashion", "runway", "style", "elegant"],
        features: ["Photo ready", "Brand logo", "Date/venue", "Print ready"],
        videoUrl: null
    },
    11: {
        id: 11,
        title: "Political Campaign Poster",
        subtitle: "Impactful design for elections and causes",
        description: "Get your message across with this bold campaign poster. Large photo area, slogan, and call to action.",
        designDetails: "Patriotic colors, strong typography, photo of candidate, slogan prominence.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi.",
        designInspiration: "Political branding, grassroots campaigns.",
        practicalApplications: "Elections, advocacy, community organizing.",
        thumbnailUrl: "https://picsum.photos/id/1053/600/400",
        fullImageUrl: "https://picsum.photos/id/1053/1200/800",
        posterType: "Advertising Poster",
        category: "advertising",
        categories: ["advertising", "event"],
        fileFormats: ["PSD", "PDF", "PNG", "JPG"],
        dimensions: "18×24 in | 2160×2880 px",
        orientation: "portrait",
        downloadCount: 1345,
        likes: 467,
        printReady: "Yes",
        colors: ["#002868", "#BF0A30", "#FFFFFF", "#FFD700", "#000000"],
        colorNames: ["Navy", "Red", "White", "Gold", "Black"],
        tags: ["political", "campaign", "election", "cause"],
        features: ["Photo ready", "Slogan area", "Call to action", "Print ready"],
        videoUrl: null
    },
    12: {
        id: 12,
        title: "Art Exhibition Poster",
        subtitle: "Elegant design for gallery shows",
        description: "Promote your art exhibition with this refined poster. Space for artist name, dates, and gallery information.",
        designDetails: "Minimal layout, fine art serif, subtle textures, image placeholder.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi.",
        designInspiration: "Art gallery branding, museum exhibitions.",
        practicalApplications: "Gallery shows, art fairs, museum events.",
        thumbnailUrl: "https://picsum.photos/id/1054/600/400",
        fullImageUrl: "https://picsum.photos/id/1054/1200/800",
        posterType: "Event Poster",
        category: "event",
        categories: ["event", "minimal"],
        fileFormats: ["PSD", "PDF", "PNG", "JPG"],
        dimensions: "18×24 in | 2160×2880 px",
        orientation: "portrait",
        downloadCount: 1567,
        likes: 543,
        printReady: "Yes",
        colors: ["#F5F5F5", "#333333", "#B0BEC5", "#FFFFFF", "#000000"],
        colorNames: ["Off White", "Dark Gray", "Silver", "White", "Black"],
        tags: ["art", "exhibition", "gallery", "fine art"],
        features: ["Artwork placeholder", "Artist info", "Gallery details", "Print ready"],
        videoUrl: null
    }
};

// ===== GLOBAL VARIABLES =====
let likedPosters = JSON.parse(localStorage.getItem('likedPosters')) || [];

// ===== DOM ELEMENTS =====
const mobileNavToggle = document.querySelectorAll('.mobile-nav-toggle');
const mobileNav = document.getElementById('mobile-nav');
const overlay = document.getElementById('overlay');
const backToTop = document.getElementById('backToTop');
const searchInput = document.getElementById('searchInput');
const newsletterForm = document.getElementById('newsletterForm');
const currentYear = document.getElementById('currentYear');

// Auth Modal Elements
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const userBtn = document.getElementById('userBtn');
const userDropdown = document.getElementById('userDropdown');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

// YouTube Popup Elements
const youtubePopup = document.getElementById('youtubePopup');
const closeYoutubePopup = document.getElementById('closeYoutubePopup');
const subscribeBtn = document.getElementById('subscribeBtn');
const viewChannelBtn = document.getElementById('viewChannelBtn');

// Poster Modal Elements
const modal = document.getElementById('posterModal');
let currentPosterId = null;

// ===== HELPER: Slugify =====
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ===== RENDER PROJECTS GRID =====
function renderProjectsGrid(filterCategory = 'all', filterOrientation = 'all', sortBy = 'newest') {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    let filtered = Object.values(posters).filter(p => {
        if (filterCategory !== 'all' && !p.categories.includes(filterCategory)) return false;
        if (filterOrientation !== 'all' && p.orientation !== filterOrientation) return false;
        return true;
    });

    // Sorting
    if (sortBy === 'popular') filtered.sort((a,b) => b.likes - a.likes);
    else if (sortBy === 'downloads') filtered.sort((a,b) => b.downloadCount - a.downloadCount);
    else if (sortBy === 'az') filtered.sort((a,b) => a.title.localeCompare(b.title));
    else if (sortBy === 'za') filtered.sort((a,b) => b.title.localeCompare(a.title));
    else filtered.sort((a,b) => b.id - a.id); // newest

    grid.innerHTML = filtered.map(p => {
        const isLiked = likedPosters.includes(p.id);
        const likeCount = isLiked ? p.likes + 1 : p.likes;
        const badgeText = p.categories[0].charAt(0).toUpperCase() + p.categories[0].slice(1);

        return `
        <div class="project-card" data-id="${p.id}" data-category="${p.categories.join(' ')}" data-orientation="${p.orientation}">
            <div class="project-badge">${badgeText}</div>
            <div class="project-img">
                <img src="${p.thumbnailUrl}" alt="${p.title}" loading="lazy">
            </div>
            <div class="project-info">
                <h3>${p.title}</h3>
                <p>${p.subtitle}</p>
                <div class="project-meta">
                    <span class="project-price free">FREE</span>
                    <div class="project-stats">
                        <span class="project-likes">
                            <i class="fas fa-heart like-icon ${isLiked ? 'active' : ''}" data-id="${p.id}"></i>
                            <span class="like-count" data-id="${p.id}">${likeCount}</span>
                        </span>
                        <span class="project-downloads">
                            <i class="fas fa-download"></i>
                            <span class="download-count" data-id="${p.id}">${p.downloadCount}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');

    // Attach like event listeners
    document.querySelectorAll('.project-likes .like-icon').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            handleLike(id);
        });
    });

    // Attach card click to open modal
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('like-icon') && !e.target.closest('.project-likes')) {
                const id = parseInt(this.dataset.id);
                openModal(id);
            }
        });
    });
}

// ===== HANDLE LIKE =====
function handleLike(pId) {
    const poster = posters[pId];
    if (!poster) return;

    const wasLiked = likedPosters.includes(pId);
    if (wasLiked) {
        likedPosters = likedPosters.filter(id => id !== pId);
        poster.likes -= 1;
    } else {
        likedPosters.push(pId);
        poster.likes += 1;
    }
    localStorage.setItem('likedPosters', JSON.stringify(likedPosters));

    // Update UI
    const likeIcons = document.querySelectorAll(`.project-likes .like-icon[data-id="${pId}"]`);
    const likeCounts = document.querySelectorAll(`.like-count[data-id="${pId}"]`);

    likeIcons.forEach(icon => icon.classList.toggle('active', !wasLiked));
    likeCounts.forEach(el => el.textContent = poster.likes);
}

// ===== MODAL FUNCTIONS =====
function openModal(id) {
    const p = posters[id];
    if (!p) return;
    currentPosterId = id;

    document.getElementById('modalImage').src = p.thumbnailUrl;
    document.getElementById('modalTitle').textContent = p.title;
    document.getElementById('modalSubtitle').textContent = p.subtitle;
    document.getElementById('modalDescription').textContent = p.description;
    document.getElementById('designDetails').textContent = p.designDetails;
    document.getElementById('materialsSpecs').textContent = p.materialsSpecs;
    document.getElementById('designInspiration').textContent = p.designInspiration;
    document.getElementById('practicalApplications').textContent = p.practicalApplications;
    document.getElementById('posterType').textContent = p.posterType;
    document.getElementById('fileFormat').textContent = p.fileFormats.join(', ');
    document.getElementById('dimensions').textContent = p.dimensions;
    document.getElementById('downloadCount').textContent = p.downloadCount.toLocaleString();
    document.getElementById('orientation').textContent = p.orientation.charAt(0).toUpperCase() + p.orientation.slice(1);
    document.getElementById('printReady').textContent = p.printReady;
    document.getElementById('modalFullImage').src = p.fullImageUrl;
    document.getElementById('modalFullImage').className = `modal-full-image ${p.orientation}`;

    document.getElementById('modalPrice').innerHTML = '<span class="price-free">FREE</span>';

    const formatBadges = document.getElementById('formatBadges');
    formatBadges.innerHTML = p.fileFormats.map(f => `<span class="format-badge">${f}</span>`).join('');

    const colorPalette = document.getElementById('colorPalette');
    colorPalette.innerHTML = p.colors.map((c, i) => `
        <div class="color" style="background-color: ${c};" title="${p.colorNames[i]}"></div>
    `).join('');

    document.getElementById('tagsContainer').innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join('');

    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = p.features.map(f => `<li>${f}</li>`).join('');

    // Handle video tutorial section
    const videoSection = document.getElementById('videoTutorialSection');
    if (p.videoUrl) {
        videoSection.style.display = 'block';
        const videoId = extractYouTubeID(p.videoUrl);
        if (videoId) {
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
            document.getElementById('videoThumbnail').src = thumbnailUrl;
            document.getElementById('videoLink').href = p.videoUrl;
        } else {
            // fallback: just show the link as text
            document.getElementById('videoThumbnail').src = '';
            document.getElementById('videoLink').href = p.videoUrl;
            document.querySelector('.video-container p').innerHTML = `<a href="${p.videoUrl}" target="_blank">Watch tutorial on YouTube</a>`;
        }
    } else {
        videoSection.style.display = 'none';
    }

    generateRelatedDesigns(id, p.category);

    const modalLikeBtn = document.getElementById('modalLikeBtn');
    const modalLikeCount = document.getElementById('modalLikeCount');
    const isLiked = likedPosters.includes(id);
    modalLikeBtn.classList.toggle('active', isLiked);
    modalLikeCount.textContent = isLiked ? p.likes + 1 : p.likes;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentPosterId = null;
}

function extractYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function generateRelatedDesigns(currentId, category) {
    const container = document.getElementById('relatedDesigns');
    const related = Object.values(posters)
        .filter(p => p.id !== currentId && p.category === category)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    
    container.innerHTML = related.map(p => `
        <div class="related-item" data-id="${p.id}">
            <img src="${p.thumbnailUrl}" alt="${p.title}">
            <div class="related-overlay"><span>${p.title}</span></div>
        </div>
    `).join('');

    container.querySelectorAll('.related-item').forEach(item => {
        item.addEventListener('click', () => openModal(parseInt(item.dataset.id)));
    });
}

// ===== FILTER & SORT =====
function applyFilters() {
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const category = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
    const orientation = document.getElementById('orientationFilter').value;
    const sort = document.getElementById('sortFilter').value;
    renderProjectsGrid(category, orientation, sort);
}

// ===== DOWNLOAD TEMPLATE =====
function downloadTemplate(pId) {
    const p = posters[pId];
    if (!p) return;

    const slug = slugify(p.title);
    const fileName = `${slug}.zip`;
    const fileUrl = `../../assets/downloads/posters/${fileName}`;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    p.downloadCount += 1;
    localStorage.setItem(`download_${pId}`, Date.now());
    document.querySelectorAll(`.download-count[data-id="${pId}"]`).forEach(el => {
        el.textContent = p.downloadCount;
    });
    document.getElementById('downloadCount').textContent = p.downloadCount.toLocaleString();
}

// ===== SEARCH FUNCTIONALITY =====
function performSearch(searchTerm) {
    const searchTerms = [
        'poster', 'movie', 'event', 'motivational', 'advertising',
        'music', 'educational', 'travel', 'minimal', 'campaign'
    ];
    
    if (searchTerms.some(term => searchTerm.toLowerCase().includes(term))) {
        alert(`Searching for: "${searchTerm}"\n\nThis would show relevant templates in a real implementation.`);
        searchInput.value = '';
    } else {
        alert(`No templates found for "${searchTerm}". Try searching for: poster, movie, event, motivational, etc.`);
    }
}

// ===== YOUTUBE POPUP =====
function setupYouTubePopup() {
    if (!youtubePopup) return;
    
    setTimeout(() => {
        youtubePopup.classList.add('active');
        overlay.classList.add('active');
    }, 5000);

    if (closeYoutubePopup) {
        closeYoutubePopup.addEventListener('click', hideYoutubePopup);
    }

    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', () => {
            alert('Redirecting to YouTube to subscribe to our channel!');
            window.open('https://www.youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw', '_blank');
            hideYoutubePopup();
        });
    }

    if (viewChannelBtn) {
        viewChannelBtn.addEventListener('click', () => {
            window.open('https://www.youtube.com/@starford.tech7', '_blank');
            hideYoutubePopup();
        });
    }

    document.addEventListener('click', (e) => {
        if (youtubePopup.classList.contains('active') && 
            !youtubePopup.contains(e.target)) {
            hideYoutubePopup();
        }
    });
}

function hideYoutubePopup() {
    if (youtubePopup) {
        youtubePopup.classList.remove('active');
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// ===== AUTH MODAL FUNCTIONS =====
function openAuthModal(type = 'login') {
    authModal.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('no-scroll');
    switchAuthTab(type);
}

function closeAuthModalFunc() {
    authModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function switchAuthTab(tabId) {
    authTabs.forEach(t => t.classList.remove('active'));
    authForms.forEach(f => f.classList.remove('active'));
    document.querySelector(`.auth-tab[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`${tabId}Form`).classList.add('active');
}

// ===== INITIALIZE EVERYTHING ON DOM LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    // Starfield
    new StarfieldAnimation();
    
    // Set current year in footer
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            mirror: false,
            anchorPlacement: 'top-bottom',
        });
    }
    
    // Initial render of poster grid
    renderProjectsGrid();
    
    // ===== FILTER BUTTONS =====
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });

    // Filter selects
    ['categoryFilter', 'orientationFilter', 'sortFilter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', applyFilters);
    });

    // Load More (simulate)
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus"></i> Load More Posters';
                this.disabled = false;
                alert('More posters would be loaded dynamically in production.');
            }, 1000);
        });
    }

    // ===== MODAL CLOSE EVENTS =====
    document.getElementById('closeModal')?.addEventListener('click', closeModal);
    document.querySelector('.modal-overlay')?.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // Modal action buttons
    document.getElementById('modalLikeBtn')?.addEventListener('click', function() {
        if (!currentPosterId) return;
        handleLike(currentPosterId);
        const p = posters[currentPosterId];
        const isLiked = likedPosters.includes(currentPosterId);
        this.classList.toggle('active', isLiked);
        document.getElementById('modalLikeCount').textContent = isLiked ? p.likes + 1 : p.likes;
    });

    document.getElementById('modalDownloadBtn')?.addEventListener('click', function() {
        if (currentPosterId) downloadTemplate(currentPosterId);
    });

    document.getElementById('downloadTemplateBtn')?.addEventListener('click', function() {
        if (currentPosterId) downloadTemplate(currentPosterId);
    });

    document.getElementById('previewBtn')?.addEventListener('click', function() {
        if (currentPosterId) window.open(posters[currentPosterId].fullImageUrl, '_blank');
    });

    document.getElementById('customizeBtn')?.addEventListener('click', function() {
        alert('Online editor coming soon!');
    });

    // ===== MOBILE NAVIGATION TOGGLE =====
    if (mobileNavToggle.length > 0) {
        mobileNavToggle.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
                if (mobileNav) mobileNav.classList.toggle('active');
                if (overlay) overlay.classList.toggle('active');
                document.body.classList.toggle('no-scroll');
            });
        });
    }

    // Close mobile menu on overlay click
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (mobileNavToggle.length > 0) {
                mobileNavToggle.forEach(toggle => {
                    toggle.setAttribute('aria-expanded', 'false');
                });
            }
            if (mobileNav) mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }

    // Mobile dropdown toggle
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    if (mobileDropdownToggles.length > 0) {
        mobileDropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const dropdown = toggle.nextElementSibling;
                const icon = toggle.querySelector('i');
                
                dropdown.classList.toggle('active');
                if (dropdown.classList.contains('active')) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            });
        });
    }

    // ===== USER DROPDOWN =====
    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }

    // ===== AUTH MODAL =====
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal('login');
        });
    }
    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal('signup');
        });
    }
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', closeAuthModalFunc);
    }

    // Auth tabs
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchAuthTab(tabId);
        });
    });

    // Auth form submissions (simulate)
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Login successful (demo)');
        closeAuthModalFunc();
    });
    document.getElementById('signupForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Account created! (demo)');
        closeAuthModalFunc();
    });

    // ===== SEARCH =====
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    performSearch(searchTerm);
                }
            }
        });
        
        const searchIcon = document.querySelector('.search-box i');
        if (searchIcon) {
            searchIcon.addEventListener('click', () => {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    performSearch(searchTerm);
                }
            });
        }
    }

    // ===== NEWSLETTER =====
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            
            const submitBtn = newsletterForm.querySelector('button');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert(`Thank you for subscribing with ${email}! You'll receive monthly poster templates.`);
                newsletterForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }

    // ===== BACK TO TOP =====
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== DESKTOP DROPDOWNS =====
    const desktopDropdowns = document.querySelectorAll('.nav-links > li.dropdown');
    desktopDropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0)';
            }
        });
        
        dropdown.addEventListener('mouseleave', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(10px)';
            }
        });
    });

    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });

    // ===== YOUTUBE POPUP =====
    setupYouTubePopup();

    // ===== ADDITIONAL: MOBILE LOGIN/SIGNUP LINKS =====
    document.querySelector('.mobile-login-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal('login');
    });
    document.querySelector('.mobile-signup-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal('signup');
    });
});