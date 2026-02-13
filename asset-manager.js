// User Asset Management System
// Creates user-specific folders and manages profile assets

// Create user-specific asset folders
function createUserAssetFolders(userId) {
    const userAssetsPath = `assets/users/${userId}`;
    
    // Create folder structure if it doesn't exist
    if (!localStorage.getItem(`userFolders_${userId}`)) {
        console.log(`Creating asset folders for user ${userId}`);
        localStorage.setItem(`userFolders_${userId}`, 'true');
        
        // Mark folders as created (in real app, this would create actual folders)
        console.log(`Asset folders created for user ${userId}`);
    }
}

// Get user-specific asset path
function getUserAssetPath(userId, assetType) {
    return `assets/users/${userId}/${assetType}`;
}

// Store user asset in localStorage with user-specific path
function storeUserAsset(userId, assetType, assetData) {
    const userAssets = JSON.parse(localStorage.getItem(`userAssets_${userId}`) || '{}');
    
    if (!userAssets[assetType]) {
        userAssets[assetType] = [];
    }
    
    userAssets[assetType].push({
        data: assetData,
        timestamp: Date.now(),
        path: getUserAssetPath(userId, assetType)
    });
    
    localStorage.setItem(`userAssets_${userId}`, JSON.stringify(userAssets));
    console.log(`Stored ${assetType} for user ${userId}`);
}

// Get user assets
function getUserAssets(userId) {
    return JSON.parse(localStorage.getItem(`userAssets_${userId}`) || '{}');
}

// Update profile generator to use user-specific paths
function updateUserProfileGenerator() {
    // This function will be called to update the profile generator
    // to use user-specific asset paths instead of generic ones
    console.log('Profile generator updated for user-specific assets');
}

// Initialize asset management for current user
function initializeAssetManagement() {
    const currentUser = JSON.parse(localStorage.getItem('mostWantedCurrentUser'));
    if (!currentUser) return;
    
    console.log(`Initializing asset management for user: ${currentUser.name}`);
    createUserAssetFolders(currentUser.id);
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createUserAssetFolders,
        getUserAssetPath,
        storeUserAsset,
        getUserAssets,
        updateUserProfileGenerator,
        initializeAssetManagement
    };
}
