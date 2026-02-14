// ===================================
// MOST WANTED - JAVASCRIPT BUNDLE
// Modern JavaScript Architecture
// ===================================

// Global App Class
class MostWantedApp {
    constructor() {
        this.currentUser = null;
        this.isLoading = false;
        this.init();
    }

    async init() {
        await this.checkAuth();
        await this.loadUserProfile();
        this.setupEventListeners();
        this.initializeComponents();
    }

    // Authentication System
    async checkAuth() {
        try {
            const userData = localStorage.getItem('mostWantedCurrentUser');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                this.updateNavigation();
            }
        } catch (error) {
            this.handleError(error, 'authentication');
        }
    }

    // Navigation System
    updateNavigation() {
        const nav = document.querySelector('.clean-nav');
        if (!nav) return;

        // Clear existing content
        nav.innerHTML = '';

        // Add navigation links
        const links = [
            { href: 'index.html', text: '🏠 Home' },
            { href: 'car-meets.html', text: '🚗 Car Meets' },
            { href: 'merch.html', text: '🛍️ Merch' },
            { href: 'team.html', text: '👥 Team' },
            { href: 'feed.html', text: '📢 Feed' }
        ];

        links.forEach(link => {
            const btn = document.createElement('a');
            btn.className = 'nav-btn';
            btn.href = link.href;
            btn.textContent = link.text;
            nav.appendChild(btn);
        });

        // Add user info
        if (this.currentUser) {
            const userInfo = document.createElement('div');
            userInfo.className = 'user-info';
            userInfo.innerHTML = `
                <span>👤 ${this.currentUser.name}</span>
                <a href="profile.html" class="profile-link-nav">👤 Profile</a>
            `;
            nav.appendChild(userInfo);

            // Add logout button
            const logoutBtn = document.createElement('a');
            logoutBtn.className = 'nav-btn logout-btn';
            logoutBtn.href = '#';
            logoutBtn.textContent = 'Logout';
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                this.logout();
            };
            nav.appendChild(logoutBtn);
        }
    }

    logout() {
        localStorage.removeItem('mostWantedCurrentUser');
        window.location.href = 'auth.html';
    }

    // Profile Management
    async loadUserProfile() {
        if (!this.currentUser) return;
        
        this.showLoading('Loading profile...');
        
        try {
            // Load profile data
            await this.loadProfileData();
            
            // Load images
            await this.loadProfileImages();
            
            // Update UI
            this.updateProfileDisplay();
            
        } catch (error) {
            this.handleError(error, 'profile-loading');
        } finally {
            this.hideLoading();
        }
    }

    loadProfileData() {
        return new Promise((resolve) => {
            // Update profile elements
            const elements = {
                'profile-name': this.currentUser.name,
                'profile-email': this.currentUser.email,
                'profile-bio': this.currentUser.profile?.bio || 'No bio yet',
                'cars-count': this.currentUser.profile?.cars?.length || 0,
                'meets-count': this.currentUser.profile?.favoriteMeets?.length || 0
            };

            Object.entries(elements).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            });

            // Calculate member days
            const joinDate = new Date(this.currentUser.joinDate);
            const days = Math.floor((Date.now() - joinDate) / (1000 * 60 * 60 * 24));
            const memberDaysEl = document.getElementById('member-days');
            if (memberDaysEl) {
                memberDaysEl.textContent = days;
            }

            resolve();
        });
    }

    // Image Management
    async loadProfileImages() {
        if (!this.currentUser.profile) return;

        // Load profile picture
        if (this.currentUser.profile.profilePic) {
            const profilePic = document.getElementById('profile-pic');
            const avatarText = document.getElementById('avatar-text');
            
            if (profilePic && avatarText) {
                profilePic.src = this.currentUser.profile.profilePic;
                profilePic.style.display = 'block';
                avatarText.style.display = 'none';
            }
        }

        // Load gallery images
        const galleryImages = this.currentUser.profile.galleryImages || [];
        galleryImages.forEach((imageData, index) => {
            if (imageData) {
                const preview = document.getElementById(`profile-image-${index + 1}-preview`);
                if (preview) {
                    preview.src = imageData;
                    preview.style.display = 'block';
                }
            }
        });
    }

    // Form Handling
    setupEventListeners() {
        // Bio form
        const bioForm = document.getElementById('bio-form');
        if (bioForm) {
            bioForm.addEventListener('submit', (e) => this.handleBioUpdate(e));
        }

        // Customization form
        const customForm = document.getElementById('customization-form');
        if (customForm) {
            customForm.addEventListener('submit', (e) => this.handleCustomizationUpdate(e));
        }

        // Image uploads
        this.setupImageUploads();
    }

    handleBioUpdate(event) {
        event.preventDefault();
        const bioTextarea = document.getElementById('bio');
        
        if (bioTextarea && this.currentUser) {
            this.currentUser.profile = this.currentUser.profile || {};
            this.currentUser.profile.bio = bioTextarea.value;
            
            this.saveUserData();
            this.showMessage('Bio updated successfully!', 'success');
        }
    }

    handleCustomizationUpdate(event) {
        event.preventDefault();
        
        if (!this.currentUser) return;
        
        const customization = {
            theme: document.getElementById('profile-theme')?.value,
            favoriteBrand: document.getElementById('favorite-brand')?.value,
            drivingStyle: document.getElementById('driving-style')?.value,
            instagram: document.getElementById('instagram-handle')?.value,
            location: document.getElementById('essex-location')?.value
        };

        this.currentUser.profile = this.currentUser.profile || {};
        this.currentUser.profile.customization = customization;
        
        this.saveUserData();
        this.applyTheme(customization.theme);
        this.showMessage('Customization saved!', 'success');
    }

    // Image Upload System
    setupImageUploads() {
        // Profile picture
        const profilePicInput = document.getElementById('profile-pic-upload');
        if (profilePicInput) {
            profilePicInput.addEventListener('change', (e) => this.handleImageUpload(e, 'profile-pic'));
        }

        // Gallery images
        for (let i = 1; i <= 3; i++) {
            const input = document.getElementById(`profile-image-${i}-upload`);
            if (input) {
                input.addEventListener('change', (e) => this.handleImageUpload(e, `gallery-${i}`));
            }
        }

        // Header image
        const headerInput = document.getElementById('header-image-upload');
        if (headerInput) {
            headerInput.addEventListener('change', (e) => this.handleImageUpload(e, 'header-image'));
        }
    }

    async handleImageUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file
        if (!this.validateImageFile(file)) return;

        try {
            const imageData = await this.readFileAsDataURL(file);
            this.saveImageData(type, imageData);
            this.updateImageDisplay(type, imageData);
            this.showMessage('Image uploaded successfully!', 'success');
        } catch (error) {
            this.handleError(error, 'image-upload');
        }
    }

    validateImageFile(file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            this.showMessage('Please select a valid image file (JPG, PNG, WebP)', 'error');
            return false;
        }

        if (file.size > maxSize) {
            this.showMessage('Image size must be less than 5MB', 'error');
            return false;
        }

        return true;
    }

    readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    saveImageData(type, imageData) {
        if (!this.currentUser.profile) {
            this.currentUser.profile = {};
        }

        switch (type) {
            case 'profile-pic':
                this.currentUser.profile.profilePic = imageData;
                break;
            case 'header-image':
                this.currentUser.profile.headerImage = imageData;
                break;
            default:
                if (type.startsWith('gallery-')) {
                    if (!this.currentUser.profile.galleryImages) {
                        this.currentUser.profile.galleryImages = [];
                    }
                    const index = parseInt(type.split('-')[1]) - 1;
                    this.currentUser.profile.galleryImages[index] = imageData;
                }
        }

        this.saveUserData();
    }

    // Theme System
    applyTheme(theme) {
        const themes = {
            gold: { primary: '#ffd700', secondary: '#ffed4e' },
            blue: { primary: '#00bfff', secondary: '#87ceeb' },
            red: { primary: '#ff4444', secondary: '#ff6666' },
            green: { primary: '#44ff44', secondary: '#66ff66' },
            purple: { primary: '#ff44ff', secondary: '#ff66ff' }
        };

        const colors = themes[theme] || themes.gold;
        
        // Update CSS variables
        document.documentElement.style.setProperty('--primary-color', colors.primary);
        document.documentElement.style.setProperty('--secondary-color', colors.secondary);
    }

    // Utility Functions
    saveUserData() {
        try {
            // Update users database
            const users = JSON.parse(localStorage.getItem('mostWantedUsers') || '[]');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex] = this.currentUser;
                localStorage.setItem('mostWantedUsers', JSON.stringify(users));
            }
            
            // Update current user session
            localStorage.setItem('mostWantedCurrentUser', JSON.stringify(this.currentUser));
            
        } catch (error) {
            this.handleError(error, 'data-save');
        }
    }

    showMessage(text, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = text;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10001;
            animation: slideIn 0.3s ease;
        `;

        // Set background color based on type
        const colors = {
            success: '#44ff44',
            error: '#ff4444',
            info: '#00bfff',
            warning: '#ffd700'
        };
        messageEl.style.background = colors[type] || colors.info;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }

    showLoading(message = 'Loading...') {
        this.isLoading = true;
        const loadingEl = document.createElement('div');
        loadingEl.id = 'loading-overlay';
        loadingEl.className = 'loading-overlay';
        loadingEl.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        loadingEl.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        document.body.appendChild(loadingEl);
    }

    hideLoading() {
        this.isLoading = false;
        const loadingEl = document.getElementById('loading-overlay');
        if (loadingEl) {
            loadingEl.remove();
        }
    }

    handleError(error, context) {
        console.error(`[${context}] ${error.message}`, error);
        this.showMessage(`Error: ${error.message}`, 'error');
        
        // Log to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'error', {
                event_category: context,
                event_label: error.message
            });
        }
    }

    initializeComponents() {
        // Initialize any additional components
        this.initializeFeed();
        this.initializeAssetManager();
    }

    initializeFeed() {
        // Feed functionality
        if (typeof shareProfileToFeed === 'function') {
            // Feed functions available
        }
    }

    initializeAssetManager() {
        // Asset management functionality
        if (typeof createUserAssetFolders === 'function') {
            createUserAssetFolders(this.currentUser?.id);
        }
    }

    updateProfileDisplay() {
        // Update all profile-related displays
        const profileName = document.getElementById('profile-name');
        if (profileName) {
            profileName.textContent = this.currentUser.name;
        }

        // Update avatar
        const avatarText = document.getElementById('avatar-text');
        if (avatarText) {
            avatarText.textContent = this.currentUser.name.charAt(0).toUpperCase();
        }

        // Apply user's theme
        if (this.currentUser.profile?.customization?.theme) {
            this.applyTheme(this.currentUser.profile.customization.theme);
        }
    }
}

// Asset Management Functions
function createUserAssetFolders(userId) {
    if (!userId) return;
    
    const userAssetsPath = `assets/users/${userId}`;
    
    if (!localStorage.getItem(`userFolders_${userId}`)) {
        console.log(`Creating asset folders for user ${userId}`);
        localStorage.setItem(`userFolders_${userId}`, 'true');
    }
}

function storeUserAsset(userId, assetType, assetData) {
    const userAssets = JSON.parse(localStorage.getItem(`userAssets_${userId}`) || '{}');
    
    if (!userAssets[assetType]) {
        userAssets[assetType] = [];
    }
    
    userAssets[assetType].push({
        data: assetData,
        timestamp: Date.now(),
        path: `assets/users/${userId}/${assetType}`
    });
    
    localStorage.setItem(`userAssets_${userId}`, JSON.stringify(userAssets));
}

// Feed Functions
function shareProfileToFeed() {
    const currentUser = JSON.parse(localStorage.getItem('mostWantedCurrentUser'));
    if (!currentUser) {
        showMessage('Please login to share to feed', 'error');
        return;
    }
    
    // Create share modal
    const modal = document.createElement('div');
    modal.className = 'feed-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Share Profile to Feed</h2>
            <form id="share-form">
                <textarea placeholder="Share your profile..." required></textarea>
                <button type="submit">Share to Feed</button>
                <button type="button" onclick="this.closest('.feed-modal').remove()">Cancel</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('share-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Handle feed submission
        modal.remove();
        showMessage('Shared to feed!', 'success');
    });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MostWantedApp();
});

// Authentication Check for all pages
function checkAuthentication() {
    const currentPage = window.location.pathname.split('/').pop();
    const publicPages = ['auth.html', 'index.html'];
    const currentUser = localStorage.getItem('mostWantedCurrentUser');
    
    if (!currentUser && !publicPages.includes(currentPage)) {
        window.location.href = 'auth.html';
        return false;
    }
    
    return true;
}

// Run authentication check
checkAuthentication();
