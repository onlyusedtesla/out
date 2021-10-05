(function () {
  var form = document.querySelector(".js-form"),
      url = document.querySelector(".js-url"),
      title = document.querySelector(".js-title"),
      author = document.querySelector(".js-author"),
      description = document.querySelector(".js-description"),
      successMessage = document.querySelector(".js-success-message");
  
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
        author: author.value
      })
    }).then(res => {
      if (res.status === 200) {
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
      }
    });
    
  });
      
})();