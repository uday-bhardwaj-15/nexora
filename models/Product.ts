import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "/diverse-products-still-life.png",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Product || mongoose.model("Product", productSchema)
