/**
 * THE GANG - Layout System
 * Standardized Navigation and Structural Components
 */

const Layout = {
    injectNavigation() {
        const user = DB.getCurrentUser();
        const path = window.location.pathname.split('/').pop();
        
        // Hide nav on login/splash
        if (['index.html', 'auth.html', ''].includes(path)) return;

        const nav = document.createElement('nav');
        nav.className = 'fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-2xl border-b border-amber-500/20 px-6 py-4 shadow-2xl';
        
        const navContent = `
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <div class="flex flex-col group cursor-pointer" onclick="window.location.href='feed.html'">
                    <span class="text-2xl font-black text-amber-500 italic tracking-tighter uppercase leading-none">THE GANG</span>
                    <span class="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mt-1">Essex Car Community</span>
                </div>
                
                <div class="hidden md:flex items-center gap-8">
                    <a href="feed.html" class="${path === 'feed.html' ? 'text-amber-500' : 'text-slate-400'} text-xs font-black uppercase tracking-widest hover:text-amber-500 transition-colors">Feed</a>
                    <a href="car-meets.html" class="${path === 'car-meets.html' ? 'text-amber-500' : 'text-slate-400'} text-xs font-black uppercase tracking-widest hover:text-amber-500 transition-colors">Meets</a>
                    <a href="merch.html" class="${path === 'merch.html' ? 'text-amber-500' : 'text-slate-400'} text-xs font-black uppercase tracking-widest hover:text-amber-500 transition-colors">Shop</a>
                    <a href="team.html" class="${path === 'team.html' ? 'text-amber-500' : 'text-slate-400'} text-xs font-black uppercase tracking-widest hover:text-amber-500 transition-colors">The Crew</a>
                </div>

                <div class="flex items-center gap-4">
                    <a href="profile.html" class="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-amber-500 px-4 py-2 rounded-full transition-all group">
                        <span class="text-xs font-black text-slate-400 group-hover:text-amber-500 transition-colors">${user ? user.name.split(' ')[0] : 'Driver'}</span>
                        <div class="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-black text-slate-950">
                            ${user ? user.name[0] : '?'}
                        </div>
                    </a>
                    <button onclick="Auth.logout()" class="p-2 text-slate-500 hover:text-red-500 transition-colors" title="Eject Session">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        nav.innerHTML = navContent;
        document.body.prepend(nav);
        // Adjust body padding for fixed nav
        document.body.style.paddingTop = '80px';
    }
};

const Auth = {
    logout() {
        localStorage.removeItem(DB.CURRENT_USER);
        window.location.href = 'auth.html';
    }
};

document.addEventListener('DOMContentLoaded', Layout.injectNavigation);
