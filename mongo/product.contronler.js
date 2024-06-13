const productModel = require('./product.model');
const categoryModel = require('./category.model');
orderItemModel = require('../mongo/orderItem/orderItem.model')
module.exports = { insert, getAll, getByKey, updateById, productByCategoryId, getProHot, remove ,search ,price};

async function insert(body) {
    try {
        const { name, material, img, price, view, bestseller, quantity, slug, category } = body;
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
                categoryName: categoryFind.name
            }
        });

        const result = await proNew.save();
        return result;
    } catch (error) {
        console.log('Lỗi khi thêm sản phẩm', error);
        throw error;
    }
}



async function getAll(page, limit) {
    try {
        page = parseInt(page) ? parseInt(page) : 1;
        limit = parseInt(limit) ? parseInt(limit) : 10;
        const skip = (page - 1) * limit;
        const result = await productModel.find().sort('-_id').skip(skip).limit(limit)
        const total = await productModel.countDocuments();
        const numberOfPages = Math.ceil(total / limit);
      
        return { result, countPro: total, countPage: numberOfPages, currentPage: page, limit: limit }
    } catch (error) {
        console.log('Error get all', error);
        throw error;    
    }
}


async function getProHot() {
    try {
        const result = await productModel.find().sort({view: -1}).limit(4)

        return result;
    } catch (error) {
        console.log('Error get all', error);
        throw error;
    }
}

async function getByKey(key, value) {
    try {
        const pro = await productModel.find({ [key]: value })
        return pro
    } catch (error) {
        console.log('Error get all', error);
        throw error;
    }
}

async function updateById(id, body) {
    try {
        const pro = await productModel.findById(id)
        if (!pro) {
            throw new Error("NO")
        }
        const { name, material, img, price, view, bestseller, quantity, slug, category } = body
        let categoryFind = null
        if (category) {

             categoryFind = await categoryModel.findById(category);
            if (!categoryFind) {
                throw new Error("NO category")

            }
        }
        const categoryUpdate = categoryFind ? {
            categoryId: categoryFind._id,
            categoryName: categoryFind.name
        } : pro.category
        const result = await productModel.findByIdAndUpdate(
            id,
            { name, material, img, price, view, bestseller, quantity, slug, category: categoryUpdate },
            { new: true })

        return result

    } catch (error) {
        console.log('Error get all', error);
        throw error;
    }
}

async function productByCategoryId(categoryId) {
    try {
        const pro = await productModel.find({ "category.categoryId": categoryId }).sort('-_id');
        return pro;
    } catch (error) {
        console.log('Error get all', error);
        throw error;
    }
}

async function remove(id) {
    try {
        const product_id = await orderItemModel.findById(id);
        if(product_id.length>0) {
            return 
        }else{
            const result = await productModel.findByIdAndDelete(id)
           return result;

        }
    } catch (error) {

    }
}

async function search(name) {
    try {
        const pro  =  await productModel.find({name: { $regex: name, $options: 'i'} })
        return pro
    } catch (error) {
        
    }
}

async function price(sortOption) {
    try {
        let sortOrder = sortOption === "desc" ? -1 : 1; // Sắp xếp giảm dần nếu sortOption là "desc", ngược lại sắp xếp tăng dần
        const pro = await productModel.find({}).sort({ price: sortOrder }).limit(10);
        return pro;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

