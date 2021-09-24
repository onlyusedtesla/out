(function () {
  
  const searchInput = document.querySelector(".js-searchbox-input");
  const searchBox = document.querySelector(".js-searchbox");
  
  // console.log("searchInput?", searchInput);
  // console.log("searchBox?", searchBox);

  searchInput.addEventListener('focus', function (event) {
    searchBox.classList.add("searchbox--focused");
  });
  
  searchInput.addEventListener('blur', function (event) {
    searchBox.classList.remove("searchbox--focused");
  });
  
  // when you focus on the search inbox, then add a class to the outer element, and remove it when you lose focus.
})();