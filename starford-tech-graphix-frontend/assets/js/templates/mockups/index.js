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
    { title: "iPhone Mockup", category: "Mockups", url: "./templates/mockups/iphone-mockup.html", tags: ["iphone", "device", "mobile"] },
    { title: "MacBook Mockup", category: "Mockups", url: "./templates/mockups/macbook-mockup.html", tags: ["macbook", "laptop", "device"] },
    { title: "Business Card Mockup", category: "Mockups", url: "./templates/mockups/business-card-mockup.html", tags: ["business card", "stationery", "print"] },
    { title: "T-Shirt Mockup", category: "Mockups", url: "./templates/mockups/tshirt-mockup.html", tags: ["apparel", "t-shirt", "clothing"] },
    { title: "Packaging Mockup", category: "Mockups", url: "./templates/mockups/packaging-mockup.html", tags: ["packaging", "box", "product"] },
    { title: "Billboard Mockup", category: "Mockups", url: "./templates/mockups/billboard-mockup.html", tags: ["billboard", "signage", "outdoor"] },
    { title: "Brochure Mockup", category: "Mockups", url: "./templates/mockups/brochure-mockup.html", tags: ["brochure", "print", "flyer"] },
    { title: "Mug Mockup", category: "Mockups", url: "./templates/mockups/mug-mockup.html", tags: ["mug", "product", "promotional"] }
];

