var userModel = require("./user.model");
const orderModel = require("./order.model");
const orderItemModel = require("./orderItem/orderItem.model");
const productModel = require("./product.model");
module.exports = { newOrder, getOrderAll, getOrderByUserId, getOrderDetail };

async function newOrder(req, res) {
  try {
    console.log(req.body);
    const {
      body: {
        name,
        email,
        phone,
        user_id,
        total_amount,
        address,
        type_payment,
        order_status,
        order_date,
      },
      products,
    } = req.body;
    const userFind = await userModel.findById(user_id);
    if (!userFind) {
      throw new Error("Không tìm thấy Mã User");
    }
    const newOrder = orderModel({
      user_id: userFind._id,
      total_amount,
      address,
      type_payment,
      order_status,
      order_date,
      name,
      email,
      phone,
    });

    const result = await newOrder.save();

    if (!Array.isArray(products) || products.length === 0) {
      console.log(products);
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
        order_id: result._id,
        product_id: productIdFind._id,
        quantity: product.quantity,
        unit_price: product.unit_price,
        total_price: product.total_price,
      });

      orderItems.push(newOrderItem);
    }

    // Lưu toàn bộ các `orderItem` vào database
    await orderItemModel.insertMany(orderItems);
    return res.status(200).json( result );
  } catch (error) {
    console.log(error);
  }
}
async function getOrderAll() {
  try {
    const order = await orderModel.find().sort("-_id");
    return order;
  } catch (error) {
    console.log(error);
  }
}

async function getOrderByUserId(id) {
  try {
    let userId = await userModel.findById(id);
    if (!userId) {
      throw new Error("User not found");
    }
    const order = await orderModel.find({ user_id: userId }).sort("-_id");
    return order;
  } catch (error) {
    console.log(error);
  }
}

async function getOrderDetail(id) {
  try {
    const orderItem = await orderItemModel.find({ order_id: id });
    const order = await orderModel.findById(id);
    if (!order && !orderItem) {
      return;
    }
    return { orderItem, order };
  } catch (error) {}
}
