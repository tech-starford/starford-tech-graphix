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
    { title: "Corporate Business Card", category: "Business Cards", url: "./templates/business-cards/corporate.html", tags: ["corporate", "professional", "business"] },
    { title: "Creative Business Card", category: "Business Cards", url: "./templates/business-cards/creative.html", tags: ["creative", "artistic", "colorful"] },
    { title: "Minimal Business Card", category: "Business Cards", url: "./templates/business-cards/minimal.html", tags: ["minimal", "clean", "simple"] },
    { title: "Modern Business Card", category: "Business Cards", url: "./templates/business-cards/modern.html", tags: ["modern", "sleek", "contemporary"] },
    { title: "Luxury Business Card", category: "Business Cards", url: "./templates/business-cards/luxury.html", tags: ["luxury", "elegant", "gold"] },
    { title: "Vintage Business Card", category: "Business Cards", url: "./templates/business-cards/vintage.html", tags: ["vintage", "retro", "classic"] },
    { title: "Bold Business Card", category: "Business Cards", url: "./templates/business-cards/bold.html", tags: ["bold", "colorful", "eye-catching"] },
    { title: "Elegant Business Card", category: "Business Cards", url: "./templates/business-cards/elegant.html", tags: ["elegant", "sophisticated", "refined"] }
];

