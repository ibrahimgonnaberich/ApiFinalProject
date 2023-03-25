
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get("postId")
setupUI()


function getPost(reload =true , page = 1){
  toggleLoader(true)
    axios.get(`${baseUrl}/posts/${id}` )
.then((posts) => {

    const post = posts.data.data
    const comments = post.comments
    const autor = post.author
    document.getElementById("username-span").innerHTML=autor.username
    let postTitle=""
    if(post.title !=null){
        postTitle =  post.title
    }
    let commentsContent =  `  `
    for(comment of comments){
        commentsContent +=   `  
        
       <div class="p-3" style="background-color: rgb(235, 235, 235)">
       <!-- ==== PFP + USERNAME ==== -->
       <div>
         <img
           src="${comment.author.profile_image}"
           alt=""
           class="rounded-circle"
           style="width: 40px; height: 40px"
         />
         <b class="px-1">@${comment.author.username}</b>
       </div>
       <!-- \\==== PFP + USERNAME ====\\-->
       <!-- ====COMEENTS BODY==== -->

       <div>
        ${comment.body}
       </div>
       <!--\\\ ====COMEENTS BODY==== \\\-->
     </div>

        
        `
    }

    const postContent= 
    `
    <div class="card shadow my-2">
    <div class="card-header">
      <img
        src="${autor.profile_image}"
        alt=""
        class="rounded-circle border border-1"
        style="width: 40px; height: 40px"
      />
      <b>@${autor.username}</b>
    </div>

    <div class="card-body">
      <img
        class="w-100"
        src="${post.image}"
        alt=""
        style="height: 450px"
      />

      <h6 style="color: rgb(193, 193, 193)" class="mt-3">${post.created_at}</h6>
      <h5>${postTitle}</h5>
      <p>
       ${post.body}
      </p>
      <hr />
      <div id="holder">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-pen"
          viewBox="0 0 16 16"
        >
          <path
            d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
          />
        </svg>
        <span>(${post.comments_count})comments</span>

      </div>
    </div>

    <div id="all-comments">
    ${commentsContent}
    </div>

    <div class="input-group mb-3"  id="add-comment-div">
      <input id="comment-input" class="form-control" type="text" placeholder="comment here ...">
      <button class="btn btn-outline-primary" type="button" onclick="createCommentClicked()">Send</button>
    </div>
  </div>
  `
  document.getElementById("post-comments").innerHTML=""
  document.getElementById("post-comments").innerHTML=postContent
})
.catch((erorr) => {
    console.log(erorr)
}).finally(() => {
  toggleLoader(false)
})
}
getPost()


function createCommentClicked(){
  let commentBody =  document.getElementById("comment-input").value
  let params = {
    "body":commentBody
  }
let token = localStorage.getItem("token")
let url = `${baseUrl}/posts/${id}/comments`
axios.post(url,params, {
  headers:{
    "authorization": `Bearer ${token}`
  }
})
.then((response) => {
  showAlert("thanks for your opinion !","success")
  getPost()
})
.catch(erorr =>{
  showAlert(erorr.response.data.message,"danger")
})
}



