const axios = require('axios');

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.warn('OPENAI_API_KEY not set — AI calls will fail until provided');
}

function buildPrompt({ ingredients, preferences, filters }){
  const ing = ingredients.join(', ');
  const prefs = JSON.stringify(preferences || {});
  const fl = JSON.stringify(filters || {});

  return `Tu es un chef étoilé Michelin et nutritionniste expert. Propose entre 3 et 5 recettes réalistes, délicieuses et simples à cuisiner à partir des ingrédients suivants: ${ing}.\n
Respecte les préférences et filtres suivants: ${prefs} | ${fl}.\n
Retourne uniquement un JSON valide avec ce schéma:\n{
  "recipes": [
    {
      "title": "",
      "description": "",
      "difficulty": "easy|medium|hard",
      "time": "45 min",
      "calories": "",
      "ingredients": [""],
      "missingIngredients": [""],
      "steps": [""],
      "chefTips": ""
    }
  ]
}
Ne renvoie aucun texte hors du JSON. Utilise un français naturel mais respecte le JSON.`;
}

exports.generateRecipes = async ({ ingredients, preferences, filters }) => {
  const prompt = buildPrompt({ ingredients, preferences, filters });

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful chef assistant that returns strict JSON.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.8,
    max_tokens: 900
  };

  try {
    const r = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const text = r.data.choices?.[0]?.message?.content || r.data.choices?.[0]?.text || '';
    // try parse JSON
    try {
      const json = JSON.parse(text);
      return json;
    } catch (parseErr) {
      // attempt to extract JSON block
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
      throw new Error('AI returned non-JSON response');
    }
  } catch (err) {
    console.error('AI service error', err?.response?.data || err.message);
    throw new Error('Failed to generate recipes');
  }
};
