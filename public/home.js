(function() {
  const searchInput = document.querySelector(".js-searchbox-input");
  const searchBox = document.querySelector(".js-searchbox");
  const mobileSearchBox = document.querySelector(".js-searchbutton-mobile");
  const moreButton = document.querySelector(".js-more-button");
  const tooltips = document.querySelectorAll(".js-tooltip");
  const shares = document.querySelectorAll(".js-share");
  
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
      addItems(html);
      page += 1;
      
      moreButton.removeAttribute("disabled");
      moreButton.innerHTML = "More";
    }).catch(function (response) {
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
  
  Array.from(tooltips).forEach(function (tooltip) {
    tooltip.addEventListener('click', function (event) {
      event.preventDefault();
      tooltip.classList.add('show');
      setTimeout(function () {
        tooltip.classList.remove('show');
      }, 2100);
    });
  });
  
  function copy(text) {
    var copyText = document.querySelector(".js-hidden");
    copyText.value = text;
    copyText.select();
    document.execCommand("copy");
  }
  
  Array.from(shares).forEach(function (share) {
    console.log('share.getAttribute("data-link")', share.getAttribute("data-link"));
    copy(share.getAttribute("data-link"));
  });
  
})();
