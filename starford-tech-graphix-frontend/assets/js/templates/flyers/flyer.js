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
        if (!this.canvas) return;
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
            this.ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
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
        if (this.animationId) cancelAnimationFrame(this.animationId);
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

// ===== GLOBAL FLYERS DATA =====
let flyersData = {};

// ===== HELPER FUNCTIONS =====
function slugify(text) {
    return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ===== RENDER GRID (using backend data) =====
function renderProjectsGrid(filterCategory = 'all', filterOrientation = 'all', sortBy = 'newest') {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    let filtered = Object.values(flyersData).filter(flr => {
        // Use flr.category (string) for filtering
        if (filterCategory !== 'all' && flr.category !== filterCategory) return false;
        if (filterOrientation !== 'all' && flr.orientation !== filterOrientation) return false;
        return true;
    });

    // Sorting
    if (sortBy === 'popular') filtered.sort((a,b) => b.likes_count - a.likes_count);
    else if (sortBy === 'downloads') filtered.sort((a,b) => b.downloads_count - a.downloads_count);
    else if (sortBy === 'az') filtered.sort((a,b) => a.title.localeCompare(b.title));
    else if (sortBy === 'za') filtered.sort((a,b) => b.title.localeCompare(a.title));
    else filtered.sort((a,b) => b.id - a.id); // newest

    grid.innerHTML = filtered.map(flr => {
        const isLiked = likedTemplates.has(flr.id);
        // Use flr.category for badge, capitalize first letter
        const badgeText = flr.category ? flr.category.charAt(0).toUpperCase() + flr.category.slice(1) : 'Flyer';

        return `
        <div class="project-card" data-id="${flr.id}" data-category="${flr.category}" data-orientation="${flr.orientation}">
            <div class="project-badge">${badgeText}</div>
            <div class="project-img">
                <img src="${flr.image_url}" alt="${flr.title}" loading="lazy">
            </div>
            <div class="project-info">
                <h3>${flr.title}</h3>
                <p>${flr.subtitle}</p>
                <div class="project-meta">
                    <span class="project-price free">FREE</span>
                    <div class="project-stats">
                        <span class="project-likes">
                            <i class="fas fa-heart like-icon ${isLiked ? 'active' : ''}" data-id="${flr.id}"></i>
                            <span class="like-count" data-id="${flr.id}">${flr.likes_count}</span>
                        </span>
                        <span class="project-downloads">
                            <i class="fas fa-download"></i>
                            <span class="download-count" data-id="${flr.id}">${flr.downloads_count}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');

    // No need to attach like listeners – handled by main.js global click
}

// ===== LOAD FLYERS FROM API =====
async function loadFlyersFromAPI() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/templates?category=flyers&limit=100`);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
            const obj = {};
            data.data.forEach(t => obj[t.id] = t);
            flyersData = obj;
        } else {
            console.warn('No flyers from API, using fallback data');
            flyersData = fallbackFlyers;
        }
    } catch (err) {
        console.error('Failed to load flyers from API:', err);
        flyersData = fallbackFlyers;
    }
    renderProjectsGrid();
}

