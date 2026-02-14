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

// ===================================
// IMAGE OPTIMIZATION SYSTEM
// ===================================

class ImageOptimizer {
    constructor() {
        this.webpSupported = this.checkWebPSupport();
        this.init();
    }

    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    init() {
        this.setupLazyLoading();
        this.optimizeExistingImages();
    }

    setupLazyLoading() {
        // Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
        }

        // Fallback for older browsers
        this.loadImagesOnScroll();
    }

    optimizeExistingImages() {
        // Convert all img tags to use lazy loading
        const images = document.querySelectorAll('img:not([data-lazy-loaded])');
        images.forEach(img => this.prepareLazyImage(img));
    }

    prepareLazyImage(img) {
        if (img.hasAttribute('loading') || img.hasAttribute('data-lazy-loaded')) return;

        const src = img.getAttribute('src');
        if (!src) return;

        // Store original src
        img.setAttribute('data-src', src);
        img.setAttribute('data-lazy-loading', 'true');

        // Set loading placeholder
        if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', 'Loading image...');
        }

        // Add loading class for CSS styling
        img.classList.add('lazy-loading');

        // Remove src to prevent loading
        img.removeAttribute('src');

        // Start observing
        if (this.imageObserver) {
            this.imageObserver.observe(img);
        } else {
            // Fallback: load immediately for older browsers
            this.loadImage(img);
        }
    }

    loadImage(img) {
        if (img.hasAttribute('data-lazy-loaded')) return;

        const src = img.getAttribute('data-src');
        if (!src) return;

        // Create new image to preload
        const newImg = new Image();

        newImg.onload = () => {
            img.src = src;
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
            img.setAttribute('data-lazy-loaded', 'true');
            img.removeAttribute('data-src');
            img.removeAttribute('data-lazy-loading');
        };

        newImg.onerror = () => {
            console.warn('Failed to load image:', src);
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-error');
        };

        newImg.src = src;
    }

    loadImagesOnScroll() {
        // Fallback lazy loading for browsers without Intersection Observer
        const lazyImages = document.querySelectorAll('img[data-lazy-loading]');

        const lazyLoad = () => {
            lazyImages.forEach(img => {
                if (this.isInViewport(img)) {
                    this.loadImage(img);
                }
            });
        };

        // Throttled scroll handler
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    lazyLoad();
                    scrollTimeout = null;
                }, 16); // ~60fps
            }
        });

        // Initial load
        lazyLoad();
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Method to convert image URLs to WebP with fallback
    getOptimizedImageUrl(originalUrl) {
        if (!originalUrl) return originalUrl;

        // If WebP is supported, try WebP version first
        if (this.webpSupported) {
            // For now, keep original - in production you'd have WebP versions
            // const webpUrl = originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            // return webpUrl;
        }

        return originalUrl;
    }
}

// ===================================
// PERFORMANCE MONITORING
// ===================================

class PerformanceMonitor {
    constructor() {
        this.config = PHASE3_CONFIG || {
            PERFORMANCE_MONITORING: {
                ENABLE_CORE_WEB_VITALS: true,
                ENABLE_PAGE_LOAD_METRICS: true,
                LOG_PERFORMANCE_DATA: true
            }
        };
        this.init();
    }

    init() {
        if (this.config.PERFORMANCE_MONITORING.ENABLE_CORE_WEB_VITALS) {
            this.trackCoreWebVitals();
        }

        if (this.config.PERFORMANCE_MONITORING.ENABLE_PAGE_LOAD_METRICS) {
            this.trackPageLoadMetrics();
        }

    createPerformanceIndicator() {
        // Only show in development/debug mode
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return;
        }

        const indicator = document.createElement('div');
        indicator.className = 'performance-indicator';
        indicator.innerHTML = `
            <div class="metric">LCP: <span class="value" id="lcp-value">Loading...</span></div>
            <div class="metric">FID: <span class="value" id="fid-value">Loading...</span></div>
            <div class="metric">CLS: <span class="value" id="cls-value">Loading...</span></div>
            <div class="metric">Load: <span class="value" id="load-value">Loading...</span></div>
        `;

        document.body.appendChild(indicator);

        // Update metrics as they become available
        this.updatePerformanceMetrics();
    }

