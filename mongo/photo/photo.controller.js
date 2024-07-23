const productModel = require('../product.model')
const photoModel = require('./photo.model')

const photoController = {
    newImage  : async (req,res) => {
        try {
            const productFind = await productModel.findById(req.body.productId)
            if(!productFind) {
                throw new Error("Product not found")
            }
            const newImage = photoModel({
                productId: productFind._id,
                nameImage: req.body.nameImage
            })
            const result = await newImage.save()
            return res.status(200).json(result)
        } catch (error) {
            res.status(500)
        }
    }
}

module.exports  = photoController