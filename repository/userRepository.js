var connection = require('./connection')

class UserRepository {
    registerUser(data, password, callback) {
        const query = `INSERT INTO users VALUES(NULL, ?, ?, ?, false, ?)`
        connection.query(query, [data.email, data.first_name, data.last_name, "" + password], (err, rows, fields) => {
            console.log(err)
            callback()
        })
    }

    getUserFromEmail(email, valueCallback) {
        const query = `SELECT * FROM users WHERE email = ?`
        connection.query(query, [email], (err, rows, fields) => {
            if (rows.length > 0) {
                valueCallback(rows[0])
            } else {
                valueCallback(null)
            }
        })
    }

    getUserById(id, valueCallback) {
        const query = `Select id, email, first_name, last_name, is_staff from users where id = ?`
        connection.query(query, [id], (err, rows, fields) => {
            if (rows.length > 0) {
                valueCallback(rows[0])
            } else {
                valueCallback(null)
            }
        })
    }

    changeUserProfile(id, password, firstName, lastName) {
        const query = `UPDATE users SET password = ?, first_name = ?, last_name = ? WHERE id = ?`
        connection.query(query, ["" + password, firstName, lastName, id])
    }
}

module.exports = new UserRepository()