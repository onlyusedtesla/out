(function () {
  
  const timeEls = document.querySelectorAll(".js-comment-date");
  const comments = document.querySelectorAll(".js-commentContainer");
  const allCommentBoxes = document.querySelectorAll(".js-comment-form");
  
  function hideAllCommentBoxes() {
    const commentBoxes = document.querySelectorAll(".js-comment-form:not(.js-comment-form-primary)");
    
    commentBoxes.forEach(function (el) {
      el.classList.add("hidden");
    });
  }
  
  function serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
  
  function addComment(comment) {
    return new Promise(function(resolve, reject) {
      fetch("/comment?" + serialize(comment), {
        method: "POST"
      }).then(res => {
        console.log("What's the response?", res);
        
        return false;
        
        if (res.status === 200) {
          res.text().then(function(html) {
            resolve(html);
          });
        } else {
          reject(res.body);
        }
      });
    });
  }
  
  Array.from(timeEls).forEach(function (el) {
    console.log("What's el?", el);
    el.innerHTML = dateFormat(+el.getAttribute("datetime"), "mmm d, h:MM TT");
  });
  
  Array.from(comments).forEach(function (el) {
    const replyButton = el.querySelector(".js-comment-reply-button");
    const commentBox = el.querySelector(".js-comment-form");
    replyButton.addEventListener('click', function (event) {
      event.preventDefault();
      hideAllCommentBoxes();
      commentBox.classList.remove("hidden");
    });
  });
  
  Array.from(allCommentBoxes).forEach(function (el) {
    
    el.addEventListener("submit", function (event) {
      event.preventDefault();
      
      
    });
  });
  
}());