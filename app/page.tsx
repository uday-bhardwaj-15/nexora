"use client"

import { useState, useEffect } from "react"
import { ProductGrid } from "@/components/product-grid"
import { CartView } from "@/components/cart-view"
import { CheckoutForm } from "@/components/checkout-form"
import { ReceiptModal } from "@/components/receipt-modal"

interface CartItem {
  _id: string
  product: {
    _id: string
    name: string
    price: number
  }
  quantity: number
  subtotal: number
}

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)
  const [showCheckout, setShowCheckout] = useState(false)
  const [receipt, setReceipt] = useState(null)

  // Fetch cart on mount
  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart")
      const data = await response.json()
      setCartItems(data.items)
      setCartTotal(data.total)
    } catch (error) {
      console.error("Error fetching cart:", error)
    }
  }

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      })

      if (response.ok) {
        fetchCart()
        alert("Added to cart!")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const handleRemoveFromCart = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchCart()
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
    }
  }

  const handleCheckoutSuccess = (orderReceipt: any) => {
    setReceipt(orderReceipt)
    setShowCheckout(false)
    setCartItems([])
    setCartTotal(0)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Vibe Commerce</h1>
          <p className="text-gray-600">Your favorite online store</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Products</h2>
            <ProductGrid onAddToCart={handleAddToCart} />
          </div>

          {/* Cart Section */}
          <div>
            {showCheckout ? (
              <CheckoutForm
                items={cartItems}
                total={cartTotal}
                onClose={() => setShowCheckout(false)}
                onSuccess={handleCheckoutSuccess}
              />
            ) : (
              <CartView
                items={cartItems}
                total={cartTotal}
                onRemove={handleRemoveFromCart}
                onCheckout={() => setShowCheckout(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {receipt && (
        <ReceiptModal
          receipt={receipt}
          onClose={() => {
            setReceipt(null)
            fetchCart()
          }}
        />
      )}
    </main>
  )
}
