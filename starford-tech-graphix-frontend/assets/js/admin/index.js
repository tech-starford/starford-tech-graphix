// Admin JavaScript – complete rewrite

// const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'https://starford-tech-graphix.onrender.com';
let currentUser = null;
let currentPage = { templates: 1, users: 1, subscribers: 1 };
let totalPages = { templates: 1, users: 1, subscribers: 1 };

// DOM elements
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const pageTitle = document.getElementById('pageTitle');
const contentArea = document.getElementById('contentArea');
const userDisplay = document.getElementById('userDisplay');
const logoutBtn = document.getElementById('logoutBtn');

// Helper: get token
const getToken = () => localStorage.getItem('token');

// Helper: fetch with auth
async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    options.headers = options.headers || {};
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, options);
    return res;
}

// Toast notification
function showToast(message, type = 'success', duration = 3000) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(toastContainer);
    }
    const toast = document.createElement('div');
    toast.style.cssText = `
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        font-weight: 500;
    `;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// Check admin session
async function checkAdmin() {
    const token = getToken();
    if (!token) {
        window.location.href = '../index.html';
        return false;
    }
    try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/me`);
        if (!res.ok) throw new Error('Not authenticated');
        const user = await res.json();
        if (!user.is_admin) {
            window.location.href = '../index.html';
            return false;
        }
        currentUser = user;
        userDisplay.textContent = `Welcome, ${user.name}`;
        return true;
    } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        window.location.href = '../index.html';
        return false;
    }
}

// Load dashboard content (stats + charts)
async function loadDashboard() {
    pageTitle.textContent = 'Dashboard';
    // Fetch stats from backend (simulate for now)
    let stats = { templates: 0, users: 0, subscribers: 0, downloads: 0 };
    try {
        const [templatesRes, usersRes, subscribersRes, downloadsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/templates?limit=1`),
            fetchWithAuth(`${API_BASE_URL}/api/admin/users?limit=1`),
            fetch(`${API_BASE_URL}/api/newsletter/count`),
            fetch(`${API_BASE_URL}/api/downloads/count`)
        ]);
        if (templatesRes.ok) {
            const tData = await templatesRes.json();
            stats.templates = tData.pagination.total || 0;
        }
        if (usersRes.ok) {
            const uData = await usersRes.json();
            stats.users = uData.total || 0;
        }
        if (subscribersRes.ok) {
            const sData = await subscribersRes.json();
            stats.subscribers = sData.count || 0;
        }
        if (downloadsRes.ok) {
            const dData = await downloadsRes.json();
            stats.downloads = dData.count || 0;
        }
    } catch (err) {
        console.error('Error fetching stats:', err);
    }

    const html = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-palette"></i></div>
                <div class="stat-info">
                    <h3>Templates</h3>
                    <div class="stat-value">${stats.templates}</div>
                    <div class="stat-change">+12% this month</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-users"></i></div>
                <div class="stat-info">
                    <h3>Users</h3>
                    <div class="stat-value">${stats.users}</div>
                    <div class="stat-change">+5% this month</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-envelope"></i></div>
                <div class="stat-info">
                    <h3>Subscribers</h3>
                    <div class="stat-value">${stats.subscribers}</div>
                    <div class="stat-change">+8% this month</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-download"></i></div>
                <div class="stat-info">
                    <h3>Downloads</h3>
                    <div class="stat-value">${stats.downloads}</div>
                    <div class="stat-change">+20% this month</div>
                </div>
            </div>
        </div>
        <div class="charts-row">
            <div class="chart-card">
                <h3><i class="fas fa-chart-bar" style="margin-right:8px;"></i>Downloads (Last 7 days)</h3>
                <div class="chart-container">
                    <canvas id="downloadsChart"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <h3><i class="fas fa-chart-pie" style="margin-right:8px;"></i>Templates by Category</h3>
                <div class="chart-container">
                    <canvas id="categoryChart"></canvas>
                </div>
            </div>
        </div>
        <div class="table-card">
            <div class="table-header">
                <h2>Recent Templates</h2>
                <a href="#" class="btn btn-primary" onclick="switchTab('templates')">View All</a>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Downloads</th>
                            <th>Likes</th>
                        </tr>
                    </thead>
                    <tbody id="recentTemplates">
                        <tr><td colspan="5">Loading...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    contentArea.innerHTML = html;

    // Load recent templates
    loadRecentTemplates();

    // Initialize charts after DOM is ready
    setTimeout(() => {
        initCharts();
    }, 100);
}

