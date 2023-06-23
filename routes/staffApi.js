const express = require('express')

const router = express.Router();
const userController = require('../controller/userController')
const middleware = require('./userMiddleware')

router.use(middleware.validateUser)
router.use(middleware.validateStaff)

router.get('/myAdmin', userController.getMe)

module.exports = router;