const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const request = require("request");

// Our scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

var PORT = process.env.PORT || 8080;

// Initialize Express
const app = express();

// Set Handlebars.
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/pokerArticles";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// mongoose.connect("mongodb://localhost/week18Populater", { useNewUrlParser: true });

// Routes

app.get("/", function(req, res) {
    db.Article.find({},function(err, data) {
       var hbsObject = {
           article: data
       };
       res.render("index", hbsObject);
    });
});

app.get("/saved", function(req, res) {
    db.Article.find({},function(err, data) {
       var hbsObject = {
           article: data
       };
       res.render("saved", hbsObject);
    });
});

// A GET route for scraping the website
app.get("/scrape", function(req, res) {
  
    db.Article.remove({}, function(dbArticle){
        // res.json(dbArticle);
    });

    axios.get("https://upswingpoker.com/blog/").then(function(response) {
        
        const $ = cheerio.load(response.data);

        $(".fl-post-grid-post").each(function(i, element) {
           
            let result = {};
            // Save the values
            result.title = $(element).find("h2").text();
            result.link = $(element).find("h2").children().attr("href");
            result.summary = $(element).find(".fl-post-grid-content").children("p").text();
            result.img = $(element).find(".fl-post-grid-image").find("img").attr("src");
            
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
            .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
            });
        });
        res.redirect("/");
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.put("/articles/:id", function(req, res) {
    // console.log("======",req.body)

    db.Article.findOne({ _id: req.params.id })
    // .populate("note")
    .then(function(dbArticle) {
        // toggles T/F 
        dbArticle.isSaved = !dbArticle.isSaved;
        db.Article.updateOne({ _id: req.params.id }, {isSaved: dbArticle.isSaved}, function(err, updatedDbArticle){
            console.log(updatedDbArticle);
            // res.json(updatedDbArticle);
            res.json(updatedDbArticle);
        });
        
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//if modal doesnt work load on new page with handlebars
// need ID of article clicking on
// /notes/:id for notes as a post


app.post("/notes/:id", function(req, res) {
    console.log(req.body);
    db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
// db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
//   .then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       // If we were able to successfully update an Article, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
