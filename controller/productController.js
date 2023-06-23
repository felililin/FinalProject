const repository = require('../repository/productRepository')
const multer = require('multer')
const fs = require("fs")

class ProductController {
    getProducts(req, res, next) {
        if (!!req.query.category_id) {
            repository.getProductsWithCategory(req.query.category_id, (data) => {
                res.send(data)
            })
        } else {
            repository.getProducts((data) => {
                res.send(data)
            })
        }
    }

    deleteProduct(req, res, next) {
        const id = req.body.id
        repository.deleteProduct(id)
        res.sendStatus(204)
    }

    createProduct(req, res, next) {
        let upload = multer({ dest: "./public/images/product" }).single('image');

        upload(req, res, function(err) {
            if (req.fileValidationError) {
                return res.send("invalid file");
            } else if (err instanceof multer.MulterError) {
                return res.send(err);
            } else if (err) {
                return res.send(err);
            }

            const tempPath = req.file.path;
            const targetPath = `./public/images/product/${req.file.originalname}`;

            fs.rename(tempPath, targetPath, err => {
                const storagePath = targetPath
                    .replace(".", `${process.env.BASE_URL}:${process.env.PORT}`)
                    .replace("/public", "")
                repository.createProduct(req.body, storagePath)
                if (err) return res.send(err);

                res.sendStatus(201)
            });
        })
    }

    editProduct(req, res, next) {
        let upload = multer({ dest: "./public/images/product" }).single('image');

        upload(req, res, function(err) {
            if (req.fileValidationError) {
                return res.send("invalid file");
            } else if (err instanceof multer.MulterError) {
                return res.send(err);
            } else if (err) {
                return res.send(err);
            }

            const tempPath = req.file.path;
            const targetPath = `./public/images/product/${req.file.originalname}`;

            fs.rename(tempPath, targetPath, err => {
                const storagePath = targetPath
                    .replace(".", `${process.env.BASE_URL}:${process.env.PORT}`)
                    .replace("/public", "")
                repository.editProduct(req.body, storagePath)
                if (err) return res.send(err);

                res.sendStatus(201)
            });
        })
    }

    updateStock(req, res, next) {
        const id = req.params.productId
        const stock = req.body.stock

        if (stock < 0) {
            res.status(400)
            res.send({
                "error": "Invalid stock amount"
            })
        }

        repository.setStock(id, stock)
        res.sendStatus(200)
    }

    updatePrice(req, res, next) {
        const id = req.params.productId
        const price = req.body.price

        if (price < 0) {
            res.status(400)
            res.send({
                "error": "Invalid price amount"
            })
        }

        repository.setPrice(id, price)
        res.sendStatus(200)
    }

    updateWeight(req, res, next) {
        const id = req.params.productId
        const weight = req.body.weight

        if (weight < 0) {
            res.status(400)
            res.send({
                "error": "Invalid weight amount"
            })
        }

        repository.setWeight(id, weight)
        res.sendStatus(200)
    }

    addVariant(req, res, next) {
        const parent_id = req.params.productId
        let upload = multer({ dest: "./public/images/product" }).single('image');

        upload(req, res, function(err) {
            if (req.fileValidationError) {
                return res.send("invalid file");
            } else if (err instanceof multer.MulterError) {
                return res.send(err);
            } else if (err) {
                return res.send(err);
            }

            const tempPath = req.file.path;
            const targetPath = `./public/images/product/${req.file.originalname}`;

            fs.rename(tempPath, targetPath, err => {
                const storagePath = targetPath
                    .replace(".", `${process.env.BASE_URL}:${process.env.PORT}`)
                    .replace("/public", "")
                repository.addVariant(parent_id, req.body, storagePath)
                if (err) return res.send(err);

                res.sendStatus(201)
            });
        })
    }
}

module.exports = new ProductController()