async function loadRecentTemplates() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/templates?limit=5`);
        const data = await res.json();
        const templates = data.data || [];
        const tbody = document.getElementById('recentTemplates');
        if (templates.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No templates found.</td></tr>';
            return;
        }
        tbody.innerHTML = templates.map(t => `
            <tr>
                <td>${t.id}</td>
                <td>${escapeHtml(t.title)}</td>
                <td>${escapeHtml(t.category)}</td>
                <td>${t.downloads_count}</td>
                <td>${t.likes_count}</td>
            </tr>
        `).join('');
    } catch (err) {
        console.error(err);
    }
}

function initCharts() {
    // Downloads chart (last 7 days)
    const ctx1 = document.getElementById('downloadsChart')?.getContext('2d');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Downloads',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // Category pie chart
    const ctx2 = document.getElementById('categoryChart')?.getContext('2d');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Flyers', 'Logos', 'Business Cards', 'Social Media', 'Posters', 'Calendars'],
                datasets: [{
                    data: [30, 20, 15, 18, 10, 7],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}

// Templates Management
async function loadTemplates(page = 1) {
    pageTitle.textContent = 'Templates';
    const html = `
        <div class="form-card" id="templateFormCard">
            <h2 id="formTitle">Add New Template</h2>
            <form id="templateForm">
                <input type="hidden" id="templateId">
                <div class="form-row">
                    <div class="form-group">
                        <label for="title">Title *</label>
                        <input type="text" id="title" required>
                    </div>
                    <div class="form-group">
                        <label for="subtitle">Subtitle</label>
                        <input type="text" id="subtitle">
                    </div>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" rows="2"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="category">Category *</label>
                        <select id="category" required>
                            <option value="">-- Select --</option>
                            <option value="flyers">Flyers</option>
                            <option value="logos">Logos</option>
                            <option value="business-cards">Business Cards</option>
                            <option value="social-media">Social Media</option>
                            <option value="posters">Posters</option>
                            <option value="calendars">Calendars</option>
                            <option value="mockups">Mockups</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="subcategory">Subcategory</label>
                        <input type="text" id="subcategory" placeholder="e.g., Business Flyers">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="image_url">Image URL *</label>
                        <input type="url" id="image_url" required>
                    </div>
                    <div class="form-group">
                        <label for="full_image_url">Full Image URL</label>
                        <input type="url" id="full_image_url">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="download_url">Download URL *</label>
                        <input type="url" id="download_url" required>
                    </div>
                    <div class="form-group">
                        <label for="file_formats">File Formats (comma separated)</label>
                        <input type="text" id="file_formats" placeholder="PDF, PSD, AI">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="dimensions">Dimensions</label>
                        <input type="text" id="dimensions" placeholder="e.g., A4">
                    </div>
                    <div class="form-group">
                        <label for="software">Software (comma separated)</label>
                        <input type="text" id="software" placeholder="Adobe Photoshop, Illustrator">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="print_ready">Print Ready</label>
                        <input type="text" id="print_ready" placeholder="Yes/No">
                    </div>
                    <div class="form-group">
                        <label for="color_mode">Color Mode</label>
                        <input type="text" id="color_mode" placeholder="CMYK/RGB">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="file_size">File Size</label>
                        <input type="text" id="file_size" placeholder="e.g., 45 MB">
                    </div>
                    <div class="form-group">
                        <label for="orientation">Orientation</label>
                        <select id="orientation">
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                            <option value="square">Square</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="paper_size">Paper Size</label>
                        <input type="text" id="paper_size" placeholder="e.g., A4, US Letter">
                    </div>
                    <div class="form-group">
                        <label for="tags">Tags (comma separated)</label>
                        <input type="text" id="tags" placeholder="business, corporate">
                    </div>
                </div>
                <div class="form-group">
                    <label for="design_details">Design Details</label>
                    <textarea id="design_details" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label for="materials_specs">Materials & Specifications</label>
                    <textarea id="materials_specs" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label for="design_inspiration">Design Inspiration</label>
                    <textarea id="design_inspiration" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label for="practical_applications">Practical Applications</label>
                    <textarea id="practical_applications" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label for="features">Features (comma separated)</label>
                    <input type="text" id="features" placeholder="Fully editable, Print-ready">
                </div>
                <div class="form-group">
                    <label for="colors">Colors (comma separated hex codes)</label>
                    <input type="text" id="colors" placeholder="#2C3E50, #3498DB">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="likes_count">Likes Count</label>
                        <input type="number" id="likes_count" value="0" min="0">
                    </div>
                    <div class="form-group">
                        <label for="downloads_count">Downloads Count</label>
                        <input type="number" id="downloads_count" value="0" min="0">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="favorites_count">Favorites Count</label>
                        <input type="number" id="favorites_count" value="0" min="0">
                    </div>
                    <div class="form-group">
                        <label for="shares_count">Shares Count</label>
                        <input type="number" id="shares_count" value="0" min="0">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="bookmarks_count">Bookmarks Count</label>
                        <input type="number" id="bookmarks_count" value="0" min="0">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary" id="saveBtn">Save Template</button>
                    <button type="button" class="btn btn-secondary" id="cancelEdit">Cancel</button>
                </div>
            </form>
        </div>
        <div class="table-card">
            <div class="table-header">
                <h2>All Templates</h2>
                <div class="table-actions">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchTemplates" placeholder="Search templates...">
                    </div>
                    <button class="btn btn-primary" onclick="loadTemplates()"><i class="fas fa-sync-alt"></i></button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Subcategory</th>
                            <th>Likes</th>
                            <th>Downloads</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="templatesList">
                        <tr><td colspan="7">Loading...</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination" id="templatesPagination"></div>
        </div>
    `;
    contentArea.innerHTML = html;

    await fetchTemplates(page);
    setupTemplateForm();
    document.getElementById('searchTemplates')?.addEventListener('input', debounce(searchTemplates, 300));
}

async function fetchTemplates(page = 1) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/templates?limit=10&page=${page}`);
        const data = await res.json();
        const templates = data.data || [];
        const tbody = document.getElementById('templatesList');
        if (templates.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No templates found.</td></tr>';
            return;
        }
        tbody.innerHTML = templates.map(t => `
            <tr>
                <td>${t.id}</td>
                <td>${escapeHtml(t.title)}</td>
                <td>${escapeHtml(t.category)}</td>
                <td>${escapeHtml(t.subcategory || '')}</td>
                <td>${t.likes_count}</td>
                <td>${t.downloads_count}</td>
                <td>
                    <button class="btn-edit" onclick="editTemplate(${t.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-danger" onclick="deleteTemplate(${t.id})"><i class="fas fa-trash"></i> Delete</button>
                </td>
            </tr>
        `).join('');
        totalPages.templates = data.pagination.pages || 1;
        currentPage.templates = page;
        renderPagination('templates', page, totalPages.templates);
    } catch (err) {
        console.error(err);
        document.getElementById('templatesList').innerHTML = '<tr><td colspan="7">Error loading templates.</td></tr>';
    }
}

