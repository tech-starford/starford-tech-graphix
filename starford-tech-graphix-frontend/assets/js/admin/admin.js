// Independent Admin JS
//const API_BASE_URL = 'http://localhost:5000'; // Change if needed
const API_BASE_URL = 'https://starford-tech-graphix.onrender.com';

// DOM Elements
const templateForm = document.getElementById('templateForm');
const templateId = document.getElementById('templateId');
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
const description = document.getElementById('description');
const category = document.getElementById('category');
const subcategory = document.getElementById('subcategory');
const image_url = document.getElementById('image_url');
const full_image_url = document.getElementById('full_image_url');
const download_url = document.getElementById('download_url');
const file_formats = document.getElementById('file_formats');
const dimensions = document.getElementById('dimensions');
const software = document.getElementById('software');
const print_ready = document.getElementById('print_ready');
const color_mode = document.getElementById('color_mode');
const file_size = document.getElementById('file_size');
const orientation = document.getElementById('orientation');
const paper_size = document.getElementById('paper_size');
const tags = document.getElementById('tags');
const design_details = document.getElementById('design_details');
const materials_specs = document.getElementById('materials_specs');
const design_inspiration = document.getElementById('design_inspiration');
const practical_applications = document.getElementById('practical_applications');
const features = document.getElementById('features');
const colors = document.getElementById('colors');
const likes_count = document.getElementById('likes_count');
const downloads_count = document.getElementById('downloads_count');
const favorites_count = document.getElementById('favorites_count');
const shares_count = document.getElementById('shares_count');
const bookmarks_count = document.getElementById('bookmarks_count');

const saveBtn = document.getElementById('saveBtn');
const cancelEdit = document.getElementById('cancelEdit');
const templatesList = document.getElementById('templatesList');
const userDisplay = document.getElementById('userDisplay');
const logoutBtn = document.getElementById('logoutBtn');

// Helper: get token
const getToken = () => localStorage.getItem('token');

// Helper: escape HTML
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Check admin status on load
async function checkAdmin() {
    const token = getToken();
    if (!token) {
        alert('You must be logged in to access admin.');
        window.location.href = './index.html';
        return false;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Not authenticated');
        const user = await res.json();
        if (!user.is_admin) {
            alert('You do not have admin privileges.');
            window.location.href = './index.html';
            return false;
        }
        userDisplay.textContent = `Welcome, ${user.name}`;
        return true;
    } catch (err) {
        console.error(err);
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = './index.html';
        return false;
    }
}

// Load templates
async function loadTemplates() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/templates?limit=100`);
        const data = await res.json();
        const templates = data.data || [];
        if (templates.length === 0) {
            templatesList.innerHTML = '<tr><td colspan="5">No templates found.</td></tr>';
            return;
        }
        templatesList.innerHTML = templates.map(t => `
            <tr>
                <td>${t.id}</td>
                <td>${escapeHtml(t.title)}</td>
                <td>${escapeHtml(t.category)}</td>
                <td>${escapeHtml(t.subcategory || '')}</td>
                <td>
                    <button class="btn-edit" onclick="editTemplate(${t.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-danger" onclick="deleteTemplate(${t.id})"><i class="fas fa-trash"></i> Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error(err);
        templatesList.innerHTML = '<tr><td colspan="5">Error loading templates.</td></tr>';
    }
}

