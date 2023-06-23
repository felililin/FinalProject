const express = require('express')

const router = express.Router();
const userController = require('../controller/userController')
const cartController = require('../controller/cartController')
const addressController = require('../controller/addressController')
const checkoutController = require('../controller/checkoutController')
const orderController = require('../controller/orderController');
const middleware = require('./userMiddleware');

// request -> router -> middleware -> controller
// middleware
//  - lanjutin request
//  - deny request

router.use(middleware.validateUser)

router.get('/me', userController.getMe)
router.post('/me/update-profile', userController.changePassword)

router.get('/address', addressController.getUserAddress)
router.post('/address', addressController.addUserAddress)
router.patch('/address', addressController.updateUserAddress)
router.delete('/address', addressController.deleteUserAddress)

router.get('/cart', cartController.getUserCart)
router.post('/cart', cartController.addToCart)
router.delete('/cart', cartController.deleteFromCart)
router.delete('/cart/all', cartController.clearUserCart)

router.post('/checkout', checkoutController.checkout)
router.get('/orders', orderController.getUserOrders)

module.exports = router;