(function() {
  var form = document.querySelector(".js-form"),
    url = document.querySelector(".js-url"),
    title = document.querySelector(".js-title"),
    author = document.querySelector(".js-author"),
    question = document.querySelector(".js-question"),
    description = document.querySelector(".js-description"),
    successMessage = document.querySelector(".js-success-message");
  
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    var responseBody = {
      title: "Ask TT: " + question.value.trim(),
      description: description.value,
      date_published: dateFormat(Date.now()),
      author: author.value,
      content_html: contentHtml,
      isQuestion: true
    };
    
    fetch("/submit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(responseBody)
    }).then(res => {
      if (res.status === 200) {
        form.classList.add("hidden");
        successMessage.classList.remove("hidden");
      }
    });
  });
})();