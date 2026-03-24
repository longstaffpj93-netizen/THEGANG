/**
 * THE GANG - Meets System
 * Logic for managing and displaying car community events
 */

const Meets = {
    init() {
        this.renderMeets();
    },

    events: [
        { date: 'FRI 13 FEB 2026', title: 'Chelmsford Friday Night', location: 'Riverside Retail Park', time: '8:00 PM – 11:00 PM', desc: 'Weekly Friday night hangout for the Chelmsford crew. Relaxed vibes, quality motors, and coffee.' },
        { date: 'SAT 14 FEB 2026', title: "Lakeside Valentine's Meet", location: 'Lakeside Shopping Centre', time: '6:00 PM – 10:00 PM', desc: "Special Valentine's edition. Food vendors, music, and good energy expected." },
        { date: 'SUN 15 FEB 2026', title: 'Southend Seafront Sunday', location: 'Marine Parade, Southend', time: '10:00 AM – 2:00 PM', desc: 'Classic Sunday cruise along the seafront. Epic photo ops with the pier backdrop.' },
        { date: 'SUN 01 MAR 2026', title: 'Season Opener', location: 'Chelmsford City Racecourse', time: '10:00 AM – 4:00 PM', desc: 'Big season kick-off event! Trade stands, special guests, and proper Essex energy.' },
        { date: 'SAT 07 MAR 2026', title: 'Basildon Mega Meet', location: 'Festival Leisure Park', time: '6:00 PM – 11:00 PM', desc: 'Monthly legend returns. DJ, competitions, giveaways, and huge turnout.' },
        { date: 'FRI 03 APR 2026', title: 'Epping Forest Night Run', location: 'High Beach Car Park', time: '7:00 PM – 10:00 PM', desc: 'Evening cruise through the forest roads. Meet at High Beach, then scenic drive.' }
    ],

    renderMeets() {
        const container = document.getElementById('meets-grid');
        
        container.innerHTML = this.events.map(event => `
            <div class="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-xl transition-all hover:border-amber-500/50 group relative overflow-hidden">
                <div class="relative z-10">
                    <span class="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-4 block">${event.date}</span>
                    <h2 class="text-2xl font-black italic uppercase tracking-tighter text-white mb-6 leading-none group-hover:text-amber-400 transition-colors">${event.title}</h2>
                    
                    <div class="space-y-3 mb-8">
                        <div class="flex items-center gap-3">
                            <span class="text-xs">📍</span>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${event.location}</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-xs">⏰</span>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${event.time}</span>
                        </div>
                    </div>
                    
                    <p class="text-slate-500 text-xs leading-relaxed">${event.desc}</p>
                </div>
                <!-- Accent Background -->
                <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rotate-45 translate-x-16 -translate-y-16 group-hover:bg-amber-500/10 transition-colors"></div>
            </div>
        `).join('');
    }
};
