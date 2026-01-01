import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    productName: String,
    price: Number,
    description: String
})

const Product = mongoose.model("products", productSchema)

export default Product;