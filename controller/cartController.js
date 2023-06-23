const repository = require('../repository/cartRepository')
const productRepository = require('../repository/productRepository')

class CartController {
    getUserCart(req, res, next) {
        console.log(res.locals.user.id)
        repository.getUserCart(res.locals.user.id, (cartItems) => {
            let cartTotal = 0
            cartItems.forEach(item => {
                cartTotal += item.total
            })

            const data = {
                cartTotal,
                items: cartItems
            }

            res.send(data)
        })
    }

    addToCart = (req, res, next) => {
        const product_id = req.body.product_id
        const userId = res.locals.user.id
        
        this.processATC(product_id, userId, (error) => {
            if (!!error) {
                res.status(400).send({
                    "error": error
                })
            } else {
                res.sendStatus(200)
            }
        })
    }

    processATC = (product_id, userId, resolver) => {
        productRepository.getStockForProduct(product_id, (stock) => {
            repository.getProductCountInCart(userId, product_id, (qty) => {
                if (qty == 0 && stock >= 1) {
                    repository.addToCart(userId, product_id)
                    resolver(null)
                } else if (stock >= qty + 1) {
                    repository.incrementProductInCart(userId, product_id)
                    console.log("up here")
                    resolver(null)
                } else {
                    resolver("Insufficient stock. Stock remaining is " + stock)
                }
            })
        })
    }

    deleteFromCart(req, res, next) {
        const product_id = req.body.product_id
        const userId = res.locals.user.id
        const removeAll = req.body.remove_all == "true"

        repository.getProductCountInCart(userId, product_id, (qty) => {
            if (qty == 1 || removeAll) {
                repository.removeProductFromCart(userId, product_id)
            } else {
                repository.decreateProductInCart(userId, product_id)
            }


            res.sendStatus(200)
        })
    }

    clearUserCart(req, res, next) {
        const userId = res.locals.user.id
        repository.clearUserCart(userId)
        res.sendStatus(200)
    }
}

module.exports = new CartController()