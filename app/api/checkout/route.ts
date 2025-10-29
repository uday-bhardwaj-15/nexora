import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Cart from "@/models/Cart"

export async function POST(request: Request) {
  try {
    await connectDB()

    const { name, email, cartItems } = await request.json()

    if (!name || !email || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate total
    let total = 0
    cartItems.forEach((item: any) => {
      total += item.subtotal
    })

    // Create receipt
    const receipt = {
      orderId: `ORD-${Date.now()}`,
      customerName: name,
      customerEmail: email,
      items: cartItems,
      total: Number.parseFloat(total.toFixed(2)),
      timestamp: new Date().toISOString(),
    }

    // Clear cart after checkout
    await Cart.deleteMany({})

    return NextResponse.json(receipt)
  } catch (error) {
    console.error("Error during checkout:", error)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
