var express = require('express');
var router = express.Router();
const userController = require('../mongo/user.controller')
var checkToken = require('../helper/token')
/* GET users listing. */
router.get('/', checkToken, async (req, res, next) => {
  try {
    const user = await userController.getUser()
    if (user) {
      res.status(200).json(user)
    }
  } catch (error) {

  }

  // res.send('respond with a resource');
});

router.get('/:_id', checkToken, async (req, res, next) => {
  try {
    let id = req.params
    const userId = await userController.getUserById(id)
    if (userId) {
      res.status(200).json(userId)
    }

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Có lỗi xảy ra' });
  }

})

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userController.remove(id)
    return res.status(200).json({ user })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error })
  }

})

router.post('/create', async (req, res) => {
  try {
    let body = req.body
    const pro = await userController.addUser(body)
    if (pro) {
      return res.status(200).json(pro)

    } else {
      res.status(409).json({ message: 'Email đã tồn tại' })
    }
  } catch (error) {

  }
})

router.post('/', async (req, res, next) => {
  try {
    const body = req.body
    const result = await userController.signIn(body)
    if (result) {
      res.status(200).json({ newUser: result, message: "Đã tạo tài khoản thành công",status: "OK" })
    }
    else {
      res.json({ message: "Email đã tồn tại" })
    }
  } catch (error) {
    res.status(500).json({ error: error })
    console.log("Lỗi" + error.message);
  }

})


router.post("/forgot", async(req, res) => {
  try {
    let {email} = req.body
    let acc = await userController.forgot(email)
    if(acc) {
      return res.status(200).json({status:"OK", message:"Đã gửi về email của bạn (em chưa làm được)"})
    }
    else{
      res.json("Không tìm thấy Email")
    }

  } catch (error) {
    res.status(500).json({error: error})
    console.log(error);
  }
  
})

router.post('/login', async (req, res) => {
  try {
    let body = req.body
    const result = await userController.login(body)
    if (result) {
      return res.status(200).json({result, message: "Đăng nhập thành công", status: "OK"})
    } else {
      res.json({ message: "Email hoặc khẩu không đúng" })
    }
  } catch (error) {
    console.log(error);
  }
})

router.put('/:_id', async (req, res, next) => {
  try {
    const id = req.params._id;
    const body = req.body;

    const result = await userController.updateUserById(id, body);
    res.status(200).json({ updatedUser: result });
  } catch (error) {
    console.log("Lỗi: " + error.message);
  }
});


module.exports = router;