// ===== BUSINESS CARD DATA (12 complete items) =====
const cards = {
    1: {
        id: 1,
        title: "Corporate Business Card",
        subtitle: "Clean and professional design for executives",
        description: "A sophisticated corporate business card template with a classic layout. Perfect for executives, consultants, and corporate professionals. Includes front and back design.",
        designDetails: "Clean grid, refined serif/sans‑serif combination, subtle foil effect (simulated), ample white space.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi, CMYK + spot UV layer.",
        designInspiration: "Corporate identity, Swiss design.",
        practicalApplications: "Corporate executives, law firms, financial advisors.",
        thumbnailUrl: "https://picsum.photos/id/140/600/400",
        fullImageUrl: "https://picsum.photos/id/140/1200/800",
        cardType: "Corporate Card",
        category: "corporate",
        categories: ["corporate", "elegant"],
        fileFormats: ["PSD", "AI", "PDF", "PNG", "JPG"],
        dimensions: "3.5×2 in (US) | 1050×600 px | 300dpi",
        orientation: "landscape",
        downloadCount: 3245,
        likes: 942,
        printReady: "Yes",
        colors: ["#2C3E50", "#3498DB", "#ECF0F1", "#95A5A6", "#27AE60"],
        colorNames: ["Midnight Blue", "Peter River", "Clouds", "Concrete", "Nephritis"],
        tags: ["corporate", "professional", "executive", "business"],
        features: ["Front/back design", "Bleed marks", "Spot UV layer", "Editable text"],
        videoUrl: "https://www.youtube.com/watch?v=T6LMWAxnm-s&t=57s"  // first tutorial link
    },
    2: {
        id: 2,
        title: "Creative Business Card",
        subtitle: "Bold and artistic for creatives",
        description: "Stand out with this vibrant, creative business card. Ideal for designers, artists, and innovative startups. Full‑color front with a unique die‑cut option.",
        designDetails: "Bold colors, asymmetrical layout, geometric shapes, die‑cut simulation.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi, CMYK.",
        designInspiration: "Modern art, Bauhaus, creative agencies.",
        practicalApplications: "Graphic designers, art studios, creative agencies.",
        thumbnailUrl: "https://picsum.photos/id/141/600/400",
        fullImageUrl: "https://picsum.photos/id/141/1200/800",
        cardType: "Creative Card",
        category: "creative",
        categories: ["creative", "bold"],
        fileFormats: ["PSD", "AI", "PDF", "PNG", "JPG"],
        dimensions: "3.5×2 in (US) | 1050×600 px | 300dpi",
        orientation: "landscape",
        downloadCount: 2876,
        likes: 854,
        printReady: "Yes",
        colors: ["#F94144", "#F8961E", "#F9C74F", "#90BE6D", "#577590"],
        colorNames: ["Red", "Orange", "Yellow", "Green", "Blue"],
        tags: ["creative", "artistic", "colorful", "bold"],
        features: ["Die‑cut layer", "Full color", "Multiple shapes", "Editable text"],
        videoUrl: "https://www.youtube.com/watch?v=FW2-byfMRbI&t=284s"  // second tutorial link
    },
    3: {
        id: 3,
        title: "Minimal Business Card",
        subtitle: "Less is more – clean and modern",
        description: "A minimalist’s dream. This card uses negative space and simple typography to make a subtle but powerful statement.",
        designDetails: "Monochrome palette, generous whitespace, subtle texture, refined typography.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi, CMYK.",
        designInspiration: "Japanese minimalism, Swiss design.",
        practicalApplications: "Architects, photographers, consultants.",
        thumbnailUrl: "https://picsum.photos/id/142/600/400",
        fullImageUrl: "https://picsum.photos/id/142/1200/800",
        cardType: "Minimal Card",
        category: "minimal",
        categories: ["minimal", "elegant"],
        fileFormats: ["PSD", "AI", "PDF", "PNG", "JPG"],
        dimensions: "3.5×2 in (US) | 1050×600 px | 300dpi",
        orientation: "landscape",
        downloadCount: 4215,
        likes: 1532,
        printReady: "Yes",
        colors: ["#FFFFFF", "#F5F5F5", "#212121", "#757575", "#BDBDBD"],
        colorNames: ["White", "Off White", "Black", "Gray", "Light Gray"],
        tags: ["minimal", "clean", "modern", "simple"],
        features: ["Textured background", "Multiple layouts", "Editable text", "Print ready"],
        videoUrl: null
    },
    4: {
        id: 4,
        title: "Modern Business Card",
        subtitle: "Sleek and contemporary design",
        description: "A modern business card with geometric elements and a split color scheme. Great for tech companies and startups.",
        designDetails: "Split background, geometric accent lines, modern sans‑serif.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi, CMYK.",
        designInspiration: "Tech startups, modern architecture.",
        practicalApplications: "Tech companies, startups, modern brands.",
        thumbnailUrl: "https://picsum.photos/id/143/600/400",
        fullImageUrl: "https://picsum.photos/id/143/1200/800",
        cardType: "Modern Card",
        category: "modern",
        categories: ["modern", "bold"],
        fileFormats: ["PSD", "AI", "PDF", "PNG", "JPG"],
        dimensions: "3.5×2 in (US) | 1050×600 px | 300dpi",
        orientation: "landscape",
        downloadCount: 3678,
        likes: 1102,
        printReady: "Yes",
        colors: ["#1E1E2F", "#9B5DE5", "#F15BB5", "#FEE440", "#00BBF9"],
        colorNames: ["Dark Blue", "Purple", "Pink", "Yellow", "Blue"],
        tags: ["modern", "sleek", "contemporary", "tech"],
        features: ["Split design", "Geometric lines", "Bold colors", "Editable text"],
        videoUrl: null
    },
    5: {
        id: 5,
        title: "Luxury Business Card",
        subtitle: "Elegant design with gold accents",
        description: "Make a lasting impression with this luxury business card. Simulated gold foil, deep colors, and refined typography.",
        designDetails: "Gold foil effect, embossed feel, dark background, elegant serif.",
        materialsSpecs: "Print‑ready PDF + layered PSD with foil layer, 300dpi, CMYK + spot colors.",
        designInspiration: "High‑end brands, luxury goods.",
        practicalApplications: "Real estate agents, luxury brands, premium services.",
        thumbnailUrl: "https://picsum.photos/id/144/600/400",
        fullImageUrl: "https://picsum.photos/id/144/1200/800",
        cardType: "Luxury Card",
        category: "luxury",
        categories: ["luxury", "elegant"],
        fileFormats: ["PSD", "AI", "PDF", "PNG", "JPG"],
        dimensions: "3.5×2 in (US) | 1050×600 px | 300dpi",
        orientation: "landscape",
        downloadCount: 2198,
        likes: 765,
        printReady: "Yes",
        colors: ["#1C1C1C", "#D4AF37", "#F5F5F5", "#800020", "#0F0F0F"],
        colorNames: ["Black", "Gold", "White", "Burgundy", "Charcoal"],
        tags: ["luxury", "gold", "elegant", "premium"],
        features: ["Foil simulation", "Dark background", "Elegant typography", "Print ready"],
        videoUrl: null
    },
    6: {
        id: 6,
        title: "Vintage Business Card",
        subtitle: "Classic design with retro charm",
        description: "Add a touch of nostalgia with this vintage business card. Distressed textures, old‑style fonts, and a timeless feel.",
        designDetails: "Distressed paper texture, vintage ornaments, hand‑drawn style font.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi, CMYK.",
        designInspiration: "1920s advertising, antique prints.",
        practicalApplications: "Antique shops, vintage stores, classic brands.",
        thumbnailUrl: "https://picsum.photos/id/145/600/400",
        fullImageUrl: "https://picsum.photos/id/145/1200/800",
        cardType: "Vintage Card",
        category: "vintage",
        categories: ["vintage", "elegant"],
        fileFormats: ["PSD", "AI", "PDF", "PNG", "JPG"],
        dimensions: "3.5×2 in (US) | 1050×600 px | 300dpi",
        orientation: "landscape",
        downloadCount: 1845,
        likes: 623,
        printReady: "Yes",
        colors: ["#8B4513", "#CD853F", "#F4A460", "#DEB887", "#2E1B0F"],
        colorNames: ["Brown", "Peru", "Sandy Brown", "Tan", "Dark Brown"],
        tags: ["vintage", "retro", "classic", "old school"],
        features: ["Distressed texture", "Vintage ornaments", "Hand‑drawn font", "Print ready"],
        videoUrl: null
    },
    7: {
        id: 7,
        title: "Bold Business Card",
        subtitle: "Make a statement with vibrant colors",
        description: "Designed for those who want to be noticed. This card uses bold colors and large typography to grab attention.",
        designDetails: "High‑contrast colors, oversized text, dynamic shapes.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi, CMYK.",
        designInspiration: "Pop art, modern advertising.",
        practicalApplications: "Marketing professionals, influencers, creatives.",
        thumbnailUrl: "https://picsum.photos/id/146/600/400",
        fullImageUrl: "https://picsum.photos/id/146/1200/800",
        cardType: "Bold Card",
        category: "bold",
        categories: ["bold", "creative"],
        fileFormats: ["PSD", "AI", "PDF", "PNG", "JPG"],
        dimensions: "3.5×2 in (US) | 1050×600 px | 300dpi",
        orientation: "landscape",
        downloadCount: 2567,
        likes: 878,
        printReady: "Yes",
        colors: ["#FF006E", "#8338EC", "#3A86FF", "#FB5607", "#FFBE0B"],
        colorNames: ["Pink", "Purple", "Blue", "Orange", "Yellow"],
        tags: ["bold", "colorful", "statement", "vibrant"],
        features: ["Large typography", "Dynamic shapes", "High contrast", "Editable text"],
        videoUrl: null
    },
    8: {
        id: 8,
        title: "Elegant Business Card",
        subtitle: "Sophisticated design for upscale brands",
        description: "Refined and graceful, this card uses subtle gradients and delicate lines to convey elegance and professionalism.",
        designDetails: "Subtle gradient, fine lines, classic serif, matte finish simulation.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi, CMYK.",
        designInspiration: "Luxury fashion, high‑end stationery.",
        practicalApplications: "Wedding planners, luxury retail, high‑end services.",
        thumbnailUrl: "https://picsum.photos/id/147/600/400",
        fullImageUrl: "https://picsum.photos/id/147/1200/800",
        cardType: "Elegant Card",
        category: "elegant",
        categories: ["elegant", "luxury"],
        fileFormats: ["PSD", "AI", "PDF", "PNG", "JPG"],
        dimensions: "3.5×2 in (US) | 1050×600 px | 300dpi",
        orientation: "landscape",
        downloadCount: 2034,
        likes: 712,
        printReady: "Yes",
        colors: ["#F8F0E3", "#C0A080", "#800020", "#2C2C2C", "#D4AF37"],
        colorNames: ["Ivory", "Beige", "Burgundy", "Charcoal", "Gold"],
        tags: ["elegant", "sophisticated", "refined", "classy"],
        features: ["Subtle gradient", "Fine lines", "Matte finish", "Editable text"],
        videoUrl: null
    },
    9: {
        id: 9,
        title: "Tech Startup Card",
        subtitle: "Futuristic design for tech companies",
        description: "A cutting‑edge card for tech startups. Includes circuit‑board patterns, a modern color scheme, and space for QR code.",
        designDetails: "Circuit patterns, geometric shapes, tech‑inspired typography, QR code area.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi, CMYK.",
        designInspiration: "Silicon Valley, cyberpunk.",
        practicalApplications: "Tech startups, app developers, IT consultants.",
        thumbnailUrl: "https://picsum.photos/id/148/600/400",
        fullImageUrl: "https://picsum.photos/id/148/1200/800",
        cardType: "Modern Card",
        category: "modern",
        categories: ["modern", "bold"],
        fileFormats: ["PSD", "AI", "PDF", "PNG", "JPG"],
        dimensions: "3.5×2 in (US) | 1050×600 px | 300dpi",
        orientation: "landscape",
        downloadCount: 3123,
        likes: 1056,
        printReady: "Yes",
        colors: ["#0A0F0F", "#00FF9F", "#0077FF", "#FFFFFF", "#6C757D"],
        colorNames: ["Black", "Green", "Blue", "White", "Gray"],
        tags: ["tech", "startup", "futuristic", "innovative"],
        features: ["Circuit pattern", "QR code spot", "Bold colors", "Editable text"],
        videoUrl: null
    },
    10: {
        id: 10,
        title: "Photography Business Card",
        subtitle: "Artistic card for photographers",
        description: "Showcase your photography style with this elegant card. Includes a photo area, minimalist layout, and space for social media handles.",
        designDetails: "Full‑bleed photo option, clean sans‑serif, icon set.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi, CMYK.",
        designInspiration: "Art galleries, photography portfolios.",
        practicalApplications: "Photographers, videographers, artists.",
        thumbnailUrl: "https://picsum.photos/id/149/600/400",
        fullImageUrl: "https://picsum.photos/id/149/1200/800",
        cardType: "Creative Card",
        category: "creative",
        categories: ["creative", "minimal"],
        fileFormats: ["PSD", "AI", "PDF", "PNG", "JPG"],
        dimensions: "3.5×2 in (US) | 1050×600 px | 300dpi",
        orientation: "landscape",
        downloadCount: 1789,
        likes: 598,
        printReady: "Yes",
        colors: ["#FFFFFF", "#000000", "#CCCCCC", "#7F8C8D", "#2C3E50"],
        colorNames: ["White", "Black", "Light Gray", "Gray", "Dark Blue"],
        tags: ["photography", "artist", "portfolio", "creative"],
        features: ["Photo area", "Social icons", "Minimal layout", "Editable text"],
        videoUrl: null
    },
    11: {
        id: 11,
        title: "Real Estate Business Card",
        subtitle: "Trustworthy design for agents",
        description: "Build trust with this professional real estate card. Features space for agent photo, company logo, and contact details.",
        designDetails: "Elegant serif, subtle property icon, photo area, gold accent.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi, CMYK.",
        designInspiration: "Luxury real estate, professional branding.",
        practicalApplications: "Real estate agents, property managers.",
        thumbnailUrl: "https://picsum.photos/id/150/600/400",
        fullImageUrl: "https://picsum.photos/id/150/1200/800",
        cardType: "Corporate Card",
        category: "corporate",
        categories: ["corporate", "elegant"],
        fileFormats: ["PSD", "AI", "PDF", "PNG", "JPG"],
        dimensions: "3.5×2 in (US) | 1050×600 px | 300dpi",
        orientation: "landscape",
        downloadCount: 2123,
        likes: 734,
        printReady: "Yes",
        colors: ["#2C3E50", "#BDC3C7", "#ECF0F1", "#E67E22", "#3498DB"],
        colorNames: ["Dark Blue", "Silver", "Clouds", "Orange", "Blue"],
        tags: ["real estate", "agent", "professional", "trust"],
        features: ["Agent photo", "Company logo", "Property icon", "Editable text"],
        videoUrl: null
    },
    12: {
        id: 12,
        title: "Architect Business Card",
        subtitle: "Clean, structural design for architects",
        description: "Reflect your architectural style with this structured, grid‑based card. Perfect for architects, designers, and engineers.",
        designDetails: "Grid lines, blueprint style, minimalist, space for sketch.",
        materialsSpecs: "Print‑ready PDF + layered PSD, 300dpi, CMYK.",
        designInspiration: "Architectural blueprints, Bauhaus.",
        practicalApplications: "Architects, interior designers, engineers.",
        thumbnailUrl: "https://picsum.photos/id/151/600/400",
        fullImageUrl: "https://picsum.photos/id/151/1200/800",
        cardType: "Minimal Card",
        category: "minimal",
        categories: ["minimal", "modern"],
        fileFormats: ["PSD", "AI", "PDF", "PNG", "JPG"],
        dimensions: "3.5×2 in (US) | 1050×600 px | 300dpi",
        orientation: "landscape",
        downloadCount: 1654,
        likes: 543,
        printReady: "Yes",
        colors: ["#F5F5F5", "#2D2D2D", "#7F8C8D", "#BDC3C7", "#3498DB"],
        colorNames: ["Off White", "Charcoal", "Gray", "Silver", "Blue"],
        tags: ["architect", "blueprint", "grid", "structural"],
        features: ["Grid lines", "Blueprint style", "Sketch area", "Editable text"],
        videoUrl: null
    }
};

