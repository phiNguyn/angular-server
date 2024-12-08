const productModel = require("./product.model");
const categoryModel = require("./category.model");
const photoModel = require("./photo/photo.model");
const orderItemModel = require("../mongo/orderItem/orderItem.model");
module.exports = {
  insert,
  getAll,
  getProductById,
  getProductSlug,
  getByKey,
  updateById,
  productByCategoryId,
  getProHot,
  remove,
  search,
  price,
};

async function insert(body) {
  try {
    const {
      name,
      material,
      img,
      price,
      view,
      bestseller,
      quantity,
      slug,
      category,
    } = body;
    const categoryFind = await categoryModel.findById(category);
    if (!categoryFind) {
      throw new Error("Không tìm thấy danh mục");
    }

    const proNew = new productModel({
      name,
      material,
      img,
      price,
      view,
      bestseller,
      quantity,
      slug,
      category: {
        categoryId: categoryFind._id,
        categoryName: categoryFind.name,
      },
    });

    const result = await proNew.save();
    return result;
  } catch (error) {
    console.log("Lỗi khi thêm sản phẩm", error);
    throw error;
  }
}

async function getAll(page, limit, sortOrder, categoryId, q) {
  try {
    page = parseInt(page) ? parseInt(page) : 1;
    limit = parseInt(limit) ? parseInt(limit) : 10;
    const skip = (page - 1) * limit;

    // Setup sort order
    const sort =
      sortOrder === "asc"
        ? { price: 1 }
        : sortOrder === "desc"
        ? { price: -1 }
        : { _id: -1 };

    // Setup filter query
    const query = {};
    if (categoryId) {
      query["category.categoryId"] = categoryId;
    }
    if (q) {
      query["name"] = { $regex: q, $options: "i" }; // Search by name (case-insensitive)
    }

    // Fetch products with pagination and filters
    const [result, total] = await Promise.all([
      productModel.find(query).sort(sort).skip(skip).limit(limit), // Select necessary fields
      productModel.countDocuments(query),
    ]);

    const numberOfPages = Math.ceil(total / limit);

    return {
      result,
      pagination: {
        countPro: total,
        countPage: numberOfPages,
        currentPage: page,
        limit: limit,
      },
    };
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function getProductById(id) {
  try {
    const result = await productModel.findById(id);
    const photos = await photoModel.find({ productId: id });
    if (!result) {
      throw new Error("Product not found");
    } else {
      return { result, photos };
    }
  } catch (error) {
    throw error;
  }
}

async function getProductSlug(slug) {
  try {
    const result = await productModel.findOne({ slug: slug });
    const photos = await photoModel.find({ productId: result._id });
    const relatedProducts = await productModel.find({
      "category.categoryId": result.category.categoryId,
      $and: [
        {
          _id: { $ne: result._id },
        },
      ],
    });
    // const productsNotEqualId = await productModel.find({_id: {$ne: relatedProducts._id}})
    if (!result) {
      throw new Error("Product not found");
    } else {
      return { result, photos, relatedProducts };
    }
  } catch (error) {
    throw error;
  }
}

async function getProHot() {
  try {
    const result = await productModel.find().sort({ view: -1 }).limit(4);

    return result;
  } catch (error) {
    console.log("Error get all", error);
    throw error;
  }
}

async function getByKey(key, value) {
  try {
    const pro = await productModel.find({ [key]: value });
    return pro;
  } catch (error) {
    console.log("Error get all", error);
    throw error;
  }
}

async function updateById(id, body) {
  try {
    const pro = await productModel.findById(id);
    if (!pro) {
      throw new Error("NO");
    }
    const {
      name,
      material,
      img,
      price,
      view,
      bestseller,
      quantity,
      slug,
      category,
    } = body;
    let categoryFind = null;
    if (category) {
      categoryFind = await categoryModel.findById(category);
      if (!categoryFind) {
        throw new Error("NO category");
      }
    }
    const categoryUpdate = categoryFind
      ? {
          categoryId: categoryFind._id,
          categoryName: categoryFind.name,
        }
      : pro.category;
    const result = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        material,
        img,
        price,
        view,
        bestseller,
        quantity,
        slug,
        category: categoryUpdate,
      },
      { new: true }
    );

    return result;
  } catch (error) {
    console.log("Error get all", error);
    throw error;
  }
}

async function productByCategoryId(categoryId, page, limit, sortOrder) {
  try {
    page = parseInt(page) ? parseInt(page) : 1;
    limit = parseInt(limit) ? parseInt(limit) : 10;
    const skip = (page - 1) * limit;

    let sort = { _id: -1 }; // Default sort order

    if (sortOrder === "asc") {
      sort = { price: 1 }; // Sort by price ascending
    } else if (sortOrder === "desc") {
      sort = { price: -1 }; // Sort by price descending
    }

    const pro = await productModel
      .find({ "category.categoryId": categoryId })
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const category = await categoryModel.findById(categoryId);
    const total = await productModel
      .find({ "category.categoryId": categoryId })
      .countDocuments();
    const numberOfPages = Math.ceil(total / limit);
    if (!pro || !category) {
      throw new Error();
    } else {
      return {
        pro,
        category,
        panigation: {
          countPro: total,
          countPage: numberOfPages,
          currentPage: page,
          limit: limit,
        },
      };
    }
  } catch (error) {
    console.log("Error get all", error);
    throw error;
  }
}

async function remove(id) {
  try {
    const product = await orderItemModel.find({ product_id: id });
    if (product.length > 0) {
      return;
    } else {
      const result = await productModel.findByIdAndDelete(id);
      return result;
    }
  } catch (error) {
    console.log(error);
  }
}

async function search(name) {
  try {
    const pro = await productModel.find({
      name: { $regex: name, $options: "i" },
    });
    return pro;
  } catch (error) {}
}

async function price(sortOption) {
  try {
    let sortOrder = sortOption === "desc" ? -1 : 1; // Sắp xếp giảm dần nếu sortOption là "desc", ngược lại sắp xếp tăng dần
    const pro = await productModel
      .find({})
      .sort({ price: sortOrder })
      .limit(10);
    return pro;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