// Edit template
window.editTemplate = async function(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/templates/${id}`);
        if (!res.ok) throw new Error('Template not found');
        const t = await res.json();

        templateId.value = t.id;
        title.value = t.title || '';
        subtitle.value = t.subtitle || '';
        description.value = t.description || '';
        category.value = t.category || '';
        subcategory.value = t.subcategory || '';
        image_url.value = t.image_url || '';
        full_image_url.value = t.full_image_url || '';
        download_url.value = t.download_url || '';
        file_formats.value = t.file_formats ? t.file_formats.join(', ') : '';
        dimensions.value = t.dimensions || '';
        software.value = t.software ? t.software.join(', ') : '';
        print_ready.value = t.print_ready || '';
        color_mode.value = t.color_mode || '';
        file_size.value = t.file_size || '';
        orientation.value = t.orientation || 'portrait';
        paper_size.value = t.paper_size || '';
        tags.value = t.tags ? t.tags.join(', ') : '';
        design_details.value = t.design_details || '';
        materials_specs.value = t.materials_specs || '';
        design_inspiration.value = t.design_inspiration || '';
        practical_applications.value = t.practical_applications || '';
        features.value = t.features ? t.features.join(', ') : '';
        colors.value = t.colors ? t.colors.join(', ') : '';
        likes_count.value = t.likes_count || 0;
        downloads_count.value = t.downloads_count || 0;
        favorites_count.value = t.favorites_count || 0;
        shares_count.value = t.shares_count || 0;
        bookmarks_count.value = t.bookmarks_count || 0;

        document.getElementById('formTitle').textContent = 'Edit Template';
        saveBtn.textContent = 'Update Template';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        console.error(err);
        alert('Could not load template for editing.');
    }
};

// Delete template
window.deleteTemplate = async function(id) {
    if (!confirm('Are you sure you want to delete this template?')) return;

    const token = getToken();
    try {
        const res = await fetch(`${API_BASE_URL}/api/admin/templates/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            alert('Template deleted.');
            loadTemplates();
            if (templateId.value == id) resetForm();
        } else {
            const err = await res.json();
            alert(err.message || 'Delete failed');
        }
    } catch (err) {
        console.error(err);
        alert('Network error');
    }
};

// Reset form
function resetForm() {
    templateForm.reset();
    templateId.value = '';
    document.getElementById('formTitle').textContent = 'Add New Template';
    saveBtn.textContent = 'Save Template';
}

// Submit form (add/update)
templateForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const templateData = {
        title: title.value,
        subtitle: subtitle.value || null,
        description: description.value || null,
        category: category.value,
        subcategory: subcategory.value || null,
        image_url: image_url.value,
        full_image_url: full_image_url.value || null,
        download_url: download_url.value,
        file_formats: file_formats.value.split(',').map(s => s.trim()).filter(Boolean),
        dimensions: dimensions.value || null,
        software: software.value.split(',').map(s => s.trim()).filter(Boolean),
        print_ready: print_ready.value || null,
        color_mode: color_mode.value || null,
        file_size: file_size.value || null,
        orientation: orientation.value,
        paper_size: paper_size.value || null,
        tags: tags.value.split(',').map(s => s.trim()).filter(Boolean),
        design_details: design_details.value || null,
        materials_specs: materials_specs.value || null,
        design_inspiration: design_inspiration.value || null,
        practical_applications: practical_applications.value || null,
        features: features.value.split(',').map(s => s.trim()).filter(Boolean),
        colors: colors.value.split(',').map(s => s.trim()).filter(Boolean),
        likes_count: parseInt(likes_count.value) || 0,
        downloads_count: parseInt(downloads_count.value) || 0,
        favorites_count: parseInt(favorites_count.value) || 0,
        shares_count: parseInt(shares_count.value) || 0,
        bookmarks_count: parseInt(bookmarks_count.value) || 0
    };

    const token = getToken();
    const id = templateId.value;
    const method = id ? 'PUT' : 'POST';
    const url = id 
        ? `${API_BASE_URL}/api/admin/templates/${id}`
        : `${API_BASE_URL}/api/admin/templates`;

    try {
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(templateData)
        });
        if (res.ok) {
            alert(id ? 'Template updated!' : 'Template created!');
            resetForm();
            loadTemplates();
        } else {
            const err = await res.json();
            alert(err.message || 'Operation failed');
        }
    } catch (err) {
        console.error(err);
        alert('Network error');
    }
});

// Cancel edit
cancelEdit.addEventListener('click', resetForm);

// Logout
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = './index.html';
});

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const isAdmin = await checkAdmin();
    if (isAdmin) {
        loadTemplates();
    }
});