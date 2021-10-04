(function () {
  var form = document.querySelector(".js-form"),
      url = document.querySelector(".js-url"),
      title = document.querySelector(".js-title"),
      description = document.querySelector(".js-description");
  
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    fetch("/submit", {
      method: "POST", 
      body: JSON.stringify({
        url: url,
        title: title,
        description: description,
        submission_date: Date.now()
      })
    }).then(res => {
      console.log("Request complete! response:", res);
    });
    
  });
      
})();