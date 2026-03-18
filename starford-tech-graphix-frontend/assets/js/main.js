// ==================== CONFIG ====================
const API_BASE_URL = 'http://localhost:5000'; // change if needed

// ==================== UTILS ====================
const getToken = () => localStorage.getItem('token');

async function fetchWithAuth(url, options = {}) {
    options.headers = options.headers || {};
    const token = getToken();
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, options);
    return res;
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function showToast(message, type = 'success', duration = 3000) {
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4caf50;
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 9999;
                animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
                font-weight: 500;
            }
            .toast.error { background: #f44336; }
            .toast.info { background: #2196f3; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, duration);
}

// ==================== GLOBAL STATE ====================
let currentUser = null;
let allTemplates = []; // cache for search
let categoryLinks = {
    flyers: './templates/flyers/index.html',
    logos: './templates/logos/index.html',
    'business-cards': './templates/business-cards/index.html',
    'social-media': './templates/social-media/index.html',
    posters: './templates/posters/index.html',
    calendars: './templates/calendars/index.html',
    mockups: './templates/mockups/index.html'
};

// ===== INTERACTION STATE =====
let likedTemplates = new Set();
let favoritedTemplates = new Set();
let bookmarkedTemplates = new Set();

// ==================== FETCH USER INTERACTIONS ====================
async function fetchUserInteractions() {
    const token = getToken();
    if (!token) return;
    try {
        const [likesRes, favsRes, bookmarksRes] = await Promise.all([
            fetchWithAuth(`${API_BASE_URL}/api/interactions/likes`),
            fetchWithAuth(`${API_BASE_URL}/api/interactions/favorites`),
            fetchWithAuth(`${API_BASE_URL}/api/interactions/bookmarks`)
        ]);
        if (likesRes.ok) {
            const likes = await likesRes.json();
            likedTemplates = new Set(likes);
            localStorage.setItem('likedTemplates', JSON.stringify(Array.from(likedTemplates)));
        }
        if (favsRes.ok) {
            const favs = await favsRes.json();
            favoritedTemplates = new Set(favs);
            localStorage.setItem('favoritedTemplates', JSON.stringify(Array.from(favoritedTemplates)));
        }
        if (bookmarksRes.ok) {
            const bookmarks = await bookmarksRes.json();
            bookmarkedTemplates = new Set(bookmarks);
            localStorage.setItem('bookmarkedTemplates', JSON.stringify(Array.from(bookmarkedTemplates)));
        }
    } catch (err) {
        console.error('Failed to fetch user interactions:', err);
    }
}

// ==================== TOGGLE FUNCTIONS ====================
async function toggleLike(templateId) {
    const token = getToken();
    if (!token) {
        openAuthModal('login');
        return;
    }
    try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/interactions/like/${templateId}`, {
            method: 'POST'
        });
        if (!res.ok) throw new Error('Failed to toggle like');
        const data = await res.json();

        if (data.liked) {
            likedTemplates.add(templateId);
        } else {
            likedTemplates.delete(templateId);
        }
        localStorage.setItem('likedTemplates', JSON.stringify(Array.from(likedTemplates)));

        updateLikeCount(templateId, data.likes_count);
        updateLikeIcon(templateId, data.liked);
    } catch (err) {
        console.error(err);
        showToast('Error toggling like.', 'error');
    }
}

async function toggleFavorite(templateId) {
    const token = getToken();
    if (!token) {
        openAuthModal('login');
        return;
    }
    try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/interactions/favorite/${templateId}`, {
            method: 'POST'
        });
        if (!res.ok) throw new Error('Failed to toggle favorite');
        const data = await res.json();

        if (data.favorited) {
            favoritedTemplates.add(templateId);
        } else {
            favoritedTemplates.delete(templateId);
        }
        localStorage.setItem('favoritedTemplates', JSON.stringify(Array.from(favoritedTemplates)));

        updateFavoriteCount(templateId, data.favorites_count);
        updateFavoriteIcon(templateId, data.favorited);
    } catch (err) {
        console.error(err);
        showToast('Error toggling favorite.', 'error');
    }
}

