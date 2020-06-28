const async = require("async");
const express = require("express");
const sequelize = require("sequelize");
const slugify = require("slugify");

const models = require("../models");

const router = express.Router();

// Only let the user access the route if they are authenticated.

// Render the home page and list all blog posts
router.get("/", (req, res) => {
  models.Entry.findAll({
    order: sequelize.literal("createdAt DESC")
  }).then(entries => {
    let entryData = [];
    async.eachSeries(entries, (entry) => {
      entry = entry.get({ plain: true });
        entryData.push({
          id: entry.id,
          name: entry.name,
          state: entry.state,
          agency: entry.agency,
          source: entry.year_decertified,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,  
        });
      })
    }, err => {
      return res.render("index", { entries: entryData });
    });
  });


// Render the user dashboard
router.get("/dashboard", (req, res, next) => {
  models.Entry.findAll({
  }).then(entries => {
    let entryData = [];
    entries.forEach(entry => {
      entryData.push(entry.get({ plain: true }));
    });
    return res.render("dashboard", { entries: entryData });
  });
});

// Create a new entry
router.post("/dashboard", (req, res, next) => {
  models.Entry.create({
    id: entry.id,
          name: entry.name,
          state: entry.state,
          agency: entry.agency,
          source: entry.year_decertified,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,  
  }).then(newentry => {
    models.Entry.findAll({
      order: sequelize.literal("createdAt DESC")
    }).then(entries => {
      let entryData = [];

      entries.forEach(entry => {
        entryData.push(entry.get({ plain: true }));
      });

      res.render("dashboard", { entry: newEntry, entries: entryData });
    });
  });
});

// Render the edit post page
router.get("/:slug/edit", (req, res, next) => {
  models.Entry.findOne({
    where: {
      slug: req.params.slug,
      authorId: 1
    }
  }).then(entry => {
    if (!entry) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    entry = entry.get({ plain: true });
    client.getUser(entry.authorId).then(user => {
      entry.authorName = user.profile.firstName + " " + user.profile.lastName;
      res.render("edit", { entry });
    });
  });
});

// Update a entry
router.post("/:slug/edit", (req, res, next) => {
  models.Entry.findOne({
    where: {
      slug: req.params.slug,
      authorId: 1
    }
  }).then(entry => {
    if (!entry) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    entry.update({
      title: req.body.title,
      body: req.body.body,
      slug: slugify(req.body.title).toLowerCase()
    }).then(() => {
      entry = entry.get({ plain: true });
      client.getUser(entry.authorId).then(user => {
        entry.authorName = user.profile.firstName + " " + user.profile.lastName;
        res.redirect("/" + slugify(req.body.title).toLowerCase());
      });
    });
  });
});

// Delete a entry
router.post("/:slug/delete", (req, res, next) => {
  models.Entry.findOne({
    where: {
      slug: req.params.slug,
      authorId: 1
    }
  }).then(entry => {
    if (!entry) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    entry.destroy();
    res.redirect("/dashboard");
  });
});

// View a entry
router.get("/:id", (req, res, next) => {
  models.Entry.findOne({
    where: {
      slug: req.params.id
    }
  }).then(entry => {
    if (!entry) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    entry = entry.get({ plain: true });
   // client.getUser(post.authorId).then(user => {
     // post.authorName = user.profile.firstName + " " + user.profile.lastName;
      res.render("entry", { entry });
  //  });
  });
});


module.exports = router;
