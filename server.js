// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./db.js");
const RSSFeed = require("./feed.js");
const ejs = require("ejs");
const path = require("path");

const { auth, requiresAuth } = require("express-openid-connect");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// set the view engine to ejs
app.set("view engine", "ejs");

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "vf8hOrlz9ntG4nE_a9WyqYvPov6Yu0eWL82nmNrGEfgMeAGF0683-I2Nyhuf0EFS",
  baseURL: process.env.STAGING
    ? "https://staging-teslatracker.derick.work"
    : "https://teslatracker.com",
  clientID: "nNRceuJ1eDslyoi1dJdGuxElPOx1oU2W",
  issuerBaseURL: "https://auth.teslatracker.com"
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.get("/", (request, response) => {
  if (
    typeof request.query.search !== "undefined" &&
    request.query.search.length >= 1
  ) {
    let items = db.getItemsFromSearch(request.query.search);

    let firstTwoItems = [];
    let nextItems = [];

    // Getting the upvote count for each of the items.
    for (let i = 0; i < items.length; i += 1) {
      items[i]["upvoteCount"] = db.getUpvoteCountForItem(items[i].item_id);
      console.log(
        "item upvotecount",
        items[i].item_id + " " + items[i].upvoteCount
      );
    }

    if (items.length >= 3) {
      nextItems = items.slice(3);
    }

    if (items.length >= 2) {
      firstTwoItems.push(items[0]);
      firstTwoItems.push(items[1]);
    }

    response.render(__dirname + "/views/index", {
      searchQuery: request.query.search,
      firstTwoItems: firstTwoItems,
      nextItems: nextItems,
      userInfo: request.oidc.isAuthenticated()
        ? request.oidc.user.nickname
        : false,
      favorites: request.oidc.isAuthenticated()
        ? db.getFavorites(request.oidc.user.sub)
        : [],
      upvotes: request.oidc.isAuthenticated()
        ? db.getUpvotes(request.oidc.user.sub)
        : [],
      staging: process.env.STAGING || false
    });
  } else {
    const items = db.getItems();

    let firstTwoItems = [];
    let nextItems = items.slice(2);

    // Getting the upvote count for each of the items.
    for (let i = 0; i < items.length; i += 1) {
      items[i]["upvoteCount"] = db.getUpvoteCountForItem(items[i].item_id);
      console.log(
        "item upvotecount",
        items[i].item_id + " " + items[i].upvoteCount
      );
    }

    firstTwoItems.push(items[0]);
    firstTwoItems.push(items[1]);

    response.render(__dirname + "/views/index", {
      firstTwoItems: firstTwoItems,
      nextItems: nextItems,
      userInfo: request.oidc.isAuthenticated()
        ? request.oidc.user.nickname
        : false,
      favorites: request.oidc.isAuthenticated()
        ? db.getFavorites(request.oidc.user.sub)
        : [],
      upvotes: request.oidc.isAuthenticated()
        ? db.getUpvotes(request.oidc.user.sub)
        : [],
      staging: process.env.STAGING || false
    });
  }
});

app.get("/item/:id", (request, response) => {
  // This is the page where we will render the individual comments page.

  const item = db.getItem(request.params.id);

  console.log("Rendering the item view");

  if (item) {
    item.upvoteCount = db.getUpvoteCountForItem(item.item_id);

    const comments = db.getComments(item.item_id);

    console.log("comments", comments);

    response.render(__dirname + "/views/comments", {
      item: item,
      staging: process.env.STAGING || false,
      userInfo: request.oidc.isAuthenticated()
        ? request.oidc.user.nickname
        : false,
      favorites: request.oidc.isAuthenticated()
        ? db.getFavorites(request.oidc.user.sub)
        : [],
      upvotes: request.oidc.isAuthenticated()
        ? db.getUpvotes(request.oidc.user.sub)
        : [],
      comments: comments,
      commentPartialPath: __dirname + "/views/partials/comments.ejs"
    });
  } else {
    // Render the 404 page.
  }
});

app.post("/comment", function(request, response) {
  if (
    request.oidc.isAuthenticated() &&
    request.query.author &&
    request.query.author === request.oidc.user.nickname &&
    request.query.item_id &&
    db.itemExists(request.query.item_id) &&
    request.query.contents &&
    request.query.contents.length >= 1 &&
    request.query.comment_date 
  ) {
    
    
    const result = db.addComment({
      item_id: request.query.item_id,
      author: request.oidc.user.nickname,
      contents: request.query.contents,
      comment_date: request.query.comment_date,
      comment_date_formatted: request.query.comment_date_formatted,
      parent_id: request.query.parent_id
    });
    
    if (result) {
      response.status(200).send(result);
    } else {
      response.status(400).send("Please make sure you're logged in and all the information is properly filled out.");
    }
  } else {
    response.status(400).send("Please make sure you're logged in and all the information is properly filled out.");
  }
  
});

