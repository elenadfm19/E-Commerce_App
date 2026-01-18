# Italian Restaurant Backend
This project is a full-stack e-commerce simulation for an Italian restaurant. It includes:
- A Node.js + Express + Passport.js backend (authentication, carts, orders, etc.)
- A React frontend for browsing the menu, manipulating the cart, and placing orders

Users can register, log in, browse the menu, create/edit a shopping cart, and place/view orders—similar to real online ordering systems.

## 🎨 Frontend Features
- Log in / register
- Browse menu items
- Add/remove dishes to the cart
- Place orders
- View past orders
- See order details
- Maintain session state via cookies

## 🧱 Tech stack
Frontend
- Vite
- React
- Redux Toolkit
- React Router
- Fetch API (talking to backend)

Backend
- Node.js
- Express
- PostgreSQL
- Passport.js (local strategy)
- Sessions + Cookies
- REST API
  
## 🔧 Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/elenadfm19/E-Commerce_App.git
cd E-Commerce_App
```
2. Edit the .env file inside the backend directory with the correct settings for your local SQL database that you will use:
```ini
DB_HOST=...
DB_PORT=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
```
4. Install backend dependencies and run the development server:
```bash
cd backend
npm install
node dbInit.js
node app.js
```
4. Install frontend dependencies:
```bash
cd ../frontend
npm install
npm run dev
```
5. The app should open at http://localhost:5173.
