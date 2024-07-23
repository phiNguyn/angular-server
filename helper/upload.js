var multer = require('multer');

const uploadFileController = {
    checkFile :  () => {
        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/images')
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname)
            }
        });
        
        function checkFileUpload(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('You must provide a file name'))
            }
            cb(null, true)
        }
        
        let upload = multer({ storage: storage, fileFilter: checkFileUpload })
    }
}

module.exports = uploadFileController