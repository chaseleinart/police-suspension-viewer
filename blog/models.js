const Sequelize = require("sequelize");

const db = new Sequelize({
  dialect: "sqlite",
  storage: "police-data.sqlite"
});


//const Post = db.define("post", {
 // title: { type: Sequelize.STRING },
 // body: { type: Sequelize.TEXT },
 // authorId: { type: Sequelize.STRING },
 // slug: { type: Sequelize.STRING }
//});

const Entry = db.define("entry",{
  id: { type: Sequelize.STRING,  primaryKey: true},
  name: { type: Sequelize.STRING},
  state: { type: Sequelize.STRING},
  agency: { type: Sequelize.STRING},
  year_decertified: { type: Sequelize.INTEGER},
  source: { type: Sequelize.STRING},
  createdAt: { type: Sequelize.DATE},
  updatedAt: { type: Sequelize.DATE},
});

db.sync();

module.exports = { Entry };