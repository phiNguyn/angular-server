


const url = 'http://localhost:3000/'

const fetchAPI = async (url, option) => {
  const response = await fetch(url, option)
  return response.json()
}

// lẤY CHI TIẾT SẢN PHẨM
const getCategoryById = async (id) => {
  const urlSanPhams = url + "categories/" + id
  const option = {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }

  return await fetchAPI(urlSanPhams, option)
}

const delCategoryById = async (id) => {
  const urlSanPhams = url + "categories/" + id
  const option = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  }

  return await fetchAPI(urlSanPhams, option)
}

const addCategory = async (data) => {
  const urlSanPhams = url + "categories"
  const option = {
    method: "POST",
    headers: { "Accept": "multipart/form-data" },
    body: data
  }
 const re = await fetchAPI(urlSanPhams, option)
 console.log(re);
}

const capNhatCategoryById = async (id, updateData) => {
  const urlSanPhams = url + "categories/" + id
  const option = {
    method: "PUT",
    headers: { "Accept": "multipart/form-data" },
    body: updateData
  }

  return await fetchAPI(urlSanPhams, option)

}


const getCategory = async () => {
  const urlSanPham = url + "categories"
  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  const response = await fetchAPI(urlSanPham, option)

  let html_sp = response.map((item) => {
    return `
        <tr >
        <td>
            <img loading="lazy" src="http://localhost:3000/images/${item.img}">
            <p>${item.name}</p>
        </td>
        <td>${item.home}</td>        
        <td>${item.stt}</td>        
        <td>${item.content}</td>        
        <td>${item.mota}</td>        
        <td><button class="status process editPro" data-id="${item._id}" >Sửa</button>
         <button class="status pending delpro"  data-id ="${item._id}">Xóa</button></td>    
    </tr>
        `
  }).join(``)
  document.getElementById("categories-admin").innerHTML = html_sp

}

// MỞ MODAL 
var openAddPage = document.querySelector("#myModal")
// Khi click nút thêm thì lấy value ở form bên user.html
document.getElementById("them").onclick = function (e) {
  e.preventDefault()
  var name = document.querySelector("#name").value
  var home = document.querySelector("#home").value
  var stt = document.querySelector("#stt").value
  var content = document.querySelector("#content").value
  var mota = document.querySelector("#mota").value
  var img = document.querySelector("#img").files[0]

  var data = new FormData()
  data.append('name', name)
  data.append('home', home)
  data.append('stt', stt)
  data.append('content', content)
  data.append('mota', mota)
  data.append('img', img)

  // Gọi hàm thêm user method post
  addCategory(data)

  openAddPage.style.display = "none"
  setTimeout(() => {
    FuiToast.success('Đã cập nhật danh mục: ' + categoryItem.name)
    getCategory()
  }, 1000);

}




var editPage = document.querySelector("#myModal")

// Mở MODAL EDIT
const myEdit = document.getElementById("myEdit")

// Hàm Đóng MODAL
function closeEdit() {
  myEdit.style.display = "block"
  document.querySelector("#myEdit").addEventListener("click", function (e) {
    if (e.target.classList.contains('dong')) {
      myEdit.style.display = "none"
      // myEditChild.remove()
      const myEditChild = document.querySelector("#myEdit .modal-content")
      if (myEditChild) {
        myEdit.removeChild(myEditChild)
      }
    }
  })
}

