/**
 * THE GANG - Core System
 * Centralized Database and Utilities
 */

const DB = {
    // Keys
    USERS: 'mostWantedUsers',
    CURRENT_USER: 'mostWantedCurrentUser',
    FEED: 'mostWantedFeed',
    MEETS: 'mostWantedMeets',

    // Generic Operations
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error(`Error reading ${key}:`, e);
            return [];
        }
    },

    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error(`Error saving ${key}:`, e);
            return false;
        }
    },

    // User Operations
    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(this.CURRENT_USER));
        } catch (e) {
            return null;
        }
    },

    updateUser(userData) {
        const users = this.get(this.USERS);
        const index = users.findIndex(u => u.id === userData.id);
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            this.save(this.USERS, users);
            // Update session if it's the current user
            const current = this.getCurrentUser();
            if (current && current.id === userData.id) {
                localStorage.setItem(this.CURRENT_USER, JSON.stringify(users[index]));
            }
            return true;
        }
        return false;
    }
};

const UI = {
    toast(message, type = 'info') {
        const colors = {
            success: 'bg-green-600',
            error: 'bg-red-600',
            info: 'bg-amber-500',
            warning: 'bg-orange-500'
        };
        
        const toast = document.createElement('div');
        toast.className = `fixed bottom-6 right-6 ${colors[type]} text-slate-950 font-black px-6 py-4 rounded-2xl shadow-2xl z-[10000] animate-bounce-in flex items-center gap-3`;
        toast.innerHTML = `<span>${type === 'error' ? '⚠️' : '🔥'}</span> ${message.toUpperCase()}`;
        
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('animate-fade-out');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    },

    formatTime(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return 'Just Now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return new Date(timestamp).toLocaleDateString();
    }
};

// Global Auth Check
function checkPageSecurity() {
    const publicPages = ['index.html', 'auth.html', ''];
    const path = window.location.pathname.split('/').pop();
    
    if (!DB.getCurrentUser() && !publicPages.includes(path)) {
        window.location.href = 'auth.html';
    }
}

document.addEventListener('DOMContentLoaded', checkPageSecurity);

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Driver Link Established:', reg.scope))
            .catch(err => console.log('Link Failure:', err));
    });
}