app.get("/landing", function(request, response) {
  response.render(__dirname + "/views/landing");
});

app.get("/submit", requiresAuth(), function(request, response) {
  response.render(__dirname + "/views/submit", {
    userInfo: request.oidc.isAuthenticated()
      ? request.oidc.user.nickname
      : false,
    staging: process.env.STAGING || false
  });
});

app.get("/items", function(request, response) {
  if (request.query.page) {
    response.setHeader("Content-Type", "text/html");
    const items = db.getItems(request.query.page);

    // Getting the upvote count for each of the items.
    for (let i = 0; i < items.length; i += 1) {
      items[i]["upvoteCount"] = db.getUpvoteCountForItem(items[i].item_id);
      console.log(
        "item upvotecount",
        items[i].item_id + " " + items[i].upvoteCount
      );
    }

    if (items.length < 1) {
      response.status(400).send("There are no more items to load");
    } else {
      let articles = ejs.renderFile(
        __dirname + "views/partials/article.ejs",
        {
          nextItems: items,
          favorites: request.oidc.isAuthenticated()
            ? db.getFavorites(request.oidc.user.sub)
            : [],
          upvotes: request.oidc.isAuthenticated()
            ? db.getUpvotes(request.oidc.user.sub)
            : []
        },
        function(err, str) {
          response.status(200).send(str);
        }
      );
    }
  } else {
    response
      .status(400)
      .send(
        "Please specify the page query parameter and make sure it's a positive number."
      );
  }
});

app.post("/submit", function(request, response) {
  try {
    db.saveSubmission(request.body);
    response.status(200).send("Submission saved successfully");
  } catch {
    response.status(400).send("An error occured while saving the submission.");
  }
});

app.post("/addFavorite", function(request, response) {
  console.log("Calling the /addFavorite post route");

  if (!request.oidc.isAuthenticated()) {
    response
      .status(400)
      .send("Please sign up / sign in before favoriting an article.");
  }

  // Something with wrong with auth. Either log the user out, and have them try again or something.
  // TODO: Fix this issue with  sometimes the use being undefined
  if (typeof request.oidc.user === "undefined") {
    response.status(400).send("Please sign in again.");
  }

  if (request.query.item_id) {
    if (db.itemExists(request.query.item_id)) {
      const result = db.addFavorite(
        request.oidc.user.sub,
        request.query.item_id
      );
      response
        .status(200)
        .send("Successfully favorited the item " + request.query.item_id);
    }
  } else {
    response.status(400).send("Please specify the article_id parameter.");
  }
});

app.post("/removeFavorite", function(request, response) {
  if (!request.oidc.isAuthenticated()) {
    response
      .status(400)
      .send("Please sign up / sign in before favoriting an article.");
  }

  if (request.query.item_id) {
    const result = db.removeFavorite(
      request.oidc.user.sub,
      request.query.item_id
    );
    response
      .status(200)
      .send("Successfully unfavorited the item " + request.query.item_id);
  } else {
    response.status(400).send("Please specify the item_id parameter.");
  }
});

app.post("/upvote", function(request, response) {
  console.log("Calling the /upvote post route");

  if (!request.oidc.isAuthenticated()) {
    response
      .status(400)
      .send("Please sign up / sign in before upvoting an article.");
  }

  // Something with wrong with auth. Either log the user out, and have them try again or something.
  // TODO: Fix this issue with  sometimes the use being undefined
  if (typeof request.oidc.user === "undefined") {
    response.status(400).send("Please sign in again.");
  }

  if (request.query.item_id) {
    if (db.itemExists(request.query.item_id)) {
      const result = db.addUpvote(request.oidc.user.sub, request.query.item_id);
      response
        .status(200)
        .send("Successfully upvoted the item " + request.query.item_id);
    }
  } else {
    response.status(400).send("Please specify the article_id parameter.");
  }
});

app.post("/removeUpvote", function(request, response) {
  if (!request.oidc.isAuthenticated()) {
    response
      .status(400)
      .send("Please sign up / sign in before upvoting article.");
  }

  if (request.query.item_id) {
    const result = db.removeUpvote(
      request.oidc.user.sub,
      request.query.item_id
    );
    response
      .status(200)
      .send("Successfully unfavorited the item " + request.query.item_id);
  } else {
    response.status(400).send("Please specify the item_id parameter.");
  }
});

app.get("/submissions.xml", function(request, response) {
  response.setHeader("Content-Type", "application/rss+xml");
  response.writeHead(200);
  response.write(RSSFeed());
  response.end();
});

app.get("/publish", function(request, response) {
  if (
    request.query.code &&
    request.query.code === "d3saztBdZUN7LqBjgJ9NC5PjfjU2dfFW"
  ) {
    const reader = require("./reader.js");
    reader(function() {
      response
        .status(200)
        .send("The website has been updated with the latest articles.");
    });
  }
});

//The 404 Route
app.get("*", function(request, response) {
  response.render(__dirname + "/views/404");
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3001, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
