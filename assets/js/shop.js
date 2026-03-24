/**
 * THE GANG - Shop System
 * E-commerce logic for official merchandise
 */

const Shop = {
    cart: [],

    init() {
        this.renderProducts();
        this.updateCartUI();
    },

    products: [
        { id: 'h1', name: 'Premium Hoodie', price: 45, category: 'hoodies', img: 'assets/images/hoodie.jpg', desc: 'Heavyweight premium hoodie with embroidered logo.' },
        { id: 'c1', name: 'Elite Cap', price: 20, category: 'caps', img: 'assets/images/hat.jpg', desc: 'Classic structured cap with adjustable strap.' },
        { id: 'k1', name: 'Metal Keychain', price: 15, category: 'accessories', img: 'assets/images/keyring.jpg', desc: 'Solid metal etched with the Most Wanted emblem.' },
        { id: 't1', name: 'Full Tracksuit', price: 120, category: 'tracksuits', img: 'assets/images/tracksuit.jpg', desc: 'Complete set. High-performance comfort.' },
        { id: 's1', name: 'Vinyl Sticker Pack', price: 5, category: 'accessories', img: 'assets/images/stickerpack.jpg', desc: 'Weatherproof decals for your machine.' }
    ],

    renderProducts(filter = 'all') {
        const container = document.getElementById('product-grid');
        const filtered = filter === 'all' ? this.products : this.products.filter(p => p.category === filter);

        container.innerHTML = filtered.map(p => `
            <div class="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden group hover:border-amber-500/50 transition-all shadow-xl">
                <div class="aspect-square bg-slate-950 relative overflow-hidden">
                    <img src="${p.img}" class="w-full h-full object-cover transition-transform group-hover:scale-110" alt="${p.name}">
                    <div class="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div class="p-8">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-xl font-black uppercase italic text-white leading-none">${p.name}</h3>
                        <span class="text-amber-500 font-black italic">£${p.price.toFixed(2)}</span>
                    </div>
                    <p class="text-slate-500 text-xs leading-relaxed mb-8">${p.desc}</p>
                    <button onclick="Shop.addToCart('${p.id}')" class="w-full bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest transition-all active:scale-95">Add to Bag</button>
                </div>
            </div>
        `).join('');
    },

    addToCart(id) {
        const product = this.products.find(p => p.id === id);
        this.cart.push({ ...product, cartId: Date.now() });
        this.updateCartUI();
        UI.toast(`${product.name} ADDED`, "success");
    },

    removeFromCart(cartId) {
        this.cart = this.cart.filter(item => item.cartId !== cartId);
        this.updateCartUI();
    },

    updateCartUI() {
        const itemsContainer = document.getElementById('cart-items');
        const totalContainer = document.getElementById('cart-total');
        const countContainer = document.getElementById('cart-count');

        if (this.cart.length === 0) {
            itemsContainer.innerHTML = `<p class="text-slate-600 text-[10px] font-bold uppercase text-center py-10 italic">Your Bag is Empty</p>`;
        } else {
            itemsContainer.innerHTML = this.cart.map(item => `
                <div class="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-3">
                    <div>
                        <p class="text-[10px] font-black text-white uppercase italic">${item.name}</p>
                        <p class="text-amber-500 font-bold text-[10px]">£${item.price.toFixed(2)}</p>
                    </div>
                    <button onclick="Shop.removeFromCart(${item.cartId})" class="text-slate-700 hover:text-red-500 transition-colors">✕</button>
                </div>
            `).join('');
        }

        const total = this.cart.reduce((sum, item) => sum + item.price, 0);
        totalContainer.innerText = `£${total.toFixed(2)}`;
        if (countContainer) countContainer.innerText = this.cart.length;
    },

    checkout() {
        if (this.cart.length === 0) return UI.toast("BAG IS EMPTY", "error");
        document.getElementById('payment-modal').classList.remove('hidden');
    }
};
