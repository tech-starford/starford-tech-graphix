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
    { title: "Instagram Post", category: "Social Media", url: "./templates/social-media/instagram-post.html", tags: ["instagram", "post", "square"] },
    { title: "Facebook Cover", category: "Social Media", url: "./templates/social-media/facebook-cover.html", tags: ["facebook", "cover", "banner"] },
    { title: "Twitter Header", category: "Social Media", url: "./templates/social-media/twitter-header.html", tags: ["twitter", "header", "banner"] },
    { title: "YouTube Thumbnail", category: "Social Media", url: "./templates/social-media/youtube-thumbnail.html", tags: ["youtube", "thumbnail", "video"] },
    { title: "LinkedIn Banner", category: "Social Media", url: "./templates/social-media/linkedin-banner.html", tags: ["linkedin", "banner", "professional"] },
    { title: "Pinterest Pin", category: "Social Media", url: "./templates/social-media/pinterest-pin.html", tags: ["pinterest", "pin", "vertical"] },
    { title: "TikTok Video", category: "Social Media", url: "./templates/social-media/tiktok-video.html", tags: ["tiktok", "video", "vertical"] },
    { title: "Instagram Story", category: "Social Media", url: "./templates/social-media/instagram-story.html", tags: ["instagram", "story", "vertical"] }
];

