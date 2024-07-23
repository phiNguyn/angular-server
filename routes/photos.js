var express = require('express');
const photoController = require('../mongo/photo/photo.controller');
var router = express.Router();
router.post('/', photoController.newImage)
module.exports = router;