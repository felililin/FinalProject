const repository = require('../repository/categoryRepository')

class BannerController {
    getCategories(req, res, next) {
        repository.getCategories((data) => {
            res.send(data)
        })
    }

    createCategory(req, res, next) {
        repository.storeCategory(req.body.name)
        res.sendStatus(201)
    }

    deleteCategory(req, res, next) {
        const id = req.body.id
        repository.deleteCategory(id)
        res.sendStatus(204)
    }

    editCategory(req, res, next) {
        const id = req.body.id
        const name = req.body.name
        repository.editCategory(id, name)
        res.sendStatus(204)
    }
}

module.exports = new BannerController()