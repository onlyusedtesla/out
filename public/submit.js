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
      const titleEl = document.createElement("h1");
      const linkEl = document.createElement("a");
      const descriptionEl = document.createElement("p");

      linkEl.href = url.value;
      linkEl.innerHTML = url.value;
      titleEl.innerHTML = title.value;
      descriptionEl.innerHTML = description.value;

      div.appendChild(titleEl);
      div.appendChild(document.createElement("br"));
      div.appendChild(descriptionEl);
      div.appendChild(document.createElement("br"));
      div.appendChild(linkEl);

      return div.innerHTML;
    })();

    fetch("/submit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        link: url.value,
        title: title.value,
        description: description.value,
        pubDate: Date.now(),
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
