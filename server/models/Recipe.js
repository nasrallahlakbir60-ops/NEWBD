const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingredients: [String],
  steps: [String],
  calories: Number,
  cuisine: String,
  difficulty: String,
  time: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
