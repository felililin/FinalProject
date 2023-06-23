var connection = require('./connection')

class CartRepository {
    addToCart(userId, productId) {
        const query = `insert into cart_items values(NULL, ?, ?, 1)`
        connection.query(query, [userId, productId])
    }

    incrementProductInCart(userId, productId) {
        const query = `update cart_items set qty = qty + 1 where user_id = ? and product_id = ?`
        connection.query(query, [userId, productId])
    }

    getUserCart(userId, valueCallback) {
        const query = `select p.id, p.name, parent.name as parent_name, p.image_url, p.price, p.description, c.qty, p.price * c.qty as 'total' from cart_items c 
        join products p on c.product_id = p.id
        left join products parent on p.parent_id = parent.id
        where c.user_id = ?`

        connection.query(query, [userId], (err, rows, fields) => {
            if (err != null) {
                console.log(err)
                valueCallback([])
            } else {
                valueCallback(rows)
            }
        })
    }

    getProductCountInCart(userId, productId, valueCallback) {
        const query = `select qty from cart_items where user_id = ? and product_id = ?`
        connection.query(query, [userId, productId], (err, rows, field) => {
            if (err != null) {
                console.log(err)
                valueCallback(0)
            } else {
                if(rows.length == 0) {
                    valueCallback(0)
                } else {
                    valueCallback(rows[0] && rows[0].qty || 0)
                }
            }
        })
    }

    decreateProductInCart(userId, productId) {
        const query = `update cart_items set qty = qty - 1 where user_id = ? and product_id = ?`
        connection.query(query, [userId, productId])
    }

    removeProductFromCart(userId, productId) {
        const query = `delete from cart_items where user_id = ? and product_id = ?`
        connection.query(query, [userId, productId])
    }

    clearUserCart(userId) {
        const query = `delete from cart_items where user_id = ?`
        connection.query(query, [userId])
    }
}

module.exports = new CartRepository()