async function toggleBookmark(templateId) {
    const token = getToken();
    if (!token) {
        openAuthModal('login');
        return;
    }
    try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/interactions/bookmark/${templateId}`, {
            method: 'POST'
        });
        if (!res.ok) throw new Error('Failed to toggle bookmark');
        const data = await res.json();

        if (data.bookmarked) {
            bookmarkedTemplates.add(templateId);
        } else {
            bookmarkedTemplates.delete(templateId);
        }
        localStorage.setItem('bookmarkedTemplates', JSON.stringify(Array.from(bookmarkedTemplates)));

        updateBookmarkCount(templateId, data.bookmarks_count);
        updateBookmarkIcon(templateId, data.bookmarked);
    } catch (err) {
        console.error(err);
        showToast('Error toggling bookmark.', 'error');
    }
}

async function downloadTemplate(templateId) {
    try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/interactions/download/${templateId}`, {
            method: 'POST'
        });
        if (!res.ok) throw new Error('Download failed');
        const data = await res.json();
        if (data.download_url) {
            window.location.href = data.download_url; // triggers file download
        }
        updateDownloadCount(templateId, data.downloads_count);
    } catch (err) {
        console.error(err);
        showToast('Download error.', 'error');
    }
}

async function shareTemplate(templateId) {
    try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/interactions/share/${templateId}`, {
            method: 'POST'
        });
        if (!res.ok) throw new Error('Share failed');
        const data = await res.json();
        updateShareCount(templateId, data.shares_count);
        showToast('Share counted!', 'success');
    } catch (err) {
        console.error(err);
        showToast('Share error.', 'error');
    }
}

// ==================== UI UPDATE HELPERS ====================
function updateLikeCount(templateId, count) {
    document.querySelectorAll(`.like-count[data-id="${templateId}"]`).forEach(el => {
        el.textContent = count;
    });
    if (window.currentTemplateId == templateId) {
        const modalLikeCount = document.getElementById('modalLikeCount');
        if (modalLikeCount) modalLikeCount.textContent = count;
    }
}

function updateLikeIcon(templateId, liked) {
    document.querySelectorAll(`.like-icon[data-id="${templateId}"]`).forEach(icon => {
        icon.className = liked ? 'fas fa-heart like-icon active' : 'far fa-heart like-icon';
    });
    if (window.currentTemplateId == templateId) {
        const modalLikeBtn = document.getElementById('modalLikeBtn');
        if (modalLikeBtn) {
            modalLikeBtn.classList.toggle('active', liked);
            const i = modalLikeBtn.querySelector('i');
            if (i) i.className = liked ? 'fas fa-heart' : 'far fa-heart';
        }
    }
}

function updateFavoriteCount(templateId, count) {
    document.querySelectorAll(`.favorite-count[data-id="${templateId}"]`).forEach(el => {
        el.textContent = count;
    });
    if (window.currentTemplateId == templateId) {
        const modalFavCount = document.getElementById('modalFavoriteCount');
        if (modalFavCount) modalFavCount.textContent = count;
    }
}

function updateFavoriteIcon(templateId, favorited) {
    document.querySelectorAll(`.favorite-icon[data-id="${templateId}"]`).forEach(icon => {
        icon.className = favorited ? 'fas fa-star favorite-icon active' : 'far fa-star favorite-icon';
    });
    if (window.currentTemplateId == templateId) {
        const modalFavBtn = document.getElementById('modalFavoriteBtn');
        if (modalFavBtn) {
            modalFavBtn.classList.toggle('active', favorited);
            const i = modalFavBtn.querySelector('i');
            if (i) i.className = favorited ? 'fas fa-star' : 'far fa-star';
        }
    }
}

function updateBookmarkCount(templateId, count) {
    document.querySelectorAll(`.bookmark-count[data-id="${templateId}"]`).forEach(el => {
        el.textContent = count;
    });
    if (window.currentTemplateId == templateId) {
        const modalBookmarkCount = document.getElementById('modalBookmarkCount');
        if (modalBookmarkCount) modalBookmarkCount.textContent = count;
    }
}

function updateBookmarkIcon(templateId, bookmarked) {
    document.querySelectorAll(`.bookmark-icon[data-id="${templateId}"]`).forEach(icon => {
        icon.className = bookmarked ? 'fas fa-bookmark bookmark-icon active' : 'far fa-bookmark bookmark-icon';
    });
    if (window.currentTemplateId == templateId) {
        const modalBookmarkBtn = document.getElementById('modalBookmarkBtn');
        if (modalBookmarkBtn) {
            modalBookmarkBtn.classList.toggle('active', bookmarked);
            const i = modalBookmarkBtn.querySelector('i');
            if (i) i.className = bookmarked ? 'fas fa-bookmark' : 'far fa-bookmark';
        }
    }
}

function updateDownloadCount(templateId, count) {
    document.querySelectorAll(`.download-count[data-id="${templateId}"]`).forEach(el => {
        el.textContent = count;
    });
    if (window.currentTemplateId == templateId) {
        const modalDownloadCount = document.getElementById('downloadCount');
        if (modalDownloadCount) modalDownloadCount.textContent = count;
    }
}

function updateShareCount(templateId, count) {
    document.querySelectorAll(`.share-count[data-id="${templateId}"]`).forEach(el => {
        el.textContent = count;
    });
    if (window.currentTemplateId == templateId) {
        const modalShareCount = document.getElementById('modalShareCount');
        if (modalShareCount) modalShareCount.textContent = count;
    }
}

// ==================== GLOBAL MODAL FUNCTIONS ====================
window.openTemplateModal = async function(id) {
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

        // Related designs (if any)
        // This will be handled by page-specific JS if needed

        document.getElementById('templateModal').classList.add('active');
        document.getElementById('overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    } catch (err) {
        console.error(err);
        showToast('Could not load template details.', 'error');
    }
};

window.closeTemplateModal = function() {
    document.getElementById('templateModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
};

// ==================== AUTH MODAL ====================
function openAuthModal(tab = 'login') {
    const modal = document.getElementById('authModal');
    const overlay = document.getElementById('overlay');
    if (modal) modal.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.classList.add('no-scroll');
    switchAuthTab(tab);
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    const overlay = document.getElementById('overlay');
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function switchAuthTab(tabId) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabId) tab.classList.add('active');
    });
    forms.forEach(form => {
        form.classList.remove('active');
        if (form.id === `${tabId}Form`) form.classList.add('active');
    });
}

// ==================== USER UI UPDATE (Desktop + Mobile) ====================
function updateUIForUser(user) {
    // Desktop
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('userDropdown');
    if (userBtn && userDropdown) {
        const newUserBtn = userBtn.cloneNode(true);
        userBtn.parentNode.replaceChild(newUserBtn, userBtn);
        const newUserDropdown = userDropdown.cloneNode(true);
        userDropdown.parentNode.replaceChild(newUserDropdown, userDropdown);

        if (user) {
            newUserBtn.innerHTML = `<i class="fas fa-user-circle"></i><span>${user.name}</span>`;
            let html = '';
            html += `<a href="../../my-profile/index.html"><i class="fas fa-user"></i> My Profile</a>`;
            if (user.is_admin) {
                html += `<a href="../../admin/index.html"><i class="fas fa-cog"></i> Admin Dashboard</a>`;
            }
            html += `<a href="#" id="logoutBtn">Logout</a>`;
            newUserDropdown.innerHTML = html;

            document.getElementById('logoutBtn').addEventListener('click', async (e) => {
                e.preventDefault();
                await logout();
            });
        } else {
            newUserBtn.innerHTML = `<i class="fas fa-user-circle"></i><span>Account</span>`;
            newUserDropdown.innerHTML = `
                <a href="#" class="login-btn" id="loginBtn">Login</a>
                <a href="#" class="signup-btn" id="signupBtn">Sign Up</a>
            `;
            document.getElementById('loginBtn').addEventListener('click', (e) => {
                e.preventDefault();
                openAuthModal('login');
            });
            document.getElementById('signupBtn').addEventListener('click', (e) => {
                e.preventDefault();
                openAuthModal('signup');
            });
        }

        newUserBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            newUserDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!newUserBtn.contains(e.target) && !newUserDropdown.contains(e.target)) {
                newUserDropdown.classList.remove('active');
            }
        });

        window.userBtn = newUserBtn;
        window.userDropdown = newUserDropdown;
    }

    // Mobile
    const mobileUserBtn = document.getElementById('mobileUserBtn');
    const mobileUserDropdown = document.getElementById('mobileUserDropdown');
    if (mobileUserBtn && mobileUserDropdown) {
        if (user) {
            mobileUserBtn.innerHTML = `<i class="fas fa-user-circle"></i><span class="user-name">${user.name}</span>`;
            let html = '';
            html += `<a href="../../my-profile/index.html"><i class="fas fa-user"></i> My Profile</a>`;
            if (user.is_admin) {
                html += `<a href="../../admin/index.html"><i class="fas fa-cog"></i> Admin Dashboard</a>`;
            }
            html += `<a href="#" id="mobileLogoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>`;
            mobileUserDropdown.innerHTML = html;

            document.getElementById('mobileLogoutBtn').addEventListener('click', async (e) => {
                e.preventDefault();
                await logout();
            });
        } else {
            mobileUserBtn.innerHTML = `<i class="fas fa-user-circle"></i><span class="user-name">Account</span>`;
            mobileUserDropdown.innerHTML = `
                <a href="#" id="mobileLoginBtn"><i class="fas fa-sign-in-alt"></i> Login</a>
                <a href="#" id="mobileSignupBtn"><i class="fas fa-user-plus"></i> Sign Up</a>
            `;
            document.getElementById('mobileLoginBtn').addEventListener('click', (e) => {
                e.preventDefault();
                openAuthModal('login');
            });
            document.getElementById('mobileSignupBtn').addEventListener('click', (e) => {
                e.preventDefault();
                openAuthModal('signup');
            });
        }

        // Toggle mobile dropdown
        mobileUserBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileUserDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!mobileUserBtn.contains(e.target) && !mobileUserDropdown.contains(e.target)) {
                mobileUserDropdown.classList.remove('active');
            }
        });
    }
}

