// Profile Image Upload Functions

// Handle profile image uploads
function handleProfileImageUpload(event, imageNumber) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showMessage('Please select an image file', 'error', 'gallery-message');
        return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showMessage('Image size must be less than 5MB', 'error', 'gallery-message');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Store in user profile
        if (!currentUser.profile) {
            currentUser.profile = {};
        }
        if (!currentUser.profile.galleryImages) {
            currentUser.profile.galleryImages = [];
        }
        
        // Ensure array has 3 elements
        while (currentUser.profile.galleryImages.length < 3) {
            currentUser.profile.galleryImages.push(null);
        }
        
        currentUser.profile.galleryImages[imageNumber - 1] = imageData;
        
        // Update preview
        const preview = document.getElementById(`profile-image-${imageNumber}-preview`);
        const placeholder = preview.parentElement.querySelector('.image-upload-placeholder');
        
        preview.src = imageData;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
        
        // Update gallery display
        updateGalleryDisplay();
        
        // Save to database
        updateUserInDatabase();
        showMessage(`Image ${imageNumber} uploaded successfully!`, 'success', 'gallery-message');
    };
    reader.readAsDataURL(file);
}

// Handle header image upload
function handleHeaderImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showMessage('Please select an image file', 'error', 'gallery-message');
        return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showMessage('Image size must be less than 5MB', 'error', 'gallery-message');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Store in user profile
        if (!currentUser.profile) {
            currentUser.profile = {};
        }
        currentUser.profile.headerImage = imageData;
        
        // Update preview
        const preview = document.getElementById('header-image-preview');
        const placeholder = preview.parentElement.querySelector('.image-upload-placeholder');
        
        preview.src = imageData;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
        
        // Update header display
        updateHeaderDisplay();
        
        // Save to database
        updateUserInDatabase();
        showMessage('Header image uploaded successfully!', 'success', 'gallery-message');
    };
    reader.readAsDataURL(file);
}

// Update gallery display
function updateGalleryDisplay() {
    const gallery = document.getElementById('profile-gallery');
    const images = currentUser.profile?.galleryImages || [];
    
    gallery.innerHTML = '';
    
    images.forEach((imageData, index) => {
        if (imageData) {
            const img = document.createElement('img');
            img.src = imageData;
            img.className = 'gallery-image';
            img.alt = `Gallery Image ${index + 1}`;
            img.onclick = () => viewImage(imageData, `Gallery Image ${index + 1}`);
            gallery.appendChild(img);
        }
    });
    
    if (images.filter(img => img).length === 0) {
        gallery.innerHTML = '<p style="text-align: center; color: #888;">No images uploaded yet</p>';
    }
}

// Update header display
function updateHeaderDisplay() {
    const headerImage = document.getElementById('profile-header-image');
    const headerImageData = currentUser.profile?.headerImage;
    
    if (headerImageData) {
        headerImage.src = headerImageData;
        headerImage.style.display = 'block';
    } else {
        headerImage.style.display = 'none';
    }
}

// View image in full size
function viewImage(imageData, title) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = imageData;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 0 30px rgba(255,215,0,0.5);
    `;
    
    modal.appendChild(img);
    modal.onclick = () => document.body.removeChild(modal);
    document.body.appendChild(modal);
}

// Load existing images on profile load
function loadProfileImages() {
    if (!currentUser.profile) return;
    
    // Load header image
    updateHeaderDisplay();
    
    // Load gallery images
    updateGalleryDisplay();
    
    // Load previews
    const galleryImages = currentUser.profile.galleryImages || [];
    galleryImages.forEach((imageData, index) => {
        if (imageData) {
            const preview = document.getElementById(`profile-image-${index + 1}-preview`);
            const placeholder = preview.parentElement.querySelector('.image-upload-placeholder');
            
            preview.src = imageData;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        }
    });
    
    // Load header preview
    const headerImageData = currentUser.profile.headerImage;
    if (headerImageData) {
        const headerPreview = document.getElementById('header-image-preview');
        const headerPlaceholder = headerPreview.parentElement.querySelector('.image-upload-placeholder');
        
        headerPreview.src = headerImageData;
        headerPreview.style.display = 'block';
        headerPlaceholder.style.display = 'none';
    }
}
