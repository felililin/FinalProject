var connection = require('./connection')

class CategoryRepository {
    getCategories(valueCallback) {
        connection.query("Select id, name from categories", (err, rows, fields) => {
            if (err != null) {
                valueCallback([])
            } else {
                valueCallback(rows)
            }
        })
    }

    storeCategory(categoryName) {
        const query = `insert into categories values(NULL, ?)`
        connection.query(query, [categoryName])
    }

    deleteCategory(id) {
        const query = `delete from categories where id = ?`
        connection.query(query, [id])
    }

    editCategory(id, name) {
        const query = `update categories set name = ? where id = ?`
        connection.query(query, [name, id])
    }
}

module.exports = new CategoryRepository()
