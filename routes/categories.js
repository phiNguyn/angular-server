var express = require("express");
var router = express.Router();
var multer = require("multer");
var categories = require("../mongo/category.contronler");
var categoryModel = require("../mongo/category.model");
const checkToken = require("../helper/token");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

function checkFileUpload(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You must provide a file name"));
  }
  cb(null, true);
}

let upload = multer({ storage: storage, fileFilter: checkFileUpload });

router.get("/", async (req, res) => {
  try {
    const category = await categoryModel.find({}).sort({ stt: 1 });

    res.status(200).json(category);
  } catch (error) {}
});
// hiển thị danh mục nếu có home = 1
router.get("/home", async (req, res) => {
  try {
    const category = await categories.getCate();
    res.status(200).json(category);
  } catch (error) {}
});

router.get("/:_id", async (req, res) => {
  try {
    let id = req.params;
    const category = await categories.getCateId(id);
    return res.status(200).json(category);
  } catch (error) {
    console.log(error);
    
  }
});

router.post("/", upload.single("img"), async (req, res) => {
  try {
    let body = req.body;
    body.img = req.file.originalname;
    const category = await categories.insert(body);
    if (category) {
      res.status(200).json({category,  message: "Thành công" });
    } else {
      res.status(400).json({ message: "Lỗi" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categories.delCategory(id);
    if (!category) {
    return   res.status(400).json({ message: "Danh Mục Có Sản Phẩm, Không Thể Xóa" });
    }
    return  res.status(200).json({category, message: "Danh mục đã được xóa", status:"OK" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  } 
}); 
        
router.put("/:_id", upload.single("img"), async (req, res, next) => {
  try {
    let id = req.params._id;
    let body = req.body;
    body.img = req.file ? req.file.filename : req.body.imgOld;
    const result = await categories.updateCategoryById(id, body);
    if (result) {
      res
        .status(200)
        .json({result, message: "Cập nhật thành công", status: "OK" });
    } else {
      res.status(404).json({ error: "Error updating category" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
