"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Product {
  _id: string
  name: string
  price: number
  description: string
  image: string
}

interface ProductGridProps {
  onAddToCart: (productId: string, quantity: number) => void
}

export function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card key={product._id} className="flex flex-col">
          <CardHeader>
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <CardDescription>${product.price.toFixed(2)}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
            <Button onClick={() => onAddToCart(product._id, 1)} className="w-full bg-blue-600 hover:bg-blue-700">
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
