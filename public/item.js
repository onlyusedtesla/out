(function() {
  const hoverTooltips = document.querySelectorAll(".js-tooltip-hover"),
        mobileToggle = document.querySelector(".js-mobilemenutoggle"),
        mobileNavigation = document.querySelector(".js-mobilenavigation");
  
  function removeFavorite(itemId) {
    return new Promise(function(resolve, reject) {
      fetch("/removeFavorite?item_id=" + itemId, {
        method: "POST"
      }).then(res => {
        console.log("What's the response?", res);

        if (res.status === 200) {
          res.text().then(function(html) {
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
          res.text().then(function(html) {
            resolve(html);
          });
        } else {
          reject(res.body);
        }
      });
    });
  }

  function upvoteItem(itemId) {
    console.log("Calling the upvoteItem function for " + itemId);

    return new Promise(function(resolve, reject) {
      fetch("/upvote?item_id=" + itemId, {
        method: "POST"
      }).then(res => {
        console.log("What's the response?", res);

        if (res.status === 200) {
          res.text().then(function(html) {
            resolve(html);
          });
        } else {
          reject(res.body);
        }
      });
    });
  }

  function removeUpvote(itemId) {
    return new Promise(function(resolve, reject) {
      fetch("/removeUpvote?item_id=" + itemId, {
        method: "POST"
      }).then(res => {
        console.log("What's the response?", res);

        if (res.status === 200) {
          res.text().then(function(html) {
            resolve(html);
          });
        } else {
          reject(res.body);
        }
      });
    });
  }
  
  function tooltipHandler(event) {
    event.preventDefault();
    
    var tooltip = event.target;
    
    tooltip.classList.add("show");
    setTimeout(function() {
      tooltip.classList.remove("show");
    }, 2100);
  }
  
  function addTooltipListeners() {
    var tooltips = document.querySelectorAll(".js-tooltip");
    Array.from(tooltips).forEach(function(tooltip) {
      tooltip.removeEventListener("click", tooltipHandler);
      tooltip.addEventListener("click", tooltipHandler);
    });
  }
  
  function addLoggedOutTooltipListeners() {
    console.log("Gonna add listeners for each tooltip.");
    var tooltips = document.querySelectorAll(".js-logged-out-tooltip");
    Array.from(tooltips).forEach(function(tooltip) {
      tooltip.removeEventListener("click", tooltipHandler);
      tooltip.addEventListener("click", tooltipHandler);
    });
  }
  
  Array.from(hoverTooltips).forEach(function(tooltip) {
    tooltip.addEventListener("mouseover", function(event) {
      event.preventDefault();
      tooltip.classList.add("show");
    });

    tooltip.addEventListener("mouseout", function(event) {
      event.preventDefault();
      tooltip.classList.remove("show");
    });
  });
  
  function shareHandler(event) {
    var share = event.target;
    
    event.preventDefault();
    navigator.clipboard
      .writeText(share.getAttribute("data-link"))
      .then(function() {}, function() {});
  }
  
  function addShareListeners() {
    var shares = document.querySelectorAll(".js-share");
    
    Array.from(shares).forEach(function(share) {
      share.removeEventListener('click', shareHandler);
      share.addEventListener("click", shareHandler);
    });
  }
  
  function toggleUpvotes(upvoteEls) {
    
    console.log("toggleUpvotes", toggleUpvotes);
    
    Array.from(upvoteEls).forEach(function(button) {
      const svg = button.querySelector("svg > path"),
        count = button.parentNode.querySelector(".js-upvoteCount"),
        isNotUpvoted = svg.getAttribute("data-upvoted") === "false";
      
      if (isNotUpvoted) {
        svg.setAttribute("fill", svg.getAttribute("data-fill-upvoted"));
        button.classList.add("article-share--upvoted");
        svg.setAttribute("data-upvoted", "true");
        button.setAttribute("data-action", "remove");
        count.innerHTML = +count.innerHTML + 1;
      } else {
        svg.setAttribute("fill", svg.getAttribute("data-fill-notupvoted"));
        button.classList.remove("article-share--upvoted");
        svg.setAttribute("data-upvoted", "false");
        button.setAttribute("data-action", "add");
        count.innerHTML = +count.innerHTML - 1;
      }
    });
  }
  
  function upvoteHandler(event) {
    
    event.preventDefault();
    
    var upvote = event.target;
    
    var article = upvote.closest(".js-article"),
      upvotesForArticle = article.querySelectorAll(".js-upvote"),
      itemId = article.getAttribute("data-item-id"),
      action = upvote.getAttribute("data-action");

    toggleUpvotes(upvotesForArticle);

    console.log("action", action);

    if (action === "add") {
      // Turn it off if error from the server.
      upvoteItem(itemId).catch(function() {
        toggleUpvotes(upvotesForArticle);
      });
    } else {
      removeUpvote(itemId).catch(function() {
        toggleUpvotes(upvotesForArticle);
      });
    }
  }
  
  function addUpvoteListeners() {
    
    var upvotes = document.querySelectorAll(".js-upvote");
    
    Array.from(upvotes).forEach(function(upvote) {
      upvote.removeEventListener("click", upvoteHandler);
      upvote.addEventListener("click", upvoteHandler);
    });
  }
  
  function convertArticleDates(articleDates) {
    var articleDates = document.querySelectorAll(".js-article-date")
    Array.from(articleDates).forEach(function(articleDate) {
      articleDate.innerHTML = dateFormat(
        +articleDate.getAttribute("data-time"),
        "mmm d, h:MM TT"
      );
      articleDate.setAttribute(
        "title",
        dateFormat(+articleDate.getAttribute("data-time"), "mmm d, h:MM TT Z")
      );
    });
  }

  function toggleFavorite(favoriteEls) {
    Array.from(favoriteEls).forEach(function(favoriteButton) {
      const isNotFavorited = favoriteButton.getAttribute("fill") === "none";

      if (isNotFavorited) {
        favoriteButton.setAttribute(
          "fill",
          favoriteButton.getAttribute("data-original-fill")
        );
        favoriteButton.setAttribute("stroke", "none");
      } else {
        favoriteButton.setAttribute(
          "stroke",
          favoriteButton.getAttribute("data-original-stroke")
        );
        favoriteButton.setAttribute("fill", "none");
      }
    });
  }

  // Takes care of favoriting.
  
  function favoriteHandler(event) {
    event.preventDefault();
    
    var favoriteButton = event.target;
    
    var article = favoriteButton.closest(".js-article"),
      favoritesForArticle = article.querySelectorAll(".js-favorite > path"),
      itemId = article.getAttribute("data-item-id"),
      action = favoriteButton.getAttribute("data-action");

    toggleFavorite(favoritesForArticle);
    
    if (action === "add") {
      favoriteItem(itemId)
        .then(function(response) {})
        .catch(function(error) {
          toggleFavorite(favoritesForArticle); // put the state of the button back.
        });
    } else if (action === "remove") {
      console.log("going to unfavorite the item.");
      removeFavorite(itemId)
        .then(function(response) {})
        .catch(function(error) {
          toggleFavorite(favoritesForArticle);
        });
    }
  }
  
  function addFavoriteListeners() {
    var favoriteButtons = document.querySelectorAll(".js-favorite");
    
    Array.from(favoriteButtons).forEach(function(favoriteButton) {
      favoriteButton.removeEventListener("click", favoriteHandler);
      favoriteButton.addEventListener("click", favoriteHandler);
    });
  }
  
  mobileToggle.addEventListener("click", function(event) {
    mobileToggle.classList.toggle("mobile-menuToggle--activated");
    mobileNavigation.classList.toggle("mobile-navigation--opened");
  });
  
  convertArticleDates();
  addFavoriteListeners();
  addUpvoteListeners();
  addShareListeners();
  addTooltipListeners();
  addLoggedOutTooltipListeners();
  
  window.APP = {};
  
  window.APP.convertArticleDates = convertArticleDates;
  window.APP.addFavoriteListeners = addFavoriteListeners;
  window.APP.addUpvoteListeners = addUpvoteListeners;
  window.APP.addShareListeners = addShareListeners;
  window.APP.addTooltipListeners = addTooltipListeners;
  
})();

