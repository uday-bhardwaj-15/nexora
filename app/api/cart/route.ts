import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Cart from "@/models/Cart"
import Product from "@/models/Product"

export async function GET() {
  try {
    await connectDB()

    const cartItems = await Cart.find({}).populate("productId")

    let total = 0
    const items = cartItems.map((item) => {
      const price = item.productId.price
      const subtotal = price * item.quantity
      total += subtotal
      return {
        _id: item._id,
        product: item.productId,
        quantity: item.quantity,
        subtotal,
      }
    })

    return NextResponse.json({ items, total })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()

    const { productId, quantity } = await request.json()

    if (!productId || !quantity) {
      return NextResponse.json({ error: "Missing productId or quantity" }, { status: 400 })
    }

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if item already in cart
    let cartItem = await Cart.findOne({ productId })

    if (cartItem) {
      cartItem.quantity += quantity
      await cartItem.save()
    } else {
      cartItem = await Cart.create({ productId, quantity })
    }

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
