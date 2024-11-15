var express = require("express");
var router = express.Router();
const order = require("../mongo/order.contronller");
const checkToken = require("../helper/token");
const dotenv = require("dotenv");
var crypto = require("crypto");
const { default: axios } = require("axios");
const { error } = require("console");
dotenv.config();
router.post("/", async (req, res) => {
  try {
    let body = req.body;
    const newOrder = await order.newOrder(body);
    if (newOrder) {
      res
        .status(200)
        .json({ newOrder, message: "Đã đặt hàng thành công", status: "OK" });
    } else {
      res.status(400).json({ message: "Lỗi " });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/", checkToken, async (req, res) => {
  try {
    let allOrder = await order.getOrderAll();
    return res.status(200).json(allOrder);
  } catch (error) {
    console.log(error);
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const orderByUser = await order.getOrderByUserId(id);
    if (orderByUser) {
      res.status(200).json(orderByUser);
    } else {
      res.status(404).json({ message: "Ban Chua co don hang nao" });
    }
  } catch (error) {
    log(error);
  }
});

router.get("/:id", checkToken, async (req, res) => {
  try {
    let { id } = req.params;
    const orderDetail = await order.getOrderDetail(id);
    if (!orderDetail) {
      res.status(200).json({ message: "Mã đơn hàng không tồn tại" });
    }
    res.status(200).json({ status: "OK", orderDetail });
  } catch (error) {}
});

router.post("transaction-status", async (req, res) => {
  try {
    const { id } = req.body;
    const rawSignature = `accesskey=${process.env.MOMO_ACCESSKEY}&orderId=${process.env.MOMO_SECRETKEY}&partnerCode=MOMO&requestId=${id}`;
    const signature = crypto
      .createHmac("sha256", process.env.MOMO_SECRETKEY)
      .update(rawSignature)
      .digest("hex");
    const requestBody = JSON.stringify({
      partner: "MOMO",
      requestId: id,
      signature: signature,
      lang: "vi",
    });

    const resp = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/query",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (resp.data) {
      const orders = await axios.put(
        `https://cake-ipun.vercel.app/orders/${id}`,
        {
          data: {
            order_status: resp.data.resultCode,
          },
        }
      );
      console.log(orders);
    }
    return res.status(200).json(resp.data);
  } catch (error) {
    console.log(error);
  }
});

router.post("callback", async (req, res) => {
  try {
    console.log("callback::: ");
    console.log(req.body);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