// KIẾM CLASS EDITPRO THEO SLUG ĐẺ MỞ MODAL
document.querySelector("tbody").addEventListener("click", function (e) {
  if (e.target.classList.contains('editPro')) {
    closeEdit()

    const id = e.target.dataset.id

    getCategoryById(id).then(category => {

      myEdit.innerHTML +=

        `
                <div class="modal-content">
                <div class="modal-body">
                  <!-- Reminders -->
  
                  <span class="dong-lai dong">&times;</span>
                  <form
                    action=""
                    class="reminders"
                    enctype="multipart/form-data"
                  >
                    <div class="header">
                      <i class="bx bx-note"></i>
                      <h3>Tên sản phẩm</h3>
                      <i class="bx bx-filter"></i>
                      <i class="bx bx-plus"></i>
                    </div>
  
                    <ul class="task-list">
                      <li class="completed">
                        <div class="task-title">
                          <i class="bx bx-check-circle"></i>
                          <p>Tên Danh Mục</p>
                          <input type="text" id="edit-name" name="name" value="${category.name}" />
                        </div>
                      </li>
  
                      <li class="completed">
                        <div class="task-title">
                          <i class="bx bx-check-circle"></i>
                          <p>Hiện Trang chủ</p>
                          <select name="home" id="edit-home">
                        <option ${category.home == 1 ? "selected" : ""} value="1" style="width: 100%">
                         Có  </option>
                         <option ${category.home == 2 ? "selected" : ""} value="2" style="width: 100%">
                         Không  </option>
                          </select>
                        </div>
                      </li>
                      <li class="completed">
                        <div class="task-title">
                          <i class="bx bx-check-circle"></i>
                          <p>Sắp Xếp</p>
                          <input type="text" id="edit-stt" name="stt"  value="${category.stt}"/>
                        </div>
                      </li>
  
                      <li class="completed">
                        <div class="task-title">
                          <i class="bx bx-check-circle"></i>
                          <p>Nội dung</p>
                          <input type="text" id="edit-content" name="content" value="${category.content}" />
                        </div>
                      </li>
  
                      <li class="completed">
                        <div class="task-title">
                          <i class="bx bx-check-circle"></i>
                          <p>Mô tả</p>
                          <input type="text" id="edit-mota" name="mota"  value="${category.mota}"/>
                        </div>
                      </li>
  
                      <li class="completed">
                        <div class="task-title">
                          <i class="bx bx-check-circle"></i>
                          <p>Ảnh</p>
                          <input type="file" id="edit-img"  />
                          <input type="hidden" id="imgOld" value="${category.img}" />
                          <img   src="http://localhost:3000/images/${category.img}" width="150px"/>
                          </div>
                          </li>
                          </ul>
                          
                    <div style="display: flex; margin-top: 20px">
                      <button type="submit" data-id="${category._id}" class="report update" >
                       Cập nhật sản phẩm
                      </button>
                    </div>
                    
                  </form>
  
                  <!-- End of Reminders-->
                </div>
              </div>
           `
      console.log(document.querySelector("#imgOld").value);
    })

  }

})


// Cập nhật tài khoản
myEdit.addEventListener("click", function (e) {


  var name = document.querySelector("#edit-name").value
  var home = document.querySelector("#edit-home").value
  var stt = document.querySelector("#edit-stt").value
  var content = document.querySelector("#edit-content").value
  var mota = document.querySelector("#edit-mota").value
  var img = document.querySelector("#edit-img").files[0]
  var imgOld = document.querySelector("#imgOld").value

  const id = e.target.dataset.id;
  if (e.target.classList.contains('update')) {
    e.preventDefault()
    var updateData = new FormData()
    updateData.append('name', name)
    updateData.append('home', home)
    updateData.append('stt', stt)
    updateData.append('content', content)
    updateData.append('mota', mota)

    if (img) {
      updateData.append('img', img)
    } else {
      // Nếu không, sử dụng hình ảnh cũ
      updateData.append('img', imgOld)
    }

   
    capNhatCategoryById(id, updateData)


    const myEditChild = document.querySelector("#myEdit .modal-content")
    if (myEditChild) {
      myEdit.removeChild(myEditChild)
    }
    myEdit.style.display = "none"




    setTimeout(() => {
      FuiToast.success('Đã cập nhật danh mục: ' + name)
      getCategory()
    }, 2000);
  }
})



// Hàm xóa
var confirm = document.querySelector("#confirm")
function confirmDelete() {
  confirm.style.display = "block"
  document.querySelector("#confirm").addEventListener("click", function (e) {
    if (e.target.classList.contains('confirm-delete_cancel')) {
      confirm.style.display = "none"
    }
  })
}

document.querySelector("tbody").addEventListener("click", function (e) {
  if (e.target.classList.contains('delpro')) {
    confirmDelete()
    document.querySelector(".confirm-delete_ok").onclick = function () {
      const id = e.target.dataset.id
      delCategoryById(id)
      confirm.style.display = "none"

      setTimeout(() => {
        FuiToast.success('Đã xóa danh mục.')
        getCategory()
      }, 1000);
    }

  }

})







getCategory()