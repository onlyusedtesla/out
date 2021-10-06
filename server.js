// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./db.js");
const RSSFeed = require("./feed.js");
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
  baseURL: "https://staging-teslatracker.derick.work",
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
  const items = db.getItems();
  
  let firstTwoItems = [];
  let nextItems = items.slice(2);

  firstTwoItems.push(items[0]);
  firstTwoItems.push(items[1]);

  if (
    typeof request.query.search !== "undefined" &&
    request.query.search.length >= 1
  ) {
    response.render(__dirname + "/views/index", {
      searchQuery: request.query.search,
      firstTwoItems: firstTwoItems,
      nextItems: nextItems,
      favicons: favicons,
      userInfo: request.oidc.isAuthenticated()
        ? request.oidc.user.nickname
        : false
    });
  } else {
    response.render(__dirname + "/views/index", {
      firstTwoItems: firstTwoItems,
      nextItems: nextItems,
      favicons: favicons,
      userInfo: request.oidc.isAuthenticated()
        ? request.oidc.user.nickname
        : false
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
        : false
  });
});

app.get("/items", function (request, response) {
  if (request.query.page) {
    response.setHeader('Content-Type', 'application/json');
    response.status(200).send(db.getItems(request.query.page));
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

app.get("/submissions.xml", function(request, response) {
  response.setHeader("Content-Type", "application/rss+xml");
  response.writeHead(200);
  response.write(RSSFeed());
  response.end();
});

// endpoint to get all the dreams in the database
app.get("/getDreams", (request, response) => {
  db.all("SELECT * from Dreams", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

// endpoint to add a dream to the database
app.post("/addDream", (request, response) => {
  console.log(`add to dreams ${request.body.dream}`);

  // DISALLOW_WRITE is an ENV variable that gets reset for new projects
  // so they can write to the database
  if (!process.env.DISALLOW_WRITE) {
    const cleansedDream = cleanseString(request.body.dream);
    db.run(`INSERT INTO Dreams (dream) VALUES (?)`, cleansedDream, error => {
      if (error) {
        response.send({ message: "error!" });
      } else {
        response.send({ message: "success" });
      }
    });
  }
});

// endpoint to clear dreams from the database
app.get("/clearDreams", (request, response) => {
  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
    db.each(
      "SELECT * from Dreams",
      (err, row) => {
        console.log("row", row);
        db.run(`DELETE FROM Dreams WHERE ID=?`, row.id, error => {
          if (row) {
            console.log(`deleted row ${row.id}`);
          }
        });
      },
      err => {
        if (err) {
          response.send({ message: "error!" });
        } else {
          response.send({ message: "success" });
        }
      }
    );
  }
});

// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
