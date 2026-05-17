const aiService = require('../services/aiService');

exports.suggestRecipes = async (req, res, next) => {
  try {
    const { ingredients, preferences = {}, filters = {} } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'La liste des ingrédients est requise et doit être un tableau.' });
    }

    // Nettoyage des ingrédients
    const cleanIngredients = ingredients.map(i => i.trim()).filter(Boolean);
    if (cleanIngredients.length === 0) {
      return res.status(400).json({ error: 'La liste des ingrédients ne peut pas être vide.' });
    }

    const result = await aiService.generateRecipes({ 
      ingredients: cleanIngredients, 
      preferences, 
      filters 
    });
    
    if (!result || !result.recipes) {
      throw new Error('Le service IA n\'a pas retourné de recettes valides.');
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};
