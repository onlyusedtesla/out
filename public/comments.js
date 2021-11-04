(function () {
  
  const timeEls = document.querySelectorAll(".js-comment-date");
  const comments = document.querySelectorAll(".js-commentContainer");
  const allCommentBoxes = document.querySelectorAll(".js-comment-form");
  const article = document.querySelector(".js-article");
  
  const itemId = article.getAttribute("data-item-id");
  
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
    
    const contents = el.querySelectorAll(".js-comment").value;
    const commentId = el.getAttribute("data-comment-id");
    
    const comment = {
      item_id: itemId,
      parent_id: typeof commentId !== "undefined" ? commentId : null,
      contents: contents,
      comment_date: 
    };
    
          {
      "item_id": "0b914140",
      "author": "Jack",
      "contents": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lobortis.",
      "comment_date": 1635450631000,
      "comment_date_formatted": "Oct 28",
      "comment_id": "e651327c",
      "parent_id": "8212d336"
    },
      
    el.addEventListener("submit", function (event) {
      event.preventDefault();
    });
  });
  
}());