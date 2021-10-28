(function() {
  var form = document.querySelector(".js-form"),
    url = document.querySelector(".js-url"),
    title = document.querySelector(".js-title"),
    author = document.querySelector(".js-author"),
    description = document.querySelector(".js-description"),
    successMessage = document.querySelector(".js-success-message");

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const contentHtml = (() => {
      const div = document.createElement("div");
      const linkEl = document.createElement("a");
      const descriptionEl = document.createElement("p");

      descriptionEl.innerHTML = description.value;
      linkEl.href = url.value;
      linkEl.style="display: block;";
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

    fetch("/submit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url.value,
        link: url.value,
        title: title.value,
        description: description.value,
        pubDate: dateFormat(Date.now()),
        author: author.value,
        content_html: contentHtml
      })
    }).then(res => {
      if (res.status === 200) {
        form.classList.add("hidden");
        successMessage.classList.remove("hidden");
      }
    });
  });
})();
