// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./db.js");
const RSSFeed = require("./feed.js");
const ejs = require("ejs");

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
  baseURL: process.env.STAGING ? "https://staging-teslatracker.derick.work" : "https://teslatracker.com",
  clientID: "nNRceuJ1eDslyoi1dJdGuxElPOx1oU2W",
  issuerBaseURL: "https://auth.teslatracker.com"
};

const favicons = {
  "twitter.com":
    "https://favicons.feedbinusercontent.com/eee/eee14e8a36b0512c12ba26c0516b4553618dea36.png",
  "bloomberg.com":
    "https://favicons.feedbinusercontent.com/f69/f6936297929ac2dc992008db38e655fa2221653f.png",
  "businessinsider.com":
    "https://favicons.feedbinusercontent.com/f8f/f8fd5dd260f11ea41d669aba064d8798c8b54e1e.png",
  "cleantechnica.com":
    "https://favicons.feedbinusercontent.com/94e/94efba6cc235ce9e6d8ddd51c8d733688cef153b.png",
  "electrek.co":
    "https://favicons.feedbinusercontent.com/69b/69b665de831b9db58e38056275c8c37624f35c98.png",
  "greencarreports.com":
    "https://favicons.feedbinusercontent.com/279/279cbba3d5f9940c028bcf11c7e94ab175681685.png",
  "techcrunch.com":
    "https://favicons.feedbinusercontent.com/224/2245821916d8964b802acb191e1220d4b408a0a5.png",
  "youtube.com":
    "https://favicons.feedbinusercontent.com/f2e/f2e22853e5da3e1017d5e1e319eeefe4f622e8c8.png",
  "tesla.com":
    "https://favicons.feedbinusercontent.com/160/160a8b53aeef50066e05f33e85a98b173ec0381d.png",
  "teslarati.com":
    "https://favicons.feedbinusercontent.com/3d5/3d56ef4537ef8b173efb51c083d4ac16055fbedc.png",
  "theteslashow.com":
    "https://favicons.feedbinusercontent.com/9b8/9b859ddeb9c368c1e8ec9fabe53c0747c0050922.png",
  "vice.com":
    "https://favicons.feedbinusercontent.com/f13/f131cb7704a83caf362ccdc3641071ed2a62bd55.png",
  "wsj.com":
    "https://favicons.feedbinusercontent.com/fc6/fc6976a0f023bb3f4c0dbf9b2dfd1dfb28d11537.png"
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
      favicons: favicons,
      userInfo: request.oidc.isAuthenticated()
        ? request.oidc.user.nickname
        : false,
      staging: process.env.STAGING || false
    });
  } else {
    
    const items = db.getItems();
    
    let firstTwoItems = [];
    let nextItems = items.slice(2);
    
    firstTwoItems.push(items[0]);
    firstTwoItems.push(items[1]);
    
    response.render(__dirname + "/views/index", {
      firstTwoItems: firstTwoItems,
      nextItems: nextItems,
      favicons: favicons,
      userInfo: request.oidc.isAuthenticated()
        ? request.oidc.user.nickname
        : false,
      favorites: request.oidc.isAuthenticated() ? db.getFavorites(request.oidc.user.sub) : [],
      staging: process.env.STAGING || false
    });
    
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

app.get("/items", function (request, response) {
  if (request.query.page) {
    response.setHeader('Content-Type', 'text/html');
    const items = db.getItems(request.query.page);
    
    if (items.length < 1) {
      response.status(400).send("There are no more items to load");
    } else {
      let articles = ejs.renderFile(__dirname + '/partials/article.ejs', {
        nextItems: items,
        favicons: favicons,
      }, function (err, str) {
        response.status(200).send(str);
      });
    }
  } else {
    response.status(400).send("Please specify the page query parameter and make sure it's a positive number.");
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

app.post("/addFavorite", function (request, response) {
  
  console.log("Calling the /addFavorite post route");
  
  if (!request.oidc.isAuthenticated()) {
    response.status(400).send("Please sign up / sign in before favoriting an article.");
  }
  
  // Something with wrong with auth. Either log the user out, and have them try again or something.
  // TODO: Fix this issue with  sometimes the use being undefined
  if (typeof request.oidc.user === "undefined") {
    response.status(400).send("Please sign in again.");
  }
  
  if (request.query.item_id) {
    if (db.itemExists(request.query.item_id)) {
      const result = db.addFavorite(request.oidc.user.sub, request.query.item_id);
      response.status(200).send("Successfully favorited the item " + request.query.item_id);
    }
  } else {
    response.status(400).send("Please specify the article_id parameter.");
  }
});

app.post("/removeFavorite", function (request, response) {
  
  if (!request.oidc.isAuthenticated()) {
    response.status(400).send("Please sign up / sign in before favoriting an article.");
  }
  
  if (request.query.item_id) {
    const result = db.removeFavorite(request.oidc.user.sub, request.query.item_id);
    response.status(200).send("Successfully unfavorited the item " + request.query.item_id);
  } else {
    response.status(400).send("Please specify the article_id parameter.");
  }
});

app.get("/submissions.xml", function(request, response) {
  response.setHeader("Content-Type", "application/rss+xml");
  response.writeHead(200);
  response.write(RSSFeed());
  response.end();
});

app.get('/publish', function (request, response) {
  if (request.query.code && request.query.code === "d3saztBdZUN7LqBjgJ9NC5PjfjU2dfFW") {
    const reader = require("./reader.js");
    reader(function () {
      response.status(200).send("The website has been updated with the latest articles.");
    });
  }
});

//The 404 Route
app.get('*', function (request, response) {
  response.render(__dirname + "/views/404");
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3001, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
