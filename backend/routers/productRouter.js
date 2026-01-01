import express from "express";
import { createProduct, deleteProduct, getProducts } from "../controllers/productController.js"; 

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.get("/", getProducts);
productRouter.delete("/", deleteProduct);

export default productRouter;