function searchTemplates(e) {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#templatesList tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

function setupTemplateForm() {
    const form = document.getElementById('templateForm');
    const cancelBtn = document.getElementById('cancelEdit');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const templateData = {
            title: document.getElementById('title').value,
            subtitle: document.getElementById('subtitle').value || null,
            description: document.getElementById('description').value || null,
            category: document.getElementById('category').value,
            subcategory: document.getElementById('subcategory').value || null,
            image_url: document.getElementById('image_url').value,
            full_image_url: document.getElementById('full_image_url').value || null,
            download_url: document.getElementById('download_url').value,
            file_formats: document.getElementById('file_formats').value.split(',').map(s => s.trim()).filter(Boolean),
            dimensions: document.getElementById('dimensions').value || null,
            software: document.getElementById('software').value.split(',').map(s => s.trim()).filter(Boolean),
            print_ready: document.getElementById('print_ready').value || null,
            color_mode: document.getElementById('color_mode').value || null,
            file_size: document.getElementById('file_size').value || null,
            orientation: document.getElementById('orientation').value,
            paper_size: document.getElementById('paper_size').value || null,
            tags: document.getElementById('tags').value.split(',').map(s => s.trim()).filter(Boolean),
            design_details: document.getElementById('design_details').value || null,
            materials_specs: document.getElementById('materials_specs').value || null,
            design_inspiration: document.getElementById('design_inspiration').value || null,
            practical_applications: document.getElementById('practical_applications').value || null,
            features: document.getElementById('features').value.split(',').map(s => s.trim()).filter(Boolean),
            colors: document.getElementById('colors').value.split(',').map(s => s.trim()).filter(Boolean),
            likes_count: parseInt(document.getElementById('likes_count').value) || 0,
            downloads_count: parseInt(document.getElementById('downloads_count').value) || 0,
            favorites_count: parseInt(document.getElementById('favorites_count').value) || 0,
            shares_count: parseInt(document.getElementById('shares_count').value) || 0,
            bookmarks_count: parseInt(document.getElementById('bookmarks_count').value) || 0
        };
        const id = document.getElementById('templateId').value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE_URL}/api/admin/templates/${id}` : `${API_BASE_URL}/api/admin/templates`;

        try {
            const res = await fetchWithAuth(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(templateData)
            });
            if (res.ok) {
                showToast(id ? 'Template updated!' : 'Template created!');
                resetTemplateForm();
                fetchTemplates(currentPage.templates);
            } else {
                const err = await res.json();
                showToast(err.message || 'Operation failed', 'error');
            }
        } catch (err) {
            showToast('Network error', 'error');
        }
    });

    cancelBtn.addEventListener('click', resetTemplateForm);
}

window.editTemplate = async function(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/templates/${id}`);
        if (!res.ok) throw new Error('Template not found');
        const t = await res.json();

        document.getElementById('templateId').value = t.id;
        document.getElementById('title').value = t.title || '';
        document.getElementById('subtitle').value = t.subtitle || '';
        document.getElementById('description').value = t.description || '';
        document.getElementById('category').value = t.category || '';
        document.getElementById('subcategory').value = t.subcategory || '';
        document.getElementById('image_url').value = t.image_url || '';
        document.getElementById('full_image_url').value = t.full_image_url || '';
        document.getElementById('download_url').value = t.download_url || '';
        document.getElementById('file_formats').value = t.file_formats ? t.file_formats.join(', ') : '';
        document.getElementById('dimensions').value = t.dimensions || '';
        document.getElementById('software').value = t.software ? t.software.join(', ') : '';
        document.getElementById('print_ready').value = t.print_ready || '';
        document.getElementById('color_mode').value = t.color_mode || '';
        document.getElementById('file_size').value = t.file_size || '';
        document.getElementById('orientation').value = t.orientation || 'portrait';
        document.getElementById('paper_size').value = t.paper_size || '';
        document.getElementById('tags').value = t.tags ? t.tags.join(', ') : '';
        document.getElementById('design_details').value = t.design_details || '';
        document.getElementById('materials_specs').value = t.materials_specs || '';
        document.getElementById('design_inspiration').value = t.design_inspiration || '';
        document.getElementById('practical_applications').value = t.practical_applications || '';
        document.getElementById('features').value = t.features ? t.features.join(', ') : '';
        document.getElementById('colors').value = t.colors ? t.colors.join(', ') : '';
        document.getElementById('likes_count').value = t.likes_count || 0;
        document.getElementById('downloads_count').value = t.downloads_count || 0;
        document.getElementById('favorites_count').value = t.favorites_count || 0;
        document.getElementById('shares_count').value = t.shares_count || 0;
        document.getElementById('bookmarks_count').value = t.bookmarks_count || 0;

        document.getElementById('formTitle').textContent = 'Edit Template';
        document.getElementById('saveBtn').textContent = 'Update Template';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        console.error(err);
        showToast('Could not load template for editing.', 'error');
    }
};

