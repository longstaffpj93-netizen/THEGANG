// Profile Page Generator
// Creates individual profile pages for users

function generateProfilePage(user) {
    const username = user.name.toLowerCase().replace(/\s+/g, '-');
    const profileContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${user.name} - Most Wanted Profile</title>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('../assets/images/background.jpg') center/cover fixed;
            font-family: 'Arial Black', Arial, sans-serif;
            color: #fff;
        }

        /* Navigation */
        .clean-nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.95);
            backdrop-filter: blur(15px);
            z-index: 1001;
            padding: 20px 10px;
            text-align: center;
            border-bottom: 2px solid #ffd700;
            box-shadow: 0 4px 20px rgba(255,215,0,0.1);
        }

        .clean-nav .nav-btn {
            background: rgba(255,215,0,0.1);
            border: 1px solid #ffd700;
            color: #ffd700;
            padding: 10px 20px;
            font-size: 0.9rem;
            font-weight: bold;
            font-family: 'Arial Black', Arial, sans-serif;
            text-decoration: none;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0 8px;
            display: inline-block;
            position: relative;
            overflow: hidden;
        }

        .clean-nav .nav-btn:hover {
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #000;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255,215,0,0.3);
        }

        .profile-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 120px 20px 50px;
        }

        .profile-header {
            background: rgba(0,0,0,0.8);
            border: 2px solid #ffd700;
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 40px;
            text-align: center;
            box-shadow: 0 0 30px rgba(255,215,0,0.2);
        }

        .profile-avatar {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 3rem;
            color: #000;
            font-weight: bold;
            box-shadow: 0 0 20px rgba(255,215,0,0.4);
            position: relative;
            overflow: hidden;
        }

        .profile-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 0;
        }

        .profile-name {
            font-size: 2.5rem;
            color: #ffd700;
            margin-bottom: 10px;
            text-shadow: 0 0 15px rgba(255,215,0,0.8);
        }

        .profile-role {
            font-size: 1.2rem;
            color: #ccc;
            margin-bottom: 20px;
        }

        .profile-bio {
            font-size: 1.1rem;
            line-height: 1.6;
            color: #e0e0e0;
            max-width: 600px;
            margin: 0 auto;
        }

        .profile-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .stat-card {
            background: rgba(255,215,0,0.1);
            border: 1px solid #ffd700;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            transition: all 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(255,215,0,0.2);
        }

        .stat-number {
            font-size: 2rem;
            color: #ffd700;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 1rem;
            color: #ccc;
        }

        .profile-sections {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
        }

        .profile-section {
            background: rgba(0,0,0,0.8);
            border: 2px solid #ffd700;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 0 20px rgba(255,215,0,0.2);
        }

        .section-title {
            font-size: 1.5rem;
            color: #ffd700;
            margin-bottom: 20px;
            text-shadow: 0 0 10px rgba(255,215,0,0.6);
        }

        .car-list {
            list-style: none;
            padding: 0;
        }

        .car-item {
            background: rgba(255,215,0,0.1);
            border: 1px solid #ffd700;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            color: #e0e0e0;
        }

        .customization-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255,215,0,0.2);
        }

        .customization-item:last-child {
            border-bottom: none;
        }

        .customization-label {
            color: #ffd700;
            font-weight: bold;
        }

        .customization-value {
            color: #e0e0e0;
        }

        .back-link {
            text-align: center;
            margin-top: 40px;
        }

        .back-link a {
            color: #ffd700;
            text-decoration: none;
            font-weight: bold;
            padding: 10px 20px;
            border: 1px solid #ffd700;
            border-radius: 25px;
            transition: all 0.3s ease;
        }

        .back-link a:hover {
            background: #ffd700;
            color: #000;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <div class="clean-nav">
        <a href="../index.html" class="nav-btn">🏠 Home</a>
        <a href="../car-meets.html" class="nav-btn">🚗 Car Meets</a>
        <a href="../merch.html" class="nav-btn">🛍️ Merch</a>
        <a href="../team.html" class="nav-btn">👥 Team</a>
        <a href="../auth.html" class="nav-btn">👤 Login / Sign Up</a>
    </div>

    <div class="profile-container">
        <div class="profile-header">
            <div class="profile-avatar">
                ${user.profile?.profilePic ? 
                    `<img src="${user.profile.profilePic}" alt="${user.name}">` : 
                    user.name.charAt(0).toUpperCase()
                }
            </div>
            <div class="profile-name">${user.name}</div>
            <div class="profile-role">Most Wanted Member</div>
            <div class="profile-bio">
                ${user.profile?.bio || 'Passionate car enthusiast and member of the Most Wanted Essex community.'}
            </div>
        </div>

        <div class="profile-stats">
            <div class="stat-card">
                <div class="stat-number">${user.profile?.cars?.length || 0}</div>
                <div class="stat-label">Cars</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${Math.floor((Date.now() - new Date(user.joinDate)) / (1000 * 60 * 60 * 24))}</div>
                <div class="stat-label">Days Member</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${user.profile?.favoriteMeets?.length || 0}</div>
                <div class="stat-label">Meets Attended</div>
            </div>
        </div>

        <div class="profile-sections">
            <div class="profile-section">
                <h2 class="section-title">🚗 My Cars</h2>
                <ul class="car-list">
                    ${(user.profile?.cars || ['No cars added yet']).map(car => 
                        `<li class="car-item">${car}</li>`
                    ).join('')}
                </ul>
            </div>

            <div class="profile-section">
                <h2 class="section-title">🎨 Profile Details</h2>
                <div class="customization-item">
                    <span class="customization-label">Member Since:</span>
                    <span class="customization-value">${new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
                ${user.profile?.customization?.favoriteBrand ? `
                    <div class="customization-item">
                        <span class="customization-label">Favorite Brand:</span>
                        <span class="customization-value">${user.profile.customization.favoriteBrand}</span>
                    </div>
                ` : ''}
                ${user.profile?.customization?.drivingStyle ? `
                    <div class="customization-item">
                        <span class="customization-label">Driving Style:</span>
                        <span class="customization-value">${user.profile.customization.drivingStyle}</span>
                    </div>
                ` : ''}
                ${user.profile?.customization?.location ? `
                    <div class="customization-item">
                        <span class="customization-label">Location:</span>
                        <span class="customization-value">${user.profile.customization.location}</span>
                    </div>
                ` : ''}
                ${user.profile?.customization?.instagram ? `
                    <div class="customization-item">
                        <span class="customization-label">Instagram:</span>
                        <span class="customization-value">${user.profile.customization.instagram}</span>
                    </div>
                ` : ''}
            </div>
        </div>

        <div class="back-link">
            <a href="../team.html">← Back to Team</a>
        </div>
    </div>
</body>
</html>`;

    return {
        filename: `${username}-profile.html`,
        content: profileContent
    };
}

// Function to generate all profile pages
function generateAllProfilePages() {
    const users = JSON.parse(localStorage.getItem('mostWantedUsers') || '[]');
    const generatedProfiles = [];

    users.forEach(user => {
        const profile = generateProfilePage(user);
        generatedProfiles.push(profile);
        
        // In a real implementation, you would save these files
        console.log(`Generated profile: ${profile.filename}`);
        console.log(`User: ${user.name}`);
    });

    return generatedProfiles;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateProfilePage, generateAllProfilePages };
}
