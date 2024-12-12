var express = require('express');
const orderItemController = require('../mongo/orderItem/orderItem.controller');
var router = express.Router();
router.post('/', orderItemController.newOrderItems)
router.get('/:_id', orderItemController.getItemByOrderId)
module.exports = router