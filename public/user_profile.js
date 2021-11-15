(function() {
  var form = document.querySelector(".js-form"),
      ownedTeslaModel = document.querySelector(".js-owned-tesla-model"),
      about = document.querySelector(".js-about"),
      author = document.querySelector(".js-author"),
      successMessage = document.querySelector(".js-success-message");
  
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    var responseBody = {
      author: author.value,
      ownedTeslaModel: ownedTeslaModel.options[ownedTeslaModel.selectedIndex].text,
      about: about.value
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
  
  // All the logic related to the clicking of stuff below the article.
  
  const profileLinks = document.querySelectorAll(".js-profile-link");
  
  function hideItemContainers() {
    let itemContainers = document.querySelectorAll(".js-item-container");
    
    Array.from(itemContainers).forEach(function (el) {
      el.classList.remove("item-container--selected");
    });
  }
  
  Array.from(profileLinks).forEach(function (profileLink) {
    profileLink.addEventListener('click', function (event) {
      event.preventDefault();
      let linkTo = profileLink.getAttribute("data-link");
      console.log("What's the data-link attribute?", linkTo);
      hideItemContainers();
      let itemContainer = document.querySelector(".js-items-container[data-link=" + linkTo + "]");
      console.log("What's the itemContainer?", itemContainer);
      // classList.add("item-container--selected");
    });
  });
  
})();