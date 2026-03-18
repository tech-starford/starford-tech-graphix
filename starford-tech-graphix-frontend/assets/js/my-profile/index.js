// ===== FETCH USER PROFILE =====
async function loadProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }
    try {
        // Use global API_BASE_URL from main.js
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error('Not authenticated');
        const user = await res.json();
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileEmail').textContent = user.email;
        if (user.created_at) {
            const joined = new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            document.getElementById('profileJoined').textContent = `Joined ${joined}`;
        }
        return user;
    } catch (err) {
        console.error(err);
        window.location.href = '../index.html';
    }
}

// ===== FETCH LIKED TEMPLATES =====
async function loadLikedTemplates() {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/interactions/likes/details`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch likes');
        const templates = await res.json();
        document.getElementById('statLiked').textContent = templates.length;
        document.getElementById('countLiked').textContent = templates.length;
        renderTemplates(templates, 'likedGrid');
    } catch (err) {
        console.error(err);
        document.getElementById('likedGrid').innerHTML = '<p class="no-data">Failed to load liked templates.</p>';
    }
}

// ===== FETCH FAVORITES =====
async function loadFavorites() {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/interactions/favorites/details`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch favorites');
        const templates = await res.json();
        document.getElementById('statFavorited').textContent = templates.length;
        document.getElementById('countFavorites').textContent = templates.length;
        renderTemplates(templates, 'favoritesGrid');
    } catch (err) {
        console.error(err);
        document.getElementById('favoritesGrid').innerHTML = '<p class="no-data">Failed to load favorites.</p>';
    }
}

// ===== FETCH BOOKMARKS =====
async function loadBookmarks() {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/interactions/bookmarks/details`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch bookmarks');
        const templates = await res.json();
        document.getElementById('statBookmarked').textContent = templates.length;
        document.getElementById('countBookmarks').textContent = templates.length;
        renderTemplates(templates, 'bookmarksGrid');
    } catch (err) {
        console.error(err);
        document.getElementById('bookmarksGrid').innerHTML = '<p class="no-data">Failed to load bookmarks.</p>';
    }
}

// ===== FETCH DOWNLOADS =====
async function loadDownloads() {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/interactions/downloads`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch downloads');
        const templates = await res.json();
        document.getElementById('statDownloads').textContent = templates.length;
        document.getElementById('countDownloads').textContent = templates.length;
        renderTemplates(templates, 'downloadsGrid');
    } catch (err) {
        console.error(err);
        document.getElementById('downloadsGrid').innerHTML = '<p class="no-data">Failed to load downloads.</p>';
    }
}

// ===== RENDER TEMPLATES IN GRID =====
function renderTemplates(templates, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    if (!templates || templates.length === 0) {
        grid.innerHTML = '<p class="no-data">No templates found.</p>';
        return;
    }
    let html = '';
    templates.forEach(t => {
        // Use global likedTemplates Set from main.js
        const liked = typeof likedTemplates !== 'undefined' && likedTemplates.has(t.id);
        html += `
        <div class="project-card" data-id="${t.id}">
            <div class="project-badge">${t.subcategory || t.category || 'Template'}</div>
            <div class="project-img">
                <img src="${t.image_url}" alt="${t.title}" loading="lazy">
            </div>
            <div class="project-info">
                <h3>${t.title}</h3>
                <p>${t.subtitle || ''}</p>
                <div class="project-meta">
                    <span class="project-price free">FREE</span>
                    <div class="project-stats">
                        <span class="project-likes">
                            <i class="${liked ? 'fas' : 'far'} fa-heart like-icon" data-id="${t.id}"></i>
                            <span class="like-count" data-id="${t.id}">${t.likes_count}</span>
                        </span>
                        <span class="project-downloads">
                            <i class="fas fa-download"></i>
                            <span class="download-count" data-id="${t.id}">${t.downloads_count}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    grid.innerHTML = html;

    // Attach card click to open modal (using global function from main.js)
    grid.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.like-icon') || e.target.closest('.project-likes')) return;
            const id = this.dataset.id;
            if (typeof window.openTemplateModal === 'function') {
                window.openTemplateModal(id);
            } else {
                console.log('Open template', id);
            }
        });
    });
}

// ===== TAB SWITCHING =====
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in
    const user = await loadProfile();
    if (!user) return;

    setupTabs();

    // Load all sections
    await Promise.all([
        loadLikedTemplates(),
        loadFavorites(),
        loadBookmarks(),
        loadDownloads()
    ]);

    // AOS init
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true });
    }
});