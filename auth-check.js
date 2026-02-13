// Authentication Check System
// Ensures only authenticated users can access site content

// Check if user is authenticated
function isAuthenticated() {
    const currentUser = localStorage.getItem('mostWantedCurrentUser');
    return currentUser !== null && currentUser !== undefined;
}

// Get current page
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    return filename;
}

// Redirect to auth if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        // Use absolute path to ensure proper redirect
        window.location.href = '/THEGANG/auth.html';
        return false;
    }
    return true;
}

// Authentication check for all pages
function checkAuthentication() {
    const currentPage = getCurrentPage();
    
    // Allow these pages without authentication
    const publicPages = ['auth.html', 'index.html'];
    
    // If not authenticated and not on a public page, redirect to auth
    if (!isAuthenticated() && !publicPages.includes(currentPage)) {
        // Use absolute path to ensure proper redirect
        window.location.href = '/THEGANG/auth.html';
        return false;
    }
    
    return true;
}

// Initialize authentication check
function initAuthCheck() {
    // Check authentication immediately
    if (!checkAuthentication()) {
        return;
    }
    
    // Add logout functionality to all pages
    addLogoutFunctionality();
    
    // Add user info display if logged in
    addUserInfoDisplay();
}

// Add logout functionality
function addLogoutFunctionality() {
    // Remove existing logout buttons if any
    const existingLogoutBtns = document.querySelectorAll('.logout-btn');
    existingLogoutBtns.forEach(btn => btn.remove());
    
    // Add logout button to navigation
    const nav = document.querySelector('.clean-nav');
    if (nav) {
        console.log('Navigation found, children count:', nav.children.length);
        console.log('Current page:', window.location.pathname);
        
        // Check if navigation is empty, if so, add navigation links
        if (nav.children.length === 0) {
            console.log('Navigation is empty, adding navigation links');
            
            // Add navigation links with absolute paths
            const homeBtn = document.createElement('a');
            homeBtn.className = 'nav-btn';
            homeBtn.href = '/THEGANG/index.html';
            homeBtn.textContent = '🏠 Home';
            nav.appendChild(homeBtn);
            
            const carMeetsBtn = document.createElement('a');
            carMeetsBtn.className = 'nav-btn';
            carMeetsBtn.href = '/THEGANG/car-meets.html';
            carMeetsBtn.textContent = '🚗 Car Meets';
            nav.appendChild(carMeetsBtn);
            
            const merchBtn = document.createElement('a');
            merchBtn.className = 'nav-btn';
            merchBtn.href = '/THEGANG/merch.html';
            merchBtn.textContent = '🛍️ Merch';
            nav.appendChild(merchBtn);
            
            const teamBtn = document.createElement('a');
            teamBtn.className = 'nav-btn';
            teamBtn.href = '/THEGANG/team.html';
            teamBtn.textContent = '👥 Team';
            nav.appendChild(teamBtn);
            
            const feedBtn = document.createElement('a');
            feedBtn.className = 'nav-btn';
            feedBtn.href = '/THEGANG/feed.html';
            feedBtn.textContent = '📢 Feed';
            nav.appendChild(feedBtn);
            
            console.log('Navigation links added');
        } else {
            console.log('Navigation already has content');
        }
        
        // Add logout button
        const logoutBtn = document.createElement('a');
        logoutBtn.className = 'nav-btn logout-btn';
        logoutBtn.href = '#';
        logoutBtn.textContent = 'Logout';
        logoutBtn.onclick = function(e) {
            e.preventDefault();
            logout();
        };
        nav.appendChild(logoutBtn);
        
        console.log('Logout button added');
    } else {
        console.log('Navigation not found');
    }
}

// Add user info display
function addUserInfoDisplay() {
    const currentUser = JSON.parse(localStorage.getItem('mostWantedCurrentUser'));
    if (!currentUser) {
        console.log('No current user found');
        return;
    }
    
    console.log('Adding user info for:', currentUser.name);
    
    // Add user info to navigation
    const nav = document.querySelector('.clean-nav');
    if (nav) {
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.style.cssText = `
            color: #ffd700;
            font-size: 0.9rem;
            margin-left: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        userInfo.innerHTML = `
            <span>👤 ${currentUser.name}</span>
            <a href="/THEGANG/profile.html" class="profile-link-nav">👤 Profile</a>
        `;
        nav.appendChild(userInfo);
        console.log('User info added to navigation');
    } else {
        console.log('Navigation not found');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('mostWantedCurrentUser');
    window.location.href = '/THEGANG/auth.html';
}

// Protect specific routes
function protectRoute() {
    const currentPage = getCurrentPage();
    const protectedRoutes = [
        'profile.html',
        'profile-viewer.html', 
        'feed.html',
        'merch.html',
        'car-meets.html',
        'team.html'
    ];
    
    if (protectedRoutes.includes(currentPage)) {
        requireAuth();
    }
}

// Enhanced authentication check with page-specific behavior
function enhancedAuthCheck() {
    const currentPage = getCurrentPage();
    
    // Always check authentication
    if (!checkAuthentication()) {
        return;
    }
    
    // Add logout functionality and user info display
    addLogoutFunctionality();
    addUserInfoDisplay();
    
    // Page-specific authentication logic
    switch(currentPage) {
        case 'profile.html':
            // Ensure user can only view their own profile
            ensureProfileAccess();
            break;
        case 'feed.html':
            // Feed requires authentication
            break;
        case 'merch.html':
            // Merch requires authentication
            break;
        case 'car-meets.html':
            // Car meets requires authentication
            break;
        case 'team.html':
            // Team requires authentication
            break;
        default:
            // Default behavior
            break;
    }
}

// Ensure user can only access their own profile
function ensureProfileAccess() {
    const currentUser = JSON.parse(localStorage.getItem('mostWantedCurrentUser'));
    if (!currentUser) return;
    
    // Check if trying to access someone else's profile
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('user');
    
    if (profileId && profileId !== currentUser.id) {
        // Redirect to own profile
        window.location.href = 'profile.html';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    enhancedAuthCheck();
});

// Check authentication periodically (for security)
setInterval(() => {
    if (!checkAuthentication()) {
        return;
    }
}, 30000); // Check every 30 seconds