window.deleteTemplate = async function(id) {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/admin/templates/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Template deleted.');
            fetchTemplates(currentPage.templates);
        } else {
            const err = await res.json();
            showToast(err.message || 'Delete failed', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }
};

function resetTemplateForm() {
    document.getElementById('templateForm').reset();
    document.getElementById('templateId').value = '';
    document.getElementById('formTitle').textContent = 'Add New Template';
    document.getElementById('saveBtn').textContent = 'Save Template';
}

// Users Management
async function loadUsers(page = 1) {
    pageTitle.textContent = 'Users';
    const html = `
        <div class="table-card">
            <div class="table-header">
                <h2>All Users</h2>
                <div class="table-actions">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchUsers" placeholder="Search users...">
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="usersList">
                        <tr><td colspan="6">Loading...</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination" id="usersPagination"></div>
        </div>
    `;
    contentArea.innerHTML = html;
    await fetchUsers(page);
    document.getElementById('searchUsers')?.addEventListener('input', debounce(searchUsers, 300));
}

async function fetchUsers(page = 1) {
    try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/admin/users?limit=10&page=${page}`);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        const users = data.users || [];
        const tbody = document.getElementById('usersList');
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No users found.</td></tr>';
            return;
        }
        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.id}</td>
                <td>${escapeHtml(u.name)}</td>
                <td>${escapeHtml(u.email)}</td>
                <td><span class="badge ${u.is_admin ? 'badge-success' : 'badge-warning'}">${u.is_admin ? 'Yes' : 'No'}</span></td>
                <td>${new Date(u.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn-edit" onclick="toggleAdmin(${u.id}, ${u.is_admin})"><i class="fas fa-user-shield"></i> Toggle Admin</button>
                </td>
            </tr>
        `).join('');
        totalPages.users = data.pages || 1;
        currentPage.users = page;
        renderPagination('users', page, totalPages.users);
    } catch (err) {
        console.error(err);
        document.getElementById('usersList').innerHTML = '<tr><td colspan="6">Error loading users.</td></tr>';
    }
}

