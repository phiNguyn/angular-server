var express = require('express');
var router = express.Router();
const productController = require('../mongo/product.contronler')
var Product = require('../mongo/product.model')
var multer = require('multer');
const checkToken = require('../helper/token');



let storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
  }
});

function checkFileUpload(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('You must provide a file name'))
  }
  cb(null, true)
}

let upload = multer({ storage: storage, fileFilter: checkFileUpload })


router.get('/' , async (req, res, next) => {
  try {
    const { page, limit,sortOrder } = req.query
    const allPro = await productController.getAll(page, limit,sortOrder)

    if (allPro) {
      res.status(200).json(allPro);
      // res.status(200).json(productHot);
    } else {
      res.status(404).json({ message: "Khong ton tai" })
    }
    // res.render('index', { title: 'Trang chủ',  productHot, allCategory });
  } catch (err) {
    console.log(err);
  }

});



router.get('/hot', async (req,res) => {
  try {
    const productHot = await productController.getProHot()
    if(productHot) {
      res.status(200).json( productHot);
    }
  } catch (error) {
    console.log(error);
  }
} )


router.post('/addProduct', upload.single('img'), async (req, res, next) => {
  try {
    const body = req.body;
    body.img = req.file.filename;
    
    const result = await productController.insert(body)
    if(!result){
    res.status(400).json({message: "Lỗi"})
    }
   res.status(200).json({result,status: "OK" , message: "Thêm Sản Phẩm Thành Công"})

  } catch (error) {
    res.status(500).json({message : error.message})
  }
});  

router.get('/price/:sortOption', async (req, res, next) => {
  try {
    let {sortOption} = req.params
    const pro = await productController.price(sortOption)
    res.status(200).json({allPro: pro})
  } catch (error) {
    
  }
})



router.get('/search/', async (req, res) => {
  let name = req.query.name;
  // const pro = await Product.find({ name: { $regex: name, $options: 'i'} })
  const pro = await productController.search(name)
  
  res.status(200).json({allPro: pro})
})

router.delete('/delete/:id', 
  // checkToken,
    async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productController.remove(id)
    if(!product){
    return res.status(200).json({ message: "Sản Phẩm đang tồn tại trong đơn hàng, chỉ có thể ẩn " })

    }

   return res.status(200).json({ message: "Đã Xoá Sản Phẩm", status:"OK" })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error })
  }

})

router.put('/update/:id',upload.single('img') , async (req, res) => {
  try {
    const { id } = req.params;
    let body = req.body;
    body.img = req.file ? req.file.filename : req.body.imgOld
    const productUpdate = await productController.updateById(id, body)
    if(productUpdate) {
      res.status(200).json({message: "Cập nhật sản phẩm thành công"})

    }else {
          res.status(403).json({ message: "Lỗi"})

    }
  } catch (error) {
    res.status(500).json("Lỗi")
  }
})



router.get('/edit/:_id', async (req, res, next) => {
  try {
    let id = req.params
    const productDetail = await Product.findById(id);

    if (productDetail) {

      res.status(200).json(productDetail);
    }
    // res.render('detail', { productDetail, title: productDetail.name + " IPUN" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Có lỗi xảy ra' });
  }
});

router.get('/detail/:id', async (req, res) => {
  try {
      let { id } = req.params;
      const detail = await productController.getProductById(id);
      if (!detail) {
          return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json(detail);
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
});


router.get('/:slug', async (req, res) => {
  try {
    let slug = req.params.slug;
    const detail = await productController.getProductSlug(slug)
    res.status(200).json(detail);
  } catch (error) {
  }
})

router.get('/cate/:categoryId', async (req, res) => {
  let {categoryId} = req.params
  const { page, limit,sortOrder } = req.query
  try {
    const allPro = await productController.productByCategoryId(categoryId,page, limit,sortOrder);
    if (allPro) {
      res.status(200).json( allPro );
    }else{
      res.status(404).json({message:"Rong"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Có lỗi xảy ra' });
  }

})






module.exports = router;
