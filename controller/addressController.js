const repository = require('../repository/addressRepository')

class AddressController {
    getUserAddress(req, res, next) {
        repository.getUserAddress(res.locals.user.id, (values) => {
            res.send(values)
        })
    }

    addUserAddress(req, res, next) {
        repository.addUserAddress(res.locals.user.id, req.body, () => {
            res.sendStatus(201)
        })
    }

    updateUserAddress(req, res, next) {
        repository.updateUserAddress(req.body.id, req.body)
        res.sendStatus(200)
    }

    deleteUserAddress(req, res, next) {
        repository.deleteUserAddress(req.body.id)
        res.sendStatus(200)
    }
}

module.exports = new AddressController()
