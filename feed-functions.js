// Feed Functions for Profile Sharing

// Share profile to feed
function shareProfileToFeed() {
    const currentUser = JSON.parse(localStorage.getItem('mostWantedCurrentUser'));
    if (!currentUser) {
        showMessage('Please login to share to feed', 'error');
        return;
    }
    
    // Create share modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: rgba(0,0,0,0.95);
        border: 2px solid #ffd700;
        border-radius: 20px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: #ffd700; font-size: 1.5rem;">Share Profile to Feed</h2>
            <button onclick="this.closest('.modal').remove()" style="background: transparent; border: 1px solid #ff4444; color: #ff6666; padding: 5px 10px; border-radius: 15px; cursor: pointer;">×</button>
        </div>
        <form onsubmit="submitProfileShare(event)" style="display: flex; flex-direction: column; gap: 15px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="color: #ffd700; font-weight: bold;">Share Message</label>
                <textarea id="profile-share-content" placeholder="Check out my Most Wanted profile!" style="background: rgba(255,255,255,0.1); border: 1px solid #ffd700; border-radius: 8px; color: #fff; padding: 10px; font-family: 'Arial Black', Arial, sans-serif; resize: vertical; min-height: 100px;">Check out my Most Wanted profile! 🚗✨</textarea>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="color: #ffd700; font-weight: bold;">Post Type</label>
                <select id="profile-share-type" style="background: rgba(255,255,255,0.1); border: 1px solid #ffd700; border-radius: 8px; color: #fff; padding: 10px; font-family: 'Arial Black', Arial, sans-serif;">
                    <option value="profiles">👤 Profile</option>
                    <option value="cars">🚗 Cars</option>
                    <option value="general">📢 General</option>
                </select>
            </div>
            <div style="display: flex; gap: 10px;">
                <label style="display: flex; align-items: center; gap: 8px; color: #ffd700;">
                    <input type="checkbox" id="include-gallery" checked>
                    Include gallery images
                </label>
                <label style="display: flex; align-items: center; gap: 8px; color: #ffd700;">
                    <input type="checkbox" id="include-header" checked>
                    Include header image
                </label>
            </div>
            <button type="submit" style="background: linear-gradient(135deg, #ffd700, #ffed4e); border: none; border-radius: 8px; color: #000; font-size: 1rem; font-weight: bold; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px; padding: 12px 24px;">Share to Feed</button>
        </form>
    `;
    
    modal.className = 'modal';
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Submit profile share
function submitProfileShare(event) {
    event.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('mostWantedCurrentUser'));
    if (!currentUser) {
        console.log('No current user found');
        return;
    }
    
    const content = document.getElementById('profile-share-content').value.trim();
    const type = document.getElementById('profile-share-type').value;
    const includeGallery = document.getElementById('include-gallery').checked;
    const includeHeader = document.getElementById('include-header').checked;
    
    if (!content) {
        console.log('No content found');
        return;
    }
    
    console.log('Submitting profile share:', { content, type, user: currentUser.name });
    
    // Get feed posts
    const feedPosts = JSON.parse(localStorage.getItem('mostWantedFeed') || '[]');
    console.log('Current feed posts count:', feedPosts.length);
    
    // Collect images to include
    const images = [];
    
    if (includeHeader && currentUser.profile?.headerImage) {
        images.push(currentUser.profile.headerImage);
    }
    
    if (includeGallery && currentUser.profile?.galleryImages) {
        images.push(...currentUser.profile.galleryImages.filter(img => img));
    }
    
    const newPost = {
        id: Date.now().toString(),
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorProfilePic: currentUser.profile?.profilePic || null,
        content: content,
        type: type,
        images: images.slice(0, 4), // Limit to 4 images
        timestamp: Date.now(),
        likes: 0,
        comments: 0,
        liked: false,
        isProfileShare: true,
        profileLink: `profile-viewer.html#${currentUser.name.toLowerCase().replace(/\s+/g, '-')}`
    };
    
    console.log('New post created:', newPost);
    
    feedPosts.unshift(newPost);
    localStorage.setItem('mostWantedFeed', JSON.stringify(feedPosts));
    console.log('Feed updated, total posts:', feedPosts.length);
    
    // Close modal
    document.querySelector('.modal').remove();
    
    // Show success message
    showMessage('Profile shared to feed successfully!', 'success');
    
    // Redirect to feed
    setTimeout(() => {
        window.location.href = 'feed.html';
    }, 1500);
}

