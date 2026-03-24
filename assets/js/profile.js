/**
 * THE GANG - Profile System
 * Management of Pilot ID, Garage, and customization
 */

const Profile = {
    init() {
        this.loadProfile();
        this.renderGallery();
    },

    loadProfile() {
        const user = DB.getCurrentUser();
        if (!user) return;

        // Header Info
        document.getElementById('pilot-name').innerText = user.name;
        document.getElementById('pilot-email').innerText = user.email;
        document.getElementById('pilot-initial').innerText = user.name[0];
        
        // Bio & Stats
        document.getElementById('bio-input').value = user.profile?.bio || '';
        document.getElementById('car-count').innerText = user.profile?.cars?.length || 0;
        
        const joinDate = new Date(user.joinDate || Date.now());
        const days = Math.floor((Date.now() - joinDate) / (1000 * 60 * 60 * 24));
        document.getElementById('member-days').innerText = days;

        // Customization
        const cust = user.profile?.customization || {};
        document.getElementById('insta-handle').value = cust.instagram || '';
        document.getElementById('location-input').value = cust.location || '';
        document.getElementById('driving-style').value = cust.drivingStyle || 'cruise';

        this.renderCars();
    },

    renderCars() {
        const user = DB.getCurrentUser();
        const container = document.getElementById('garage-list');
        const cars = user.profile?.cars || [];

        if (cars.length === 0) {
            container.innerHTML = `<p class="text-slate-600 text-[10px] font-bold uppercase py-4">Garage is Empty</p>`;
            return;
        }

        container.innerHTML = cars.map((car, i) => `
            <div class="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800 mb-2 group">
                <span class="text-xs font-black text-white uppercase italic">${car}</span>
                <button onclick="Profile.removeCar(${i})" class="text-slate-600 hover:text-red-500 transition-colors">✕</button>
            </div>
        `).join('');
    },

    addCar() {
        const input = document.getElementById('new-car-input');
        const car = input.value.trim();
        if (!car) return;

        const user = DB.getCurrentUser();
        if (!user.profile.cars) user.profile.cars = [];
        user.profile.cars.push(car);
        
        DB.updateUser(user);
        input.value = '';
        this.loadProfile();
        UI.toast("Vehicle Registered", "success");
    },

    removeCar(index) {
        const user = DB.getCurrentUser();
        user.profile.cars.splice(index, 1);
        DB.updateUser(user);
        this.loadProfile();
        UI.toast("Vehicle Ejected", "info");
    },

    saveProfile() {
        const user = DB.getCurrentUser();
        user.profile.bio = document.getElementById('bio-input').value;
        user.profile.customization = {
            instagram: document.getElementById('insta-handle').value,
            location: document.getElementById('location-input').value,
            drivingStyle: document.getElementById('driving-style').value
        };

        DB.updateUser(user);
        UI.toast("Pilot File Updated", "success");
    },

    handleImageUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const user = DB.getCurrentUser();
            if (type === 'profile') {
                user.profile.profilePic = e.target.result;
            } else if (type === 'gallery') {
                if (!user.profile.gallery) user.profile.gallery = [];
                user.profile.gallery.unshift(e.target.result);
                if (user.profile.gallery.length > 6) user.profile.gallery.pop();
            }
            
            DB.updateUser(user);
            this.loadProfile();
            this.renderGallery();
            UI.toast("Visual Uploaded", "success");
        };
        reader.readAsDataURL(file);
    },

    renderGallery() {
        const user = DB.getCurrentUser();
        const container = document.getElementById('image-gallery');
        const images = user.profile?.gallery || [];

        if (images.length === 0) {
            container.innerHTML = `<p class="col-span-full text-center text-slate-700 text-[10px] font-black uppercase py-10 italic">No Media Captured</p>`;
            return;
        }

        container.innerHTML = images.map(img => `
            <div class="aspect-video bg-slate-950 border border-slate-800 rounded-xl overflow-hidden group relative">
                <img src="${img}" class="w-full h-full object-cover transition-transform group-hover:scale-110">
                <div class="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
        `).join('');
    }
};
