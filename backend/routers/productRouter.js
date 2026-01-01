import express from "express";
import { createProduct, deleteProduct, getProductByName, getProducts } from "../controllers/productController.js"; 

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.get("/", getProducts);
productRouter.get("/:productName", getProductByName);
productRouter.delete("/:productName", deleteProduct);

export default productRouter;