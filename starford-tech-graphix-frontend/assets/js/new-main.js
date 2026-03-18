// ===== STARFIELD ANIMATION =====
class StarfieldAnimation {
    constructor() {
        this.canvas = document.getElementById('starCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.colors = ['#4361ee', '#4cc9f0', '#b5179e', '#f9c74f'];
        this.animationId = null;
        this.resizeTimeout = null;
        this.init();
    }

    init() {
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

// ===== STATE =====
let featuredTemplates = [];
let popularTemplates = [];
let portfolioItems = [];
let serviceItems = [];
let toolItems = [];
let displayedPopularCount = 8;
let currentPopularFilter = 'all';

// ===== RENDER FUNCTIONS =====
function renderFeaturedSlider(templates) {
    const slider = document.querySelector('.featured-slider');
    if (!slider) return;
    slider.innerHTML = templates.map(t => `
        <div class="featured-slide">
            <div class="featured-card" data-id="${t.id}">
                <div class="featured-img">
                    <img src="${t.image_url}" alt="${t.title}" loading="lazy">
                    ${t.badge ? `<div class="featured-badge">${t.badge}</div>` : ''}
                </div>
                <div class="featured-content">
                    <h3>${t.title}</h3>
                    <p>${t.description ? t.description.substring(0, 80) : ''}...</p>
                    <div class="featured-meta">
                        <span class="featured-price">FREE</span>
                        <span class="featured-rating"><i class="fas fa-star"></i> ${t.rating || 4.5} (${t.reviews || 0})</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Initialize Slick slider if available
    if (typeof $ !== 'undefined' && $('.featured-slider').length) {
        $('.featured-slider').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            arrows: true,
            dots: true,
            responsive: [
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 576, settings: { slidesToShow: 1 } }
            ]
        });
    }
    
    // Add click listeners
    document.querySelectorAll('.featured-card').forEach(card => {
        card.addEventListener('click', () => openTemplateModal(card.dataset.id));
    });
}

function renderPortfolio(items) {
    const grid = document.querySelector('.portfolio-grid');
    if (!grid) return;
    grid.innerHTML = items.map(item => `
        <div class="portfolio-item" data-id="${item.id}">
            <div class="portfolio-img">
                <img src="${item.image_url}" alt="${item.title}" loading="lazy">
                <span class="portfolio-category">${item.category}</span>
            </div>
            <div class="portfolio-content">
                <h3>${item.title}</h3>
                <p>${item.description ? item.description.substring(0, 60) : ''}...</p>
                <button class="btn btn-outline view-template">View Template</button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => openTemplateModal(item.dataset.id));
    });
}

function renderPopularGrid() {
    const grid = document.getElementById('popularGrid');
    if (!grid) return;
    
    const filtered = popularTemplates.filter(t => currentPopularFilter === 'all' || t.category === currentPopularFilter);
    const toShow = filtered.slice(0, displayedPopularCount);
    
    if (toShow.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px;">No designs in this category.</div>';
        return;
    }
    
    grid.innerHTML = toShow.map(t => {
        const liked = likedTemplates.has(t.id);
        return `
            <div class="popular-card" data-id="${t.id}" data-category="${t.category}">
                ${t.badge ? `<div class="popular-badge">${t.badge}</div>` : ''}
                <div class="popular-img">
                    <img src="${t.image_url}" alt="${t.title}" loading="lazy">
                </div>
                <div class="popular-info">
                    <h3>${t.title}</h3>
                    <p>${t.description ? t.description.substring(0, 50) : ''}...</p>
                    <div class="popular-meta">
                        <div class="popular-stats">
                            <span class="popular-likes">
                                <i class="${liked ? 'fas' : 'far'} fa-heart like-icon" data-id="${t.id}"></i>
                                <span class="like-count" data-id="${t.id}">${t.likes_count || 0}</span>
                            </span>
                            <span class="popular-downloads">
                                <i class="fas fa-download"></i>
                                <span class="download-count" data-id="${t.id}">${t.downloads_count || 0}</span>
                            </span>
                        </div>
                        <span class="popular-price">FREE</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Attach card click listeners
    document.querySelectorAll('.popular-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.like-icon') || e.target.closest('.popular-likes')) return;
            openTemplateModal(card.dataset.id);
        });
    });
    
    // Update load more button visibility
    const loadMoreBtn = document.getElementById('loadMorePopularBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = displayedPopularCount >= filtered.length ? 'none' : 'inline-flex';
    }
}

function renderServices(services) {
    const grid = document.querySelector('.services-grid');
    if (!grid) return;
    grid.innerHTML = services.map(s => `
        <div class="service-card">
            <div class="service-icon-container">
                <div class="service-icon-bg">
                    <img src="${s.image_url || 'https://via.placeholder.com/220x120'}" alt="${s.title}">
                </div>
                <div class="service-icon"><i class="${s.icon}"></i></div>
            </div>
            <h3>${s.title}</h3>
            <p>${s.description}</p>
            <ul class="service-features">
                ${s.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
            </ul>
            <a href="${s.link}" class="btn">View Templates</a>
        </div>
    `).join('');
}

function renderTools(tools) {
    const grid = document.querySelector('.tools-grid');
    if (!grid) return;
    grid.innerHTML = tools.map(t => `
        <div class="tool-card">
            <div class="tool-icon"><i class="${t.icon}"></i></div>
            <h3>${t.name}</h3>
        </div>
    `).join('');
}

// ===== MODAL FUNCTIONS =====
async function openTemplateModal(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/templates/${id}`);
        if (!res.ok) throw new Error('Template not found');
        const template = await res.json();
        window.currentTemplateId = template.id;

        // Populate modal fields
        document.getElementById('modalImage').src = template.image_url;
        document.getElementById('modalTitle').textContent = template.title;
        document.getElementById('modalSubtitle').textContent = template.subcategory || template.category;
        document.getElementById('modalDescription').textContent = template.description;
        document.getElementById('modalCategory').textContent = template.subcategory || template.category;
        document.getElementById('modalFileFormat').textContent = template.file_formats ? template.file_formats.join(', ') : '';
        document.getElementById('modalDimensions').textContent = template.dimensions || '';
        document.getElementById('modalDownloadCount').textContent = (template.downloads_count || 0).toLocaleString();
        document.getElementById('modalSoftware').textContent = template.software ? template.software.join(', ') : '';
        document.getElementById('modalPrintReady').textContent = template.print_ready || '';
        document.getElementById('modalColorMode').textContent = template.color_mode || '';
        document.getElementById('modalFileSize').textContent = template.file_size || '';
        document.getElementById('designDetails').textContent = template.design_details || '';
        document.getElementById('materialsSpecs').textContent = template.materials_specs || '';
        document.getElementById('designInspiration').textContent = template.design_inspiration || '';
        document.getElementById('practicalApplications').textContent = template.practical_applications || '';
        document.getElementById('modalBadge').textContent = template.badge || 'Popular';
        document.getElementById('modalFullImage').src = template.full_image_url || template.image_url;

        // Format badges
        const formatBadges = document.getElementById('formatBadges');
        if (formatBadges) {
            formatBadges.innerHTML = (template.file_formats || []).map(f => `<span class="format-badge">${f}</span>`).join('');
        }

        // Color palette
        const colorPalette = document.getElementById('colorPalette');
        if (colorPalette) {
            colorPalette.innerHTML = (template.colors || []).map(c => `<div class="color" style="background:${c}" title="${c}"></div>`).join('');
        }

        // Tags
        const tagsContainer = document.getElementById('tagsContainer');
        if (tagsContainer) {
            tagsContainer.innerHTML = (template.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
        }

        // Features
        const featuresList = document.getElementById('featuresList');
        if (featuresList) {
            featuresList.innerHTML = (template.features || []).map(f => `<li>${f}</li>`).join('');
        }

        // Floating action buttons
        const liked = likedTemplates.has(template.id);
        document.getElementById('modalLikeBtn').innerHTML = `<i class="${liked ? 'fas' : 'far'} fa-heart"></i><span class="action-count" id="modalLikeCount">${template.likes_count || 0}</span>`;
        document.getElementById('modalFavoriteBtn').innerHTML = `<i class="${favoritedTemplates.has(template.id) ? 'fas' : 'far'} fa-star"></i><span class="action-count" id="modalFavoriteCount">${template.favorites_count || 0}</span>`;
        document.getElementById('modalBookmarkBtn').innerHTML = `<i class="${bookmarkedTemplates.has(template.id) ? 'fas' : 'far'} fa-bookmark"></i><span class="action-count" id="modalBookmarkCount">${template.bookmarks_count || 0}</span>`;
        document.getElementById('modalShareBtn').innerHTML = `<i class="far fa-share-alt"></i><span class="action-count" id="modalShareCount">${template.shares_count || 0}</span>`;
        document.getElementById('modalDownloadBtn').innerHTML = `<i class="fas fa-download"></i>`;

        // Related designs
        const related = popularTemplates.filter(t => t.category === template.category && t.id != template.id).slice(0, 4);
        const relatedGrid = document.getElementById('relatedDesigns');
        if (relatedGrid) {
            if (related.length) {
                relatedGrid.innerHTML = related.map(r => `
                    <div class="related-item" data-id="${r.id}">
                        <img src="${r.image_url}" alt="${r.title}">
                        <div class="related-overlay"><span>${r.title}</span></div>
                    </div>
                `).join('');
                relatedGrid.querySelectorAll('.related-item').forEach(el => {
                    el.addEventListener('click', () => openTemplateModal(el.dataset.id));
                });
                relatedGrid.closest('.related-designs').style.display = 'block';
            } else {
                relatedGrid.closest('.related-designs').style.display = 'none';
            }
        }

        document.getElementById('templateModal').classList.add('active');
        document.getElementById('overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    } catch (err) {
        console.error(err);
        showToast('Could not load template details.', 'error');
    }
}

function closeTemplateModal() {
    document.getElementById('templateModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
}

// ===== FETCH DATA =====
async function fetchHomepageData() {
    try {
        // Fetch featured templates (latest 5)
        const featuredRes = await fetch(`${API_BASE_URL}/api/templates?limit=5&sort=created_at`);
        const featuredData = await featuredRes.json();
        featuredTemplates = featuredData.data || [];

        // Fetch popular templates (most liked/downloaded, limit 20)
        const popularRes = await fetch(`${API_BASE_URL}/api/templates?limit=20&sort=popular`);
        const popularData = await popularRes.json();
        popularTemplates = popularData.data || [];

        // Portfolio items: first 6 from popular
        portfolioItems = popularTemplates.slice(0, 6);

        // Static services and tools (you can also fetch these from backend if needed)
        serviceItems = [
            {
                id: 1,
                title: "Brand Identity",
                description: "Create a memorable brand with our comprehensive identity packages including logo design, color schemes, and typography.",
                icon: "fas fa-palette",
                features: ["Logo Design", "Brand Guidelines", "Business Cards", "Stationery Design"],
                link: "./templates/logos/index.html",
                image_url: "./assets/images/photos/brand-identity-bg.jpg"
            },
            {
                id: 2,
                title: "Print Design",
                description: "High-quality print materials that make an impression, from business collateral to large format printing.",
                icon: "fas fa-print",
                features: ["Brochures & Flyers", "Posters & Banners", "Magazine Layouts", "Annual Reports"],
                link: "./templates/flyers/index.html",
                image_url: "./assets/images/photos/print-design-bg.jpg"
            },
            {
                id: 3,
                title: "Digital Design",
                description: "Engaging digital assets optimized for web and social media to boost your online presence.",
                icon: "fas fa-laptop-code",
                features: ["Social Media Graphics", "Web Banners", "Email Templates", "Digital Ads"],
                link: "./templates/social-media/index.html",
                image_url: "./assets/images/photos/digital-design-bg.jpg"
            },
            {
                id: 4,
                title: "Packaging Design",
                description: "Eye-catching packaging that stands out on shelves and communicates your product's value.",
                icon: "fas fa-box-open",
                features: ["Product Labels", "Box & Bag Design", "Retail Displays", "Prototyping"],
                link: "./templates/packaging.html",
                image_url: "./assets/images/photos/packaging-bg.jpg"
            },
            {
                id: 5,
                title: "UI/UX Design",
                description: "Intuitive and beautiful user interfaces that enhance user experience and drive engagement.",
                icon: "fas fa-mobile-alt",
                features: ["Website Design", "Mobile App Design", "User Flows", "Prototyping"],
                link: "./templates/social-media/index.html",
                image_url: "./assets/images/photos/social-media-bg.jpg"
            },
            {
                id: 6,
                title: "Motion Graphics",
                description: "Dynamic animated content that brings your brand to life and captures attention.",
                icon: "fas fa-film",
                features: ["Animated Logos", "Explainer Videos", "Social Media Ads", "Presentation Graphics"],
                link: "./motion-graphics.html",
                image_url: "./assets/images/photos/motion-graphics-bg.jpg"
            }
        ];

        toolItems = [
            { name: "Adobe Photoshop", icon: "fab fa-adobe" },
            { name: "Adobe Illustrator", icon: "fab fa-adobe" },
            { name: "Adobe InDesign", icon: "fab fa-adobe" },
            { name: "Figma", icon: "fab fa-figma" },
            { name: "Blender", icon: "fas fa-cube" },
            { name: "Sketch", icon: "fab fa-sketch" },
            { name: "After Effects", icon: "fas fa-film" },
            { name: "Procreate", icon: "fas fa-paint-brush" }
        ];

        // Render all sections
        renderFeaturedSlider(featuredTemplates);
        renderPortfolio(portfolioItems);
        renderPopularGrid();
        renderServices(serviceItems);
        renderTools(toolItems);
    } catch (err) {
        console.error('Failed to load homepage data:', err);
        showToast('Failed to load templates. Please refresh.', 'error');
    }
}

// ===== FILTER HANDLERS =====
function setupFilters() {
    document.querySelectorAll('.filter-popular-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-popular-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentPopularFilter = this.dataset.filter;
            displayedPopularCount = 8;
            renderPopularGrid();
        });
    });

    const loadMoreBtn = document.getElementById('loadMorePopularBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            displayedPopularCount += 4;
            renderPopularGrid();
        });
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize starfield
    new StarfieldAnimation();

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true });
    }

    // Fetch and render data
    fetchHomepageData();

    // Setup filters
    setupFilters();

    // Modal close events
    document.getElementById('closeModal')?.addEventListener('click', closeTemplateModal);
    document.getElementById('overlay')?.addEventListener('click', closeTemplateModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('templateModal')?.classList.contains('active')) {
            closeTemplateModal();
        }
    });

    // Interaction buttons in modal
    document.getElementById('modalLikeBtn')?.addEventListener('click', () => {
        if (window.currentTemplateId) toggleLike(window.currentTemplateId);
    });
    document.getElementById('modalFavoriteBtn')?.addEventListener('click', () => {
        if (window.currentTemplateId) toggleFavorite(window.currentTemplateId);
    });
    document.getElementById('modalBookmarkBtn')?.addEventListener('click', () => {
        if (window.currentTemplateId) toggleBookmark(window.currentTemplateId);
    });
    document.getElementById('modalDownloadBtn')?.addEventListener('click', () => {
        if (window.currentTemplateId) downloadTemplate(window.currentTemplateId);
    });
    document.getElementById('downloadTemplateBtn')?.addEventListener('click', () => {
        if (window.currentTemplateId) downloadTemplate(window.currentTemplateId);
    });
    document.getElementById('modalShareBtn')?.addEventListener('click', () => {
        if (window.currentTemplateId) shareTemplate(window.currentTemplateId);
    });
    document.getElementById('previewBtn')?.addEventListener('click', () => {
        const img = document.getElementById('modalFullImage');
        if (img.src) window.open(img.src, '_blank');
    });
    document.getElementById('customizeBtn')?.addEventListener('click', () => {
        showToast('Online editor coming soon!', 'info');
    });
});