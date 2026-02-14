// ===================================
// PHASE 3 CONFIGURATION
// Analytics, Performance, and PWA Settings
// ===================================

const PHASE3_CONFIG = {
    // Google Analytics 4 Measurement ID
    // Replace with your actual GA4 ID (format: G-XXXXXXXXXX)
    GOOGLE_ANALYTICS_ID: null, // Set to your GA4 ID when ready

    // Performance Monitoring Settings
    PERFORMANCE_MONITORING: {
        ENABLE_CORE_WEB_VITALS: true,
        ENABLE_PAGE_LOAD_METRICS: true,
        ENABLE_CACHE_SIZE_MONITORING: false,
        LOG_PERFORMANCE_DATA: true
    },

    // Service Worker Settings
    SERVICE_WORKER: {
        ENABLE_BACKGROUND_SYNC: false,
        ENABLE_PERIODIC_SYNC: false,
        ENABLE_PUSH_NOTIFICATIONS: false,
        CACHE_EXPIRY_DAYS: 7
    },

    // PWA Settings
    PWA: {
        ENABLE_INSTALL_PROMPT: true,
        ENABLE_SHORTCUTS: true,
        ENABLE_SHARE_TARGET: false
    },

    // Image Optimization Settings
    IMAGES: {
        ENABLE_WEBP_CONVERSION: false, // Set to true when WebP versions are available
        ENABLE_LAZY_LOADING: true,
        LAZY_LOAD_OFFSET: 50, // pixels
        PLACEHOLDER_TYPE: 'shimmer' // 'shimmer' or 'blur'
    },

    // Feature Flags (for gradual rollout)
    FEATURES: {
        ANALYTICS: false, // Set to true when GA ID is configured
        PERFORMANCE_MONITORING: true,
        OFFLINE_MODE: true,
        PWA_INSTALL: true,
        IMAGE_OPTIMIZATION: true
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PHASE3_CONFIG;
}
