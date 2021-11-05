(function () {
  
  const moreButton = document.querySelector(".js-more-button");
    
  let page = 1; // For getting more articles

  function addItems(html) {
    console.log("addItems");
    console.log("html", html);
    var tpl = document.createElement("template");
    tpl.innerHTML = html;
    let articlesEl = document.querySelectorAll("section.articles")[1];
    articlesEl.appendChild(tpl.content);
  }

  function getItems(page) {
    console.log("getItems");
    return new Promise(function(resolve, reject) {
      fetch("/items?page=" + page, {
        method: "GET",
        headers: {
          "Content-Type": "text/html"
        }
      }).then(res => {
        console.log("In the then statement");
        console.log("What's the res?", res);
        console.log("res.status", res.status);
        
        if (res.status === 200) {
          res.text().then(function(html) {
            console.log("html", html);
            resolve(html);
          });
        } else {
          console.log("What's the res? in the else statement");
          reject(res.body);
        }
      })
      .catch(res => {
        console.log("in getItems catch");
        console.log("What's the res?", res);
      });
    });
  }
  
  moreButton.addEventListener("click", function(event) {
    event.preventDefault();

    moreButton.setAttribute("disabled", "disabled");
    moreButton.innerHTML = "Loading...";

    getItems(page)
      .then(function(html) {
      
        addItems(html);
      
        page += 1;

        moreButton.removeAttribute("disabled");
        moreButton.innerHTML = "More";
      
        setTimeout(function() {
          window.APP.convertArticleDates();
          window.APP.addFavoriteListeners();
          window.APP.addUpvoteListeners();
          window.APP.addShareListeners();
          window.APP.addTooltipListeners();
        });
      
      })
      .catch(function(response) {
        console.log("What's the response?", response);
        moreButton.removeAttribute("disabled");
        moreButton.innerHTML = "More";
      });
  });
  
}());