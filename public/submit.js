(function () {
  var form = document.querySelector(".js-form"),
      url = document.querySelector(".js-url"),
      title = document.querySelector(".js-title"),
      author = document.querySelector(".js-author"),
      description = document.querySelector(".js-description"),
      successMessage = document.querySelector(".js-success-message");
  
  const contentHtml = (function () {
    const div = document.createElement('div');
    const title = document.createElement('h1');
    title.innerText = title;
    const link = document.createElement('a');
    
    link.href = url.value;
  })();
  
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    fetch("/submit", {
      method: "POST", 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
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
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
      }
    });
    
  });
      
})();