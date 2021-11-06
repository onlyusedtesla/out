(function() {
  var form = document.querySelector(".js-form"),
    url = document.querySelector(".js-url"),
    title = document.querySelector(".js-title"),
    author = document.querySelector(".js-author"),
    question = document.querySelector(".js-question"),
    description = document.querySelector(".js-description"),
    successMessage = document.querySelector(".js-success-message");

  var isQuestion =
    form.getAttribute("data-is-question") === "true" ? true : false;

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const contentHtml = (() => {
      const div = document.createElement("div");
      const linkEl = document.createElement("a");
      const descriptionEl = document.createElement("p");
      
      if (isQuestion) {
        descriptionEl.innerHTML = question.value + "<br>" + description.value;
      } else {
        descriptionEl.innerHTML = description.value;
      }
        
      // don't put the link in there unless it exists. It won't for the question.
      if (url) {
        linkEl.href = url.value;
      } else {
        linkEl.href = "https://teslatracker.com/";
      }
      
      linkEl.style = "display: block;";
      linkEl.appendChild(descriptionEl);
      linkEl.appendChild(descriptionEl);
      div.appendChild(linkEl);
      
      let by = document.createElement("span");
      by.innerHTML = " by ";

      div.appendChild(by);

      let username = document.createElement("a");
      username.innerHTML = author.value;
      username.href = "https://teslatracker.com/user?id=" + author.value;

      div.appendChild(username);

      return div.innerHTML;
    })();

    var responseBody = undefined;
    
    if (isQuestion) {
      responseBody = {
        question: question.value,
        description: description.value,
        pubDate: dateFormat(Date.now()),
        author: author.value,
        content_html: contentHtml,
        isQuestion: true
      };
    } else {
      responseBody = {
        url: url.value,
        link: url.value,
        title: title.value,
        description: description.value,
        pubDate: dateFormat(Date.now()),
        author: author.value,
        content_html: contentHtml,
        isQuestion: false
      };
    }

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
