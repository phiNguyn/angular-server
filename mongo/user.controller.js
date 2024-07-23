const userModel = require('./user.model')
var bcryptjs = require('bcryptjs')
var jwt = require('jsonwebtoken');
   module.exports ={ signUP, getUser, getUserById, addUser, updateUserById, remove, login, forgot }
   

  async function signUP (body)  {
    try {
        let { name, email, pass, role } = body
        let user = await userModel.findOne({ email: email })
        if (user) {
            throw new Error(`User ${email} already exists`)

        }
        const salt = bcryptjs.genSaltSync(10)
        const hash = bcryptjs.hashSync(pass,salt)
        user = new userModel({name,email,pass:hash,role : role ||1})
        const result = await user.save()
     return result
    } catch (error) {
       console.log(error);
    }
}
async function forgot(email) {
    try {
        let acc = await userModel.findOne({ email:email})
        if(!acc) {
            throw new Error("Email Không Tồn Tại")
        }
        return acc
    } catch (error) {
        
    }
}

async function login(body) {
    try {
        const {email, pass} = body
        let user = await userModel.findOne({email: email})
        if(!user) {
            throw new Error("Email chưa tạo")
        }
        const checkpass = bcryptjs.compareSync(pass,user.pass)
        if(!checkpass) {
            throw new Error("Sai Mật Khẩu")
        }
        delete user._doc.pass
        const token = jwt.sign(
            {_id:user._id, email:user.email, role:user.role}, 
            "nguyen",
            {expiresIn: "1d"}
        )
        user = {...user._doc,token}
        return user

    } catch (error) {
        
    }
}

async function getUser() {
    try {
        const user = await userModel.find({role: 1}).sort('-_id')
        return user

    } catch (error) {
        console.log('Error get all', error);
        throw error;
    }
}

async function getUserById(id) {
    try {
        const user = await userModel.findById(id)
        return user
    } catch (error) {
        console.log('Error get all', error);
        throw error;
    }
}

async function addUser(body) {
    try {
        const { name, email, pass, role } = body
        let user = await userModel.findOne({email: email}) 
        if(user) {
            throw new Error ("Email already exists")
        }
        const newUser = new userModel({
            name, email, pass, role
        })
        const result = await newUser.save();
        return result
    } catch (error) {
        console.log('Lỗi khi thêm sản phẩm', error);
        throw error;
    }
}

async function updateUserById(id, body) {
    try {
        const { name, email, pass, role } = body;
        const result = await userModel.findByIdAndUpdate(id, { name, email, pass, role }, { new: true });
        return result;
    } catch (error) {
        console.error("Error updating user: ", error);
        throw error;
    }
}

async function remove(id) {
    try {
        const result = await userModel.findByIdAndDelete(id)
        return result;
    } catch (error) {

    }
}
