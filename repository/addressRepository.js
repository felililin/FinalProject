var connection = require('./connection')

class AddressRepository {
    getUserAddress(userId, valueCallback) {
        const query = `select * from addresses where user_id = ?`
        connection.query(query, [userId], (err, rows, fields) => {
            if (err != null) {
                console.log(err)
                valueCallback([])
            } else {
                valueCallback(rows)
            }
        })
    }

    addUserAddress(userId, data, callback) {
        console.log(userId)
        const deleteQuery = `delete from addresses where user_id = ?`
        connection.query(deleteQuery, [userId])

        const query = `insert into addresses values(NULL, ?, ?, ?, ?, ?)`
        connection.query(query, [userId, data.alias, data.phone_number, data.address_line, data.postal_code], (err, result, fields) => {
            if (!err) {
                console.log(result.insertId)
                callback(result.insertId)
            } else {
                console.log(err)
                callback(null)
            }
        })
    }

    updateUserAddress(id, data) {
        const query = `update addresses set alias = ?, phone_number = ?, address_line = ?, postal_code = ? where id = ?`
        connection.query(query, [data.alias, data.phone_number, data.address_line, data.postal_code, id])
    }

    deleteUserAddress(id) {
        const query = `delete from addresses where id = ?`
        connection.query(query, [id])
    }
}

module.exports = new AddressRepository()