// ===== MOCKUP DATA (12 complete items) =====
const mockups = {
    1: {
        id: 1,
        title: "iPhone 14 Pro Mockup",
        subtitle: "Realistic device mockup for app presentations",
        description: "Showcase your mobile app or website on the latest iPhone 14 Pro. Includes multiple angles and customizable backgrounds.",
        designDetails: "High‑resolution PSD with smart objects, studio lighting, multiple color options.",
        materialsSpecs: "Digital use only, 300dpi for print if needed, layered PSD.",
        designInspiration: "Apple product photography, minimal studio setups.",
        practicalApplications: "App store screenshots, portfolio presentations, marketing materials.",
        thumbnailUrl: "https://picsum.photos/id/0/600/400",
        fullImageUrl: "https://picsum.photos/id/0/1200/800",
        mockupType: "Device Mockup",
        category: "device",
        categories: ["device", "product"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "4000×4000 px | Square",
        orientation: "square",
        downloadCount: 4215,
        likes: 1532,
        printReady: "No (digital only)",
        colors: ["#000000", "#F5F5F5", "#A7A7A7", "#FF3B30", "#007AFF"],
        colorNames: ["Black", "White", "Gray", "Red", "Blue"],
        tags: ["iphone", "device", "mobile", "app"],
        features: ["Smart object layers", "6 color variants", "Isolated shadows", "High resolution"],
        videoUrl: "https://www.youtube.com/watch?v=T6LMWAxnm-s&t=57s"  // first tutorial link
    },
    2: {
        id: 2,
        title: "MacBook Pro Mockup",
        subtitle: "Clean laptop mockup for web design",
        description: "Present your website or software on a sleek MacBook Pro. Includes front and angled views with customizable screen content.",
        designDetails: "Realistic perspective, soft shadows, reflection effects, easy‑edit screen layer.",
        materialsSpecs: "PSD with smart objects, 300dpi, CMYK/ RGB.",
        designInspiration: "Minimal tech setups, workspace photography.",
        practicalApplications: "Web design portfolios, software demos, UI/UX presentations.",
        thumbnailUrl: "https://picsum.photos/id/1/600/400",
        fullImageUrl: "https://picsum.photos/id/1/1200/800",
        mockupType: "Device Mockup",
        category: "device",
        categories: ["device", "product"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "5000×3500 px | Landscape",
        orientation: "landscape",
        downloadCount: 3872,
        likes: 1298,
        printReady: "Yes (if needed)",
        colors: ["#C0C0C0", "#000000", "#F5F5F5", "#D4D4D4"],
        colorNames: ["Silver", "Space Gray", "White", "Light Gray"],
        tags: ["macbook", "laptop", "device", "web design"],
        features: ["2 angles", "Smart objects", "Adjustable background", "High resolution"],
        videoUrl: "https://www.youtube.com/watch?v=FW2-byfMRbI&t=284s"  // second tutorial link
    },
    3: {
        id: 3,
        title: "Business Card Mockup",
        subtitle: "Elegant stationery mockup for branding",
        description: "Display your business card design in a professional, photorealistic setting. Includes front/back views and multiple arrangement options.",
        designDetails: "Detailed shadows, depth of field, texture overlay, customizable card color.",
        materialsSpecs: "PSD with smart objects, 300dpi, CMYK.",
        designInspiration: "Luxury stationery, minimalist branding.",
        practicalApplications: "Brand identity presentations, client proposals.",
        thumbnailUrl: "https://picsum.photos/id/2/600/400",
        fullImageUrl: "https://picsum.photos/id/2/1200/800",
        mockupType: "Stationery Mockup",
        category: "stationery",
        categories: ["stationery", "branding"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "4000×3000 px | Landscape",
        orientation: "landscape",
        downloadCount: 2945,
        likes: 876,
        printReady: "Yes",
        colors: ["#F2F2F2", "#2C3E50", "#E67E22", "#ECF0F1"],
        colorNames: ["Off White", "Dark Blue", "Orange", "Clouds"],
        tags: ["business card", "stationery", "branding"],
        features: ["Front/back layers", "Shadow effects", "Easy edit", "Print ready"],
        videoUrl: null
    },
    4: {
        id: 4,
        title: "T‑Shirt Mockup",
        subtitle: "Apparel mockup for clothing designs",
        description: "Showcase your t‑shirt designs on a realistic model or flat lay. Multiple styles and colors included.",
        designDetails: "Multiple angles (front/back), fabric texture, fold shadows, adjustable design color.",
        materialsSpecs: "PSD with smart objects, 300dpi, CMYK.",
        designInspiration: "Streetwear branding, apparel photography.",
        practicalApplications: "Clothing lines, merchandise, sportswear.",
        thumbnailUrl: "https://picsum.photos/id/3/600/400",
        fullImageUrl: "https://picsum.photos/id/3/1200/800",
        mockupType: "Apparel Mockup",
        category: "apparel",
        categories: ["apparel", "product"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "3000×4000 px | Portrait",
        orientation: "portrait",
        downloadCount: 1863,
        likes: 634,
        printReady: "Yes",
        colors: ["#000000", "#FFFFFF", "#FF0000", "#0000FF", "#FFFF00"],
        colorNames: ["Black", "White", "Red", "Blue", "Yellow"],
        tags: ["t-shirt", "apparel", "clothing"],
        features: ["Front/back views", "Multiple colors", "Smart objects", "High resolution"],
        videoUrl: null
    },
    5: {
        id: 5,
        title: "Cosmetic Packaging Mockup",
        subtitle: "Luxury box mockup for beauty products",
        description: "Present your cosmetic or perfume packaging in a premium setting. Includes box, bottle, and tube variations.",
        designDetails: "Elegant lighting, reflection effects, die‑cut layers, gold foil simulation.",
        materialsSpecs: "PSD with smart objects, 300dpi, CMYK.",
        designInspiration: "High‑end beauty branding, luxury packaging.",
        practicalApplications: "Cosmetics, skincare, fragrance lines.",
        thumbnailUrl: "https://picsum.photos/id/4/600/400",
        fullImageUrl: "https://picsum.photos/id/4/1200/800",
        mockupType: "Packaging Mockup",
        category: "packaging",
        categories: ["packaging", "product"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "4000×4000 px | Square",
        orientation: "square",
        downloadCount: 2156,
        likes: 798,
        printReady: "Yes",
        colors: ["#FADADD", "#D4AF37", "#F8F0E3", "#C0C0C0", "#800020"],
        colorNames: ["Blush", "Gold", "Ivory", "Silver", "Burgundy"],
        tags: ["packaging", "cosmetics", "box", "luxury"],
        features: ["Multiple shapes", "Foil effects", "Smart objects", "Print ready"],
        videoUrl: null
    },
    6: {
        id: 6,
        title: "Billboard Mockup",
        subtitle: "Outdoor advertising mockup",
        description: "Visualize your campaign on a large‑scale billboard. Includes urban and highway environments.",
        designDetails: "Realistic perspective, environmental lighting, people and cars included (optional).",
        materialsSpecs: "PSD with smart objects, 150dpi (outdoor scale).",
        designInspiration: "Outdoor advertising, cityscapes.",
        practicalApplications: "Advertising agencies, brand campaigns.",
        thumbnailUrl: "https://picsum.photos/id/5/600/400",
        fullImageUrl: "https://picsum.photos/id/5/1200/800",
        mockupType: "Signage Mockup",
        category: "signage",
        categories: ["signage", "product"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "6000×4000 px | Landscape",
        orientation: "landscape",
        downloadCount: 1432,
        likes: 501,
        printReady: "No (for preview only)",
        colors: ["#2C3E50", "#ECF0F1", "#BDC3C7", "#3498DB"],
        colorNames: ["Dark Blue", "Clouds", "Silver", "Peter River"],
        tags: ["billboard", "outdoor", "signage", "advertising"],
        features: ["2 scenes", "Smart objects", "Realistic shadows", "High resolution"],
        videoUrl: null
    },
    7: {
        id: 7,
        title: "Brochure Mockup",
        subtitle: "Tri‑fold brochure mockup",
        description: "Display your brochure design in a professional, photorealistic setting. Includes front, back, and inside views.",
        designDetails: "Realistic paper texture, fold shadows, multiple angles, editable panels.",
        materialsSpecs: "PSD with smart objects, 300dpi, CMYK.",
        designInspiration: "Corporate brochures, travel leaflets.",
        practicalApplications: "Marketing materials, product catalogs.",
        thumbnailUrl: "https://picsum.photos/id/6/600/400",
        fullImageUrl: "https://picsum.photos/id/6/1200/800",
        mockupType: "Print Mockup",
        category: "print",
        categories: ["print", "stationery"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "4000×3000 px | Landscape",
        orientation: "landscape",
        downloadCount: 1789,
        likes: 612,
        printReady: "Yes",
        colors: ["#FFFFFF", "#F2F2F2", "#CCCCCC", "#333333"],
        colorNames: ["White", "Off White", "Gray", "Dark Gray"],
        tags: ["brochure", "print", "flyer", "leaflet"],
        features: ["Tri‑fold", "Inside/outside", "Smart objects", "Print ready"],
        videoUrl: null
    },
    8: {
        id: 8,
        title: "Mug Mockup",
        subtitle: "Ceramic mug mockup",
        description: "Present your custom mug designs in a cozy setting. Includes front and back views, multiple mug colors.",
        designDetails: "Ceramic texture, reflection highlights, steam effect (optional), shadow.",
        materialsSpecs: "PSD with smart objects, 300dpi, CMYK.",
        designInspiration: "Coffee shop branding, promotional merchandise.",
        practicalApplications: "Promotional products, gifts, cafe merchandise.",
        thumbnailUrl: "https://picsum.photos/id/7/600/400",
        fullImageUrl: "https://picsum.photos/id/7/1200/800",
        mockupType: "Product Mockup",
        category: "product",
        categories: ["product", "promotional"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "3000×3000 px | Square",
        orientation: "square",
        downloadCount: 2034,
        likes: 723,
        printReady: "Yes",
        colors: ["#FFFFFF", "#000000", "#C0C0C0", "#F5DEB3"],
        colorNames: ["White", "Black", "Gray", "Wheat"],
        tags: ["mug", "product", "promotional"],
        features: ["2 views", "Smart objects", "Adjustable colors", "High resolution"],
        videoUrl: null
    },
    9: {
        id: 9,
        title: "Poster Mockup",
        subtitle: "Frame poster mockup for wall displays",
        description: "Showcase your poster or art print in a beautiful frame. Multiple frame colors and wall backgrounds included.",
        designDetails: "Realistic frame textures, wall shadows, glass reflection effects, easy art swap.",
        materialsSpecs: "PSD with smart objects, 300dpi, CMYK.",
        designInspiration: "Art galleries, interior design.",
        practicalApplications: "Art prints, movie posters, advertising posters.",
        thumbnailUrl: "https://picsum.photos/id/8/600/400",
        fullImageUrl: "https://picsum.photos/id/8/1200/800",
        mockupType: "Print Mockup",
        category: "print",
        categories: ["print", "signage"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "4000×5000 px | Portrait",
        orientation: "portrait",
        downloadCount: 1678,
        likes: 589,
        printReady: "Yes",
        colors: ["#8B4513", "#D2B48C", "#C0C0C0", "#000000"],
        colorNames: ["Brown", "Tan", "Silver", "Black"],
        tags: ["poster", "frame", "art", "print"],
        features: ["Multiple frames", "Wall backgrounds", "Smart objects", "High resolution"],
        videoUrl: null
    },
    10: {
        id: 10,
        title: "iPad Pro Mockup",
        subtitle: "Tablet mockup for app and ebook presentations",
        description: "Present your app, ebook, or magazine on the iPad Pro. Includes front and side angles, pencil optional.",
        designDetails: "Realistic display, ambient lighting, shadow, smart object layers.",
        materialsSpecs: "PSD with smart objects, 300dpi.",
        designInspiration: "Apple product shots, digital publishing.",
        practicalApplications: "App demos, ebook covers, digital magazines.",
        thumbnailUrl: "https://picsum.photos/id/9/600/400",
        fullImageUrl: "https://picsum.photos/id/9/1200/800",
        mockupType: "Device Mockup",
        category: "device",
        categories: ["device", "product"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "4000×4000 px | Square",
        orientation: "square",
        downloadCount: 2245,
        likes: 812,
        printReady: "No (digital use)",
        colors: ["#C0C0C0", "#000000", "#F5F5F5"],
        colorNames: ["Silver", "Space Gray", "White"],
        tags: ["ipad", "tablet", "device", "app"],
        features: ["2 angles", "Smart objects", "Reflection effect", "High resolution"],
        videoUrl: null
    },
    11: {
        id: 11,
        title: "Logo Branding Mockup",
        subtitle: "Set of branding mockups for logos",
        description: "Present your logo on multiple items: business card, letterhead, pen, and envelope. Perfect for brand identity presentations.",
        designDetails: "Coordinated set, consistent lighting, smart objects for each item.",
        materialsSpecs: "PSD with smart objects, 300dpi, CMYK.",
        designInspiration: "Corporate identity design, stationery sets.",
        practicalApplications: "Logo presentations, brand guidelines.",
        thumbnailUrl: "https://picsum.photos/id/10/600/400",
        fullImageUrl: "https://picsum.photos/id/10/1200/800",
        mockupType: "Branding Mockup",
        category: "branding",
        categories: ["branding", "stationery"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "5000×4000 px | Landscape",
        orientation: "landscape",
        downloadCount: 3123,
        likes: 1104,
        printReady: "Yes",
        colors: ["#2C3E50", "#ECF0F1", "#BDC3C7", "#3498DB"],
        colorNames: ["Dark Blue", "Clouds", "Silver", "Blue"],
        tags: ["branding", "logo", "stationery", "identity"],
        features: ["5 items", "Smart objects", "Consistent lighting", "Print ready"],
        videoUrl: null
    },
    12: {
        id: 12,
        title: "Book Cover Mockup",
        subtitle: "Hardcover book mockup",
        description: "Display your book cover design in a realistic 3D setting. Includes front, spine, and back views.",
        designDetails: "Realistic hardcover texture, embossing effect, page details, shadow.",
        materialsSpecs: "PSD with smart objects, 300dpi, CMYK.",
        designInspiration: "Bookstore displays, publishing industry.",
        practicalApplications: "Book covers, eBooks, author portfolios.",
        thumbnailUrl: "https://picsum.photos/id/11/600/400",
        fullImageUrl: "https://picsum.photos/id/11/1200/800",
        mockupType: "Product Mockup",
        category: "product",
        categories: ["product", "print"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "4000×4000 px | Square",
        orientation: "square",
        downloadCount: 1976,
        likes: 678,
        printReady: "Yes",
        colors: ["#8B4513", "#D2691E", "#A0522D", "#DEB887"],
        colorNames: ["Brown", "Chocolate", "Sienna", "Tan"],
        tags: ["book", "cover", "hardcover", "publishing"],
        features: ["Front/spine/back", "Emboss effect", "Smart objects", "High resolution"],
        videoUrl: null
    }
};

// ===== GLOBAL VARIABLES =====
let likedMockups = JSON.parse(localStorage.getItem('likedMockups')) || [];

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

// Mockup Modal Elements
const modal = document.getElementById('mockupModal');
let currentMockupId = null;

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

    let filtered = Object.values(mockups).filter(mck => {
        if (filterCategory !== 'all' && !mck.categories.includes(filterCategory)) return false;
        if (filterOrientation !== 'all' && mck.orientation !== filterOrientation) return false;
        return true;
    });

    // Sorting
    if (sortBy === 'popular') filtered.sort((a,b) => b.likes - a.likes);
    else if (sortBy === 'downloads') filtered.sort((a,b) => b.downloadCount - a.downloadCount);
    else if (sortBy === 'az') filtered.sort((a,b) => a.title.localeCompare(b.title));
    else if (sortBy === 'za') filtered.sort((a,b) => b.title.localeCompare(a.title));
    else filtered.sort((a,b) => b.id - a.id); // newest

    grid.innerHTML = filtered.map(mck => {
        const isLiked = likedMockups.includes(mck.id);
        const likeCount = isLiked ? mck.likes + 1 : mck.likes;
        const badgeText = mck.categories[0].charAt(0).toUpperCase() + mck.categories[0].slice(1);

        return `
        <div class="project-card" data-id="${mck.id}" data-category="${mck.categories.join(' ')}" data-orientation="${mck.orientation}">
            <div class="project-badge">${badgeText}</div>
            <div class="project-img">
                <img src="${mck.thumbnailUrl}" alt="${mck.title}" loading="lazy">
            </div>
            <div class="project-info">
                <h3>${mck.title}</h3>
                <p>${mck.subtitle}</p>
                <div class="project-meta">
                    <span class="project-price free">FREE</span>
                    <div class="project-stats">
                        <span class="project-likes">
                            <i class="fas fa-heart like-icon ${isLiked ? 'active' : ''}" data-id="${mck.id}"></i>
                            <span class="like-count" data-id="${mck.id}">${likeCount}</span>
                        </span>
                        <span class="project-downloads">
                            <i class="fas fa-download"></i>
                            <span class="download-count" data-id="${mck.id}">${mck.downloadCount}</span>
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
function handleLike(mckId) {
    const mockup = mockups[mckId];
    if (!mockup) return;

    const wasLiked = likedMockups.includes(mckId);
    if (wasLiked) {
        likedMockups = likedMockups.filter(id => id !== mckId);
        mockup.likes -= 1;
    } else {
        likedMockups.push(mckId);
        mockup.likes += 1;
    }
    localStorage.setItem('likedMockups', JSON.stringify(likedMockups));

    // Update UI
    const likeIcons = document.querySelectorAll(`.project-likes .like-icon[data-id="${mckId}"]`);
    const likeCounts = document.querySelectorAll(`.like-count[data-id="${mckId}"]`);

    likeIcons.forEach(icon => icon.classList.toggle('active', !wasLiked));
    likeCounts.forEach(el => el.textContent = mockup.likes);
}

// ===== MODAL FUNCTIONS =====
function openModal(id) {
    const mck = mockups[id];
    if (!mck) return;
    currentMockupId = id;

    document.getElementById('modalImage').src = mck.thumbnailUrl;
    document.getElementById('modalTitle').textContent = mck.title;
    document.getElementById('modalSubtitle').textContent = mck.subtitle;
    document.getElementById('modalDescription').textContent = mck.description;
    document.getElementById('designDetails').textContent = mck.designDetails;
    document.getElementById('materialsSpecs').textContent = mck.materialsSpecs;
    document.getElementById('designInspiration').textContent = mck.designInspiration;
    document.getElementById('practicalApplications').textContent = mck.practicalApplications;
    document.getElementById('mockupType').textContent = mck.mockupType;
    document.getElementById('fileFormat').textContent = mck.fileFormats.join(', ');
    document.getElementById('dimensions').textContent = mck.dimensions;
    document.getElementById('downloadCount').textContent = mck.downloadCount.toLocaleString();
    document.getElementById('orientation').textContent = mck.orientation.charAt(0).toUpperCase() + mck.orientation.slice(1);
    document.getElementById('printReady').textContent = mck.printReady;
    document.getElementById('modalFullImage').src = mck.fullImageUrl;
    document.getElementById('modalFullImage').className = `modal-full-image ${mck.orientation}`;

    document.getElementById('modalPrice').innerHTML = '<span class="price-free">FREE</span>';

    const formatBadges = document.getElementById('formatBadges');
    formatBadges.innerHTML = mck.fileFormats.map(f => `<span class="format-badge">${f}</span>`).join('');

    const colorPalette = document.getElementById('colorPalette');
    colorPalette.innerHTML = mck.colors.map((c, i) => `
        <div class="color" style="background-color: ${c};" title="${mck.colorNames[i]}"></div>
    `).join('');

    document.getElementById('tagsContainer').innerHTML = mck.tags.map(t => `<span class="tag">${t}</span>`).join('');

    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = mck.features.map(f => `<li>${f}</li>`).join('');

    // Handle video tutorial section
    const videoSection = document.getElementById('videoTutorialSection');
    if (mck.videoUrl) {
        videoSection.style.display = 'block';
        const videoId = extractYouTubeID(mck.videoUrl);
        if (videoId) {
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
            document.getElementById('videoThumbnail').src = thumbnailUrl;
            document.getElementById('videoLink').href = mck.videoUrl;
        } else {
            // fallback: just show the link as text
            document.getElementById('videoThumbnail').src = '';
            document.getElementById('videoLink').href = mck.videoUrl;
            document.querySelector('.video-container p').innerHTML = `<a href="${mck.videoUrl}" target="_blank">Watch tutorial on YouTube</a>`;
        }
    } else {
        videoSection.style.display = 'none';
    }

    generateRelatedDesigns(id, mck.category);

    const modalLikeBtn = document.getElementById('modalLikeBtn');
    const modalLikeCount = document.getElementById('modalLikeCount');
    const isLiked = likedMockups.includes(id);
    modalLikeBtn.classList.toggle('active', isLiked);
    modalLikeCount.textContent = isLiked ? mck.likes + 1 : mck.likes;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentMockupId = null;
}

function extractYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function generateRelatedDesigns(currentId, category) {
    const container = document.getElementById('relatedDesigns');
    const related = Object.values(mockups)
        .filter(m => m.id !== currentId && m.category === category)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    
    container.innerHTML = related.map(m => `
        <div class="related-item" data-id="${m.id}">
            <img src="${m.thumbnailUrl}" alt="${m.title}">
            <div class="related-overlay"><span>${m.title}</span></div>
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
function downloadTemplate(mckId) {
    const mck = mockups[mckId];
    if (!mck) return;

    const slug = slugify(mck.title);
    const fileName = `${slug}.zip`;
    const fileUrl = `../../assets/downloads/mockups/${fileName}`;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mck.downloadCount += 1;
    localStorage.setItem(`download_${mckId}`, Date.now());
    document.querySelectorAll(`.download-count[data-id="${mckId}"]`).forEach(el => {
        el.textContent = mck.downloadCount;
    });
    document.getElementById('downloadCount').textContent = mck.downloadCount.toLocaleString();
}

// ===== SEARCH FUNCTIONALITY =====
function performSearch(searchTerm) {
    const searchTerms = [
        'mockup', 'device', 'iphone', 'macbook', 'business card', 't-shirt',
        'packaging', 'billboard', 'brochure', 'poster', 'branding', 'logo'
    ];
    
    if (searchTerms.some(term => searchTerm.toLowerCase().includes(term))) {
        alert(`Searching for: "${searchTerm}"\n\nThis would show relevant templates in a real implementation.`);
        searchInput.value = '';
    } else {
        alert(`No templates found for "${searchTerm}". Try searching for: mockup, device, iphone, macbook, etc.`);
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
    
    // Initial render of mockup grid
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
                this.innerHTML = '<i class="fas fa-plus"></i> Load More Mockups';
                this.disabled = false;
                alert('More mockups would be loaded dynamically in production.');
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
        if (!currentMockupId) return;
        handleLike(currentMockupId);
        const mck = mockups[currentMockupId];
        const isLiked = likedMockups.includes(currentMockupId);
        this.classList.toggle('active', isLiked);
        document.getElementById('modalLikeCount').textContent = isLiked ? mck.likes + 1 : mck.likes;
    });

    document.getElementById('modalDownloadBtn')?.addEventListener('click', function() {
        if (currentMockupId) downloadTemplate(currentMockupId);
    });

    document.getElementById('downloadTemplateBtn')?.addEventListener('click', function() {
        if (currentMockupId) downloadTemplate(currentMockupId);
    });

    document.getElementById('previewBtn')?.addEventListener('click', function() {
        if (currentMockupId) window.open(mockups[currentMockupId].fullImageUrl, '_blank');
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
                alert(`Thank you for subscribing with ${email}! You'll receive monthly mockup templates.`);
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