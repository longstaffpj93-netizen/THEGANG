/**
 * THE GANG - Feed System
 * Logic for community posts, likes, and sharing
 */

const Feed = {
    init() {
        this.renderPosts();
    },

    getPosts(filter = 'all') {
        const posts = DB.get(DB.FEED);
        if (filter === 'all') return posts.sort((a, b) => b.timestamp - a.timestamp);
        return posts.filter(p => p.type === filter).sort((a, b) => b.timestamp - a.timestamp);
    },

    renderPosts(filter = 'all') {
        const container = document.getElementById('feed-posts');
        const posts = this.getPosts(filter);

        if (posts.length === 0) {
            container.innerHTML = `
                <div class="py-20 text-center opacity-20">
                    <p class="text-4xl mb-4">📢</p>
                    <p class="font-black uppercase tracking-widest italic">Radio Silence</p>
                </div>
            `;
            return;
        }

        container.innerHTML = posts.map(post => this.createPostHTML(post)).join('');
    },

    createPostHTML(post) {
        const user = DB.getCurrentUser();
        const isLiked = post.likedBy?.includes(user?.id);
        
        return `
            <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden mb-8 shadow-xl transition-all hover:border-amber-500/30">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-xs font-black text-slate-950">
                                ${post.authorName[0]}
                            </div>
                            <div>
                                <p class="text-sm font-black text-white uppercase italic leading-none">${post.authorName}</p>
                                <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">${UI.formatTime(post.timestamp)}</p>
                            </div>
                        </div>
                        <span class="bg-slate-950 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                            ${post.type}
                        </span>
                    </div>
                    
                    <p class="text-slate-300 text-sm leading-relaxed mb-6">${post.content}</p>
                    
                    <div class="flex items-center gap-6 pt-6 border-t border-slate-800/50">
                        <button onclick="Feed.toggleLike('${post.id}')" class="flex items-center gap-2 group">
                            <span class="text-lg transition-transform group-active:scale-150">${isLiked ? '❤️' : '🤍'}</span>
                            <span class="text-[10px] font-black ${isLiked ? 'text-white' : 'text-slate-500'} uppercase">${post.likes || 0}</span>
                        </button>
                        <button class="flex items-center gap-2 opacity-50 cursor-not-allowed">
                            <span class="text-lg">💬</span>
                            <span class="text-[10px] font-black text-slate-500 uppercase">0</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    toggleLike(postId) {
        const user = DB.getCurrentUser();
        if (!user) return UI.toast("Login Required", "error");

        const posts = DB.get(DB.FEED);
        const post = posts.find(p => p.id === postId);
        
        if (post) {
            if (!post.likedBy) post.likedBy = [];
            
            const index = post.likedBy.indexOf(user.id);
            if (index === -1) {
                post.likedBy.push(user.id);
                post.likes = (post.likes || 0) + 1;
            } else {
                post.likedBy.splice(index, 1);
                post.likes = Math.max(0, (post.likes || 0) - 1);
            }
            
            DB.save(DB.FEED, posts);
            this.renderPosts();
        }
    },

    sharePost(content, type) {
        const user = DB.getCurrentUser();
        const posts = DB.get(DB.FEED);
        
        const newPost = {
            id: Date.now().toString(),
            authorId: user.id,
            authorName: user.name,
            content,
            type,
            timestamp: Date.now(),
            likes: 0,
            likedBy: []
        };
        
        posts.unshift(newPost);
        DB.save(DB.FEED, posts);
        UI.toast("Transmission Sent", "success");
        this.renderPosts();
    }
};
