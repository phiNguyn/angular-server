const productModel = require("../product.model");
const orderModel = require("../order.model");
const orderItemModel = require("./orderItem.model");
const orderItemController = {
  newOrderItems: async (req, res) => {
    try {
      const { order_id, products } = req.body; // `products` là một mảng các sản phẩm
      const orderIdFind = await orderModel.findById(order_id);

      if (!orderIdFind) {
        throw new Error("Thiếu ID của order");
      }

      if (!Array.isArray(products) || products.length === 0) {
        throw new Error("Danh sách sản phẩm không hợp lệ");
      }

      // Duyệt qua danh sách sản phẩm để kiểm tra và tạo các `orderItem`
      const orderItems = [];
      for (const product of products) {
        const productIdFind = await productModel.findById(product.product_id);
        if (!productIdFind) {
          throw new Error(
            `Không tìm thấy sản phẩm với ID: ${product.product_id}`
          );
        }

        const newOrderItem = new orderItemModel({
          order_id: orderIdFind._id,
          product_id: productIdFind._id,
          quantity: product.quantity,
          unit_price: product.unit_price,
          total_price: product.total_price,
        });

        orderItems.push(newOrderItem);
      }

      // Lưu toàn bộ các `orderItem` vào database
      const results = await orderItemModel.insertMany(orderItems);

      return res
        .status(200)
        .json({ results, message: "Tạo nhiều sản phẩm thành công" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  getItemByOrderId: async (req, res) => {
    try {
      const orderId = req.params._id;
      const item = await orderItemModel.find({ order_id: orderId });
      return res.status(200).json({ item, message: "Yeah" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = orderItemController;
