const async = require("async");
const express = require("express");
const sequelize = require("sequelize");
const slugify = require("slugify");

const models = require("../models");

const router = express.Router();

// Only let the user access the route if they are authenticated.


// Render the home page and list all blog posts
router.get("/", (req, res) => {
  models.Post.findAll({
    order: sequelize.literal("createdAt DESC")
  }).then(posts => {
    let postData = [];

    async.eachSeries(posts, (post, callback) => {
      post = post.get({ plain: true });
      client.getUser(post.authorId).then(user => {
        postData.push({
          title: post.title,
          body: post.body,
          createdAt: post.createdAt,
          authorName: user.profile.firstName + " " + user.profile.lastName,
          slug: post.slug
        });
        callback();
      }).catch(err => {
        postData.push({
          title: post.title,
          body: post.body,
          createdAt: post.createdAt,
          slug: post.slug
        });
        callback();
      });
    }, err => {
      return res.render("index", { posts: postData });
    });
  });
});

// Render the user dashboard
router.get("/dashboard", (req, res, next) => {
  models.Post.findAll({
    where: {
      authorId: 1
    },
    order: sequelize.literal("createdAt DESC")
  }).then(posts => {
    let postData = [];

    posts.forEach(post => {
      postData.push(post.get({ plain: true }));
    });

    return res.render("dashboard", { posts: postData });
  });
});

// Create a new post
router.post("/dashboard", (req, res, next) => {
  models.Post.create({
    title: req.body.title,
    body: req.body.body,
    authorId: 1,
    slug: slugify(req.body.title).toLowerCase()
  }).then(newPost => {
    models.Post.findAll({
      where: {
        authorId: 1
      },
      order: sequelize.literal("createdAt DESC")
    }).then(posts => {
      let postData = [];

      posts.forEach(post => {
        postData.push(post.get({ plain: true }));
      });

      res.render("dashboard", { post: newPost, posts: postData });
    });
  });
});

// Render the edit post page
router.get("/:slug/edit", (req, res, next) => {
  models.Post.findOne({
    where: {
      slug: req.params.slug,
      authorId: 1
    }
  }).then(post => {
    if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    post = post.get({ plain: true });
    client.getUser(post.authorId).then(user => {
      post.authorName = user.profile.firstName + " " + user.profile.lastName;
      res.render("edit", { post });
    });
  });
});

// Update a post
router.post("/:slug/edit", (req, res, next) => {
  models.Post.findOne({
    where: {
      slug: req.params.slug,
      authorId: 1
    }
  }).then(post => {
    if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    post.update({
      title: req.body.title,
      body: req.body.body,
      slug: slugify(req.body.title).toLowerCase()
    }).then(() => {
      post = post.get({ plain: true });
      client.getUser(post.authorId).then(user => {
        post.authorName = user.profile.firstName + " " + user.profile.lastName;
        res.redirect("/" + slugify(req.body.title).toLowerCase());
      });
    });
  });
});

// Delete a post
router.post("/:slug/delete", (req, res, next) => {
  models.Post.findOne({
    where: {
      slug: req.params.slug,
      authorId: 1
    }
  }).then(post => {
    if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    post.destroy();
    res.redirect("/dashboard");
  });
});

// View a post
router.get("/:slug", (req, res, next) => {
  models.Post.findOne({
    where: {
      slug: req.params.slug
    }
  }).then(post => {
    if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    post = post.get({ plain: true });
   // client.getUser(post.authorId).then(user => {
     // post.authorName = user.profile.firstName + " " + user.profile.lastName;
      res.render("post", { post });
  //  });
  });
});


module.exports = router;