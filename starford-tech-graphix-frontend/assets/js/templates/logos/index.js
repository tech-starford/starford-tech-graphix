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
    { title: "Business Logo", category: "Logos", url: "./templates/logos/business-logo.html", tags: ["business", "corporate", "professional"] },
    { title: "Creative Logo", category: "Logos", url: "./templates/logos/creative-logo.html", tags: ["creative", "artistic", "colorful"] },
    { title: "Minimal Logo", category: "Logos", url: "./templates/logos/minimal-logo.html", tags: ["minimal", "simple", "modern"] },
    { title: "Abstract Logo", category: "Logos", url: "./templates/logos/abstract-logo.html", tags: ["abstract", "geometric", "unique"] },
    { title: "Typography Logo", category: "Logos", url: "./templates/logos/typography-logo.html", tags: ["typography", "wordmark", "font"] },
    { title: "Emblem Logo", category: "Logos", url: "./templates/logos/emblem-logo.html", tags: ["emblem", "badge", "vintage"] },
    { title: "Mascot Logo", category: "Logos", url: "./templates/logos/mascot-logo.html", tags: ["mascot", "character", "sports"] },
    { title: "Luxury Logo", category: "Logos", url: "./templates/logos/luxury-logo.html", tags: ["luxury", "elegant", "gold"] }
];

