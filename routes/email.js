var express = require('express');
const emailController = require('../mongo/email.controller');
var router = express.Router();

router.post('/',emailController.postEmail)
module.exports = router;
