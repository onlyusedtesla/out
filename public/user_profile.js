(function() {
  var form = document.querySelector(".js-form"),
      ownedTeslaModel = document.querySelector(".js-owned-tesla-model"),
      about = document.querySelector(".js-about"),
      author = document.querySelector(".js-author"),
      successMessage = document.querySelector(".js-success-message");
  
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    var responseBody = {
      author: author,
      ownedTeslaModel: ownedTeslaModel,
      about: about
    };
    
    fetch("/updateProfile", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(responseBody)
    }).then(res => {
      window.location.reload();
    });
  });
})();