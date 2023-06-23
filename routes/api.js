const express = require('express')

const router = express.Router();
const bannerController = require('../controller/bannerController')
const categoryController = require('../controller/categoryController')
const productController = require('../controller/productController')
const userController = require('../controller/userController')
const botController = require('../controller/botController')

router.get('/banner', bannerController.getBanners);
router.post('/banner', bannerController.createBanner);
router.delete('/banner', bannerController.deleteBanner);
router.patch('/banner', bannerController.editBanner);

router.get('/category', categoryController.getCategories);
router.post('/category', categoryController.createCategory);
router.delete('/category', categoryController.deleteCategory);
router.patch('/category', categoryController.editCategory);

router.get('/product', productController.getProducts);
router.post('/product', productController.createProduct);
router.delete('/product', productController.deleteProduct);
router.patch('/product', productController.editProduct);
router.post('/product/:productId/stock', productController.updateStock);
router.post('/product/:productId/price', productController.updatePrice);
router.post('/product/:productId/weight', productController.updateWeight);
router.post('/product/:productId/variant', productController.addVariant);

router.post('/user/register', userController.registerUser);
router.post('/user/login', userController.login);

router.post('/bot/webhook', botController.handleWebhook);

router.get('/autocomplete', (request, response, next) => {
    response.sendStatus(204)
    response.status
})

module.exports = router;