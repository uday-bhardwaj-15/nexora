"use client"

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

interface CartViewProps {
  items: CartItem[]
  total: number
  onRemove: (itemId: string) => void
  onCheckout: () => void
}

export function CartView({ items, total, onRemove, onCheckout }: CartViewProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shopping Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Your cart is empty</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopping Cart ({items.length} items)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item._id} className="flex justify-between items-center border-b pb-4">
            <div className="flex-1">
              <p className="font-semibold">{item.product.name}</p>
              <p className="text-sm text-gray-600">
                ${item.product.price.toFixed(2)} x {item.quantity} = ${item.subtotal.toFixed(2)}
              </p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => onRemove(item._id)}>
              Remove
            </Button>
          </div>
        ))}

        <div className="pt-4 border-t-2">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
          </div>
          <Button onClick={onCheckout} className="w-full bg-green-600 hover:bg-green-700">
            Proceed to Checkout
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
