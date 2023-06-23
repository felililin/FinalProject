const repository = require('../repository/bannerRepository')
const multer = require('multer')
const fs = require("fs")

class BannerController {
    getBanners(req, res, next) {
        repository.getBanners((data) => {
            res.send(data)
        })
    }

    createBanner(req, res, next) {
        let upload = multer({ dest: "./public/images" }).single('image');

        upload(req, res, function(err) {
            if (req.fileValidationError) {
                return res.send("invalid file");
            } else if (err instanceof multer.MulterError) {
                return res.send(err);
            } else if (err) {
                return res.send(err);
            }

            const tempPath = req.file.path;
            const targetPath = `./public/images/${req.file.originalname}`;

            fs.rename(tempPath, targetPath, err => {
                const storagePath = targetPath
                    .replace(".", `${process.env.BASE_URL}:${process.env.PORT}`)
                    .replace("/public", "")
                repository.storeBanner(req.body, storagePath)
                if (err) return res.send(err);

                res.sendStatus(201)
            });
        });
    }

    deleteBanner(req, res, next) {
        const id = req.body.id
        repository.deleteBanner(id)
        res.sendStatus(204)
    }

    editBanner(req, res, next) {
        let upload = multer({ dest: "./public/images" }).single('image');

        upload(req, res, function(err) {
            if (req.fileValidationError) {
                return res.send("invalid file");
            } else if (err instanceof multer.MulterError) {
                return res.send(err);
            } else if (err) {
                return res.send(err);
            }

            const tempPath = req.file.path;
            const targetPath = `./public/images/${req.file.originalname}`;

            fs.rename(tempPath, targetPath, err => {
                const storagePath = targetPath
                    .replace(".", `${process.env.BASE_URL}:${process.env.PORT}`)
                    .replace("/public", "")
                repository.editBanner(req.body, storagePath)
                if (err) return res.send(err);

                res.sendStatus(204)
            });
        });
    }
}

module.exports = new BannerController()