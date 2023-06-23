const orderRepository = require("../repository/orderRepository")

class OrderController {
    getUserOrders(req, res, next) {
        orderRepository.getOrdersForUser(res.locals.user.id, orders => {
            res.send(orders)
        })
    }
}

module.exports = new OrderController()