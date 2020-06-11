// const config = require("../config/auth.config");
const db = require("../models");
const Article = db.article;

exports.articles = async (req, res) => {
  const articles = await Article.find().sort({createdAt: 'desc'});
  res.json(articles);
};

exports.new = async (req, res) => {
  let article = new Article();
  article.title = req.body.title;
  article.description = req.body.description;
  article.markdown = req.body.markdown;

  try {
    article = await article.save();
    res.json(article);
  } catch(e) {
    res.json(e);
  }
};

exports.get = async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  //if null send error
  res.json(article);
};

exports.update = async (req, res) => {
  let article = await Article.findById(req.body.id);
  article.title = req.body.title;
  article.description = req.body.description;
  article.markdown = req.body.markdown;

  try {
    article = await article.save();
    res.json(article);
  } catch(e) {
    res.json(e);
  }
};

exports.delete = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.body.id);
    res.json({status: "success"});
  } catch(e) {
    res.json(e);
  }
};