// ==================== AUTH ACTIONS ====================
async function handleLogin(email, password) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    await fetchUserInteractions();
    currentUser = data.user;
    updateUIForUser(data.user);
    closeAuthModal();
    if (data.user.is_admin) {
        // optional redirect
    }
    return data.user;
}

async function handleSignup(name, email, password) {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    currentUser = data.user;
    updateUIForUser(data.user);
    closeAuthModal();
    return data.user;
}

async function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    likedTemplates.clear();
    favoritedTemplates.clear();
    bookmarkedTemplates.clear();
    localStorage.removeItem('likedTemplates');
    localStorage.removeItem('favoritedTemplates');
    localStorage.removeItem('bookmarkedTemplates');
    updateUIForUser(null);
}

async function checkSession() {
    const token = getToken();
    if (!token) {
        currentUser = null;
        updateUIForUser(null);
        return;
    }
    try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/me`);
        if (!res.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            currentUser = null;
            updateUIForUser(null);
            return;
        }
        const user = await res.json();
        currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
        await fetchUserInteractions();
        updateUIForUser(user);
    } catch (err) {
        console.error('Session check failed:', err);
    }
}

// ==================== NEWSLETTER ====================
function setupNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const email = input.value;
        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Subscribing...';
        btn.disabled = true;

        try {
            const res = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                showToast('Thank you for subscribing!');
                form.reset();
            } else {
                showToast(data.message || 'Subscription failed', 'error');
            }
        } catch (err) {
            showToast('Network error. Please try again.', 'error');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

// ==================== SEARCH ====================
async function loadAllTemplatesForSearch() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/templates?limit=1000`);
        const data = await res.json();
        allTemplates = data.data || [];
    } catch (err) {
        console.error('Failed to load templates for search:', err);
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'search-suggestions';
    searchInput.parentNode.appendChild(suggestionsDiv);

    searchInput.addEventListener('input', debounce(async function() {
        const term = this.value.trim().toLowerCase();
        if (term.length < 2) {
            suggestionsDiv.classList.remove('active');
            return;
        }

        const templateMatches = allTemplates.filter(t =>
            t.title.toLowerCase().includes(term) ||
            (t.description && t.description.toLowerCase().includes(term)) ||
            (t.tags && t.tags.some(tag => tag.toLowerCase().includes(term)))
        ).slice(0, 5);

        const categoryMatches = Object.entries(categoryLinks).filter(([key]) =>
            key.toLowerCase().includes(term)
        ).map(([key, url]) => ({ name: key.replace('-', ' '), url }));

        let html = '';
        categoryMatches.forEach(cat => {
            html += `
                <div class="suggestion-item category-link" data-url="${cat.url}">
                    <div class="suggestion-info">
                        <div class="suggestion-title suggestion-category-link">${cat.name} →</div>
                    </div>
                </div>
            `;
        });

        templateMatches.forEach(t => {
            html += `
                <div class="suggestion-item" data-id="${t.id}">
                    <img src="${t.image_url || 'https://via.placeholder.com/40'}" alt="${t.title}" loading="lazy">
                    <div class="suggestion-info">
                        <div class="suggestion-title">${t.title}</div>
                        <div class="suggestion-category">${t.category}</div>
                    </div>
                </div>
            `;
        });

        if (html === '') {
            suggestionsDiv.classList.remove('active');
            return;
        }

        suggestionsDiv.innerHTML = html;
        suggestionsDiv.classList.add('active');

        suggestionsDiv.querySelectorAll('.suggestion-item[data-id]').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                // Use global openTemplateModal
                if (typeof window.openTemplateModal === 'function') {
                    window.openTemplateModal(id);
                } else {
                    // fallback: navigate to template page
                    window.location.href = `./template.html?id=${id}`;
                }
                suggestionsDiv.classList.remove('active');
                searchInput.value = '';
            });
        });

        suggestionsDiv.querySelectorAll('.category-link').forEach(item => {
            item.addEventListener('click', () => {
                window.location.href = item.dataset.url;
            });
        });
    }, 300));

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.classList.remove('active');
        }
    });
}

