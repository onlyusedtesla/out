(function () {
  
  const timeEls = document.querySelectorAll(".js-comment-date");
  
  const comments = document.querySelectorAll(".js-comment");
  
  console.log("Going to run the dateFormat function on the time elements");
  
  Array.from(timeEls).forEach(function (el) {
    console.log("What's el?", el);
    el.innerHTML = dateFormat(+el.getAttribute("datetime"), "mmm d, h:MM TT");
  });
  
  Array.from(comments).forEach(function (comment) {
    const replyButton = comment.querySelector(".js-comment-reply-button");
    replyButton.addEventListener('click', function ());
  });
  
}());