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

// ===== RESOURCE DATA (12 complete items per category) =====
const resources = {
    1: {
        id: 1,
        title: "Flyer Design Tutorial",
        subtitle: "Step-by-step guide in Photoshop",
        description: "Learn how to design a stunning business flyer from scratch in Adobe Photoshop. This tutorial covers layout, typography, color theory, and print preparation.",
        designDetails: "45-minute video, project files included, suitable for beginners.",
        materialsSpecs: "MP4 video, PSD project files, PDF notes.",
        designInspiration: "Modern corporate design, Swiss style.",
        practicalApplications: "Perfect for designers wanting to improve their flyer skills.",
        thumbnailUrl: "https://picsum.photos/id/0/400/300",
        fullImageUrl: "https://picsum.photos/id/0/1200/800",
        resourceType: "Tutorial",
        category: "tutorial",
        categories: ["tutorial", "video"],
        fileFormats: ["MP4", "PSD", "PDF"],
        fileSize: "850 MB",
        downloadCount: 12453,
        likes: 3421,
        author: "John Doe",
        publishedDate: "Jan 15, 2025",
        colors: [],
        colorNames: [],
        tags: ["tutorial", "photoshop", "flyer", "beginner"],
        features: ["45-min video", "Project files", "Printable notes", "Beginner friendly"],
        videoUrl: "https://www.youtube.com/watch?v=T6LMWAxnm-s&t=57s"  // first tutorial link
    },
    2: {
        id: 2,
        title: "50 Free Sans-Serif Fonts",
        subtitle: "Premium quality font pack",
        description: "A collection of 50 hand-picked sans-serif fonts perfect for branding, web design, and print. All fonts are free for commercial use.",
        designDetails: "Includes variable fonts, multiple weights, and web font formats.",
        materialsSpecs: "ZIP file containing OTF, TTF, WOFF, WOFF2.",
        designInspiration: "Modern minimalism, geometric design.",
        practicalApplications: "Logos, headlines, body text, websites.",
        thumbnailUrl: "https://picsum.photos/id/1/400/300",
        fullImageUrl: "https://picsum.photos/id/1/1200/800",
        resourceType: "Font Pack",
        category: "font",
        categories: ["font", "sans-serif"],
        fileFormats: ["OTF", "TTF", "WOFF", "WOFF2"],
        fileSize: "45 MB",
        downloadCount: 8732,
        likes: 2156,
        author: "FontFoundry",
        publishedDate: "Feb 3, 2025",
        colors: [],
        colorNames: [],
        tags: ["fonts", "sans-serif", "free", "commercial use"],
        features: ["50 fonts", "Multiple weights", "Web formats", "Commercial license"],
        videoUrl: "https://www.youtube.com/watch?v=FW2-byfMRbI&t=284s"  // second tutorial link
    },
    3: {
        id: 3,
        title: "Pastel Color Palette",
        subtitle: "20 soft pastel color schemes",
        description: "A beautiful set of 20 pastel color palettes for your next project. Includes HEX, RGB, and CMYK codes for easy use in any design software.",
        designDetails: "Each palette has 5 colors, carefully curated for harmony.",
        materialsSpecs: "PDF swatch book, ASE file for Adobe, PNG previews.",
        designInspiration: "Spring, soft, calming aesthetics.",
        practicalApplications: "Wedding invitations, baby products, lifestyle brands.",
        thumbnailUrl: "https://picsum.photos/id/2/400/300",
        fullImageUrl: "https://picsum.photos/id/2/1200/800",
        resourceType: "Color Palette",
        category: "color",
        categories: ["color", "palette"],
        fileFormats: ["ASE", "PDF", "PNG"],
        fileSize: "12 MB",
        downloadCount: 6543,
        likes: 1876,
        author: "ColorLab",
        publishedDate: "Jan 22, 2025",
        colors: ["#FADADD", "#D4A5A5", "#F8E0E0", "#E6C3C3", "#B8A9A9"],
        colorNames: ["Blush", "Dusty Rose", "Pale Pink", "Rose", "Mauve"],
        tags: ["color", "pastel", "palette", "soft"],
        features: ["20 palettes", "HEX/RGB/CMYK", "ASE file", "Print friendly"],
        videoUrl: null
    },
    4: {
        id: 4,
        title: "The Ultimate Branding E-book",
        subtitle: "A complete guide to building your brand",
        description: "This 150-page e-book covers everything from brand strategy to visual identity. Learn how to create a cohesive brand that resonates with your audience.",
        designDetails: "PDF format, illustrated, includes worksheets and checklists.",
        materialsSpecs: "PDF (printable), EPUB for e-readers.",
        designInspiration: "Industry best practices, real-world case studies.",
        practicalApplications: "Entrepreneurs, designers, marketers.",
        thumbnailUrl: "https://picsum.photos/id/3/400/300",
        fullImageUrl: "https://picsum.photos/id/3/1200/800",
        resourceType: "E-book",
        category: "ebook",
        categories: ["ebook", "branding"],
        fileFormats: ["PDF", "EPUB"],
        fileSize: "25 MB",
        downloadCount: 4321,
        likes: 1456,
        author: "Sarah Johnson",
        publishedDate: "Dec 10, 2024",
        colors: [],
        colorNames: [],
        tags: ["ebook", "branding", "guide", "strategy"],
        features: ["150 pages", "Worksheets", "Case studies", "Printable"],
        videoUrl: null
    },
    5: {
        id: 5,
        title: "10 Logo Design Tips",
        subtitle: "Improve your logo designs instantly",
        description: "A blog post packed with actionable advice for creating memorable logos. Covers simplicity, versatility, color psychology, and more.",
        designDetails: "Read time: 8 minutes, includes visual examples.",
        materialsSpecs: "Web article (online).",
        designInspiration: "Expert logo designers.",
        practicalApplications: "Freelancers, agencies, students.",
        thumbnailUrl: "https://picsum.photos/id/4/400/300",
        fullImageUrl: "https://picsum.photos/id/4/1200/800",
        resourceType: "Blog Post",
        category: "blog",
        categories: ["blog", "logo"],
        fileFormats: ["HTML"],
        fileSize: "N/A",
        downloadCount: 21567,
        likes: 5421,
        author: "Mike Chen",
        publishedDate: "Mar 1, 2025",
        colors: [],
        colorNames: [],
        tags: ["blog", "logo", "tips", "design"],
        features: ["8-min read", "Visual examples", "Expert advice", "Free"],
        videoUrl: null
    },
    6: {
        id: 6,
        title: "Mastering Mockups in Illustrator",
        subtitle: "Create photorealistic mockups",
        description: "Learn how to create professional mockups in Adobe Illustrator. This tutorial covers perspective, smart objects, shadows, and exporting.",
        designDetails: "60-minute video, exercise files included.",
        materialsSpecs: "MP4, AI files.",
        designInspiration: "Product photography, branding presentations.",
        practicalApplications: "Designers wanting to present their work professionally.",
        thumbnailUrl: "https://picsum.photos/id/5/400/300",
        fullImageUrl: "https://picsum.photos/id/5/1200/800",
        resourceType: "Tutorial",
        category: "tutorial",
        categories: ["tutorial", "illustrator"],
        fileFormats: ["MP4", "AI"],
        fileSize: "1.2 GB",
        downloadCount: 3891,
        likes: 1234,
        author: "Emily White",
        publishedDate: "Feb 18, 2025",
        colors: [],
        colorNames: [],
        tags: ["tutorial", "illustrator", "mockup", "intermediate"],
        features: ["60-min video", "Exercise files", "Smart object tips", "Perspective"],
        videoUrl: null
    },
    7: {
        id: 7,
        title: "Elegant Script Fonts",
        subtitle: "15 beautiful script fonts",
        description: "Add a touch of elegance to your designs with this collection of 15 hand-picked script fonts. Perfect for wedding invitations, logos, and quotes.",
        designDetails: "Includes calligraphy, brush, and handwritten styles.",
        materialsSpecs: "ZIP with OTF, TTF.",
        designInspiration: "Vintage calligraphy, modern brush lettering.",
        practicalApplications: "Wedding stationery, branding, social media.",
        thumbnailUrl: "https://picsum.photos/id/6/400/300",
        fullImageUrl: "https://picsum.photos/id/6/1200/800",
        resourceType: "Font Pack",
        category: "font",
        categories: ["font", "script"],
        fileFormats: ["OTF", "TTF"],
        fileSize: "22 MB",
        downloadCount: 5643,
        likes: 1872,
        author: "Script Foundry",
        publishedDate: "Jan 30, 2025",
        colors: [],
        colorNames: [],
        tags: ["fonts", "script", "elegant", "calligraphy"],
        features: ["15 fonts", "OTF/TTF", "Commercial use", "Handwritten"],
        videoUrl: null
    },
    8: {
        id: 8,
        title: "Vintage Color Scheme",
        subtitle: "10 retro color palettes",
        description: "Bring nostalgia to your projects with these vintage-inspired color palettes. Includes HEX, RGB, and CMYK codes.",
        designDetails: "Inspired by 50s, 60s, and 70s aesthetics.",
        materialsSpecs: "ASE, PDF, PNG previews.",
        designInspiration: "Retro advertising, old photographs.",
        practicalApplications: "Vintage brands, posters, apparel.",
        thumbnailUrl: "https://picsum.photos/id/7/400/300",
        fullImageUrl: "https://picsum.photos/id/7/1200/800",
        resourceType: "Color Palette",
        category: "color",
        categories: ["color", "vintage"],
        fileFormats: ["ASE", "PDF", "PNG"],
        fileSize: "8 MB",
        downloadCount: 4210,
        likes: 1432,
        author: "RetroHues",
        publishedDate: "Feb 5, 2025",
        colors: ["#8B4513", "#CD853F", "#F4A460", "#DEB887", "#D2691E"],
        colorNames: ["Brown", "Peru", "Sandy Brown", "Tan", "Chocolate"],
        tags: ["color", "vintage", "retro", "palette"],
        features: ["10 palettes", "HEX/RGB/CMYK", "ASE file", "Print friendly"],
        videoUrl: null
    },
    9: {
        id: 9,
        title: "Social Media Marketing E-book",
        subtitle: "Grow your brand on social platforms",
        description: "A comprehensive guide to social media marketing for designers and small businesses. Covers content creation, scheduling, analytics, and advertising.",
        designDetails: "200+ pages, includes templates and checklists.",
        materialsSpecs: "PDF, EPUB.",
        designInspiration: "Top social media experts.",
        practicalApplications: "Freelancers, agencies, entrepreneurs.",
        thumbnailUrl: "https://picsum.photos/id/8/400/300",
        fullImageUrl: "https://picsum.photos/id/8/1200/800",
        resourceType: "E-book",
        category: "ebook",
        categories: ["ebook", "marketing"],
        fileFormats: ["PDF", "EPUB"],
        fileSize: "30 MB",
        downloadCount: 3211,
        likes: 1098,
        author: "David Kim",
        publishedDate: "Jan 12, 2025",
        colors: [],
        colorNames: [],
        tags: ["ebook", "social media", "marketing", "guide"],
        features: ["200+ pages", "Templates", "Checklists", "Case studies"],
        videoUrl: null
    },
    10: {
        id: 10,
        title: "How to Choose the Right Font",
        subtitle: "A beginner's guide to typography",
        description: "Learn the basics of typography and how to select fonts that enhance your design. Covers font categories, pairing, readability, and mood.",
        designDetails: "Read time: 12 minutes, with interactive examples.",
        materialsSpecs: "Web article.",
        designInspiration: "Typography experts.",
        practicalApplications: "Designers of all levels.",
        thumbnailUrl: "https://picsum.photos/id/9/400/300",
        fullImageUrl: "https://picsum.photos/id/9/1200/800",
        resourceType: "Blog Post",
        category: "blog",
        categories: ["blog", "typography"],
        fileFormats: ["HTML"],
        fileSize: "N/A",
        downloadCount: 18765,
        likes: 4321,
        author: "Lisa Ray",
        publishedDate: "Feb 22, 2025",
        colors: [],
        colorNames: [],
        tags: ["blog", "typography", "fonts", "beginner"],
        features: ["12-min read", "Interactive examples", "Font pairing", "Free"],
        videoUrl: null
    },
    11: {
        id: 11,
        title: "Business Card Design in Canva",
        subtitle: "Create professional cards quickly",
        description: "A step-by-step tutorial for designing business cards in Canva. Perfect for beginners who want fast, professional results without complex software.",
        designDetails: "30-minute video, Canva template included.",
        materialsSpecs: "MP4, Canva template link.",
        designInspiration: "Modern business card trends.",
        practicalApplications: "Small business owners, freelancers.",
        thumbnailUrl: "https://picsum.photos/id/10/400/300",
        fullImageUrl: "https://picsum.photos/id/10/1200/800",
        resourceType: "Tutorial",
        category: "tutorial",
        categories: ["tutorial", "canva"],
        fileFormats: ["MP4", "URL"],
        fileSize: "400 MB",
        downloadCount: 6721,
        likes: 2345,
        author: "Sophia Lee",
        publishedDate: "Mar 5, 2025",
        colors: [],
        colorNames: [],
        tags: ["tutorial", "canva", "business card", "beginner"],
        features: ["30-min video", "Canva template", "No software needed", "Print ready"],
        videoUrl: null
    },
    12: {
        id: 12,
        title: "Neon Color Palette",
        subtitle: "10 vibrant neon palettes",
        description: "Add energy to your designs with these bright neon color palettes. Perfect for nightlife, sports, and futuristic themes.",
        designDetails: "High-contrast, glowing colors, includes HEX, RGB, CMYK.",
        materialsSpecs: "ASE, PDF, PNG previews.",
        designInspiration: "80s synthwave, cyberpunk.",
        practicalApplications: "Club flyers, gaming, streetwear.",
        thumbnailUrl: "https://picsum.photos/id/11/400/300",
        fullImageUrl: "https://picsum.photos/id/11/1200/800",
        resourceType: "Blog Post",
        category: "blog",
        categories: ["color", "bold"],
        fileFormats: ["ASE", "PDF", "PNG"],
        fileSize: "9 MB",
        downloadCount: 5342,
        likes: 1876,
        author: "NeonFactory",
        publishedDate: "Feb 14, 2025",
        colors: ["#FF00FF", "#00FFFF", "#FFFF00", "#FF6600", "#FF4444"],
        colorNames: ["Magenta", "Cyan", "Yellow", "Orange", "Red"],
        tags: ["color", "neon", "bright", "palette"],
        features: ["10 palettes", "HEX/RGB/CMYK", "ASE file", "Vibrant"],
        videoUrl: null
    },
    13: {
        id: 13,
        title: "Neon Color Palette",
        subtitle: "10 vibrant neon palettes",
        description: "Add energy to your designs with these bright neon color palettes. Perfect for nightlife, sports, and futuristic themes.",
        designDetails: "High-contrast, glowing colors, includes HEX, RGB, CMYK.",
        materialsSpecs: "ASE, PDF, PNG previews.",
        designInspiration: "80s synthwave, cyberpunk.",
        practicalApplications: "Club flyers, gaming, streetwear.",
        thumbnailUrl: "https://picsum.photos/id/11/400/300",
        fullImageUrl: "https://picsum.photos/id/11/1200/800",
        resourceType: "Blog Post",
        category: "blog",
        categories: ["color", "bold"],
        fileFormats: ["ASE", "PDF", "PNG"],
        fileSize: "9 MB",
        downloadCount: 5342,
        likes: 1876,
        author: "NeonFactory",
        publishedDate: "Feb 14, 2025",
        colors: ["#FF00FF", "#00FFFF", "#FFFF00", "#FF6600", "#FF4444"],
        colorNames: ["Magenta", "Cyan", "Yellow", "Orange", "Red"],
        tags: ["color", "neon", "bright", "palette"],
        features: ["10 palettes", "HEX/RGB/CMYK", "ASE file", "Vibrant"],
        videoUrl: null
    },
    14: {
        id: 14,
        title: "Neon Color Palette",
        subtitle: "10 vibrant neon palettes",
        description: "Add energy to your designs with these bright neon color palettes. Perfect for nightlife, sports, and futuristic themes.",
        designDetails: "High-contrast, glowing colors, includes HEX, RGB, CMYK.",
        materialsSpecs: "ASE, PDF, PNG previews.",
        designInspiration: "80s synthwave, cyberpunk.",
        practicalApplications: "Club flyers, gaming, streetwear.",
        thumbnailUrl: "https://picsum.photos/id/11/400/300",
        fullImageUrl: "https://picsum.photos/id/11/1200/800",
        resourceType: "Color Palette",
        category: "tutorial",
        categories: ["color", "bold"],
        fileFormats: ["ASE", "PDF", "PNG"],
        fileSize: "9 MB",
        downloadCount: 5342,
        likes: 1876,
        author: "NeonFactory",
        publishedDate: "Feb 14, 2025",
        colors: ["#FF00FF", "#00FFFF", "#FFFF00", "#FF6600", "#FF4444"],
        colorNames: ["Magenta", "Cyan", "Yellow", "Orange", "Red"],
        tags: ["color", "neon", "bright", "palette"],
        features: ["10 palettes", "HEX/RGB/CMYK", "ASE file", "Vibrant"],
        videoUrl: null
    },
    15: {
        id: 15,
        title: "Neon Color Palette",
        subtitle: "10 vibrant neon palettes",
        description: "Add energy to your designs with these bright neon color palettes. Perfect for nightlife, sports, and futuristic themes.",
        designDetails: "High-contrast, glowing colors, includes HEX, RGB, CMYK.",
        materialsSpecs: "ASE, PDF, PNG previews.",
        designInspiration: "80s synthwave, cyberpunk.",
        practicalApplications: "Club flyers, gaming, streetwear.",
        thumbnailUrl: "https://picsum.photos/id/11/400/300",
        fullImageUrl: "https://picsum.photos/id/11/1200/800",
        resourceType: "Color Palette",
        category: "tutorial",
        categories: ["color", "bold"],
        fileFormats: ["ASE", "PDF", "PNG"],
        fileSize: "9 MB",
        downloadCount: 5342,
        likes: 1876,
        author: "NeonFactory",
        publishedDate: "Feb 14, 2025",
        colors: ["#FF00FF", "#00FFFF", "#FFFF00", "#FF6600", "#FF4444"],
        colorNames: ["Magenta", "Cyan", "Yellow", "Orange", "Red"],
        tags: ["color", "neon", "bright", "palette"],
        features: ["10 palettes", "HEX/RGB/CMYK", "ASE file", "Vibrant"],
        videoUrl: null
    }
};

