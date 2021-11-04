(function () {
  
  const timeEls = document.querySelectorAll(".js-comment-date");
  const comments = document.querySelectorAll(".js-comment");
  
  function hideAllCommentBoxes() {
    const commentBoxes = Array.from(document.querySelectorAll(".js-comment-form:not(.js-comment-form-primary)"));
    
    commentBoxes.forEach(function (el) {
      el.classList.add("hidden");
    });
  }
  
  Array.from(timeEls).forEach(function (el) {
    console.log("What's el?", el);
    el.innerHTML = dateFormat(+el.getAttribute("datetime"), "mmm d, h:MM TT");
  });
  
  Array.from(comments).forEach(function (comment) {
    const replyButton = comment.querySelector(".js-comment-reply-button");
    const commentBox = comment.querySelector(".js-comment-form");
    replyButton.addEventListener('click', function () {
      hideAllCommentBoxes();
      commentBox.classList.remove("hidden");
    });
  });
  
}());