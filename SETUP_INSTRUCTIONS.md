# Vibe Commerce - E-Commerce Cart Setup Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier available)

## Step 1: Get MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier is fine)
4. Click "Connect" on your cluster
5. Choose "Drivers" and select Node.js
6. Copy the connection string
7. Replace `<password>` with your database password
8. Replace `myFirstDatabase` with your desired database name

Example format:
\`\`\`
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
\`\`\`

## Step 2: Setup Environment Variables

1. Create a `.env.local` file in the root directory
2. Add your MongoDB connection string:
\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
\`\`\`

## Step 3: Install Dependencies

\`\`\`bash
npm install
\`\`\`

## Step 4: Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

✅ **Product Listing** - Browse 8 mock products with images and descriptions
✅ **Add to Cart** - Add products with quantity management
✅ **Cart Management** - View cart items, remove items, see totals
✅ **Checkout** - Enter name and email for mock checkout
✅ **Order Receipt** - View order confirmation with order ID and timestamp
✅ **Responsive Design** - Works on mobile, tablet, and desktop
✅ **MongoDB Integration** - All data persisted in MongoDB

## API Endpoints

- `GET /api/products` - Get all products (creates mock data on first call)
- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get cart items and total
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/checkout` - Process checkout and create order

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── products/route.ts
│   │   ├── cart/route.ts
│   │   ├── cart/[id]/route.ts
│   │   └── checkout/route.ts
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── product-grid.tsx
│   ├── cart-view.tsx
│   ├── checkout-form.tsx
│   └── receipt-modal.tsx
├── models/
│   ├── Product.ts
│   └── Cart.ts
├── lib/
│   └── mongodb.ts
└── .env.local
\`\`\`

## Troubleshooting

**"MONGODB_URI is not defined"**
- Make sure `.env.local` file exists in the root directory
- Verify the connection string is correct
- Restart the dev server after adding env variables

**"Cannot connect to MongoDB"**
- Check your internet connection
- Verify MongoDB Atlas cluster is running
- Check if your IP is whitelisted in MongoDB Atlas (Network Access)

**Products not loading**
- Check browser console for errors
- Verify MongoDB connection is working
- Try refreshing the page

## Deployment

To deploy to Vercel:

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variable `MONGODB_URI` in Vercel dashboard
5. Deploy!

## Notes

- This is a mock e-commerce app for learning purposes
- No real payments are processed
- Cart data is stored in MongoDB and persists across sessions
- Mock products are created automatically on first API call
