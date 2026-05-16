const aiService = require('../services/aiService');

exports.suggestRecipes = async (req, res, next) => {
  try {
    const { ingredients, preferences = {}, filters = {} } = req.body;
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'ingredients must be a non-empty array' });
    }

    const result = await aiService.generateRecipes({ ingredients, preferences, filters });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