    updatePerformanceMetrics() {
        // LCP
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                const lcpValue = document.getElementById('lcp-value');
                if (lcpValue) {
                    lcpValue.textContent = Math.round(lastEntry.startTime) + 'ms';
                }
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // FID
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    const fidValue = document.getElementById('fid-value');
                    if (fidValue) {
                        fidValue.textContent = Math.round(entry.processingStart - entry.startTime) + 'ms';
                    }
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // CLS
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                const clsElement = document.getElementById('cls-value');
                if (clsElement) {
                    clsElement.textContent = clsValue.toFixed(4);
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }

        // Page load time
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.fetchStart;
                const loadValue = document.getElementById('load-value');
                if (loadValue) {
                    loadValue.textContent = Math.round(loadTime) + 'ms';
                }
            }, 0);
        });
    }

    trackCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

                // First Input Delay (FID)
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        console.log('FID:', entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });

                // Cumulative Layout Shift (CLS)
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    console.log('CLS:', clsValue);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });

            } catch (e) {
                console.warn('Performance monitoring not fully supported:', e);
            }
        }
    }

    trackPageLoadMetrics() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Metrics:', {
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                    totalTime: perfData.loadEventEnd - perfData.fetchStart
                });
            }, 0);
        });
    }
}

// ===================================
// SERVICE WORKER MANAGEMENT
// ===================================

class ServiceWorkerManager {
    constructor() {
        this.init();
    }

    init() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                this.registerServiceWorker();
            });
        }
    }

    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration.scope);

            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                }
            });

        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    }

    showUpdateNotification() {
        // Create update notification
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <span>🎉 App updated! Refresh to get the latest features.</span>
                <button class="update-btn" onclick="window.location.reload()">Refresh</button>
            </div>
        `;
        document.body.appendChild(notification);

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }
}

// ===================================
// ANALYTICS INTEGRATION
// ===================================

class AnalyticsManager {
    constructor() {
        this.config = PHASE3_CONFIG || {
            GOOGLE_ANALYTICS_ID: null,
            FEATURES: { ANALYTICS: false }
        };
        this.init();
    }

    init() {
        if (this.config.FEATURES.ANALYTICS && this.config.GOOGLE_ANALYTICS_ID) {
            this.loadGoogleAnalytics();
            this.trackPageViews();
            this.trackUserInteractions();
        } else {
            console.log('Analytics not enabled - configure GOOGLE_ANALYTICS_ID in phase3-config.js');
        }
    }

    loadGoogleAnalytics() {
        const gaId = this.config.GOOGLE_ANALYTICS_ID;

        if (!gaId) {
            console.log('Google Analytics ID not configured');
            return;
        }

        // Load GA4 script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', gaId);

        console.log('Google Analytics loaded with ID:', gaId);
    }

    trackPageViews() {
        // Track page views (GA4 does this automatically when configured)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
    }

    trackUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .nav-btn, .action-btn');
            if (button && typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'engagement',
                    event_label: button.textContent || button.className
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'engagement',
                    event_label: e.target.id || 'form'
                });
            }
        });
    }
}

// ===================================
// PWA FEATURES
// ===================================

class PWAManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupInstallPrompt();
        this.registerManifest();
    }

    setupInstallPrompt() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // Show install button
            this.showInstallButton(deferredPrompt);
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully');
            deferredPrompt = null;
        });
    }

    showInstallButton(deferredPrompt) {
        const installBtn = document.createElement('button');
        installBtn.className = 'install-btn';
        installBtn.innerHTML = '📱 Install App';
        installBtn.onclick = async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log('Install outcome:', outcome);
                deferredPrompt = null;
                installBtn.remove();
            }
        };

        // Add to navigation or as floating button
        const nav = document.querySelector('.clean-nav');
        if (nav) {
            nav.appendChild(installBtn);
        }

        // Auto-hide after 30 seconds
        setTimeout(() => {
            if (installBtn.parentNode) {
                installBtn.remove();
            }
        }, 30000);
    }

    registerManifest() {
        // Check if manifest exists
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (manifestLink) {
            console.log('PWA manifest registered');
        } else {
            console.log('PWA manifest not found');
        }
    }
}

// ===================================
// INITIALIZE OPTIMIZATIONS
// ===================================

// Initialize all Phase 3 optimizations
const imageOptimizer = new ImageOptimizer();
const performanceMonitor = new PerformanceMonitor();
const serviceWorkerManager = new ServiceWorkerManager();
const analyticsManager = new AnalyticsManager();
const pwaManager = new PWAManager();

// Run authentication check
checkAuthentication();
