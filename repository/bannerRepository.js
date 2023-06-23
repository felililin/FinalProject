var connection = require('./connection')

class BannerRepository {
    getBanners(valueCallback) {
        connection.query("Select id, image_url, redirect_url from banners", (err, rows, fields) => {
            if (err != null) {
                console.log(err)
                valueCallback([])
            } else {
                valueCallback(rows)
            }
        })
    }

    storeBanner(banner, filePath) {
        const query = `insert into banners values(NULL, ?, ?)`
        connection.query(query, [filePath, banner.redirectUrl])
    }

    deleteBanner(id) {
        const query = `delete from banners where id = ?`
        connection.query(query, [id])
    }

    editBanner(banner, filePath) {
        const query = `update banners set image_url = ?, redirect_url = ? where id = ?`
        connection.query(query, [filePath, banner.redirectUrl, banner.id])
    }
}

module.exports = new BannerRepository()
