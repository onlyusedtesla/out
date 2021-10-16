(function() {
  const searchInput = document.querySelector(".js-searchbox-input");
  const searchBox = document.querySelector(".js-searchbox");
  const mobileSearchBox = document.querySelector(".js-searchbutton-mobile");
  const moreButton = document.querySelector(".js-more-button");
  const tooltips = document.querySelectorAll(".js-tooltip");
  const hoverTooltips = document.querySelectorAll(".js-tooltip-hover");
  const shares = document.querySelectorAll(".js-share");
  const favoriteButtons = document.querySelectorAll(".js-favorite");
  const upvotes = document.querySelectorAll(".js-upvote");
  
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
  
  function removeFavorite(itemId) {
    return new Promise(function(resolve, reject) {
      fetch("/removeFavorite?item_id=" + itemId, {
        method: "POST"
      }).then(res => {
        
        console.log("What's the response?", res);
        
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
  
  function favoriteItem(itemId) {
    
    console.log("Calling the favoriteItem function for " + itemId);
    
    return new Promise(function(resolve, reject) {
      fetch("/addFavorite?item_id=" + itemId, {
        method: "POST"
      }).then(res => {
        
        console.log("What's the response?", res);
        
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
      
      setTimeout(function () {
        convertArticleDates();
      });
      
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
  
  Array.from(hoverTooltips).forEach(function (tooltip) {
    tooltip.addEventListener('mouseover', function (event) {
      event.preventDefault();
      tooltip.classList.add('show');
    });
    
    tooltip.addEventListener('mouseout', function (event) {
      event.preventDefault();
      tooltip.classList.remove('show');
    });
  });
  
  Array.from(shares).forEach(function (share) {
    share.addEventListener('click', function (event) {
      event.preventDefault();
      navigator.clipboard.writeText(share.getAttribute("data-link")).then(function() {}, function() {});
    });
  });
  
  function toggleUpvotes(upvoteEls) {
    Array.from(upvoteEls).forEach(function (svg) {
      
      
      const isNotUpvoted = svg.getAttribute("data-upvoted") === "false";
      
      if (isNotUpvoted) {
        svg.setAttribute("fill", svg.getAttribute("data-fill-upvoted"));
        svg.setAttribute("data-upvoted", "true");
      } else {
        svg.setAttribute("fill", svg.getAttribute("data-fill-notupvoted"));
        svg.setAttribute("data-upvoted", "false");
      }      
    });
  }
  
  Array.from(upvotes).forEach(function (upvote) {
    upvote.addEventListener('click', function (event) {
      
      console.log("clickingon the upvote. Which cone isit ?", upvote);
      
      event.preventDefault();
      
      var article = upvote.closest(".js-article"),
          upvotesForArticle = article.querySelectorAll(".js-upvote");
      
      console.log("What are the upvote for article?", upvotesForArticle);
      toggleUpvotes(upvotesForArticle);
      
    });                       
  });
  
  function convertArticleDates() {
    var articleDates = document.querySelectorAll(".js-article-date");
    Array.from(articleDates).forEach(function(articleDate) {
      articleDate.innerHTML = dateFormat(+articleDate.getAttribute("data-time"), "mmm d, h:MM TT");
      articleDate.setAttribute("title", dateFormat(+articleDate.getAttribute("data-time"), "mmm d, h:MM TT Z"));
    });
  }
  
  function toggleFavorite(favoriteEls) {
    Array.from(favoriteEls).forEach(function (favoriteButton) {
      
      const isNotFavorited = favoriteButton.getAttribute("fill") === "none";
      
      if (isNotFavorited) {
        favoriteButton.setAttribute("fill", favoriteButton.getAttribute("data-original-fill"));
        favoriteButton.setAttribute("stroke", "none");
      } else {
        favoriteButton.setAttribute("stroke", favoriteButton.getAttribute("data-original-stroke"));
        favoriteButton.setAttribute("fill", "none");
      }
      
    });
  }
  
  // Takes care of favoriting.
  Array.from(favoriteButtons).forEach(function (favoriteButton) {
    favoriteButton.addEventListener('click', function (event) {
      
      event.preventDefault();
      
      var article = favoriteButton.closest(".js-article"),
          favoritesForArticle = article.querySelectorAll(".js-favorite > path"),
          itemId = favoriteButton.getAttribute("data-item-id"),
          action = favoriteButton.getAttribute("data-favorite-action");
      
      toggleFavorite(favoritesForArticle);
      
      if (action === "add") {
        favoriteItem(itemId).then(function (response) { }).catch(function (error) {
          toggleFavorite(favoritesForArticle); // put the state of the button back.
        });
      } else if (action === "remove") {
        console.log("going to unfavorite the item.");
        removeFavorite(itemId).then(function (response) {}).catch(function (error) {
          toggleFavorite(favoritesForArticle);
        });
        
      }
      
    });
  });
  
  convertArticleDates();
  
})();