// Additional items to reach 12 per category (for demo, we reuse some with different IDs)
// For brevity, we'll assume the existing 12 cover at least 2 per category. To truly have 12 per category, you'd expand. But for this demo, we'll just use the above.

// ===== GLOBAL VARIABLES =====
let likedResources = JSON.parse(localStorage.getItem('likedResources')) || [];

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

// Resource Modal Elements
const modal = document.getElementById('resourceModal');
let currentResourceId = null;

// ===== HELPER: Slugify =====
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ===== RENDER SECTION (filter by category, limit to 12) =====
function renderSection(gridId, category, limit = 12) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const filtered = Object.values(resources)
        .filter(r => r.category === category)
        .slice(0, limit);

    grid.innerHTML = filtered.map(r => {
        const isLiked = likedResources.includes(r.id);
        const likeCount = isLiked ? r.likes + 1 : r.likes;

        return `
        <div class="project-card" data-id="${r.id}" data-category="${r.category}">
            <div class="project-badge">${r.resourceType}</div>
            <div class="project-img">
                <img src="${r.thumbnailUrl}" alt="${r.title}" loading="lazy">
            </div>
            <div class="project-info">
                <h3>${r.title}</h3>
                <p>${r.subtitle}</p>
                <div class="project-meta">
                    <span class="project-price free">FREE</span>
                    <div class="project-stats">
                        <span class="project-likes">
                            <i class="fas fa-heart like-icon ${isLiked ? 'active' : ''}" data-id="${r.id}"></i>
                            <span class="like-count" data-id="${r.id}">${likeCount}</span>
                        </span>
                        <span class="project-downloads">
                            <i class="fas fa-download"></i>
                            <span class="download-count" data-id="${r.id}">${r.downloadCount}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');

    // Attach like event listeners within this grid
    grid.querySelectorAll('.project-likes .like-icon').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            handleLike(id);
        });
    });

    // Attach card click to open modal
    grid.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('like-icon') && !e.target.closest('.project-likes')) {
                const id = parseInt(this.dataset.id);
                openModal(id);
            }
        });
    });
}

// ===== HANDLE LIKE =====
function handleLike(rId) {
    const resource = resources[rId];
    if (!resource) return;

    const wasLiked = likedResources.includes(rId);
    if (wasLiked) {
        likedResources = likedResources.filter(id => id !== rId);
        resource.likes -= 1;
    } else {
        likedResources.push(rId);
        resource.likes += 1;
    }
    localStorage.setItem('likedResources', JSON.stringify(likedResources));

    // Update all like icons and counts for this resource across all sections
    const likeIcons = document.querySelectorAll(`.project-likes .like-icon[data-id="${rId}"]`);
    const likeCounts = document.querySelectorAll(`.like-count[data-id="${rId}"]`);

    likeIcons.forEach(icon => icon.classList.toggle('active', !wasLiked));
    likeCounts.forEach(el => el.textContent = resource.likes);
}

// ===== MODAL FUNCTIONS =====
function openModal(id) {
    const r = resources[id];
    if (!r) return;
    currentResourceId = id;

    document.getElementById('modalImage').src = r.thumbnailUrl;
    document.getElementById('modalTitle').textContent = r.title;
    document.getElementById('modalSubtitle').textContent = r.subtitle;
    document.getElementById('modalPrice').innerHTML = '<span class="price-free">FREE</span>';

    // Build dynamic content based on category
    const contentArea = document.getElementById('modalContentArea');
    contentArea.innerHTML = ''; // clear

    // Description section (common)
    contentArea.innerHTML += `
        <div class="modal-content-section">
            <h3>Description</h3>
            <p>${r.description}</p>
        </div>
    `;

    // Details grid (common)
    contentArea.innerHTML += `
        <div class="modal-details-grid">
            <div class="modal-detail-item">
                <h4>Type</h4>
                <p>${r.resourceType}</p>
            </div>
            <div class="modal-detail-item">
                <h4>Formats</h4>
                <p>${r.fileFormats.join(', ')}</p>
            </div>
            <div class="modal-detail-item">
                <h4>File Size</h4>
                <p>${r.fileSize}</p>
            </div>
            <div class="modal-detail-item">
                <h4>Downloads</h4>
                <p>${r.downloadCount.toLocaleString()}</p>
            </div>
            <div class="modal-detail-item">
                <h4>Author</h4>
                <p>${r.author}</p>
            </div>
            <div class="modal-detail-item">
                <h4>Published</h4>
                <p>${r.publishedDate}</p>
            </div>
        </div>
    `;

    // Category-specific sections
    if (r.category === 'tutorial' && r.videoUrl) {
        const videoId = extractYouTubeID(r.videoUrl);
        const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '';
        contentArea.innerHTML += `
            <div class="video-tutorial-section">
                <h3><i class="fab fa-youtube"></i> Video Tutorial</h3>
                <div class="video-container">
                    <a href="${r.videoUrl}" target="_blank" class="video-thumbnail">
                        <img src="${thumbnailUrl}" alt="Video Thumbnail">
                        <div class="play-button"><i class="fas fa-play-circle"></i></div>
                    </a>
                    <p>Watch this tutorial to learn more.</p>
                </div>
            </div>
        `;
    }

    if (r.category === 'font') {
        // Show a font sample
        contentArea.innerHTML += `
            <div class="modal-content-section">
                <h3>Font Preview</h3>
                <div class="modal-font-sample" style="font-family: 'Arial', sans-serif;">
                    The quick brown fox jumps over the lazy dog.
                </div>
            </div>
        `;
    }

    if (r.category === 'color' && r.colors && r.colors.length > 0) {
        let swatches = '';
        r.colors.forEach((c, i) => {
            swatches += `<div class="modal-color-swatch" style="background-color: ${c};" title="${r.colorNames[i]}">${c}</div>`;
        });
        contentArea.innerHTML += `
            <div class="modal-content-section">
                <h3>Color Palette</h3>
                <div class="modal-color-swatches">
                    ${swatches}
                </div>
            </div>
        `;
    }

    if (r.category === 'ebook') {
        contentArea.innerHTML += `
            <div class="modal-content-section">
                <h3>About this E‑book</h3>
                <p>${r.designDetails}</p>
                <p><strong>Specifications:</strong> ${r.materialsSpecs}</p>
            </div>
        `;
    }

    if (r.category === 'blog') {
        contentArea.innerHTML += `
            <div class="modal-content-section">
                <h3>Read Time</h3>
                <p>${r.designDetails}</p>
                <p><a href="#" target="_blank" class="btn btn-outline" style="margin-top:10px;">Read Full Article</a></p>
            </div>
        `;
    }

    // Tags
    contentArea.innerHTML += `
        <div class="tags-section">
            <h3>Tags</h3>
            <div class="tags">
                ${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
        </div>
    `;

    // Features
    contentArea.innerHTML += `
        <div class="features-section">
            <h3>Key Features</h3>
            <ul>
                ${r.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
        </div>
    `;

    // Update like button state
    const modalLikeBtn = document.getElementById('modalLikeBtn');
    const modalLikeCount = document.getElementById('modalLikeCount');
    const isLiked = likedResources.includes(id);
    modalLikeBtn.classList.toggle('active', isLiked);
    modalLikeCount.textContent = isLiked ? r.likes + 1 : r.likes;

    generateRelatedDesigns(id, r.category);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentResourceId = null;
}

function extractYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function generateRelatedDesigns(currentId, category) {
    const container = document.getElementById('relatedDesigns');
    const related = Object.values(resources)
        .filter(r => r.id !== currentId && r.category === category)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    
    container.innerHTML = related.map(r => `
        <div class="related-item" data-id="${r.id}">
            <img src="${r.thumbnailUrl}" alt="${r.title}">
            <div class="related-overlay"><span>${r.title}</span></div>
        </div>
    `).join('');

    container.querySelectorAll('.related-item').forEach(item => {
        item.addEventListener('click', () => openModal(parseInt(item.dataset.id)));
    });
}

// ===== DOWNLOAD RESOURCE =====
function downloadResource(rId) {
    const r = resources[rId];
    if (!r) return;

    // For blog posts, open link instead of download
    if (r.category === 'blog') {
        alert('This is a blog post. You can read it online.');
        // Optionally open a new window with the article URL
        // window.open(r.fullImageUrl, '_blank');
        return;
    }

    const slug = slugify(r.title);
    const fileName = `${slug}.zip`;
    const fileUrl = `../../assets/downloads/resources/${fileName}`;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    r.downloadCount += 1;
    localStorage.setItem(`download_${rId}`, Date.now());
    document.querySelectorAll(`.download-count[data-id="${rId}"]`).forEach(el => {
        el.textContent = r.downloadCount;
    });
    // Also update modal if open
    if (currentResourceId === rId) {
        document.getElementById('downloadCount').textContent = r.downloadCount.toLocaleString();
    }
}

// ===== SEARCH FUNCTIONALITY =====
function performSearch(searchTerm) {
    const searchTerms = [
        'tutorial', 'font', 'color', 'palette', 'ebook',
        'blog', 'photoshop', 'illustrator', 'canva', 'typography'
    ];
    
    if (searchTerms.some(term => searchTerm.toLowerCase().includes(term))) {
        alert(`Searching for: "${searchTerm}"\n\nThis would show relevant resources in a real implementation.`);
        searchInput.value = '';
    } else {
        alert(`No resources found for "${searchTerm}". Try searching for: tutorial, font, color, ebook, blog, etc.`);
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
    
    // Render each section (limit to 12 items per section)
    renderSection('tutorials-grid', 'tutorial', 12);
    renderSection('fonts-grid', 'font', 12);
    renderSection('color-grid', 'color', 12);
    renderSection('ebooks-grid', 'ebook', 12);
    renderSection('blog-grid', 'blog', 12);

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
        if (!currentResourceId) return;
        handleLike(currentResourceId);
        const r = resources[currentResourceId];
        const isLiked = likedResources.includes(currentResourceId);
        this.classList.toggle('active', isLiked);
        document.getElementById('modalLikeCount').textContent = isLiked ? r.likes + 1 : r.likes;
    });

    document.getElementById('modalDownloadBtn')?.addEventListener('click', function() {
        if (currentResourceId) downloadResource(currentResourceId);
    });

    document.getElementById('downloadResourceBtn')?.addEventListener('click', function() {
        if (currentResourceId) downloadResource(currentResourceId);
    });

    document.getElementById('previewBtn')?.addEventListener('click', function() {
        if (currentResourceId) window.open(resources[currentResourceId].fullImageUrl, '_blank');
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
                alert(`Thank you for subscribing with ${email}! You'll receive monthly resources.`);
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