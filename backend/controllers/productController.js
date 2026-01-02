import Product from "../models/product.js";
import Student from "../models/student.js";

export function createProduct(req, res) {
    const product = new Product(req.body)
    product.save().then(
        () => {
            res.json({
                message: "Product created"
            })
        }
    ).catch(
        () => {
            res.json({
                message: "Not product created"
            })
        }
    )
}

export function getProducts(req, res) {
    Product.find().then(
        (productList) => {
            res.json({
                list: productList
            })
        }
    ).catch(
        (error) => {
            res.json({
                message: error
            })
        }
    )
}

export function getProductByName(req, res) {
    Product.find({productName: req.params.productName}).then(
        (productList) => {
            if(productList == 0) {
                res.json({
                    message: "Product not found"
                })
            } else {
                res.json({
                    list: productList
                })                
            }
        }
    ).catch(
        (error) => {
            res.json({
                message: error
            })
        }
    )
}

export function deleteProduct(req, res) {
    Product.deleteOne({productName: req.params.productName}).then(
        () => {
            res.json({
                message: "Product delete successfully"
            })
        }
    ).catch(
        (error) => {
            res.json({
                message: error
            })
        }
    )
}