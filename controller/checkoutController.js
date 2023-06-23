const cartRepository = require('../repository/cartRepository')
const orderRepository = require('../repository/orderRepository')
const productRepository = require('../repository/productRepository')

class CheckoutController {
    checkout = (req, res, next) => {
        // get user carts
        const note = req.body.note
        const addressId = req.body.address_id
        const isPickUp = req.body.is_pick_up || false
        const userId = res.locals.user.id

        this.processCheckout(note, addressId, isPickUp, userId, (error) => {
            if (!!error) {
                res.status(400).send({
                    error: error
                })
            } else {
                res.sendStatus(200)
            }
        })
    }

    processCheckout = (note, addressId, isPickUp, userId, callback) => {
        const getUserCartPromise = userId => new Promise(resolve => cartRepository.getUserCart(userId, resolve))

        getUserCartPromise(userId)
            .then(cartItems => {
                let cartTotal = 0
                let productIds = []
                cartItems.forEach(item => {
                    cartTotal += item.total
                    productIds.push(item.id)
                })

                this.validateStocks(userId, cartItems, cartTotal, productIds, note, addressId, isPickUp, (error) => {
                    callback(error)
                })
            })
    }

    validateStocks = (userId, cartItems, cartTotal, productIds, note, addressId, isPickUp, resolver) => {
        const getStocks = productIds => new Promise(resolve => productRepository.getStockForProducts(productIds, resolve))

        getStocks(productIds)
            .then((stocks) => {
                try {
                    cartItems.forEach((item) => {
                        const stock = stocks.find(stock => stock.id == item.id)

                        if (!stock || stock.stock < item.qty) {
                            let productFullName = item.name
                            if (!!item.parent_name) {
                                productFullName = `${item.parent_name} - ${productFullName}`
                            }
                            resolver(`Insufficient Stock for ${productFullName}. Only ${stock && stock.stock || 0} remaining`)
                            throw '';
                        }
                    })

                    productRepository.reduceStockForProducts(cartItems)
                    this.createOrder(userId, cartItems, cartTotal, note, addressId, isPickUp, resolver)
                } catch (e) {
                    // do nothing
                }
            })
    }

    createOrder(userId, cartItems, cartTotal, note, addressId, isPickUp, resolver) {
        orderRepository.createOrder(
            userId,
            addressId ,
            cartTotal, 
            note,
            isPickUp,
            (orderId) => {
                cartRepository.clearUserCart(userId)
                cartItems.forEach(item => {
                    console.log(item)
                    orderRepository.createOrderLine(orderId, item.id, item.qty)
                })

                resolver(null)
            }
        )
    }
}

module.exports = new CheckoutController()