// ===== FALLBACK DATA (your 12 flyers, but transformed to match backend structure) =====
const fallbackFlyers = {
    1: {
        id: 1,
        title: "Modern Business Flyer",
        subtitle: "Clean corporate design for professional use",
        description: "A sleek, professional flyer template perfect for corporate announcements, product launches, and B2B marketing. Features a modular grid and ample space for your content.",
        category: "business",
        subcategory: "Business Flyer",
        image_url: "https://picsum.photos/id/1/600/400",
        full_image_url: "https://picsum.photos/id/1/1200/800",
        download_url: "../../assets/downloads/flyers/modern-business-flyer.zip",
        file_formats: ["PDF","PSD","AI","PNG","JPG"],
        dimensions: "A4 (8.27×11.69 in) | 2480×3508 px",
        software: ["Adobe Illustrator","Adobe Photoshop"],
        print_ready: "Yes",
        color_mode: "CMYK",
        file_size: "45 MB",
        orientation: "portrait",
        paper_size: "A4, US Letter",
        tags: ["business","corporate","professional","minimal"],
        design_details: "Grid-based layout with ample whitespace, modern sans-serif typography, subtle geometric accents.",
        materials_specs: "Print-ready with bleed marks, CMYK, 150gsm matte paper recommended.",
        design_inspiration: "Swiss design, minimalist corporate branding.",
        practical_applications: "Corporate events, business announcements, product launches.",
        features: ["Fully editable","Print-ready","Includes guidelines","Free fonts used"],
        colors: ["#2C3E50","#3498DB","#ECF0F1","#95A5A6","#27AE60"],
        likes_count: 942,
        downloads_count: 3245,
        favorites_count: 0,
        shares_count: 0,
        bookmarks_count: 0
    },
    2: {
        id: 2,
        title: "Colorful Event Flyer",
        subtitle: "Vibrant design for parties and gatherings",
        description: "Eye‑catching flyer template for any kind of event – from birthday parties to music festivals. Bold colors, playful typography, and plenty of space for your details.",
        category: "event",
        subcategory: "Event Flyer",
        image_url: "https://picsum.photos/id/26/600/400",
        full_image_url: "https://picsum.photos/id/26/1200/800",
        download_url: "../../assets/downloads/flyers/colorful-event-flyer.zip",
        file_formats: ["PDF","PSD","AI","PNG","JPG"],
        dimensions: "A5 (5.83×8.27 in) | 1748×2480 px",
        software: ["Adobe Illustrator","Adobe Photoshop"],
        print_ready: "Yes",
        color_mode: "CMYK",
        file_size: "38 MB",
        orientation: "portrait",
        paper_size: "A5, Half Letter",
        tags: ["event","party","colorful","festival"],
        design_details: "Vibrant gradients, bold display fonts, asymmetrical layout, photo‑ready areas.",
        materials_specs: "Digital and print, 130gsm glossy paper recommended.",
        design_inspiration: "Street art, festival posters, Memphis design.",
        practical_applications: "Concerts, club nights, birthday parties, community events.",
        features: ["Fully editable","Print-ready","Social media sizes included","Spot colors"],
        colors: ["#F9C74F","#F9844A","#F94144","#577590","#43AA8B"],
        likes_count: 1532,
        downloads_count: 4281,
        favorites_count: 0,
        shares_count: 0,
        bookmarks_count: 0
    },
    3: {
        id: 3,
        title: "Flash Sale Flyer",
        subtitle: "Urgent design for promotions and discounts",
        description: "Create urgency and drive sales with this bold sale flyer template. Large price tags, countdown timers, and attention‑grabbing typography.",
        category: "sale",
        subcategory: "Sale Flyer",
        image_url: "https://picsum.photos/id/24/600/400",
        full_image_url: "https://picsum.photos/id/24/1200/800",
        download_url: "../../assets/downloads/flyers/flash-sale-flyer.zip",
        file_formats: ["PDF","PSD","AI","PNG","JPG"],
        dimensions: "A4 (8.27×11.69 in) | 2480×3508 px",
        software: ["Adobe Illustrator","Adobe Photoshop"],
        print_ready: "Yes",
        color_mode: "CMYK",
        file_size: "42 MB",
        orientation: "portrait",
        paper_size: "A4, US Letter",
        tags: ["sale","discount","promotion","retail"],
        design_details: "High‑contrast colors, large price display, countdown element, bullet points for offers.",
        materials_specs: "Print‑ready PDF with crop marks, CMYK, 100gsm coated paper.",
        design_inspiration: "Retail advertising, Black Friday campaigns.",
        practical_applications: "Retail sales, online promotions, clearance events.",
        features: ["Editable text","Change colors","Countdown element","Print‑ready"],
        colors: ["#E63946","#F1FA8C","#A8DADC","#457B9D","#1D3557"],
        likes_count: 887,
        downloads_count: 2765,
        favorites_count: 0,
        shares_count: 0,
        bookmarks_count: 0
    },
    4: {
        id: 4,
        title: "Real Estate Open House Flyer",
        subtitle: "Professional flyer for property listings",
        description: "Showcase your property with this elegant real estate flyer. Features a large photo area, key selling points, and agent contact details.",
        category: "real-estate",
        subcategory: "Real Estate Flyer",
        image_url: "https://picsum.photos/id/106/600/400",
        full_image_url: "https://picsum.photos/id/106/1200/800",
        download_url: "../../assets/downloads/flyers/real-estate-open-house.zip",
        file_formats: ["PDF","PSD","AI","PNG","JPG"],
        dimensions: "A5 (5.83×8.27 in) | 1748×2480 px",
        software: ["Adobe Illustrator","Adobe Photoshop"],
        print_ready: "Yes",
        color_mode: "CMYK",
        file_size: "36 MB",
        orientation: "portrait",
        paper_size: "A5, Half Letter",
        tags: ["real estate","property","open house","agent"],
        design_details: "Sophisticated serif + sans‑serif pairing, subtle texture, price and features prominently displayed.",
        materials_specs: "Print‑ready, CMYK, 150gsm matte paper recommended.",
        design_inspiration: "Luxury real estate brochures, architectural photography.",
        practical_applications: "Open houses, property listings, agent marketing.",
        features: ["Photo placeholder","Key features list","Agent info","Print‑ready"],
        colors: ["#2C3E50","#BDC3C7","#ECF0F1","#7F8C8D","#3498DB"],
        likes_count: 614,
        downloads_count: 1982,
        favorites_count: 0,
        shares_count: 0,
        bookmarks_count: 0
    },
    5: {
        id: 5,
        title: "Music Festival Flyer",
        subtitle: "Edgy design for concerts and festivals",
        description: "Capture the energy of your music event with this bold, grunge‑inspired flyer. Perfect for rock, electronic, or indie festivals.",
        category: "music",
        subcategory: "Music Flyer",
        image_url: "https://picsum.photos/id/15/600/400",
        full_image_url: "https://picsum.photos/id/15/1200/800",
        download_url: "../../assets/downloads/flyers/music-festival-flyer.zip",
        file_formats: ["PDF","PSD","AI","PNG","JPG"],
        dimensions: "A4 (8.27×11.69 in) | 2480×3508 px",
        software: ["Adobe Illustrator","Adobe Photoshop"],
        print_ready: "Yes",
        color_mode: "CMYK",
        file_size: "50 MB",
        orientation: "portrait",
        paper_size: "A4, US Letter",
        tags: ["music","festival","concert","band"],
        design_details: "Distressed textures, overlapping elements, bold headline, line‑up grid.",
        materials_specs: "Print‑ready PDF, CMYK, 120gsm uncoated paper for a natural feel.",
        design_inspiration: "Rock posters, street art, vinyl cover art.",
        practical_applications: "Music festivals, club nights, concert promotions.",
        features: ["Line‑up grid","Editable text","Photo ready","Print‑ready"],
        colors: ["#000000","#E63946","#F1FA8C","#A8DADC","#457B9D"],
        likes_count: 1275,
        downloads_count: 3310,
        favorites_count: 0,
        shares_count: 0,
        bookmarks_count: 0
    },
    6: {
        id: 6,
        title: "Corporate Seminar Flyer",
        subtitle: "Elegant design for professional events",
        description: "Promote your seminar, workshop, or conference with this refined, grid‑based flyer. Clean lines and a professional color scheme.",
        category: "corporate",
        subcategory: "Corporate Flyer",
        image_url: "https://picsum.photos/id/20/600/400",
        full_image_url: "https://picsum.photos/id/20/1200/800",
        download_url: "../../assets/downloads/flyers/corporate-seminar-flyer.zip",
        file_formats: ["PDF","PSD","AI","PNG","JPG"],
        dimensions: "A5 (5.83×8.27 in) | 1748×2480 px",
        software: ["Adobe Illustrator","Adobe Photoshop"],
        print_ready: "Yes",
        color_mode: "CMYK",
        file_size: "32 MB",
        orientation: "portrait",
        paper_size: "A5, Half Letter",
        tags: ["corporate","seminar","workshop","professional"],
        design_details: "Grid layout, subtle gradient background, icon set included.",
        materials_specs: "Print‑ready PDF with bleed, CMYK, 150gsm silk paper.",
        design_inspiration: "Corporate identity, minimalist posters.",
        practical_applications: "Seminars, workshops, conferences, networking events.",
        features: ["Agenda area","Speaker bios","Sponsor logos","Print‑ready"],
        colors: ["#1E3D58","#43B0F1","#E8EEF1","#057DCD","#F4F4F4"],
        likes_count: 512,
        downloads_count: 1547,
        favorites_count: 0,
        shares_count: 0,
        bookmarks_count: 0
    },
    7: {
        id: 7,
        title: "Restaurant Promotion Flyer",
        subtitle: "Appetizing design for food & drink offers",
        description: "Make your customers hungry with this delicious‑looking flyer template. Perfect for happy hour, new menu items, or special events.",
        category: "promotional",
        subcategory: "Promotional Flyer",
        image_url: "https://picsum.photos/id/30/600/400",
        full_image_url: "https://picsum.photos/id/30/1200/800",
        download_url: "../../assets/downloads/flyers/restaurant-promotion-flyer.zip",
        file_formats: ["PDF","PSD","AI","PNG","JPG"],
        dimensions: "A5 (5.83×8.27 in) | 1748×2480 px",
        software: ["Adobe Illustrator","Adobe Photoshop"],
        print_ready: "Yes",
        color_mode: "CMYK",
        file_size: "35 MB",
        orientation: "landscape",
        paper_size: "A5, Half Letter",
        tags: ["restaurant","food","drink","promotion"],
        design_details: "Food‑friendly layout, large photo space, decorative typography.",
        materials_specs: "Print‑ready PDF, CMYK, 150gsm gloss paper.",
        design_inspiration: "Food photography, vintage menus.",
        practical_applications: "Restaurants, cafes, food trucks, bars.",
        features: ["Menu section","Offer highlights","Photo ready","Print‑ready"],
        colors: ["#E27D60","#E8A87C","#C38D9E","#E98074","#E6B89C"],
        likes_count: 784,
        downloads_count: 2194,
        favorites_count: 0,
        shares_count: 0,
        bookmarks_count: 0
    },
    8: {
        id: 8,
        title: "Gym & Fitness Flyer",
        subtitle: "Motivational design for fitness events",
        description: "Inspire action with this energetic flyer for gym openings, fitness classes, or wellness workshops. Bold typography and dynamic shapes.",
        category: "promotional",
        subcategory: "Promotional Flyer",
        image_url: "https://picsum.photos/id/98/600/400",
        full_image_url: "https://picsum.photos/id/98/1200/800",
        download_url: "../../assets/downloads/flyers/gym-fitness-flyer.zip",
        file_formats: ["PDF","PSD","AI","PNG","JPG"],
        dimensions: "A4 (8.27×11.69 in) | 2480×3508 px",
        software: ["Adobe Illustrator","Adobe Photoshop"],
        print_ready: "Yes",
        color_mode: "CMYK",
        file_size: "48 MB",
        orientation: "portrait",
        paper_size: "A4, US Letter",
        tags: ["fitness","gym","workout","health"],
        design_details: "Dynamic diagonal lines, bold sans‑serif, before/after photo spots.",
        materials_specs: "Print‑ready PDF, CMYK, 130gsm matte paper.",
        design_inspiration: "Sports branding, motivational posters.",
        practical_applications: "Gym openings, fitness classes, personal training.",
        features: ["Class schedule","Trainer bios","Price list","Print‑ready"],
        colors: ["#F94144","#F9C74F","#90BE6D","#577590","#4D908E"],
        likes_count: 633,
        downloads_count: 1862,
        favorites_count: 0,
        shares_count: 0,
        bookmarks_count: 0
    },
    9: {
        id: 9,
        title: "Birthday Party Flyer",
        subtitle: "Fun, colorful design for all ages",
        description: "Celebrate in style with this versatile birthday flyer. Customize the colors and text to match any age or theme.",
        category: "party",
        subcategory: "Party Flyer",
        image_url: "https://picsum.photos/id/96/600/400",
        full_image_url: "https://picsum.photos/id/96/1200/800",
        download_url: "../../assets/downloads/flyers/birthday-party-flyer.zip",
        file_formats: ["PDF","PSD","AI","PNG","JPG"],
        dimensions: "A5 (5.83×8.27 in) | 1748×2480 px",
        software: ["Adobe Illustrator","Adobe Photoshop"],
        print_ready: "Yes",
        color_mode: "CMYK",
        file_size: "34 MB",
        orientation: "portrait",
        paper_size: "A5, Half Letter",
        tags: ["birthday","party","celebration","fun"],
        design_details: "Playful shapes, confetti elements, balloon illustrations, photo spot.",
        materials_specs: "Print‑ready PDF, CMYK, 120gsm gloss paper.",
        design_inspiration: "Party decorations, children’s birthday themes.",
        practical_applications: "Kids' birthdays, adult parties, milestone celebrations.",
        features: ["Photo spot","Editable text","Balloon graphics","Print‑ready"],
        colors: ["#F94144","#F8961E","#F9C74F","#90BE6D","#577590"],
        likes_count: 1123,
        downloads_count: 2931,
        favorites_count: 0,
        shares_count: 0,
        bookmarks_count: 0
    },
    10: {
        id: 10,
        title: "Non‑profit Fundraiser Flyer",
        subtitle: "Compassionate design for charity events",
        description: "Raise awareness and encourage donations with this heartfelt flyer template. Clean, trustworthy design with space for mission statements and calls to action.",
        category: "event",
        subcategory: "Event Flyer",
        image_url: "https://picsum.photos/id/432/600/400",
        full_image_url: "https://picsum.photos/id/432/1200/800",
        download_url: "../../assets/downloads/flyers/nonprofit-fundraiser-flyer.zip",
        file_formats: ["PDF","PSD","AI","PNG","JPG"],
        dimensions: "A4 (8.27×11.69 in) | 2480×3508 px",
        software: ["Adobe Illustrator","Adobe Photoshop"],
        print_ready: "Yes",
        color_mode: "CMYK",
        file_size: "44 MB",
        orientation: "portrait",
        paper_size: "A4, US Letter",
        tags: ["non‑profit","charity","fundraiser","awareness"],
        design_details: "Warm color palette, icon set, donor recognition area.",
        materials_specs: "Print‑ready PDF, CMYK, 130gsm recycled paper recommended.",
        design_inspiration: "Charity campaigns, social impact design.",
        practical_applications: "Galas, donation drives, awareness events.",
        features: ["Mission statement","Donation tear‑off","Event details","Print‑ready"],
        colors: ["#2E5E4E","#7C9D8E","#F4B860","#C73E1D","#F3E9D2"],
        likes_count: 489,
        downloads_count: 1456,
        favorites_count: 0,
        shares_count: 0,
        bookmarks_count: 0
    },
    11: {
        id: 11,
        title: "Tech Product Launch Flyer",
        subtitle: "Modern, high‑tech design for gadgets",
        description: "Unleash the hype for your new tech product with this sleek, futuristic flyer. Perfect for smartphones, apps, or software releases.",
        category: "business",
        subcategory: "Business Flyer",
        image_url: "https://picsum.photos/id/60/600/400",
        full_image_url: "https://picsum.photos/id/60/1200/800",
        download_url: "../../assets/downloads/flyers/tech-product-launch-flyer.zip",
        file_formats: ["PDF","PSD","AI","PNG","JPG"],
        dimensions: "A4 (8.27×11.69 in) | 2480×3508 px",
        software: ["Adobe Illustrator","Adobe Photoshop"],
        print_ready: "Yes",
        color_mode: "CMYK",
        file_size: "47 MB",
        orientation: "landscape",
        paper_size: "A4, US Letter",
        tags: ["tech","product launch","gadget","innovation"],
        design_details: "Futuristic gradients, device mockup integration, bold headlines.",
        materials_specs: "Digital‑first, also print‑ready CMYK, 150gsm gloss paper.",
        design_inspiration: "Apple product launches, sci‑fi aesthetics.",
        practical_applications: "Product launches, trade shows, online promotions.",
        features: ["Device placeholder","Features list","Call to action","Print‑ready"],
        colors: ["#0A0F0D","#3A6EA5","#C0D6DF","#EBF5EE","#78A1BB"],
        likes_count: 721,
        downloads_count: 2013,
        favorites_count: 0,
        shares_count: 0,
        bookmarks_count: 0
    },
    12: {
        id: 12,
        title: "Educational Workshop Flyer",
        subtitle: "Clean, inviting design for learning events",
        description: "Attendees to your workshop, class, or seminar with this friendly, organized flyer. Space for curriculum, instructor bio, and registration details.",
        category: "event",
        subcategory: "Event Flyer",
        image_url: "https://picsum.photos/id/20/600/400",
        full_image_url: "https://picsum.photos/id/20/1200/800",
        download_url: "../../assets/downloads/flyers/educational-workshop-flyer.zip",
        file_formats: ["PDF","PSD","AI","PNG","JPG"],
        dimensions: "A5 (5.83×8.27 in) | 1748×2480 px",
        software: ["Adobe Illustrator","Adobe Photoshop"],
        print_ready: "Yes",
        color_mode: "CMYK",
        file_size: "33 MB",
        orientation: "portrait",
        paper_size: "A5, Half Letter",
        tags: ["workshop","education","class","training"],
        design_details: "Friendly serif + sans‑serif combination, icons for subjects, grid layout.",
        materials_specs: "Print‑ready PDF, CMYK, 120gsm uncoated paper.",
        design_inspiration: "Educational brochures, university posters.",
        practical_applications: "Workshops, adult education, training sessions.",
        features: ["Curriculum outline","Instructor bio","QR code spot","Print‑ready"],
        colors: ["#283618","#606C38","#FEFAE0","#DDA15E","#BC6C25"],
        likes_count: 596,
        downloads_count: 1782,
        favorites_count: 0,
        shares_count: 0,
        bookmarks_count: 0
    }
};

