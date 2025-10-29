import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"

export async function GET() {
  try {
    await connectDB()

    // Check if products exist, if not create mock products
    let products = await Product.find({})

    if (products.length === 0) {
      const mockProducts = [
        {
          name: "Wireless Headphones",
          price: 79.99,
          description: "High-quality wireless headphones with noise cancellation",
          image: "/wireless-headphones.png",
        },
        {
          name: "USB-C Cable",
          price: 12.99,
          description: "Durable USB-C charging cable",
          image: "/usb-cable.png",
        },
        {
          name: "Phone Case",
          price: 24.99,
          description: "Protective phone case with premium materials",
          image: "/colorful-phone-case-display.png",
        },
        {
          name: "Screen Protector",
          price: 9.99,
          description: "Tempered glass screen protector",
          image: "/screen-protector.png",
        },
        {
          name: "Portable Charger",
          price: 34.99,
          description: "20000mAh portable power bank",
          image: "/portable-charger-lifestyle.png",
        },
        {
          name: "Bluetooth Speaker",
          price: 49.99,
          description: "Waterproof portable Bluetooth speaker",
          image: "/bluetooth-speaker.jpg",
        },
        {
          name: "Phone Stand",
          price: 14.99,
          description: "Adjustable phone stand for desk",
          image: "/phone-stand.jpg",
        },
        {
          name: "Wireless Charger",
          price: 29.99,
          description: "Fast wireless charging pad",
          image: "/wireless-charger.png",
        },
      ]

      products = await Product.insertMany(mockProducts)
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
