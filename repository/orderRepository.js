const connection = require('./connection')

class OrderRepository {
    createOrder(userId, addressId, total, note, isPickUp, callback) {
        const query = `insert into orders values(NULL, ?, ?, ?, CURRENT_TIMESTAMP, 'waiting payment', ?, ?)`
        connection.query(query, [userId, addressId, total, note, isPickUp], (err, result, fields) => {
            console.log(err)
            callback(result.insertId)
        })
    }

    createOrderLine(orderId, productId, qty) {
        const query = `insert into order_items values(NULL, ?, ?, ?)`
        connection.query(query, [orderId, productId, qty])
    }

    getLastOrderIdForUser(userId, valueCallback) {
        const query = `SELECT id from orders where user_id = ? order by created desc limit 1`
        connection.query(query, [userId], (err, rows, fields) => {
            if (err != null) {
                valueCallback(null)
            } else {
                const orderId = rows[0] && rows[0].id
                valueCallback(orderId)
            }
        })
    }

    getOrdersForUser(userId, valueCallback) {
        const query = `select o.id, o.total, o.created, o.status, o.note, o.is_pick_up, a.id as address_id, a.alias, a.phone_number, a.address_line, a.postal_code, 
            p.id as product_id, p.name, parent.name as parent_name, p.image_url, p.price, p.description, i.qty, p.price * i.qty as 'item_total' from orders o 
        left join addresses a on o.address_id = a.id 
        join order_items i on o.id = i.order_id
        join products p on i.product_id = p.id
        left join products parent on p.parent_id = parent.id
        where o.user_id = ?
        order by o.created desc`
        connection.query(query, [userId], (err, rows, fields) => {
            if (err != null) {
                valueCallback([])
            } else {
                let result = []
                let lastRow = null

                for (const index in rows) {
                    const row = rows[index]
                    if (!!lastRow && row.id === lastRow.id) {
                        lastRow.items.push({
                            id: row.product_id,
                            name: row.name,
                            parent_name: row.parent_name,
                            image_url: row.image_url,
                            price: row.price,
                            description: row.description,
                            total: row.item_total,
                            qty: row.qty
                        })
                    } else {
                        if (!!lastRow) {
                            result.push(lastRow)
                        }

                        let item = {
                            id: row.product_id,
                            name: row.name,
                            parent_name: row.parent_name,
                            image_url: row.image_url,
                            price: row.price,
                            description: row.description,
                            total: row.item_total,
                            qty: row.qty
                        }

                        const order = {
                            items: [item],
                            id: row.id,
                            total: row.total,
                            created: row.created,
                            status: row.status,
                            note: row.note,
                            isPickUp: !!row.is_pick_up,
                            address: {
                                id: row.address_id,
                                alias: row.alias,
                                phone_number: row.phone_number,
                                address_line: row.address_line,
                                postal_code: row.postal_code
                            }
                        }
                        lastRow = order
                    }
                }

                if (!!lastRow) {
                    result.push(lastRow)
                }

                valueCallback(result)
            }
        })
    }
}

module.exports = new OrderRepository()
