var express = require('express');
var router = express.Router();
const productController = require('../mongo/product.contronler')
var Product = require('../mongo/product.model')
var multer = require('multer');

var token = require('../helper/token');
const checkToken = require('../helper/token');



let storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname)
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
    const { page, limit } = req.query
    const allPro = await productController.getAll(page, limit)
   

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


router.post('/addProduct', checkToken,  upload.single('img'), async (req, res, next) => {
  try {
    const body = req.body;
    body.img = req.file.originalname;

    const result = await productController.insert(body)
    if(!result){
  return res.status(200).json({message: "Lỗi "})
      
    }
  return res.status(200).json({status: "OK" , message: "Thêm Sản Phẩm Thành Công"})

  } catch (error) {
    console.log("Loi" + error.message);
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



router.get('/search/:name', async (req, res) => {
  let name = req.params.name;
  // const pro = await Product.find({ name: { $regex: name, $options: 'i'} })
  const pro = await productController.search(name)
  
  res.status(200).json({allPro: pro})
})

router.delete('/delete/:id', checkToken,  async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productController.remove(id)
    if(!product){
    return res.status(200).json({ message: "Sản Phẩm đang tồn tại trong đơn hàng " })

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
    body.img = req.file ? req.file.originalname : req.body.imgOld
    const productUpdate = await productController.updateById(id, body)
    if(productUpdate) {
      res.status(200).json(productUpdate)

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
    let id = req.params.id;
    const detail = await Product.findById(id)
    
    
 
    res.status(200).json(detail);
  } catch (error) {

  }
})

router.get('/:categoryId', async (req, res) => {
  try {
    let categoryId = req.params.categoryId
    const allPro = await productController.productByCategoryId(categoryId);
    if (allPro) {
      res.status(200).json({ allPro });

    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Có lỗi xảy ra' });
  }

})






module.exports = router;
