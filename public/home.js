(function() {
  const searchInput = document.querySelector(".js-searchbox-input");
  const searchBox = document.querySelector(".js-searchbox");
  const mobileSearchBox = document.querySelector(".js-searchbutton-mobile");
  const moreButton = document.querySelector(".js-more-button");

  let page = 1; // For getting more articles
  
  function addItems(html) {
    var tpl = document.createElement('template');
    tpl.innerHTML = html;
    let articlesEl = document.querySelectorAll('section.articles')[1];
    articlesEl.appendChild(tpl.content);
  }
  
  function getItems(page) {
    return new Promise(function(resolve, reject) {
      fetch("/items?page=" + page, {
        method: "GET",
        headers: {
          'Content-Type': 'text/html'
        }
      }).then(res => {
        console.log("res", res);
        if (res.status === 200) {
          res.text().then(function (html) {
            resolve(html);
          });
        } else {
          reject(res.body);
        }
      });
    });
  }

  moreButton.addEventListener("click", function(event) {
    event.preventDefault();

    moreButton.setAttribute("disabled", "disabled");
    moreButton.innerHTML = "Loading...";
    
    getItems(page).then(function (html) {
      console.log("It got accepted");
      addItems(html);
      page += 1;
      
      moreButton.removeAttribute("disabled");
      moreButton.innerHTML = "More";
      
    }).catch(function (response) {
      console.log("This got rejected");
      console.log("What's the response?", response);
      
      moreButton.removeAttribute("disabled");
      moreButton.innerHTML = "More";
    });
    
  });

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
      var url = new URL(window.location.href);
      url.searchParams.set("search", encodeURIComponent(searchTerms));
      window.location.href = url.href;
    }
  });
})();
