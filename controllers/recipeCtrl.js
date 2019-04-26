const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const User = require("../models/user");
const axios = require("axios");
let recipes;
let recipe;
let searchQuery = "food";

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.session.username
    });
    const recipeData = recipe.data[0];
    const newRecipe = await Recipe.create({
      uri: recipeData.uri,
      label: recipeData.label,
      image: recipeData.image,
      url: recipeData.url,
      yield: recipeData.yield,
      caolories: recipeData.calories,
      ingredients: recipeData.ingredientLines,
      dietlabels: recipeData.dietLabels,
      healthlabels: recipeData.healthLabels,
      likes: 0,
      hates: 0
    });
    user.cookbook.push(newRecipe.id);
    user.save();
    res.redirect(`/users/${user.id}/cookbook`);
    console.log(user);
  } catch (err) {
    throw new Error(err);
  }
});

router.post("/search", (req, res) => {
  searchQuery = req.body.searchQuery;
  res.redirect("/recipes");
});

router.get("/", async (req, res) => {
  console.log(process.env);
  recipes = await axios.get(
    `https://api.edamam.com/search?q=${searchQuery}&app_id=${
      process.env.APP_ID
    }&app_key=${process.env.APP_KEY}&`
  );
  //console.log(recipes.data.hits[0].recipe.image)

  try {
    res.render("recipes/index", { recipes });
    // res.send("got recipes")
  } catch (err) {
    throw new Error(err);
  }
});

router.get("/:uri", async (req, res) => {
  try {
    const encode = await encodeURIComponent(req.params.uri);
    recipe = await axios.get(
      `https://api.edamam.com/search?r=${encode}&app_id=${
        process.env.APP_ID
      }&app_key=${process.env.APP_KEY}&`
    );
    res.render("recipes/show", {
      recipe
    });
  } catch (err) {
    throw new Error(err);
  }
  // console.log(recipe)
});

module.exports = router;
