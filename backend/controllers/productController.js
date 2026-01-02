import Product from "../models/product.js";

export function createProduct(req, res) {
    if(req.user == null) {
        res.json({
            message: "You ara not logged in"
        })
        return
    }

    if(req.user.role != "admin") {
        res.json({
            message: "You are not an admin"
        })
        return
    }

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
    Product.findOne({productName: req.params.productName}).then(
        product => {
            if(!product) {
                res.json({
                    message: "Product not found"
                })
            } else {
                res.json({
                    product: product
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