window.toggleAdmin = async function(userId, currentStatus) {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'remove admin from' : 'make admin'} this user?`)) return;
    try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/admin/users/${userId}/toggle-admin`, {
            method: 'PUT'
        });
        if (res.ok) {
            showToast('Admin status updated.');
            fetchUsers(currentPage.users);
        } else {
            const err = await res.json();
            showToast(err.message || 'Update failed', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }
};

function searchUsers(e) {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#usersList tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

// Subscribers Management
async function loadSubscribers(page = 1) {
    pageTitle.textContent = 'Newsletter Subscribers';
    const html = `
        <div class="table-card">
            <div class="table-header">
                <h2>Subscribers</h2>
                <div class="table-actions">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchSubscribers" placeholder="Search email...">
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Subscribed</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="subscribersList">
                        <tr><td colspan="4">Loading...</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination" id="subscribersPagination"></div>
        </div>
    `;
    contentArea.innerHTML = html;
    await fetchSubscribers(page);
    document.getElementById('searchSubscribers')?.addEventListener('input', debounce(searchSubscribers, 300));
}

async function fetchSubscribers(page = 1) {
    try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/admin/subscribers?limit=10&page=${page}`);
        if (!res.ok) throw new Error('Failed to fetch subscribers');
        const data = await res.json();
        const subscribers = data.subscribers || [];
        const tbody = document.getElementById('subscribersList');
        if (subscribers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No subscribers found.</td></tr>';
            return;
        }
        tbody.innerHTML = subscribers.map(s => `
            <tr>
                <td>${s.id}</td>
                <td>${escapeHtml(s.email)}</td>
                <td>${new Date(s.subscribed_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn-danger" onclick="deleteSubscriber(${s.id})"><i class="fas fa-trash"></i> Delete</button>
                </td>
            </tr>
        `).join('');
        totalPages.subscribers = data.pages || 1;
        currentPage.subscribers = page;
        renderPagination('subscribers', page, totalPages.subscribers);
    } catch (err) {
        console.error(err);
        document.getElementById('subscribersList').innerHTML = '<tr><td colspan="4">Error loading subscribers.</td></tr>';
    }
}

window.deleteSubscriber = async function(id) {
    if (!confirm('Delete this subscriber?')) return;
    try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/admin/subscribers/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Subscriber deleted.');
            fetchSubscribers(currentPage.subscribers);
        } else {
            showToast('Delete failed', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }
};

function searchSubscribers(e) {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#subscribersList tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

// Analytics
async function loadAnalytics() {
    pageTitle.textContent = 'Analytics';
    const html = `
        <div class="charts-row">
            <div class="chart-card">
                <h3>Downloads Over Time</h3>
                <div class="chart-container">
                    <canvas id="downloadsAnalyticsChart"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <h3>User Registrations</h3>
                <div class="chart-container">
                    <canvas id="usersAnalyticsChart"></canvas>
                </div>
            </div>
        </div>
        <div class="charts-row">
            <div class="chart-card">
                <h3>Template Categories</h3>
                <div class="chart-container">
                    <canvas id="categoryAnalyticsChart"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <h3>Top 5 Templates</h3>
                <div class="table-responsive">
                    <table class="admin-table">
                        <thead>
                            <tr><th>Title</th><th>Downloads</th></tr>
                        </thead>
                        <tbody id="topTemplatesList"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    contentArea.innerHTML = html;
    // Fetch real data and initialize charts
    setTimeout(() => {
        initAnalyticsCharts();
    }, 100);
}

function initAnalyticsCharts() {
    // Downloads over time (example)
    const ctx1 = document.getElementById('downloadsAnalyticsChart')?.getContext('2d');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Downloads',
                    data: [1200, 1900, 3000, 5000, 2300, 3400],
                    borderColor: '#3b82f6'
                }]
            }
        });
    }
    // User registrations
    const ctx2 = document.getElementById('usersAnalyticsChart')?.getContext('2d');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Users',
                    data: [200, 450, 600, 800, 950, 1100],
                    borderColor: '#10b981'
                }]
            }
        });
    }
    // Category pie
    const ctx3 = document.getElementById('categoryAnalyticsChart')?.getContext('2d');
    if (ctx3) {
        new Chart(ctx3, {
            type: 'doughnut',
            data: {
                labels: ['Flyers', 'Logos', 'Cards', 'Social', 'Posters', 'Calendars'],
                datasets: [{
                    data: [35, 25, 15, 10, 8, 7],
                    backgroundColor: ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899']
                }]
            }
        });
    }
    // Top templates (placeholder)
    document.getElementById('topTemplatesList').innerHTML = `
        <tr><td>Business Flyer</td><td>3245</td></tr>
        <tr><td>Event Flyer</td><td>4281</td></tr>
        <tr><td>Logo Pack</td><td>2134</td></tr>
        <tr><td>Social Media Kit</td><td>1876</td></tr>
        <tr><td>Calendar 2026</td><td>1567</td></tr>
    `;
}