// ===== MODAL FUNCTIONS =====
let currentFlyerId = null;

function openModal(id) {
    const flr = flyersData[id];
    if (!flr) return;
    currentFlyerId = id;
    window.currentTemplateId = id;

    document.getElementById('modalImage').src = flr.image_url;
    document.getElementById('modalTitle').textContent = flr.title;
    document.getElementById('modalSubtitle').textContent = flr.subtitle;
    document.getElementById('modalDescription').textContent = flr.description;
    document.getElementById('designDetails').textContent = flr.design_details || flr.designDetails;
    document.getElementById('materialsSpecs').textContent = flr.materials_specs || flr.materialsSpecs;
    document.getElementById('designInspiration').textContent = flr.design_inspiration || flr.designInspiration;
    document.getElementById('practicalApplications').textContent = flr.practical_applications || flr.practicalApplications;
    document.getElementById('flyerType').textContent = flr.subcategory || '';
    document.getElementById('fileFormat').textContent = (flr.file_formats || []).join(', ');
    document.getElementById('dimensions').textContent = flr.dimensions;
    document.getElementById('downloadCount').textContent = flr.downloads_count.toLocaleString();
    document.getElementById('orientation').textContent = flr.orientation ? flr.orientation.charAt(0).toUpperCase() + flr.orientation.slice(1) : '';
    document.getElementById('paperSize').textContent = flr.paper_size || flr.paperSize;
    document.getElementById('printReady').textContent = flr.print_ready || flr.printReady;
    document.getElementById('modalFullImage').src = flr.full_image_url;
    document.getElementById('modalFullImage').className = `modal-full-image ${flr.orientation}`;

    document.getElementById('modalPrice').innerHTML = '<span class="price-free">FREE</span>';

    const formatBadges = document.getElementById('formatBadges');
    formatBadges.innerHTML = (flr.file_formats || []).map(f => `<span class="format-badge">${f}</span>`).join('');

    const colorPalette = document.getElementById('colorPalette');
    const colors = flr.colors || [];
    colorPalette.innerHTML = colors.map(c => `<div class="color" style="background-color: ${c};" title="${c}"></div>`).join('');

    document.getElementById('tagsContainer').innerHTML = (flr.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = (flr.features || []).map(f => `<li>${f}</li>`).join('');

    // Video section (if you have video_url in your data)
    const videoSection = document.getElementById('videoTutorialSection');
    if (flr.video_url) {
        videoSection.style.display = 'block';
        const videoId = extractYouTubeID(flr.video_url);
        if (videoId) {
            document.getElementById('videoThumbnail').src = `https://img.youtube.com/vi/${videoId}/0.jpg`;
            document.getElementById('videoLink').href = flr.video_url;
        } else {
            document.getElementById('videoThumbnail').src = '';
            document.getElementById('videoLink').href = flr.video_url;
            document.querySelector('.video-container p').innerHTML = `<a href="${flr.video_url}" target="_blank">Watch tutorial on YouTube</a>`;
        }
    } else {
        videoSection.style.display = 'none';
    }

    generateRelatedDesigns(id, flr.category);

    // Update modal counts
    document.getElementById('modalLikeCount').textContent = flr.likes_count;
    document.getElementById('modalFavoriteCount').textContent = flr.favorites_count || 0;
    document.getElementById('modalBookmarkCount').textContent = flr.bookmarks_count || 0;
    document.getElementById('modalShareCount').textContent = flr.shares_count || 0;

    // Update icons based on user state
    updateLikeIcon(id, likedTemplates.has(id));
    updateFavoriteIcon(id, favoritedTemplates.has(id));
    updateBookmarkIcon(id, bookmarkedTemplates.has(id));

    document.getElementById('flyerModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('flyerModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    currentFlyerId = null;
    window.currentTemplateId = null;
}

function extractYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function generateRelatedDesigns(currentId, category) {
    const container = document.getElementById('relatedDesigns');
    const related = Object.values(flyersData)
        .filter(f => f.id != currentId && f.category === category)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    
    container.innerHTML = related.map(f => `
        <div class="related-item" data-id="${f.id}">
            <img src="${f.image_url}" alt="${f.title}">
            <div class="related-overlay"><span>${f.title}</span></div>
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

// ===== PAGE-SPECIFIC INIT =====
function pageInit() {
    new StarfieldAnimation();

    const currentYear = document.getElementById('currentYear');
    if (currentYear) currentYear.textContent = new Date().getFullYear();

    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, easing: 'ease-in-out', once: true, offset: 100 });
    }

    loadFlyersFromAPI();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });

    ['orientationFilter', 'sortFilter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', applyFilters);
    });

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus"></i> Load More Flyers';
                this.disabled = false;
                showToast('More flyers would be loaded from the backend.', 'info');
            }, 1000);
        });
    }

    document.getElementById('closeModal')?.addEventListener('click', closeModal);
    document.querySelector('.modal-overlay')?.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('flyerModal').classList.contains('active')) {
            closeModal();
        }
    });

    document.getElementById('modalLikeBtn')?.addEventListener('click', () => {
        if (currentFlyerId) toggleLike(currentFlyerId);
    });
    document.getElementById('modalFavoriteBtn')?.addEventListener('click', () => {
        if (currentFlyerId) toggleFavorite(currentFlyerId);
    });
    document.getElementById('modalBookmarkBtn')?.addEventListener('click', () => {
        if (currentFlyerId) toggleBookmark(currentFlyerId);
    });
    document.getElementById('modalDownloadBtn')?.addEventListener('click', () => {
        if (currentFlyerId) downloadTemplate(currentFlyerId);
    });
    document.getElementById('downloadTemplateBtn')?.addEventListener('click', () => {
        if (currentFlyerId) downloadTemplate(currentFlyerId);
    });
    document.getElementById('modalShareBtn')?.addEventListener('click', () => {
        if (currentFlyerId) shareTemplate(currentFlyerId);
    });
    document.getElementById('previewBtn')?.addEventListener('click', () => {
        if (currentFlyerId) window.open(flyersData[currentFlyerId].full_image_url, '_blank');
    });
    document.getElementById('customizeBtn')?.addEventListener('click', () => {
        showToast('Online editor coming soon!', 'info');
    });
}

window.pageInit = pageInit;