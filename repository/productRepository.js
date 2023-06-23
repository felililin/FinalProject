var connection = require('./connection')

class ProductRepository {
    getProducts(valueCallback) {
        connection.query(`select products.id, products.category_id, products.name, products.image_url, products.price, products.description, products.weight, products.stock, categories.name as category_name,
        v.id as child_id, v.name as child_name, v.price as child_price, v.image_url as child_image_url, v.description as child_description, v.weight as child_weight, v.stock as child_stock
            from products 
            JOIN categories on products.category_id = categories.id
            LEFT JOIN products v on v.parent_id = products.id
            where products.parent_id is null`, (err, rows, fields) => {
            if (err != null) {
                valueCallback([])
                console.log(err)
            } else {
                const result = this.processProductData(rows)
                console.log(result)
                valueCallback(result)
            }
        })
    }

    getProductsWithCategory(categoryId, valueCallback) {
        connection.query(`select products.id, products.category_id, products.name, products.image_url, products.price, products.description, products.weight, products.stock, categories.name as category_name,
        v.id as child_id, v.name as child_name, v.price as child_price, v.image_url as child_image_url, v.description as child_description, v.weight as child_weight, v.stock as child_stock
            from products 
            JOIN categories on products.category_id = categories.id
            LEFT JOIN products v on v.parent_id = products.id
            where products.parent_id is null and products.category_id = ?`, [categoryId], (err, rows, fields) => {
            if (err != null) {
                valueCallback([])
            } else {
                const result = this.processProductData(rows)
                valueCallback(result)
            }
        })
    }

    getProductDetail(productId, valueCallback) {
        connection.query(`select products.id, products.category_id, products.name, products.image_url, products.price, products.description, products.weight, products.stock, categories.name as category_name,
        v.id as child_id, v.name as child_name, v.price as child_price, v.image_url as child_image_url, v.description as child_description, v.weight as child_weight, v.stock as child_stock
            from products 
            JOIN categories on products.category_id = categories.id
            LEFT JOIN products v on v.parent_id = products.id
            where products.parent_id is null AND products.id = ?`, [productId], (err, rows, fields) => {
            if (err != null) {
                valueCallback([])
                console.log(err)
            } else {
                const result = this.processProductData(rows)
                console.log(result)
                valueCallback(result)
            }
        })
    }

    processProductData(rows) {
        let result = []
        let lastRow = null
        for (const index in rows) {
            const row = rows[index]
            if (!!lastRow && row.id === lastRow.id) {
                lastRow.children.push({
                    id: row.child_id,
                    name: row.child_name,
                    image_url: row.child_image_url,
                    price: row.child_price,
                    description: row.child_description,
                    weight: row.child_weight,
                    stock: row.child_stock,
                })
            } else {
                if (!!lastRow) {
                    result.push(lastRow)
                }

                let product = {
                    id: row.id,
                    category_id: row.category_id,
                    name: row.name,
                    image_url: row.image_url,
                    price: row.price,
                    description: row.description,
                    weight: row.weight,
                    stock: row.stock,
                    category_name: row.category_name,
                    children: []
                }

                if (!!row.child_id) {
                    let child = {
                        id: row.child_id,
                        name: row.child_name,
                        image_url: row.child_image_url,
                        price: row.child_price,
                        description: row.child_description,
                        weight: row.child_weight,
                        stock: row.child_stock,
                    }
                    product.children.push(child)
                }
                lastRow = product
            }
        }
        if (!!lastRow) {
            result.push(lastRow)
        }

        return result
    }

    deleteProduct(id) {
        const query = `delete from products where id = ?`
        connection.query(query, [id])
    }

    createProduct(data, imageUrl) {
        const query = `insert into products values(NULL, ?, ?, ?, ?, ?, ?, ?, NULL)`
        connection.query(query, [data.name, imageUrl, data.price, data.description, data.category_id, data.weight, data.stock])
    }

    editProduct(data, imageUrl) {
        const query = `update products SET name = ?, image_url = ?, price = ?, description = ?, category_id = ?, weight = ?, stock = ? where id = ?`
        connection.query(query, [data.name, imageUrl, data.price, data.description, data.category_id, data.weight, data.stock, data.id])
    }

    setStock(id, stock) {
        const query = `update products SET stock = ? where id = ?`
        console.log(query)
        connection.query(query, [stock, id])
    }

    setPrice(id, price) {
        const query = `update products set price = ? where id = ?`
        connection.query(query, [price, id])
    }

    setWeight(id, weight) {
        const query = `update products set weight = ? where id = ?`
        connection.query(query, [weight, id])
    }

    addVariant(parent_id, data, imageUrl) {
        const query = `insert into products values(NULL, ?, ?, ?, ?, ?, ?, ?, ?)`
        connection.query(query, [data.name, imageUrl, data.price, data.description, data.category_id, data.weight, data.stock, parseInt(parent_id, 10)])
    }

    getStockForProduct(productId, valueCallback) {
        const query = `select stock from products where id = ?`
        connection.query(query, [productId], (err, rows, field) => {
            if (err != null) {
                console.log(err)
                valueCallback(0)
            } else {
                if (rows.length == 0) {
                    valueCallback(0)
                } else {
                    valueCallback(rows[0] && rows[0].stock || 0)
                }
            }
        })
    }

    getStockForProducts(productIds, valueCallback) {
        const flattenedProductIds = productIds.join(", ")
        const query = `select id, stock from products where id in (${flattenedProductIds})`
        connection.query(query, (err, rows, field) => {
            if (err != null) {
                valueCallback([])
            } else {
                valueCallback(rows)
            }
        })
    }

    reduceStockForProducts(cartItems) {
        cartItems.forEach((item) => {
            const query = `update products set stock = stock - ? where id = ?`
            connection.query(query, [item.qty, item.id])
        })
    }
}

module.exports = new ProductRepository()