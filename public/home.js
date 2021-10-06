(function () {
  
  const searchInput = document.querySelector(".js-searchbox-input");
  const searchBox = document.querySelector(".js-searchbox");
  const mobileSearchBox = document.querySelector(".js-searchbutton-mobile");
  const moreButton = document.querySelector(".js-more-button");
  
  let page = 1; // For getting more articles
  
  function getItems(page) {
    
    return new Promise(function (resolve, reject) {

          fetch("/submit", {
      method: "GET",
    }).then(res => {
      if (res.status === 200) {
        
        moreButton.removeAttribute('disabled');
        moreButton.innerHTML = "More";
        
        console.log("What's the res.body?", res.body);
      } else {
        reject(res.body);
      }
    });
    });
  }
  
  moreButton.addEventListener('click', function (event) {
    event.preventDefault();
    
    moreButton.setAtttribute('disabled', 'disabled');
    moreButton.innerHTML = "Loading...";
    
  });
  
  // when you focus on the search inbox, then add a class to the outer element, and remove it when you lose focus.
  searchInput.addEventListener('focus', function (event) {
    searchBox.classList.add("searchbox--focused");
  });
  
  searchInput.addEventListener('blur', function (event) {
    searchBox.classList.remove("searchbox--focused");
  });
  
  mobileSearchBox.addEventListener('click', function (event) {
    event.preventDefault();
    var searchTerms = prompt("Enter search");
    
    if (searchTerms && searchTerms.length >= 1) {
      var url = new URL(window.location.href);
      url.searchParams.set("search", encodeURIComponent(searchTerms));
      window.location.href = url.href;
    }
  });
})();