// Pagination
function renderPagination(type, current, total) {
    const container = document.getElementById(`${type}Pagination`);
    if (!container) return;
    let html = '';
    for (let i = 1; i <= total; i++) {
        html += `<button class="${i === current ? 'active' : ''}" onclick="goToPage('${type}', ${i})">${i}</button>`;
    }
    container.innerHTML = html;
}

window.goToPage = function(type, page) {
    if (type === 'templates') fetchTemplates(page);
    else if (type === 'users') fetchUsers(page);
    else if (type === 'subscribers') fetchSubscribers(page);
};

// Tab switching
function switchTab(tabId) {
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    document.querySelector(`.sidebar-nav a[data-tab="${tabId}"]`).classList.add('active');

    if (tabId === 'dashboard') loadDashboard();
    else if (tabId === 'templates') loadTemplates();
    else if (tabId === 'users') loadUsers();
    else if (tabId === 'subscribers') loadSubscribers();
    else if (tabId === 'analytics') loadAnalytics();
}

// Sidebar toggle
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Logout
logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '../index.html';
});

// Utility: debounce
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initialise
document.addEventListener('DOMContentLoaded', async () => {
    const isAdmin = await checkAdmin();
    if (isAdmin) {
        // Set up sidebar navigation
        document.querySelectorAll('.sidebar-nav a[data-tab]').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = a.dataset.tab;
                switchTab(tab);
            });
        });
        // Load default tab (dashboard)
        switchTab('dashboard');
    }
});