// ==================== MOBILE NAVIGATION ====================
function setupMobileNav() {
    const toggles = document.querySelectorAll('.mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = document.getElementById('overlay');
    if (!toggles.length || !mobileNav) return;

    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
            mobileNav.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    });

    if (overlay) {
        overlay.addEventListener('click', () => {
            toggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }

    document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
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

// ==================== YOUTUBE POPUP (max 3 times) ====================
const YOUTUBE_POPUP_COUNT = 'youtubePopupCount';
let youtubeTimer = null;

function setupYouTubePopup() {
    const popup = document.getElementById('youtubePopup');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('closeYoutubePopup');
    const subscribeBtn = document.getElementById('subscribeBtn');
    const viewChannelBtn = document.getElementById('viewChannelBtn');

    if (!popup) return;

    let count = parseInt(sessionStorage.getItem(YOUTUBE_POPUP_COUNT) || '0');
    if (count >= 3) return;

    function showPopup() {
        if (count >= 3) return;
        popup.classList.add('active');
        if (overlay) overlay.classList.add('active');
    }

    function hidePopupAndScheduleNext() {
        popup.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        count++;
        sessionStorage.setItem(YOUTUBE_POPUP_COUNT, count.toString());
        if (count < 3) {
            if (youtubeTimer) clearTimeout(youtubeTimer);
            youtubeTimer = setTimeout(showPopup, 120000); // 2 minutes
        }
    }

    setTimeout(() => {
        count = parseInt(sessionStorage.getItem(YOUTUBE_POPUP_COUNT) || '0');
        if (count < 3) showPopup();
    }, 30000); // 30 seconds

    if (closeBtn) closeBtn.addEventListener('click', hidePopupAndScheduleNext);
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', () => {
            window.open('https://www.youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw', '_blank');
            hidePopupAndScheduleNext();
        });
    }
    if (viewChannelBtn) {
        viewChannelBtn.addEventListener('click', () => {
            window.open('https://www.youtube.com/@starford.tech7', '_blank');
            hidePopupAndScheduleNext();
        });
    }
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (popup.classList.contains('active')) hidePopupAndScheduleNext();
        });
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();

    if (document.getElementById('searchInput')) {
        await loadAllTemplatesForSearch();
        setupSearch();
    }

    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    if (loginBtn) loginBtn.addEventListener('click', (e) => { e.preventDefault(); openAuthModal('login'); });
    if (signupBtn) signupBtn.addEventListener('click', (e) => { e.preventDefault(); openAuthModal('signup'); });

    const mobileLogin = document.querySelector('.mobile-login-btn');
    const mobileSignup = document.querySelector('.mobile-signup-btn');
    if (mobileLogin) mobileLogin.addEventListener('click', (e) => { e.preventDefault(); openAuthModal('login'); });
    if (mobileSignup) mobileSignup.addEventListener('click', (e) => { e.preventDefault(); openAuthModal('signup'); });

    const closeBtn = document.getElementById('closeAuthModal');
    if (closeBtn) closeBtn.addEventListener('click', closeAuthModal);
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.addEventListener('click', closeAuthModal);

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            const btn = loginForm.querySelector('button[type="submit"]');
            const original = btn.textContent;
            btn.textContent = 'Logging in...';
            btn.disabled = true;
            try {
                await handleLogin(email, password);
            } catch (err) {
                showToast(err.message, 'error');
            } finally {
                btn.textContent = original;
                btn.disabled = false;
            }
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = signupForm.querySelector('input[type="text"]').value;
            const email = signupForm.querySelector('input[type="email"]').value;
            const password = signupForm.querySelectorAll('input[type="password"]')[0].value;
            const confirm = signupForm.querySelectorAll('input[type="password"]')[1].value;
            if (password !== confirm) {
                showToast('Passwords do not match', 'error');
                return;
            }
            const btn = signupForm.querySelector('button[type="submit"]');
            const original = btn.textContent;
            btn.textContent = 'Creating account...';
            btn.disabled = true;
            try {
                await handleSignup(name, email, password);
            } catch (err) {
                showToast(err.message, 'error');
            } finally {
                btn.textContent = original;
                btn.disabled = false;
            }
        });
    }

    setupNewsletter();
    setupMobileNav();
    setupYouTubePopup();

    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) backToTop.classList.add('active');
            else backToTop.classList.remove('active');
        });
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Global click handler for interaction icons
    document.addEventListener('click', (e) => {
        const likeIcon = e.target.closest('.like-icon');
        if (likeIcon) {
            e.preventDefault();
            const id = likeIcon.dataset.id;
            if (id) toggleLike(id);
        }

        const favIcon = e.target.closest('.favorite-icon');
        if (favIcon) {
            e.preventDefault();
            const id = favIcon.dataset.id;
            if (id) toggleFavorite(id);
        }

        const bookmarkIcon = e.target.closest('.bookmark-icon');
        if (bookmarkIcon) {
            e.preventDefault();
            const id = bookmarkIcon.dataset.id;
            if (id) toggleBookmark(id);
        }

        const downloadBtn = e.target.closest('.download-btn');
        if (downloadBtn) {
            e.preventDefault();
            const id = downloadBtn.dataset.id;
            if (id) downloadTemplate(id);
        }

        const shareBtn = e.target.closest('.share-btn');
        if (shareBtn) {
            e.preventDefault();
            const id = shareBtn.dataset.id;
            if (id) shareTemplate(id);
        }
    });

    if (typeof window.pageInit === 'function') {
        window.pageInit();
    }
});