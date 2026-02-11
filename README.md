# THE GANG - Essex Car Meets

## 🚗 About
THE GANG is Essex's premier car enthusiast community. We bring together petrolheads from across the county for epic meets, cruises, and vibes.

## 📁 Project Structure
```
thegang/
├── car-meets.html     # Main page with event calendar
├── merch.html         # Merchandise store with Stripe payments
├── team.html          # Team member profiles
├── app.rb             # Ruby/Sinatra backend for payments
├── Gemfile            # Ruby dependencies
├── THE_GANG_logo.png  # Official brand logo
└── README.md          # This file
```

## 🛍️ Merchandise Store
Features a fully functional e-commerce store with:
- Product catalog with categories
- Shopping cart functionality
- Real Stripe payment processing
- Multiple payment methods (Card, PayPal, Apple Pay, Google Pay)

## 💳 Payment Setup
The store uses Stripe for secure payment processing:

### Test Environment
- Currently using Stripe test keys
- Test card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVV

### To Go Live
1. Replace test keys with live keys in `merch.html` and `app.rb`
2. Configure webhook endpoint in Stripe dashboard
3. Update endpoint secret in `app.rb`

## 🚀 Running the Store

### Prerequisites
- Ruby installed
- Bundle gem installed

### Setup
```bash
# Install dependencies
bundle install

# Start the server
ruby app.rb

# For development with auto-reload
rerun ruby app.rb
```

### Access
- Main site: http://localhost:4242
- Merch page: http://localhost:4242/merch.html

## 🎨 Design
- **Theme**: Gold and black (#ffd700, #000000)
- **Typography**: Arial Black
- **Responsive**: Mobile-friendly design
- **Interactive**: Hover effects and animations

## 📧 Contact
- Run by: Courbon Longstaff
- Web & Media: PJ Longstaff

## 📜 License
MIT License