// ===== GLOBAL VARIABLES =====
let likedCards = JSON.parse(localStorage.getItem('likedCards')) || [];

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

// Card Modal Elements
const modal = document.getElementById('cardModal');
let currentCardId = null;

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

    let filtered = Object.values(cards).filter(c => {
        if (filterCategory !== 'all' && !c.categories.includes(filterCategory)) return false;
        if (filterOrientation !== 'all' && c.orientation !== filterOrientation) return false;
        return true;
    });

    // Sorting
    if (sortBy === 'popular') filtered.sort((a,b) => b.likes - a.likes);
    else if (sortBy === 'downloads') filtered.sort((a,b) => b.downloadCount - a.downloadCount);
    else if (sortBy === 'az') filtered.sort((a,b) => a.title.localeCompare(b.title));
    else if (sortBy === 'za') filtered.sort((a,b) => b.title.localeCompare(a.title));
    else filtered.sort((a,b) => b.id - a.id); // newest

    grid.innerHTML = filtered.map(c => {
        const isLiked = likedCards.includes(c.id);
        const likeCount = isLiked ? c.likes + 1 : c.likes;
        const badgeText = c.categories[0].charAt(0).toUpperCase() + c.categories[0].slice(1);

        return `
        <div class="project-card" data-id="${c.id}" data-category="${c.categories.join(' ')}" data-orientation="${c.orientation}">
            <div class="project-badge">${badgeText}</div>
            <div class="project-img">
                <img src="${c.thumbnailUrl}" alt="${c.title}" loading="lazy">
            </div>
            <div class="project-info">
                <h3>${c.title}</h3>
                <p>${c.subtitle}</p>
                <div class="project-meta">
                    <span class="project-price free">FREE</span>
                    <div class="project-stats">
                        <span class="project-likes">
                            <i class="fas fa-heart like-icon ${isLiked ? 'active' : ''}" data-id="${c.id}"></i>
                            <span class="like-count" data-id="${c.id}">${likeCount}</span>
                        </span>
                        <span class="project-downloads">
                            <i class="fas fa-download"></i>
                            <span class="download-count" data-id="${c.id}">${c.downloadCount}</span>
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
function handleLike(cId) {
    const card = cards[cId];
    if (!card) return;

    const wasLiked = likedCards.includes(cId);
    if (wasLiked) {
        likedCards = likedCards.filter(id => id !== cId);
        card.likes -= 1;
    } else {
        likedCards.push(cId);
        card.likes += 1;
    }
    localStorage.setItem('likedCards', JSON.stringify(likedCards));

    // Update UI
    const likeIcons = document.querySelectorAll(`.project-likes .like-icon[data-id="${cId}"]`);
    const likeCounts = document.querySelectorAll(`.like-count[data-id="${cId}"]`);

    likeIcons.forEach(icon => icon.classList.toggle('active', !wasLiked));
    likeCounts.forEach(el => el.textContent = card.likes);
}

// ===== MODAL FUNCTIONS =====
function openModal(id) {
    const c = cards[id];
    if (!c) return;
    currentCardId = id;

    document.getElementById('modalImage').src = c.thumbnailUrl;
    document.getElementById('modalTitle').textContent = c.title;
    document.getElementById('modalSubtitle').textContent = c.subtitle;
    document.getElementById('modalDescription').textContent = c.description;
    document.getElementById('designDetails').textContent = c.designDetails;
    document.getElementById('materialsSpecs').textContent = c.materialsSpecs;
    document.getElementById('designInspiration').textContent = c.designInspiration;
    document.getElementById('practicalApplications').textContent = c.practicalApplications;
    document.getElementById('cardType').textContent = c.cardType;
    document.getElementById('fileFormat').textContent = c.fileFormats.join(', ');
    document.getElementById('dimensions').textContent = c.dimensions;
    document.getElementById('downloadCount').textContent = c.downloadCount.toLocaleString();
    document.getElementById('orientation').textContent = c.orientation.charAt(0).toUpperCase() + c.orientation.slice(1);
    document.getElementById('printReady').textContent = c.printReady;
    document.getElementById('modalFullImage').src = c.fullImageUrl;
    document.getElementById('modalFullImage').className = `modal-full-image ${c.orientation}`;

    document.getElementById('modalPrice').innerHTML = '<span class="price-free">FREE</span>';

    const formatBadges = document.getElementById('formatBadges');
    formatBadges.innerHTML = c.fileFormats.map(f => `<span class="format-badge">${f}</span>`).join('');

    const colorPalette = document.getElementById('colorPalette');
    colorPalette.innerHTML = c.colors.map((col, i) => `
        <div class="color" style="background-color: ${col};" title="${c.colorNames[i]}"></div>
    `).join('');

    document.getElementById('tagsContainer').innerHTML = c.tags.map(t => `<span class="tag">${t}</span>`).join('');

    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = c.features.map(f => `<li>${f}</li>`).join('');

    // Handle video tutorial section
    const videoSection = document.getElementById('videoTutorialSection');
    if (c.videoUrl) {
        videoSection.style.display = 'block';
        const videoId = extractYouTubeID(c.videoUrl);
        if (videoId) {
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
            document.getElementById('videoThumbnail').src = thumbnailUrl;
            document.getElementById('videoLink').href = c.videoUrl;
        } else {
            // fallback: just show the link as text
            document.getElementById('videoThumbnail').src = '';
            document.getElementById('videoLink').href = c.videoUrl;
            document.querySelector('.video-container p').innerHTML = `<a href="${c.videoUrl}" target="_blank">Watch tutorial on YouTube</a>`;
        }
    } else {
        videoSection.style.display = 'none';
    }

    generateRelatedDesigns(id, c.category);

    const modalLikeBtn = document.getElementById('modalLikeBtn');
    const modalLikeCount = document.getElementById('modalLikeCount');
    const isLiked = likedCards.includes(id);
    modalLikeBtn.classList.toggle('active', isLiked);
    modalLikeCount.textContent = isLiked ? c.likes + 1 : c.likes;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentCardId = null;
}

function extractYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function generateRelatedDesigns(currentId, category) {
    const container = document.getElementById('relatedDesigns');
    const related = Object.values(cards)
        .filter(c => c.id !== currentId && c.category === category)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    
    container.innerHTML = related.map(c => `
        <div class="related-item" data-id="${c.id}">
            <img src="${c.thumbnailUrl}" alt="${c.title}">
            <div class="related-overlay"><span>${c.title}</span></div>
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
function downloadTemplate(cId) {
    const c = cards[cId];
    if (!c) return;

    const slug = slugify(c.title);
    const fileName = `${slug}.zip`;
    const fileUrl = `../../assets/downloads/business-cards/${fileName}`;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    c.downloadCount += 1;
    localStorage.setItem(`download_${cId}`, Date.now());
    document.querySelectorAll(`.download-count[data-id="${cId}"]`).forEach(el => {
        el.textContent = c.downloadCount;
    });
    document.getElementById('downloadCount').textContent = c.downloadCount.toLocaleString();
}

// ===== SEARCH FUNCTIONALITY =====
function performSearch(searchTerm) {
    const searchTerms = [
        'business card', 'corporate', 'creative', 'minimal', 'modern',
        'luxury', 'vintage', 'bold', 'elegant', 'professional'
    ];
    
    if (searchTerms.some(term => searchTerm.toLowerCase().includes(term))) {
        alert(`Searching for: "${searchTerm}"\n\nThis would show relevant templates in a real implementation.`);
        searchInput.value = '';
    } else {
        alert(`No templates found for "${searchTerm}". Try searching for: business card, corporate, creative, minimal, etc.`);
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
    
    // Initial render of card grid
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
                this.innerHTML = '<i class="fas fa-plus"></i> Load More Cards';
                this.disabled = false;
                alert('More business cards would be loaded dynamically in production.');
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
        if (!currentCardId) return;
        handleLike(currentCardId);
        const c = cards[currentCardId];
        const isLiked = likedCards.includes(currentCardId);
        this.classList.toggle('active', isLiked);
        document.getElementById('modalLikeCount').textContent = isLiked ? c.likes + 1 : c.likes;
    });

    document.getElementById('modalDownloadBtn')?.addEventListener('click', function() {
        if (currentCardId) downloadTemplate(currentCardId);
    });

    document.getElementById('downloadTemplateBtn')?.addEventListener('click', function() {
        if (currentCardId) downloadTemplate(currentCardId);
    });

    document.getElementById('previewBtn')?.addEventListener('click', function() {
        if (currentCardId) window.open(cards[currentCardId].fullImageUrl, '_blank');
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
                alert(`Thank you for subscribing with ${email}! You'll receive monthly business card templates.`);
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