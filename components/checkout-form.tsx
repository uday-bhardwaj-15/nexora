"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

interface CheckoutFormProps {
  items: CartItem[]
  total: number
  onClose: () => void
  onSuccess: (receipt: any) => void
}

export function CheckoutForm({ items, total, onClose, onSuccess }: CheckoutFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          cartItems: items,
        }),
      })

      const receipt = await response.json()

      if (response.ok) {
        onSuccess(receipt)
      } else {
        alert("Checkout failed: " + receipt.error)
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      alert("An error occurred during checkout")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            {items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm mb-1">
                <span>
                  {item.product.name} x {item.quantity}
                </span>
                <span>${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
              {loading ? "Processing..." : "Complete Purchase"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
