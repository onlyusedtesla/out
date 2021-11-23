(function () {
  
  const timeEls = document.querySelectorAll(".js-comment-date");
  const comments = document.querySelectorAll(".js-commentContainer");
  const allCommentBoxes = document.querySelectorAll(".js-comment-form");
  const article = document.querySelector(".js-article");
  
  const author = document.querySelector(".js-author").value;
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
        if (res.status === 200) {
          res.text().then(function(responseText) {
            resolve(responseText);
          });
        } else {
          reject(res.body);
        }
      });
    });
  }
  
  Array.from(timeEls).forEach(function (el) {
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
      
      const contents = el.querySelector(".js-comment").value;
      const commentId = el.getAttribute("data-comment-id");
      const commentDate = (new Date()).getTime();
      
      const comment = {
        item_id: itemId,
        parent_id: typeof commentId !== "undefined" ? commentId : null,
        contents: contents,
        comment_date: commentDate,
        comment_date_formatted: dateFormat(commentDate, "mmm d"),
        author: author
      };
      
      addComment(comment).then(function (newCommentId) {
        console.log("Added a comment - in the then.");
        // Refresh the page and let's go directly to the new comment_id
        window.location.hash = newCommentId;
        window.location.reload();
      });
      
    });
  });
  
  function removeCommentUpvote(commentId) {
    return new Promise(function(resolve, reject) {
      fetch("/removeCommentUpvote?comment_id=" + commentId, {
        method: "POST"
      }).then(res => {
        console.log("What's the response?", res);

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

  function addCommentUpvote(commentId) {
    console.log("Calling the addCommentUpvote function for " + commentId);

    return new Promise(function(resolve, reject) {
      fetch("/addCommentUpvote?comment_id=" + commentId, {
        method: "POST"
      }).then(res => {
        console.log("What's the response?", res);

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
  
  const commentUpvoteButtons = document.querySelectorAll(".js-commentupvote");
  
  Array.from(commentUpvoteButtons).forEach(function (commentUpvoteButton) {
    commentUpvoteButton.addEventListener('click', function (event) {
      
      event.preventDefault();
      
      const commentContainer = commentUpvoteButton.closest(".js-commentContainer");
      const commentId = commentContainer.id;
      const addOrRemove = commentUpvoteButton.getAttribute("data-action");
      const pathEl = commentUpvoteButton.querySelector("path");
      
      if (addOrRemove === "add") {
        
        pathEl.setAttribute("fill", pathEl.getAttribute("data-fill-upvoted")); 
        
        addCommentUpvote(commentId).then(function () {
          commentUpvoteButton.setAttribute('data-action', 'remove');
        }).catch(function () {
          pathEl.setAttribute("fill", pathEl.getAttribute("data-fill-notupvoted")); 
        });
        
      } else {
        pathEl.setAtttribute("fill", pathEl.getAttribute("data-fill-notupvoted"));
        
        removeCommentUpvote(commentId).then(function () {
          commentUpvoteButton.setAttribute('data-action', 'add');
        }).catch(function () {
          pathEl.setAttribute("fill", pathEl.getAttribute("data-fill-upvoted")); 
        });
        
      }
    });
    
  });
}());