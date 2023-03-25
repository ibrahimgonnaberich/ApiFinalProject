
 let currentPage = 1
 let lastPage=1
 setupUI()
 getPosts()

window.addEventListener("scroll", function(){
  console.log("scroling")
  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
  console.log(endOfPage)
  if (endOfPage && currentPage < lastPage){
    currentPage++
    if(currentPage)
    getPosts(false , currentPage)
  }
});
function userClicked(userId){
window.location = `profile.html?userid=${userId}`

}





function getPosts(reload =true , page = 1){
  toggleLoader(true)
    axios.get(`${baseUrl}/posts?limit=2&page=${page}` )
.then((posts) => {
  toggleLoader(false)
    lastPage = posts.data.meta.last_page
    let placeHolder =document.getElementById("posts")
    if(reload){
  placeHolder.innerHTML=""
    }
  
    for(let post of posts.data.data){
        let postTitle = ""
        let user = getCurrentUser()
        let myEiditContent =  ``
        let isMyPost = user != null && user.id == post.author.id
        if(isMyPost){
          myEiditContent= `
          <button class="btn btn-danger" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
          <button class="btn btn-secondary" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
          `
        }
      if(post.title !== null ){
      postTitle = post.title
      }
        placeHolder.innerHTML +=
        ` <div class="card shadow my-2">
            <div class="card-header">
            <div class="d-flex w-100 justify-content-between align-items-center">
          <div>
          <span onclick="userClicked(${post.author.id})" style="cursor:pointer;">
          <img src="${post.author.profile_image}" alt="no" class="rounded-circle border border-1" style="width: 40px; height: 40px;">
          <b>@${post.author.username}</b>
       </span>

          </div>
          <div>
          ${myEiditContent}
          </div>
              </div>
              </div>

              <div class="card-body" onclick="postClicked(${post.id})" style ="cursor:pointer;">
                <img class="w-100 " src="${post.image}" alt="" style=" height:550px;">


                <h6 style="color: rgb(193,193,193);" class="mt-3">
                  ${post.created_at}
                </h6>
                <h5>
            ${postTitle}
                </h5>
                <p>
                ${post.body}
                </p>
                <hr>
                <div id ="holder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                  </svg>
                  <span>${post.comments_count} comments</span>
                  <span id="post-tags-${post.id}">
                  <button class="btn btn-sm rounded-5" style ="background-color:gray; color:white">
                  ibrahim</button>
                  </span>

                </div>

        </div>
      </div>
      `
      const tagsHolder= `post-tags-${post.id}`
      document.getElementById(tagsHolder).innerHTML=""

      for(let tag of post.tags)
      {
          console.log(tag)
          let tagsContent= `
          <button class="btn btn-sm rounded-5" style ="background-color:gray; color:white">
          ${tag.name}
          </button>

              `
          document.getElementById(tagsHolder).innerHTML+= tagsContent

  }
  }

})
.catch((erorr) => {
    console.log(erorr)
})
}






  

