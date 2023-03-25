const baseUrl = "https://tarmeezacademy.com/api/v1"
function setupUI() {

    const token = localStorage.getItem("token")
    const loginDiv = document.getElementById("login-div")
    const logoutDiv = document.getElementById("logout-div")
    const CreatBtn = document.getElementById("add-post-button")
    
        if(token == null){
          if(CreatBtn != null){
            CreatBtn.style.setProperty("display","none","important")
          }
          loginDiv.style.setProperty("display","flex","important")
            logoutDiv.style.setProperty("display","none","important")
         
          }
        
        else{
          if(CreatBtn != null){
            CreatBtn.style.setProperty("display","block","important")
          }
          loginDiv.style.setProperty("display","none","important")
          logoutDiv.style.setProperty("display","flex","important")
          const user = getCurrentUser()
          document.getElementById("nav-username").innerHTML=user.username
          document.getElementById("nav-user-image").src = user.profile_image
        }

    }

function loginBtnClicked(){
  toggleLoader(true)
        const username = document.getElementById("username-input").value
        const password = document.getElementById("Password-input").value
        const params = {
            "username":username,
            "password":password
        }
            axios.post(`${baseUrl}/login`,params)
            .then((response) => {
              localStorage.setItem("token",response.data.token)
              localStorage.setItem("user",JSON.stringify(response.data.user))
              const modal = document.getElementById("loginModal")
              const modatInstance = bootstrap.Modal.getInstance(modal)
                modatInstance.hide()
                  setupUI()
                  showAlert("logged in successfully","success")
    
          })
          .catch((erorr) => {
          showAlert(erorr.response.data.message,"danger")
          }).finally(() => {

            toggleLoader(false)
          })
    
     }

 function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setupUI()
        showAlert("logged out successfully","danger")
      }


 function RegisterBtnClicked(){
  toggleLoader(true)
        const name = document.getElementById("register-name-input").value
        const username = document.getElementById("register-username-input").value
        const password = document.getElementById("register-password-input").value
        const img = document.getElementById("register-image-input").files[0]
        const formData = new FormData()
        formData.append("name",name)
        formData.append("username",username)
        formData.append("password",password)
        formData.append("image",img)
        const headers = {
          "Content-Type":"multipart/form-data"
        }
              axios.post(`${baseUrl}/register`,formData,{
                headers
              })
              .then((response) => {
                    localStorage.setItem("token",response.data.token)
                    localStorage.setItem("user",JSON.stringify(response.data.user))
    
                    const modal = document.getElementById("register-modal")
                    const modatInstance = bootstrap.Modal.getInstance(modal)
                      modatInstance.hide()
                        setupUI()
                        showAlert("new user registered successfully","success")
    
            })
            .catch((erorr) => {
              showAlert(erorr.response.data.message,"danger")
            }).finally(() => {
              toggleLoader(false)
            })
        }



function showAlert(coustumMessage,color){
            const alertPlaceholder = document.getElementById('success-alert')
        
              const alert = (message, type) => {
                const wrapper = document.createElement('div')
                wrapper.innerHTML = [
                  `<div class="alert alert-${type} alert-dismissible" role="alert">`,
                  `   <div>${message}</div>`,
                  '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                  '</div>'
                ].join('')
        
                alertPlaceholder.append(wrapper)
              }
        
                //hide the alert // to do 
        
                  alert(coustumMessage, color)
                  const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
                  // setTimeout(() => {
                  //   alertToHide.close()
                  // }, 2000);
        
        
        
          }


 function getCurrentUser(){ 
            let user = null
            const storageUser = localStorage.getItem("user")
            if (storageUser != null){
              user = JSON.parse(storageUser)
            }
          return user
        }

  function editPostBtnClicked(postObject){
          let post = JSON.parse(decodeURIComponent(postObject))
           document.getElementById("post-id-input").value= post.id
          document.getElementById("Post-modal title").innerHTML="Edit post"
          document.getElementById("post-modal-create-btn").innerHTML="Update"
          document.getElementById("post-title-input").value=post.title
          document.getElementById("post-body-input").value=post.body
          let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"),{})
          postModal.toggle()
        }
      
      
      function deletePostBtnClicked (postObject){
          let post = JSON.parse(decodeURIComponent(postObject))
          document.getElementById("post-id").value=post.id
         let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"),{})
         postModal.toggle()
        getPosts()
        
        }
      
      
     function confirmDelete(){
          const postId = document.getElementById("post-id").value
          const token = localStorage.getItem("token")
          const headers = {
           "Content-Type":"multipart/form-data",
           "authorization":`Bearer ${token}`
         }
               axios.delete(`${baseUrl}/posts/${postId}`,{
                 headers:headers
               })
               .then((response) => {
                 const modal = document.getElementById("delete-post-modal")
                 const modatInstance = bootstrap.Modal.getInstance(modal)
                   modatInstance.hide()
                     getPosts()
                     showAlert("Deleted post successfully","success")
                     getPost()
      
             })
             .catch((erorr) => {
             showAlert(erorr.response.data.message,"danger")
             })
      }


      function createNewPostClicked(){
        toggleLoader(true)
          let postId = document.getElementById("post-id-input").value
          let isCreate = (postId == null || postId == "")
          const title = document.getElementById("post-title-input").value
          const body = document.getElementById("post-body-input").value
          const img = document.getElementById("post-image-input").files[0]
          const token = localStorage.getItem("token")
        
          let formData = new FormData()
          formData.append("title",title)
          formData.append("body",body)
          formData.append("image",img)
        
          let url = ""
          const headers = {
            "Content-Type":"multipart/form-data",
            "authorization":`Bearer ${token}`
          }
          if(isCreate){
           
        
          url = `${baseUrl}/posts`
        
          }else{
            formData.append("_method","put")
              url = `${baseUrl}/posts/${postId}`
        
            }
         
          axios.post(url,formData,{
              headers: headers
        
                })
                .then((response) => {
                      const modal = document.getElementById("create-post-modal")
                      const modatInstance = bootstrap.Modal.getInstance(modal)
                        modatInstance.hide()
                      showAlert("New Post Has Been Created","success")
                    getPosts()
              })
              .catch((erorr) => {
                showAlert(erorr.response.data.message,"danger")
              }).finally(() => {
                toggleLoader(true)
              })
        
      }

    function profileClicked(){
         const myId= getCurrentUser().id
         window.location= `profile.html?userid=${myId}`
        }

  function toggleLoader(show = true)
{
if(show){
  document.getElementById("loader").style.visibility="visible"
}else{
  document.getElementById("loader").style.visibility="hidden"

}

}

function postClicked(postId){

  window.location= `postDetailes.html?postId=${postId}`
}


function addBtnClicked(){
  document.getElementById("post-id-input").value=null
 document.getElementById("Post-modal title").innerHTML="Create"
 document.getElementById("post-modal-create-btn").innerHTML="Create A New Post"
 document.getElementById("post-title-input").value=""
 document.getElementById("post-body-input").value=""
 let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"),{})
 postModal.toggle()
}

