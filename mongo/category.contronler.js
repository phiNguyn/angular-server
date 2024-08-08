const categoryModel = require('./category.model');
const productModel = require('./product.model');

module.exports = { insert, getCate, delCategory, getCateId ,updateCategoryById};

async function insert(body) {
    try {
        const { name, img, home, stt, content, mota } = body;
        const cateNew = new categoryModel({
            name, img, home, stt, content, mota
        });

        const result = await cateNew.save();
        return result;
    } catch (error) {
        console.log('Lỗi khi thêm sản phẩm', error);
        throw error;
    }
}

async function getCate() {
    try {
        const result = await categoryModel.find({home:true}).sort({stt:1}).limit(3)
        return result;
    } catch (error) {
        console.log('Error get all', error);
        throw error;
    }
}

async function getCateId(id) {
    try {
        const result = await categoryModel.findById(id)
        return result;
    } catch (error) {
        console.log('Error get all', error);
        throw error;
    }
}
async function delCategory(id) {
    try {
        // Tìm sản phẩm theo categoryId
        const products = await productModel.find({ "category.categoryId": id });

        // Kiểm tra nếu có sản phẩm thuộc danh mục này
        if (products.length > 0) {
           return
        }else{

            // Xóa danh mục nếu không có sản phẩm nào thuộc danh mục này
            const result = await categoryModel.findByIdAndDelete(id);
            return result
        }
        
        

    } catch (error) {
        console.log('Lỗi khi xóa danh mục', error);
        throw error;
    }
}


async function updateCategoryById(id, body) {
    try {
        const { name, img, home, stt, mota, content} = body;
        const result = await categoryModel.findByIdAndUpdate(id, { name, img, home, stt, mota, content }, { new: true });
        return result;
    } catch (error) {
        console.error("Error updating user: ", error);
        throw error;
    }
}