(function () {
  
  const searchInput = document.querySelector(".js-searchbox-input");
  const searchBox = document.querySelector(".js-searchbox");
  const mobileSearchBox = document.querySelector(".js-searchbutton-mobile");
  
  // when you focus on the search inbox, then add a class to the outer element, and remove it when you lose focus.
  searchInput.addEventListener("focus", function(event) {
    searchBox.classList.add("searchbox--focused");
  });

  searchInput.addEventListener("blur", function(event) {
    searchBox.classList.remove("searchbox--focused");
  });
  
  mobileSearchBox.addEventListener("click", function(event) {
    event.preventDefault();
    var searchTerms = prompt("Enter search");

    if (searchTerms && searchTerms.length >= 1) {
      var url = new URL("https://" + document.location.hostname + "/");
      url.searchParams.set("search", encodeURIComponent(searchTerms));
      window.location.href = url.href;
    }
  });
  
}());