const repository = require('../repository/userRepository')

class UserMiddleware {
    validateUser(req, res, next) {
        if (!req.headers["authorization"]) {
            res.sendStatus(401)
            return
        }

        const authHeader = req.headers["authorization"].split(" ")[1]
        if (!authHeader) { 
            res.sendStatus(401)
            return
         }

        const decodedHeaders = atob(authHeader).split(":")
        if (process.env.SECRET === decodedHeaders[0] && !!decodedHeaders[1]) {
            repository.getUserById(decodedHeaders[1], (user) => {
                if (!!user) {
                    res.locals.user = user
                    next()
                } else {
                    res.sendStatus(401)
                }
                return
            })
        } else {
            res.sendStatus(401)
        }
    }

    validateStaff(req, res, next) {
        if (!!res.locals.user && res.locals.user.is_staff) {
            next()
        } else {
            res.sendStatus(403)
        }
    }
}

module.exports = new UserMiddleware()
