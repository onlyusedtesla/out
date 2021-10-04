(function () {
  var form = document.querySelector(".js-form"),
      url = document.querySelector(".js-url"),
      title = document.querySelector(".js-title"),
      description = document.querySelector(".js-description");
  
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    fetch("/submit", {
      method: "POST", 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url.value,
        title: title.value,
        description: description.value,
        submission_date: Date.now()
      })
    }).then(res => {
      console.log("Request complete! response:", res);
    });
    
  });
      
})();