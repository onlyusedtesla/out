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
      const title = document.createElement("h1");
      const link = document.createElement("a");
      const description = document.createElement("p");

      link.href = url.value;
      link.innerHTML = url.value;
      title.innerHTML = title.value;
      description.innerHTML = description.value;

      div.appendChild(title);
      div.appendChild(document.createElement("br"));
      div.appendChild(description);
      div.appendChild(document.createElement("br"));
      div.appendChild(link);

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