// ===== LOGO DATA (12 complete items) =====
const logos = {
    1: {
        id: 1,
        title: "Modern Business Logo",
        subtitle: "Professional logo for corporate identity",
        description: "A clean and versatile business logo template, perfect for startups and established companies. Includes multiple color variations and layout options.",
        designDetails: "Geometric sans‑serif, clean lines, scalable vector, monogram option.",
        materialsSpecs: "Vector formats (AI, EPS, SVG) + PNG previews, CMYK/RGB.",
        designInspiration: "Swiss design, minimal corporate branding.",
        practicalApplications: "Business cards, websites, signage, stationery.",
        thumbnailUrl: "https://picsum.photos/id/100/600/400",
        fullImageUrl: "https://picsum.photos/id/100/1200/800",
        logoType: "Business Logo",
        category: "business",
        categories: ["business", "minimal"],
        fileFormats: ["AI", "EPS", "SVG", "PNG", "JPG"],
        dimensions: "Vector (scalable) | 3000×3000 px preview",
        orientation: "square",
        downloadCount: 4215,
        likes: 1532,
        printReady: "Yes (vector)",
        colors: ["#2C3E50", "#3498DB", "#ECF0F1", "#95A5A6", "#27AE60"],
        colorNames: ["Midnight Blue", "Peter River", "Clouds", "Concrete", "Nephritis"],
        tags: ["business", "corporate", "minimal", "professional"],
        features: ["Fully editable", "Vector formats", "Color variations", "Print ready"],
        videoUrl: "https://www.youtube.com/watch?v=T6LMWAxnm-s&t=57s"  // first tutorial link
    },
    2: {
        id: 2,
        title: "Creative Abstract Logo",
        subtitle: "Artistic logo for creative businesses",
        description: "Stand out with this unique abstract logo. Perfect for artists, designers, and innovative brands. Includes multiple abstract shapes and color schemes.",
        designDetails: "Fluid shapes, gradient options, organic forms, dynamic composition.",
        materialsSpecs: "Vector + raster, full editability in AI/EPS.",
        designInspiration: "Abstract expressionism, modern art.",
        practicalApplications: "Art studios, creative agencies, design portfolios.",
        thumbnailUrl: "https://picsum.photos/id/101/600/400",
        fullImageUrl: "https://picsum.photos/id/101/1200/800",
        logoType: "Abstract Logo",
        category: "abstract",
        categories: ["abstract", "creative"],
        fileFormats: ["AI", "EPS", "SVG", "PNG", "JPG"],
        dimensions: "Vector (scalable) | 3000×3000 px preview",
        orientation: "square",
        downloadCount: 3872,
        likes: 1298,
        printReady: "Yes (vector)",
        colors: ["#F94144", "#F8961E", "#F9C74F", "#90BE6D", "#577590"],
        colorNames: ["Red", "Orange", "Yellow", "Green", "Blue"],
        tags: ["abstract", "creative", "artistic", "unique"],
        features: ["Multiple shapes", "Gradient options", "Vector files", "Print ready"],
        videoUrl: "https://www.youtube.com/watch?v=FW2-byfMRbI&t=284s"  // second tutorial link
    },
    3: {
        id: 3,
        title: "Minimal Wordmark Logo",
        subtitle: "Clean typography‑based logo",
        description: "A sophisticated wordmark logo for brands that want to let their name speak. Includes custom letter spacing and font pairing.",
        designDetails: "Elegant serif/sans‑serif combination, balanced kerning, negative space.",
        materialsSpecs: "Vector formats + font suggestions (free fonts).",
        designInspiration: "Classic typography, modernist design.",
        practicalApplications: "Fashion brands, magazines, consultancies.",
        thumbnailUrl: "https://picsum.photos/id/102/600/400",
        fullImageUrl: "https://picsum.photos/id/102/1200/800",
        logoType: "Typography Logo",
        category: "typography",
        categories: ["typography", "minimal"],
        fileFormats: ["AI", "EPS", "SVG", "PNG", "JPG"],
        dimensions: "Vector (scalable) | 3000×2000 px",
        orientation: "landscape",
        downloadCount: 2945,
        likes: 876,
        printReady: "Yes (vector)",
        colors: ["#000000", "#333333", "#666666", "#999999", "#CCCCCC"],
        colorNames: ["Black", "Dark Gray", "Gray", "Light Gray", "Silver"],
        tags: ["wordmark", "typography", "minimal", "elegant"],
        features: ["Custom spacing", "Font suggestions", "Vector files", "Print ready"],
        videoUrl: null
    },
    4: {
        id: 4,
        title: "Emblem Badge Logo",
        subtitle: "Classic badge style for heritage brands",
        description: "Give your brand a sense of tradition and trust with this emblem logo. Includes shield, ribbon, and banner elements.",
        designDetails: "Ornamental borders, vintage textures, layered shield.",
        materialsSpecs: "Vector + layered PSD, 300dpi, CMYK.",
        designInspiration: "University crests, sports badges, craft breweries.",
        practicalApplications: "Schools, sports teams, breweries, clubs.",
        thumbnailUrl: "https://picsum.photos/id/103/600/400",
        fullImageUrl: "https://picsum.photos/id/103/1200/800",
        logoType: "Emblem Logo",
        category: "emblem",
        categories: ["emblem", "vintage"],
        fileFormats: ["AI", "EPS", "SVG", "PSD", "PNG"],
        dimensions: "Vector (scalable) | 3000×3000 px",
        orientation: "square",
        downloadCount: 1863,
        likes: 634,
        printReady: "Yes (vector)",
        colors: ["#8B4513", "#D2691E", "#F4A460", "#CD853F", "#A0522D"],
        colorNames: ["Brown", "Chocolate", "Sandy Brown", "Peru", "Sienna"],
        tags: ["emblem", "badge", "vintage", "crest"],
        features: ["Editable text", "Layered", "Shield/ribbon", "Print ready"],
        videoUrl: null
    },
    5: {
        id: 5,
        title: "Mascot Sports Logo",
        subtitle: "Energetic mascot for teams and brands",
        description: "Bring personality to your brand with this dynamic mascot logo. Includes multiple poses and expressions.",
        designDetails: "Bold lines, vibrant colors, character illustration, team name integration.",
        materialsSpecs: "Vector + layered PSD, 300dpi.",
        designInspiration: "Sports branding, cartoon characters.",
        practicalApplications: "Sports teams, gaming, energy drinks.",
        thumbnailUrl: "https://picsum.photos/id/104/600/400",
        fullImageUrl: "https://picsum.photos/id/104/1200/800",
        logoType: "Mascot Logo",
        category: "mascot",
        categories: ["mascot", "creative"],
        fileFormats: ["AI", "EPS", "SVG", "PSD", "PNG"],
        dimensions: "Vector (scalable) | 3000×3000 px",
        orientation: "square",
        downloadCount: 2156,
        likes: 798,
        printReady: "Yes (vector)",
        colors: ["#E63946", "#F1FA8C", "#A8DADC", "#457B9D", "#1D3557"],
        colorNames: ["Red", "Yellow", "Light Blue", "Blue", "Dark Blue"],
        tags: ["mascot", "sports", "character", "energetic"],
        features: ["Multiple poses", "Character design", "Team name", "Print ready"],
        videoUrl: null
    },
    6: {
        id: 6,
        title: "Luxury Gold Logo",
        subtitle: "Elegant logo for high‑end brands",
        description: "Exude sophistication with this luxury logo, featuring gold foil textures and elegant serifs. Perfect for premium products.",
        designDetails: "Gold gradients, foil effect, refined typography, monogram option.",
        materialsSpecs: "Vector + layered PSD with foil effects, CMYK.",
        designInspiration: "High‑end fashion, jewelry, fine dining.",
        practicalApplications: "Jewelry brands, hotels, exclusive clubs.",
        thumbnailUrl: "https://picsum.photos/id/105/600/400",
        fullImageUrl: "https://picsum.photos/id/105/1200/800",
        logoType: "Luxury Logo",
        category: "luxury",
        categories: ["luxury", "elegant"],
        fileFormats: ["AI", "EPS", "SVG", "PSD", "PNG"],
        dimensions: "Vector (scalable) | 3000×3000 px",
        orientation: "square",
        downloadCount: 1432,
        likes: 501,
        printReady: "Yes (vector)",
        colors: ["#D4AF37", "#C0C0C0", "#F5F5F5", "#000000", "#800020"],
        colorNames: ["Gold", "Silver", "White", "Black", "Burgundy"],
        tags: ["luxury", "gold", "elegant", "premium"],
        features: ["Foil effect", "Monogram option", "Vector files", "Print ready"],
        videoUrl: null
    },
    7: {
        id: 7,
        title: "Geometric Abstract Logo",
        subtitle: "Modern logo with geometric shapes",
        description: "Clean and contemporary logo built from geometric forms. Customizable colors and arrangements.",
        designDetails: "Circles, triangles, lines; optical illusion effects; modular.",
        materialsSpecs: "Vector (AI, EPS, SVG) + PNG previews.",
        designInspiration: "Bauhaus, Memphis design, minimalism.",
        practicalApplications: "Tech startups, design studios, modern brands.",
        thumbnailUrl: "https://picsum.photos/id/106/600/400",
        fullImageUrl: "https://picsum.photos/id/106/1200/800",
        logoType: "Abstract Logo",
        category: "abstract",
        categories: ["abstract", "minimal"],
        fileFormats: ["AI", "EPS", "SVG", "PNG", "JPG"],
        dimensions: "Vector (scalable) | 3000×3000 px",
        orientation: "square",
        downloadCount: 1789,
        likes: 612,
        printReady: "Yes (vector)",
        colors: ["#4361EE", "#3A0CA3", "#7209B7", "#F72585", "#4CC9F0"],
        colorNames: ["Blue", "Dark Blue", "Purple", "Pink", "Light Blue"],
        tags: ["geometric", "abstract", "modern", "tech"],
        features: ["Modular", "Optical effects", "Vector files", "Print ready"],
        videoUrl: null
    },
    8: {
        id: 8,
        title: "Handwritten Signature Logo",
        subtitle: "Personal, artistic signature style",
        description: "A unique handwritten logo that feels personal and approachable. Perfect for freelancers, artists, and lifestyle brands.",
        designDetails: "Brush strokes, ink texture, custom lettering, organic feel.",
        materialsSpecs: "Vector + high‑res PNG, 300dpi.",
        designInspiration: "Calligraphy, modern brush lettering.",
        practicalApplications: "Photographers, wedding planners, artisans.",
        thumbnailUrl: "https://picsum.photos/id/107/600/400",
        fullImageUrl: "https://picsum.photos/id/107/1200/800",
        logoType: "Signature Logo",
        category: "creative",
        categories: ["creative", "typography"],
        fileFormats: ["AI", "EPS", "SVG", "PNG", "JPG"],
        dimensions: "Vector (scalable) | 3000×2000 px",
        orientation: "landscape",
        downloadCount: 2034,
        likes: 723,
        printReady: "Yes (vector)",
        colors: ["#2D2D2D", "#4A4A4A", "#6D6D6D", "#A9A9A9", "#D3D3D3"],
        colorNames: ["Charcoal", "Gray", "Medium Gray", "Silver", "Light Gray"],
        tags: ["handwritten", "signature", "artistic", "personal"],
        features: ["Custom lettering", "Brush strokes", "Vector files", "Print ready"],
        videoUrl: null
    },
    9: {
        id: 9,
        title: "Monogram Initial Logo",
        subtitle: "Sophisticated two‑letter monogram",
        description: "Create a classy brand identity with this monogram logo. Choose your letters and combine them elegantly.",
        designDetails: "Interlocking letters, decorative frame, multiple layouts.",
        materialsSpecs: "Vector + layered PSD, 300dpi.",
        designInspiration: "Fashion monograms, luxury branding.",
        practicalApplications: "Fashion designers, personal brands, consulting.",
        thumbnailUrl: "https://picsum.photos/id/108/600/400",
        fullImageUrl: "https://picsum.photos/id/108/1200/800",
        logoType: "Monogram Logo",
        category: "minimal",
        categories: ["minimal", "luxury"],
        fileFormats: ["AI", "EPS", "SVG", "PSD", "PNG"],
        dimensions: "Vector (scalable) | 3000×3000 px",
        orientation: "square",
        downloadCount: 1678,
        likes: 589,
        printReady: "Yes (vector)",
        colors: ["#1E1E1E", "#3D3D3D", "#C0C0C0", "#F5F5F5", "#D4AF37"],
        colorNames: ["Black", "Dark Gray", "Silver", "White", "Gold"],
        tags: ["monogram", "initials", "minimal", "elegant"],
        features: ["Interlocking letters", "Multiple frames", "Vector files", "Print ready"],
        videoUrl: null
    },
    10: {
        id: 10,
        title: "Tech Startup Logo",
        subtitle: "Futuristic logo for tech companies",
        description: "Cutting‑edge design for innovative tech startups. Includes abstract tech elements and modern typography.",
        designDetails: "Circuit‑like lines, geometric shapes, gradient options.",
        materialsSpecs: "Vector + layered PSD, 300dpi.",
        designInspiration: "Cyberpunk, sci‑fi, modern tech.",
        practicalApplications: "SaaS companies, app developers, AI startups.",
        thumbnailUrl: "https://picsum.photos/id/109/600/400",
        fullImageUrl: "https://picsum.photos/id/109/1200/800",
        logoType: "Business Logo",
        category: "business",
        categories: ["business", "creative"],
        fileFormats: ["AI", "EPS", "SVG", "PSD", "PNG"],
        dimensions: "Vector (scalable) | 3000×3000 px",
        orientation: "square",
        downloadCount: 2245,
        likes: 812,
        printReady: "Yes (vector)",
        colors: ["#0A0F0D", "#3A6EA5", "#C0D6DF", "#EBF5EE", "#78A1BB"],
        colorNames: ["Black", "Blue", "Light Blue", "Off White", "Steel Blue"],
        tags: ["tech", "startup", "futuristic", "innovation"],
        features: ["Tech elements", "Gradient options", "Vector files", "Print ready"],
        videoUrl: null
    },
    11: {
        id: 11,
        title: "Eco Friendly Logo",
        subtitle: "Green logo for sustainable brands",
        description: "Communicate your commitment to the environment with this nature‑inspired logo. Features leaves, trees, and earth tones.",
        designDetails: "Organic shapes, leaf motifs, recycled textures.",
        materialsSpecs: "Vector + layered PSD, 300dpi.",
        designInspiration: "Nature, sustainability, organic products.",
        practicalApplications: "Organic food, green energy, non‑profits.",
        thumbnailUrl: "https://picsum.photos/id/110/600/400",
        fullImageUrl: "https://picsum.photos/id/110/1200/800",
        logoType: "Creative Logo",
        category: "creative",
        categories: ["creative", "abstract"],
        fileFormats: ["AI", "EPS", "SVG", "PSD", "PNG"],
        dimensions: "Vector (scalable) | 3000×3000 px",
        orientation: "square",
        downloadCount: 1976,
        likes: 678,
        printReady: "Yes (vector)",
        colors: ["#2E5E4E", "#7C9D8E", "#F4B860", "#C73E1D", "#F3E9D2"],
        colorNames: ["Forest", "Sage", "Gold", "Rust", "Cream"],
        tags: ["eco", "green", "nature", "sustainable"],
        features: ["Leaf motifs", "Earth tones", "Vector files", "Print ready"],
        videoUrl: null
    },
    12: {
        id: 12,
        title: "Vintage Retro Logo",
        subtitle: "Nostalgic design for retro brands",
        description: "Capture the spirit of past decades with this vintage logo. Perfect for bars, diners, and retro clothing lines.",
        designDetails: "Distressed textures, retro fonts, badge styles, faded colors.",
        materialsSpecs: "Vector + layered PSD with texture overlays.",
        designInspiration: "1950s advertising, retro signage.",
        practicalApplications: "Breweries, vintage shops, classic cars.",
        thumbnailUrl: "https://picsum.photos/id/111/600/400",
        fullImageUrl: "https://picsum.photos/id/111/1200/800",
        logoType: "Emblem Logo",
        category: "emblem",
        categories: ["emblem", "vintage"],
        fileFormats: ["AI", "EPS", "SVG", "PSD", "PNG"],
        dimensions: "Vector (scalable) | 3000×3000 px",
        orientation: "square",
        downloadCount: 1823,
        likes: 645,
        printReady: "Yes (vector)",
        colors: ["#8B4513", "#CD853F", "#F4A460", "#DEB887", "#D2691E"],
        colorNames: ["Brown", "Peru", "Sandy Brown", "Tan", "Chocolate"],
        tags: ["vintage", "retro", "nostalgic", "badge"],
        features: ["Distressed textures", "Retro fonts", "Vector files", "Print ready"],
        videoUrl: null
    }
};

