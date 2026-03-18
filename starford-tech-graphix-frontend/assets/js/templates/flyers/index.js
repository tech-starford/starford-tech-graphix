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

// ===== RENDER GRID =====
function renderProjectsGrid(filterCategory = 'all', filterOrientation = 'all', sortBy = 'newest') {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    let filtered = Object.values(flyersData).filter(flr => {
        if (filterCategory !== 'all' && !flr.categories.includes(filterCategory)) return false;
        if (filterOrientation !== 'all' && flr.orientation !== filterOrientation) return false;
        return true;
    });

    if (sortBy === 'popular') filtered.sort((a,b) => b.likes_count - a.likes_count);
    else if (sortBy === 'downloads') filtered.sort((a,b) => b.downloads_count - a.downloads_count);
    else if (sortBy === 'az') filtered.sort((a,b) => a.title.localeCompare(b.title));
    else if (sortBy === 'za') filtered.sort((a,b) => b.title.localeCompare(a.title));
    else filtered.sort((a,b) => b.id - a.id); // newest

    grid.innerHTML = filtered.map(flr => {
        const isLiked = likedTemplates.has(flr.id);
        const badgeText = flr.categories[0].charAt(0).toUpperCase() + flr.categories[0].slice(1);

        return `
        <div class="project-card" data-id="${flr.id}" data-category="${flr.categories.join(' ')}" data-orientation="${flr.orientation}">
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

// ===== FALLBACK DATA (your 12 flyers, copied from original) =====
const fallbackFlyers = { /* paste your original flyers object here */ };

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
    document.getElementById('flyerType').textContent = flr.flyerType || flr.subcategory;
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

    // Video section
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