// Add share button to profile pages
function addShareButtonToProfile() {
    const profileContainer = document.querySelector('.profile-container');
    if (!profileContainer) return;
    
    const shareButton = document.createElement('button');
    shareButton.className = 'share-to-feed-btn';
    shareButton.innerHTML = '📢 Share Profile to Feed';
    shareButton.onclick = shareProfileToFeed;
    shareButton.style.cssText = `
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        border: none;
        border-radius: 25px;
        color: #000;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 15px 30px;
        margin: 20px auto;
        display: block;
        text-align: center;
    `;
    
    shareButton.onmouseover = () => {
        shareButton.style.transform = 'translateY(-2px)';
        shareButton.style.boxShadow = '0 10px 20px rgba(255,215,0,0.3)';
    };
    
    shareButton.onmouseout = () => {
        shareButton.style.transform = 'translateY(0)';
        shareButton.style.boxShadow = 'none';
    };
    
    // Insert after profile header
    const profileHeader = document.querySelector('.profile-header');
    if (profileHeader) {
        profileHeader.parentNode.insertBefore(shareButton, profileHeader.nextSibling);
    }
}

// Initialize share functionality
function initializeShareFunctionality() {
    // Add share button to profile page
    if (window.location.pathname.includes('profile.html') || window.location.pathname.includes('profile-viewer.html')) {
        setTimeout(() => {
            addShareButtonToProfile();
        }, 1000);
    }
}

// Enhanced feed loading with profile shares
function loadEnhancedFeedPosts(filter = 'all') {
    console.log('Loading feed posts with filter:', filter);
    const feedPosts = JSON.parse(localStorage.getItem('mostWantedFeed') || '[]');
    console.log('Feed posts found:', feedPosts.length);
    const feedContainer = document.getElementById('feed-posts');
    
    if (!feedContainer) {
        console.log('Feed container not found');
        return;
    }
    
    // Sort by timestamp (newest first)
    const sortedPosts = feedPosts.sort((a, b) => b.timestamp - a.timestamp);
    
    // Filter posts
    const filteredPosts = filter === 'all' 
        ? sortedPosts 
        : sortedPosts.filter(post => post.type === filter);
    
    console.log('Filtered posts:', filteredPosts.length);
    
    if (filteredPosts.length === 0) {
        feedContainer.innerHTML = `
            <div class="empty-feed">
                <div class="empty-feed-icon">📢</div>
                <div class="empty-feed-text">No posts yet</div>
                <div class="empty-feed-subtext">Be the first to share with the Most Wanted community!</div>
            </div>
        `;
        return;
    }
    
    feedContainer.innerHTML = filteredPosts.map(post => createEnhancedPostHTML(post)).join('');
    console.log('Feed posts rendered');
}

// Create enhanced post HTML with profile shares
function createEnhancedPostHTML(post) {
    const date = new Date(post.timestamp);
    const timeAgo = getTimeAgo(date);
    
    return `
        <div class="feed-post" data-post-id="${post.id}">
            <div class="post-type-badge">${getTypeEmoji(post.type)} ${post.type.charAt(0).toUpperCase() + post.type.slice(1)}</div>
            ${post.isProfileShare ? `
                <div class="profile-share-badge">
                    <span>👤 Profile Share</span>
                    <a href="${post.profileLink}" style="color: #ffd700; text-decoration: none;">View Profile →</a>
                </div>
            ` : ''}
            <div class="post-header">
                <div class="post-avatar">
                    ${post.authorProfilePic ? 
                        `<img src="${post.authorProfilePic}" alt="${post.authorName}">` : 
                        post.authorName.charAt(0).toUpperCase()
                    }
                </div>
                <div class="post-meta">
                    <div class="post-author">${post.authorName}</div>
                    <div class="post-time">${timeAgo}</div>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            ${post.images && post.images.length > 0 ? `
                <div class="post-images">
                    ${post.images.map(image => 
                        `<img src="${image}" class="post-image" onclick="viewImage('${image}')" alt="Post image">`
                    ).join('')}
                </div>
            ` : ''}
            <div class="post-actions">
                <div class="post-actions-left">
                    <button class="post-action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike('${post.id}')">
                        <span>${post.liked ? '❤️' : '🤍'}</span>
                        <span>${post.likes || 0}</span>
                    </button>
                    <button class="post-action-btn" onclick="viewPost('${post.id}')">
                        <span>💬</span>
                        <span>${post.comments || 0}</span>
                    </button>
                </div>
                <button class="post-action-btn" onclick="sharePost('${post.id}')">
                    <span>🔗</span>
                    <span>Share</span>
                </button>
            </div>
        </div>
    `;
}

// Add profile share badge styles
function addProfileShareStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .profile-share-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(255,215,0,0.2);
            border: 1px solid #ffd700;
            color: #ffd700;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .profile-share-badge a:hover {
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);
}

// Initialize enhanced functionality
document.addEventListener('DOMContentLoaded', function() {
    addProfileShareStyles();
    initializeShareFunctionality();
});