// ===== SOCIAL MEDIA DATA (12 complete items) =====
const socials = {
    1: {
        id: 1,
        title: "Instagram Post – Modern Quote",
        subtitle: "Elegant quote template for Instagram",
        description: "A clean, typographic Instagram post template perfect for sharing inspirational quotes or announcements. Easily customizable colors and text.",
        designDetails: "Minimal layout, bold serif typography, subtle gradient background.",
        materialsSpecs: "PSD + AI + PNG, 1080×1080 px, RGB.",
        designInspiration: "Modern minimalism, Swiss design.",
        practicalApplications: "Quote of the day, brand announcements, motivational posts.",
        thumbnailUrl: "https://picsum.photos/id/110/600/400",
        fullImageUrl: "https://picsum.photos/id/110/1200/800",
        templateType: "Instagram Post",
        category: "instagram",
        categories: ["instagram", "quote"],
        fileFormats: ["PSD", "AI", "PNG", "JPG"],
        dimensions: "1080×1080 px | Square",
        orientation: "square",
        downloadCount: 4215,
        likes: 1532,
        printReady: "No (digital use)",
        colors: ["#F5F5F5", "#212121", "#757575", "#FFC107", "#03A9F4"],
        colorNames: ["Off White", "Black", "Gray", "Amber", "Light Blue"],
        tags: ["instagram", "post", "quote", "typography"],
        features: ["Editable text", "Gradient background", "Smart objects", "High resolution"],
        videoUrl: "https://www.youtube.com/watch?v=T6LMWAxnm-s&t=57s"  // first tutorial link
    },
    2: {
        id: 2,
        title: "YouTube Thumbnail – Gaming",
        subtitle: "Eye‑catching thumbnail for gaming videos",
        description: "Make your gaming videos stand out with this dynamic thumbnail template. Includes space for game title, episode number, and your face cam.",
        designDetails: "Bold colors, action lines, text highlights, face cam cutout.",
        materialsSpecs: "PSD with smart objects, 1920×1080 px, RGB.",
        designInspiration: "Gaming channels, esports branding.",
        practicalApplications: "Let's plays, tutorials, live streams.",
        thumbnailUrl: "https://picsum.photos/id/111/600/400",
        fullImageUrl: "https://picsum.photos/id/111/1200/800",
        templateType: "YouTube Thumbnail",
        category: "youtube",
        categories: ["youtube", "gaming"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "1920×1080 px | Landscape",
        orientation: "landscape",
        downloadCount: 3872,
        likes: 1298,
        printReady: "No (digital use)",
        colors: ["#FF0000", "#000000", "#FFFFFF", "#FFD700", "#00FF00"],
        colorNames: ["Red", "Black", "White", "Gold", "Green"],
        tags: ["youtube", "thumbnail", "gaming", "video"],
        features: ["Face cam spot", "Game title", "Episode number", "Smart objects"],
        videoUrl: "https://www.youtube.com/watch?v=FW2-byfMRbI&t=284s"  // second tutorial link
    },
    3: {
        id: 3,
        title: "Facebook Cover – Business",
        subtitle: "Professional banner for company pages",
        description: "Create a polished Facebook cover for your business page. Includes company name, tagline, and call‑to‑action button placeholder.",
        designDetails: "Clean corporate look, centered composition, gradient overlay.",
        materialsSpecs: "PSD + AI, 1640×924 px, RGB.",
        designInspiration: "Corporate branding, minimal web design.",
        practicalApplications: "Business pages, event promotion, product launches.",
        thumbnailUrl: "https://picsum.photos/id/112/600/400",
        fullImageUrl: "https://picsum.photos/id/112/1200/800",
        templateType: "Facebook Cover",
        category: "facebook",
        categories: ["facebook", "business"],
        fileFormats: ["PSD", "AI", "PNG", "JPG"],
        dimensions: "1640×924 px | Landscape",
        orientation: "landscape",
        downloadCount: 2945,
        likes: 876,
        printReady: "No (digital use)",
        colors: ["#2C3E50", "#3498DB", "#ECF0F1", "#95A5A6", "#27AE60"],
        colorNames: ["Midnight Blue", "Peter River", "Clouds", "Concrete", "Nephritis"],
        tags: ["facebook", "cover", "business", "banner"],
        features: ["Company name", "Tagline", "CTA spot", "Smart objects"],
        videoUrl: null
    },
    4: {
        id: 4,
        title: "Twitter Header – Personal Brand",
        subtitle: "Stylish header for your Twitter profile",
        description: "Elevate your Twitter profile with this modern header. Space for your photo, name, and a brief bio.",
        designDetails: "Asymmetric layout, duotone effect, avatar placeholder.",
        materialsSpecs: "PSD, 1500×500 px, RGB.",
        designInspiration: "Personal branding, influencer profiles.",
        practicalApplications: "Influencers, freelancers, small businesses.",
        thumbnailUrl: "https://picsum.photos/id/113/600/400",
        fullImageUrl: "https://picsum.photos/id/113/1200/800",
        templateType: "Twitter Header",
        category: "twitter",
        categories: ["twitter", "personal"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "1500×500 px | Landscape",
        orientation: "landscape",
        downloadCount: 1863,
        likes: 634,
        printReady: "No (digital use)",
        colors: ["#1DA1F2", "#14171A", "#FFFFFF", "#657786", "#AAB8C2"],
        colorNames: ["Twitter Blue", "Black", "White", "Dark Gray", "Light Gray"],
        tags: ["twitter", "header", "profile", "banner"],
        features: ["Avatar spot", "Bio area", "Name text", "Smart objects"],
        videoUrl: null
    },
    5: {
        id: 5,
        title: "LinkedIn Banner – Professional",
        subtitle: "Sophisticated banner for LinkedIn profiles",
        description: "Make a great first impression with this clean, professional LinkedIn banner. Perfect for job seekers, executives, and consultants.",
        designDetails: "Elegant serif, subtle pattern, contact info area.",
        materialsSpecs: "PSD + AI, 1584×396 px, RGB.",
        designInspiration: "Corporate headshots, premium branding.",
        practicalApplications: "Job hunting, networking, personal branding.",
        thumbnailUrl: "https://picsum.photos/id/114/600/400",
        fullImageUrl: "https://picsum.photos/id/114/1200/800",
        templateType: "LinkedIn Banner",
        category: "linkedin",
        categories: ["linkedin", "business"],
        fileFormats: ["PSD", "AI", "PNG", "JPG"],
        dimensions: "1584×396 px | Landscape",
        orientation: "landscape",
        downloadCount: 2156,
        likes: 798,
        printReady: "No (digital use)",
        colors: ["#0A66C2", "#FFFFFF", "#000000", "#7F8C8D", "#ECF0F1"],
        colorNames: ["LinkedIn Blue", "White", "Black", "Gray", "Clouds"],
        tags: ["linkedin", "banner", "professional", "career"],
        features: ["Name title", "Tagline", "Contact info", "Smart objects"],
        videoUrl: null
    },
    6: {
        id: 6,
        title: "Pinterest Pin – Recipe",
        subtitle: "Delicious recipe pin for Pinterest",
        description: "Drive traffic to your blog with this mouth‑watering recipe pin. Includes title, ingredients preview, and call‑to‑action.",
        designDetails: "Warm colors, food photography area, step‑by‑step icons.",
        materialsSpecs: "PSD, 1000×1500 px, RGB.",
        designInspiration: "Food blogging, lifestyle photography.",
        practicalApplications: "Recipe blogs, meal planning, cooking channels.",
        thumbnailUrl: "https://picsum.photos/id/115/600/400",
        fullImageUrl: "https://picsum.photos/id/115/1200/800",
        templateType: "Pinterest Pin",
        category: "pinterest",
        categories: ["pinterest", "food"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "1000×1500 px | Portrait",
        orientation: "portrait",
        downloadCount: 1432,
        likes: 501,
        printReady: "No (digital use)",
        colors: ["#E27D60", "#E8A87C", "#C38D9E", "#E98074", "#E6B89C"],
        colorNames: ["Terracotta", "Peach", "Mauve", "Coral", "Cream"],
        tags: ["pinterest", "pin", "recipe", "food"],
        features: ["Photo ready", "Ingredient list", "Title", "CTA button"],
        videoUrl: null
    },
    7: {
        id: 7,
        title: "Instagram Story – Sale",
        subtitle: "Urgent story design for promotions",
        description: "Announce your sale or offer with this eye‑catching Instagram Story template. Bold text, countdown sticker area, and product image spot.",
        designDetails: "High‑contrast colors, bold sans‑serif, product cutout, gradient.",
        materialsSpecs: "PSD, 1080×1920 px, RGB.",
        designInspiration: "Flash sales, e‑commerce stories.",
        practicalApplications: "Retail promotions, flash sales, new arrivals.",
        thumbnailUrl: "https://picsum.photos/id/116/600/400",
        fullImageUrl: "https://picsum.photos/id/116/1200/800",
        templateType: "Instagram Story",
        category: "story",
        categories: ["story", "instagram"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "1080×1920 px | Portrait",
        orientation: "portrait",
        downloadCount: 1789,
        likes: 612,
        printReady: "No (digital use)",
        colors: ["#E63946", "#F1FA8C", "#A8DADC", "#457B9D", "#1D3557"],
        colorNames: ["Red", "Yellow", "Light Blue", "Blue", "Dark Blue"],
        tags: ["instagram", "story", "sale", "promotion"],
        features: ["Product spot", "Discount text", "CTA", "Smart objects"],
        videoUrl: null
    },
    8: {
        id: 8,
        title: "Facebook Event Cover",
        subtitle: "Promote your event with style",
        description: "Get more attendees with this professional event cover. Perfect for conferences, webinars, or parties.",
        designDetails: "Clean grid, photo area, event details section.",
        materialsSpecs: "PSD, 1920×1005 px, RGB.",
        designInspiration: "Event branding, conference posters.",
        practicalApplications: "Webinars, workshops, parties, conferences.",
        thumbnailUrl: "https://picsum.photos/id/117/600/400",
        fullImageUrl: "https://picsum.photos/id/117/1200/800",
        templateType: "Facebook Cover",
        category: "facebook",
        categories: ["facebook", "event"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "1920×1005 px | Landscape",
        orientation: "landscape",
        downloadCount: 2034,
        likes: 723,
        printReady: "No (digital use)",
        colors: ["#2C3E50", "#E67E22", "#ECF0F1", "#BDC3C7", "#3498DB"],
        colorNames: ["Dark Blue", "Orange", "Clouds", "Silver", "Peter River"],
        tags: ["facebook", "event", "cover", "promotion"],
        features: ["Photo ready", "Event title", "Date/venue", "CTA"],
        videoUrl: null
    },
    9: {
        id: 9,
        title: "TikTok Video – Intro",
        subtitle: "Dynamic intro for TikTok videos",
        description: "Grab attention in the first second with this animated‑style TikTok intro template. Customize colors and text.",
        designDetails: "Bold typography, motion lines, animated feel (static).",
        materialsSpecs: "PSD + After Effects project (link), 1080×1920 px.",
        designInspiration: "TikTok trends, energetic branding.",
        practicalApplications: "TikTok intros, challenges, announcements.",
        thumbnailUrl: "https://picsum.photos/id/118/600/400",
        fullImageUrl: "https://picsum.photos/id/118/1200/800",
        templateType: "TikTok Video",
        category: "tiktok",
        categories: ["tiktok", "story"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "1080×1920 px | Portrait",
        orientation: "portrait",
        downloadCount: 1678,
        likes: 589,
        printReady: "No (digital use)",
        colors: ["#000000", "#FF004F", "#00F2EA", "#FFFFFF", "#69C9D0"],
        colorNames: ["Black", "Pink", "Cyan", "White", "Light Blue"],
        tags: ["tiktok", "video", "intro", "vertical"],
        features: ["Editable text", "Colorful shapes", "Logo spot", "Smart objects"],
        videoUrl: null
    },
    10: {
        id: 10,
        title: "Instagram Carousel – Tips",
        subtitle: "Multi‑page carousel for educational content",
        description: "Create engaging Instagram carousels with this 10‑page template. Perfect for tips, lists, and step‑by‑step guides.",
        designDetails: "Consistent style, numbered pages, icons, large text.",
        materialsSpecs: "PSD (10 artboards), 1080×1080 px each, RGB.",
        designInspiration: "Educational influencers, listicles.",
        practicalApplications: "How‑to guides, top 10 lists, educational posts.",
        thumbnailUrl: "https://picsum.photos/id/119/600/400",
        fullImageUrl: "https://picsum.photos/id/119/1200/800",
        templateType: "Instagram Carousel",
        category: "instagram",
        categories: ["instagram", "educational"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "1080×1080 px each | Square",
        orientation: "square",
        downloadCount: 2245,
        likes: 812,
        printReady: "No (digital use)",
        colors: ["#4A90E2", "#F5A623", "#7ED321", "#D0021B", "#9013FE"],
        colorNames: ["Blue", "Orange", "Green", "Red", "Purple"],
        tags: ["instagram", "carousel", "tips", "educational"],
        features: ["10 pages", "Icons", "Editable text", "Consistent design"],
        videoUrl: null
    },
    11: {
        id: 11,
        title: "LinkedIn Post – Professional",
        subtitle: "Professional post template for LinkedIn feed",
        description: "Increase engagement on your LinkedIn posts with this clean, professional template. Ideal for sharing insights, articles, or company news.",
        designDetails: "Clean layout, company logo area, headline, body text, CTA.",
        materialsSpecs: "PSD, 1200×1200 px, RGB.",
        designInspiration: "LinkedIn news feed, corporate communications.",
        practicalApplications: "Thought leadership, company updates, article sharing.",
        thumbnailUrl: "https://picsum.photos/id/120/600/400",
        fullImageUrl: "https://picsum.photos/id/120/1200/800",
        templateType: "LinkedIn Post",
        category: "linkedin",
        categories: ["linkedin", "business"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "1200×1200 px | Square",
        orientation: "square",
        downloadCount: 1976,
        likes: 678,
        printReady: "No (digital use)",
        colors: ["#FFFFFF", "#0A66C2", "#000000", "#7F8C8D", "#ECF0F1"],
        colorNames: ["White", "Blue", "Black", "Gray", "Clouds"],
        tags: ["linkedin", "post", "professional", "business"],
        features: ["Logo spot", "Headline", "Body text", "CTA button"],
        videoUrl: null
    },
    12: {
        id: 12,
        title: "Pinterest Pin – DIY",
        subtitle: "Creative pin for DIY and crafts",
        description: "Inspire your audience with this colorful DIY pin. Perfect for craft blogs, tutorials, and handmade products.",
        designDetails: "Bright colors, step‑by‑step preview, materials list.",
        materialsSpecs: "PSD, 1000×1500 px, RGB.",
        designInspiration: "Crafting blogs, DIY tutorials.",
        practicalApplications: "DIY projects, craft ideas, home decor.",
        thumbnailUrl: "https://picsum.photos/id/121/600/400",
        fullImageUrl: "https://picsum.photos/id/121/1200/800",
        templateType: "Pinterest Pin",
        category: "pinterest",
        categories: ["pinterest", "creative"],
        fileFormats: ["PSD", "PNG", "JPG"],
        dimensions: "1000×1500 px | Portrait",
        orientation: "portrait",
        downloadCount: 1823,
        likes: 645,
        printReady: "No (digital use)",
        colors: ["#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#92A8D1"],
        colorNames: ["Coral", "Purple", "Green", "Pink", "Blue"],
        tags: ["pinterest", "pin", "DIY", "craft"],
        features: ["Materials list", "Step preview", "Title", "CTA"],
        videoUrl: null
    }
};

// ===== GLOBAL VARIABLES =====
let likedSocials = JSON.parse(localStorage.getItem('likedSocials')) || [];

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

// Social Modal Elements
const modal = document.getElementById('socialModal');
let currentSocialId = null;

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

    let filtered = Object.values(socials).filter(s => {
        if (filterCategory !== 'all' && !s.categories.includes(filterCategory)) return false;
        if (filterOrientation !== 'all' && s.orientation !== filterOrientation) return false;
        return true;
    });

    // Sorting
    if (sortBy === 'popular') filtered.sort((a,b) => b.likes - a.likes);
    else if (sortBy === 'downloads') filtered.sort((a,b) => b.downloadCount - a.downloadCount);
    else if (sortBy === 'az') filtered.sort((a,b) => a.title.localeCompare(b.title));
    else if (sortBy === 'za') filtered.sort((a,b) => b.title.localeCompare(a.title));
    else filtered.sort((a,b) => b.id - a.id); // newest

    grid.innerHTML = filtered.map(s => {
        const isLiked = likedSocials.includes(s.id);
        const likeCount = isLiked ? s.likes + 1 : s.likes;
        const badgeText = s.categories[0].charAt(0).toUpperCase() + s.categories[0].slice(1);

        return `
        <div class="project-card" data-id="${s.id}" data-category="${s.categories.join(' ')}" data-orientation="${s.orientation}">
            <div class="project-badge">${badgeText}</div>
            <div class="project-img">
                <img src="${s.thumbnailUrl}" alt="${s.title}" loading="lazy">
            </div>
            <div class="project-info">
                <h3>${s.title}</h3>
                <p>${s.subtitle}</p>
                <div class="project-meta">
                    <span class="project-price free">FREE</span>
                    <div class="project-stats">
                        <span class="project-likes">
                            <i class="fas fa-heart like-icon ${isLiked ? 'active' : ''}" data-id="${s.id}"></i>
                            <span class="like-count" data-id="${s.id}">${likeCount}</span>
                        </span>
                        <span class="project-downloads">
                            <i class="fas fa-download"></i>
                            <span class="download-count" data-id="${s.id}">${s.downloadCount}</span>
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
function handleLike(sId) {
    const social = socials[sId];
    if (!social) return;

    const wasLiked = likedSocials.includes(sId);
    if (wasLiked) {
        likedSocials = likedSocials.filter(id => id !== sId);
        social.likes -= 1;
    } else {
        likedSocials.push(sId);
        social.likes += 1;
    }
    localStorage.setItem('likedSocials', JSON.stringify(likedSocials));

    // Update UI
    const likeIcons = document.querySelectorAll(`.project-likes .like-icon[data-id="${sId}"]`);
    const likeCounts = document.querySelectorAll(`.like-count[data-id="${sId}"]`);

    likeIcons.forEach(icon => icon.classList.toggle('active', !wasLiked));
    likeCounts.forEach(el => el.textContent = social.likes);
}

// ===== MODAL FUNCTIONS =====
function openModal(id) {
    const s = socials[id];
    if (!s) return;
    currentSocialId = id;

    document.getElementById('modalImage').src = s.thumbnailUrl;
    document.getElementById('modalTitle').textContent = s.title;
    document.getElementById('modalSubtitle').textContent = s.subtitle;
    document.getElementById('modalDescription').textContent = s.description;
    document.getElementById('designDetails').textContent = s.designDetails;
    document.getElementById('materialsSpecs').textContent = s.materialsSpecs;
    document.getElementById('designInspiration').textContent = s.designInspiration;
    document.getElementById('practicalApplications').textContent = s.practicalApplications;
    document.getElementById('templateType').textContent = s.templateType;
    document.getElementById('fileFormat').textContent = s.fileFormats.join(', ');
    document.getElementById('dimensions').textContent = s.dimensions;
    document.getElementById('downloadCount').textContent = s.downloadCount.toLocaleString();
    document.getElementById('orientation').textContent = s.orientation.charAt(0).toUpperCase() + s.orientation.slice(1);
    document.getElementById('printReady').textContent = s.printReady;
    document.getElementById('modalFullImage').src = s.fullImageUrl;
    document.getElementById('modalFullImage').className = `modal-full-image ${s.orientation}`;

    document.getElementById('modalPrice').innerHTML = '<span class="price-free">FREE</span>';

    const formatBadges = document.getElementById('formatBadges');
    formatBadges.innerHTML = s.fileFormats.map(f => `<span class="format-badge">${f}</span>`).join('');

    const colorPalette = document.getElementById('colorPalette');
    colorPalette.innerHTML = s.colors.map((c, i) => `
        <div class="color" style="background-color: ${c};" title="${s.colorNames[i]}"></div>
    `).join('');

    document.getElementById('tagsContainer').innerHTML = s.tags.map(t => `<span class="tag">${t}</span>`).join('');

    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = s.features.map(f => `<li>${f}</li>`).join('');

    // Handle video tutorial section
    const videoSection = document.getElementById('videoTutorialSection');
    if (s.videoUrl) {
        videoSection.style.display = 'block';
        const videoId = extractYouTubeID(s.videoUrl);
        if (videoId) {
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
            document.getElementById('videoThumbnail').src = thumbnailUrl;
            document.getElementById('videoLink').href = s.videoUrl;
        } else {
            // fallback: just show the link as text
            document.getElementById('videoThumbnail').src = '';
            document.getElementById('videoLink').href = s.videoUrl;
            document.querySelector('.video-container p').innerHTML = `<a href="${s.videoUrl}" target="_blank">Watch tutorial on YouTube</a>`;
        }
    } else {
        videoSection.style.display = 'none';
    }

    generateRelatedDesigns(id, s.category);

    const modalLikeBtn = document.getElementById('modalLikeBtn');
    const modalLikeCount = document.getElementById('modalLikeCount');
    const isLiked = likedSocials.includes(id);
    modalLikeBtn.classList.toggle('active', isLiked);
    modalLikeCount.textContent = isLiked ? s.likes + 1 : s.likes;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentSocialId = null;
}

function extractYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function generateRelatedDesigns(currentId, category) {
    const container = document.getElementById('relatedDesigns');
    const related = Object.values(socials)
        .filter(s => s.id !== currentId && s.category === category)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    
    container.innerHTML = related.map(s => `
        <div class="related-item" data-id="${s.id}">
            <img src="${s.thumbnailUrl}" alt="${s.title}">
            <div class="related-overlay"><span>${s.title}</span></div>
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
function downloadTemplate(sId) {
    const s = socials[sId];
    if (!s) return;

    const slug = slugify(s.title);
    const fileName = `${slug}.zip`;
    const fileUrl = `../../assets/downloads/social-media/${fileName}`;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    s.downloadCount += 1;
    localStorage.setItem(`download_${sId}`, Date.now());
    document.querySelectorAll(`.download-count[data-id="${sId}"]`).forEach(el => {
        el.textContent = s.downloadCount;
    });
    document.getElementById('downloadCount').textContent = s.downloadCount.toLocaleString();
}

// ===== SEARCH FUNCTIONALITY =====
function performSearch(searchTerm) {
    const searchTerms = [
        'instagram', 'facebook', 'twitter', 'youtube', 'linkedin',
        'pinterest', 'tiktok', 'story', 'post', 'cover', 'thumbnail'
    ];
    
    if (searchTerms.some(term => searchTerm.toLowerCase().includes(term))) {
        alert(`Searching for: "${searchTerm}"\n\nThis would show relevant templates in a real implementation.`);
        searchInput.value = '';
    } else {
        alert(`No templates found for "${searchTerm}". Try searching for: instagram, facebook, youtube, etc.`);
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
    
    // Initial render of social media grid
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
                this.innerHTML = '<i class="fas fa-plus"></i> Load More Templates';
                this.disabled = false;
                alert('More templates would be loaded dynamically in production.');
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
        if (!currentSocialId) return;
        handleLike(currentSocialId);
        const s = socials[currentSocialId];
        const isLiked = likedSocials.includes(currentSocialId);
        this.classList.toggle('active', isLiked);
        document.getElementById('modalLikeCount').textContent = isLiked ? s.likes + 1 : s.likes;
    });

    document.getElementById('modalDownloadBtn')?.addEventListener('click', function() {
        if (currentSocialId) downloadTemplate(currentSocialId);
    });

    document.getElementById('downloadTemplateBtn')?.addEventListener('click', function() {
        if (currentSocialId) downloadTemplate(currentSocialId);
    });

    document.getElementById('previewBtn')?.addEventListener('click', function() {
        if (currentSocialId) window.open(socials[currentSocialId].fullImageUrl, '_blank');
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
                alert(`Thank you for subscribing with ${email}! You'll receive monthly social media templates.`);
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