var express = require("express");
var router = express.Router();
const order = require('../mongo/order.contronller')
const checkToken  = require('../helper/token')
router.post('/', async (req, res) => {
  try {
    let body = req.body;
    const newOrder = await order.newOrder(body);
    if(newOrder) {

      res.status(200).json({newOrder, message: "Đã đặt hàng thành công", status: "OK" });
    }else {
      res.status(400).json({ message: "Lỗi "})
    }

  } catch (error) {
    console.log(error);
  }
});

 router.get('/', checkToken, async (req, res) => {
    try {
        let allOrder = await order.getOrderAll()
        return res.status(200).json(allOrder)
    } catch (error) {
        console.log(error);
    }
 })

 router.get('/user/:id', async (req, res) => {
  try {
    let id = req.params.id
    const orderByUser = await order.getOrderByUserId(id)
    if(orderByUser) {
      res.status(200).json(orderByUser)
    }else {
      res.status(404).json({ message: "Ban Chua co don hang nao"})
    }
  } catch (error) {
     log(error)
  }
 })

 router.get('/:id',checkToken, async (req, res) => {
  try {
    let {id} = req.params
    const orderDetail = await order.getOrderDetail(id)
    if(!orderDetail){
      res.status(200).json({message: "Mã đơn hàng không tồn tại"})
    }
res.status(200).json({status: "OK", orderDetail})
  } catch (error) {
    
  }
 })


 

module.exports = router;
