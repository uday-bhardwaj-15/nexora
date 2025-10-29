import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Cart from "@/models/Cart"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const { id } = params

    const deletedItem = await Cart.findByIdAndDelete(id)

    if (!deletedItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Item removed from cart" })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}