// ===== GLOBAL VARIABLES =====
let likedLogos = JSON.parse(localStorage.getItem('likedLogos')) || [];

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

// Logo Modal Elements
const modal = document.getElementById('logoModal');
let currentLogoId = null;

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

    let filtered = Object.values(logos).filter(lg => {
        if (filterCategory !== 'all' && !lg.categories.includes(filterCategory)) return false;
        if (filterOrientation !== 'all' && lg.orientation !== filterOrientation) return false;
        return true;
    });

    // Sorting
    if (sortBy === 'popular') filtered.sort((a,b) => b.likes - a.likes);
    else if (sortBy === 'downloads') filtered.sort((a,b) => b.downloadCount - a.downloadCount);
    else if (sortBy === 'az') filtered.sort((a,b) => a.title.localeCompare(b.title));
    else if (sortBy === 'za') filtered.sort((a,b) => b.title.localeCompare(a.title));
    else filtered.sort((a,b) => b.id - a.id); // newest

    grid.innerHTML = filtered.map(lg => {
        const isLiked = likedLogos.includes(lg.id);
        const likeCount = isLiked ? lg.likes + 1 : lg.likes;
        const badgeText = lg.categories[0].charAt(0).toUpperCase() + lg.categories[0].slice(1);

        return `
        <div class="project-card" data-id="${lg.id}" data-category="${lg.categories.join(' ')}" data-orientation="${lg.orientation}">
            <div class="project-badge">${badgeText}</div>
            <div class="project-img">
                <img src="${lg.thumbnailUrl}" alt="${lg.title}" loading="lazy">
            </div>
            <div class="project-info">
                <h3>${lg.title}</h3>
                <p>${lg.subtitle}</p>
                <div class="project-meta">
                    <span class="project-price free">FREE</span>
                    <div class="project-stats">
                        <span class="project-likes">
                            <i class="fas fa-heart like-icon ${isLiked ? 'active' : ''}" data-id="${lg.id}"></i>
                            <span class="like-count" data-id="${lg.id}">${likeCount}</span>
                        </span>
                        <span class="project-downloads">
                            <i class="fas fa-download"></i>
                            <span class="download-count" data-id="${lg.id}">${lg.downloadCount}</span>
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
function handleLike(lgId) {
    const logo = logos[lgId];
    if (!logo) return;

    const wasLiked = likedLogos.includes(lgId);
    if (wasLiked) {
        likedLogos = likedLogos.filter(id => id !== lgId);
        logo.likes -= 1;
    } else {
        likedLogos.push(lgId);
        logo.likes += 1;
    }
    localStorage.setItem('likedLogos', JSON.stringify(likedLogos));

    // Update UI
    const likeIcons = document.querySelectorAll(`.project-likes .like-icon[data-id="${lgId}"]`);
    const likeCounts = document.querySelectorAll(`.like-count[data-id="${lgId}"]`);

    likeIcons.forEach(icon => icon.classList.toggle('active', !wasLiked));
    likeCounts.forEach(el => el.textContent = logo.likes);
}

// ===== MODAL FUNCTIONS =====
function openModal(id) {
    const lg = logos[id];
    if (!lg) return;
    currentLogoId = id;

    document.getElementById('modalImage').src = lg.thumbnailUrl;
    document.getElementById('modalTitle').textContent = lg.title;
    document.getElementById('modalSubtitle').textContent = lg.subtitle;
    document.getElementById('modalDescription').textContent = lg.description;
    document.getElementById('designDetails').textContent = lg.designDetails;
    document.getElementById('materialsSpecs').textContent = lg.materialsSpecs;
    document.getElementById('designInspiration').textContent = lg.designInspiration;
    document.getElementById('practicalApplications').textContent = lg.practicalApplications;
    document.getElementById('logoType').textContent = lg.logoType;
    document.getElementById('fileFormat').textContent = lg.fileFormats.join(', ');
    document.getElementById('dimensions').textContent = lg.dimensions;
    document.getElementById('downloadCount').textContent = lg.downloadCount.toLocaleString();
    document.getElementById('orientation').textContent = lg.orientation.charAt(0).toUpperCase() + lg.orientation.slice(1);
    document.getElementById('printReady').textContent = lg.printReady;
    document.getElementById('modalFullImage').src = lg.fullImageUrl;
    document.getElementById('modalFullImage').className = `modal-full-image ${lg.orientation}`;

    document.getElementById('modalPrice').innerHTML = '<span class="price-free">FREE</span>';

    const formatBadges = document.getElementById('formatBadges');
    formatBadges.innerHTML = lg.fileFormats.map(f => `<span class="format-badge">${f}</span>`).join('');

    const colorPalette = document.getElementById('colorPalette');
    colorPalette.innerHTML = lg.colors.map((c, i) => `
        <div class="color" style="background-color: ${c};" title="${lg.colorNames[i]}"></div>
    `).join('');

    document.getElementById('tagsContainer').innerHTML = lg.tags.map(t => `<span class="tag">${t}</span>`).join('');

    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = lg.features.map(f => `<li>${f}</li>`).join('');

    // Handle video tutorial section
    const videoSection = document.getElementById('videoTutorialSection');
    if (lg.videoUrl) {
        videoSection.style.display = 'block';
        const videoId = extractYouTubeID(lg.videoUrl);
        if (videoId) {
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
            document.getElementById('videoThumbnail').src = thumbnailUrl;
            document.getElementById('videoLink').href = lg.videoUrl;
        } else {
            // fallback: just show the link as text
            document.getElementById('videoThumbnail').src = '';
            document.getElementById('videoLink').href = lg.videoUrl;
            document.querySelector('.video-container p').innerHTML = `<a href="${lg.videoUrl}" target="_blank">Watch tutorial on YouTube</a>`;
        }
    } else {
        videoSection.style.display = 'none';
    }

    generateRelatedDesigns(id, lg.category);

    const modalLikeBtn = document.getElementById('modalLikeBtn');
    const modalLikeCount = document.getElementById('modalLikeCount');
    const isLiked = likedLogos.includes(id);
    modalLikeBtn.classList.toggle('active', isLiked);
    modalLikeCount.textContent = isLiked ? lg.likes + 1 : lg.likes;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentLogoId = null;
}

function extractYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function generateRelatedDesigns(currentId, category) {
    const container = document.getElementById('relatedDesigns');
    const related = Object.values(logos)
        .filter(l => l.id !== currentId && l.category === category)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    
    container.innerHTML = related.map(l => `
        <div class="related-item" data-id="${l.id}">
            <img src="${l.thumbnailUrl}" alt="${l.title}">
            <div class="related-overlay"><span>${l.title}</span></div>
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
function downloadTemplate(lgId) {
    const lg = logos[lgId];
    if (!lg) return;

    const slug = slugify(lg.title);
    const fileName = `${slug}.zip`;
    const fileUrl = `../../assets/downloads/logos/${fileName}`;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    lg.downloadCount += 1;
    localStorage.setItem(`download_${lgId}`, Date.now());
    document.querySelectorAll(`.download-count[data-id="${lgId}"]`).forEach(el => {
        el.textContent = lg.downloadCount;
    });
    document.getElementById('downloadCount').textContent = lg.downloadCount.toLocaleString();
}

// ===== SEARCH FUNCTIONALITY =====
function performSearch(searchTerm) {
    const searchTerms = [
        'logo', 'business', 'creative', 'minimal', 'abstract',
        'typography', 'emblem', 'mascot', 'luxury', 'brand'
    ];
    
    if (searchTerms.some(term => searchTerm.toLowerCase().includes(term))) {
        alert(`Searching for: "${searchTerm}"\n\nThis would show relevant templates in a real implementation.`);
        searchInput.value = '';
    } else {
        alert(`No templates found for "${searchTerm}". Try searching for: logo, business, creative, minimal, etc.`);
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
    
    // Initial render of logo grid
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
                this.innerHTML = '<i class="fas fa-plus"></i> Load More Logos';
                this.disabled = false;
                alert('More logos would be loaded dynamically in production.');
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
        if (!currentLogoId) return;
        handleLike(currentLogoId);
        const lg = logos[currentLogoId];
        const isLiked = likedLogos.includes(currentLogoId);
        this.classList.toggle('active', isLiked);
        document.getElementById('modalLikeCount').textContent = isLiked ? lg.likes + 1 : lg.likes;
    });

    document.getElementById('modalDownloadBtn')?.addEventListener('click', function() {
        if (currentLogoId) downloadTemplate(currentLogoId);
    });

    document.getElementById('downloadTemplateBtn')?.addEventListener('click', function() {
        if (currentLogoId) downloadTemplate(currentLogoId);
    });

    document.getElementById('previewBtn')?.addEventListener('click', function() {
        if (currentLogoId) window.open(logos[currentLogoId].fullImageUrl, '_blank');
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
                alert(`Thank you for subscribing with ${email}! You'll receive monthly logo templates.`);
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