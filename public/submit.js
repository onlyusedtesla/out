(function () {
  var form = document.querySelector(".js-form"),
      url = document.querySelector(".js-url"),
      title = document.querySelector(".js-title"),
      description = document.querySelector(".js-description");
  
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/submit", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      url: url,
      title: title,
      description: description
    }));
    
  });
  
})();