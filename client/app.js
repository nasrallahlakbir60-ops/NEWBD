const $ingredients = document.getElementById('ingredients');
const $suggest = document.getElementById('suggest');
const $results = document.getElementById('results');

function renderSpinner() {
  $results.innerHTML = '<div class="spinner" aria-hidden="true"></div>';
}

function renderError(msg) {
  $results.innerHTML = `<div class="error-card"><strong>⚠️ Erreur:</strong> ${msg}</div>`;
}

function renderRecipes(data) {
  if (!data || !data.recipes || data.recipes.length === 0) {
    return renderError('Aucune recette n\'a pu être générée. Essayez d\'autres ingrédients.');
  }

  $results.innerHTML = data.recipes.map(r => `
    <article class="card">
      <h3>${r.title}</h3>
      <div class="badges">
        <span class="badge">🔥 ${r.difficulty}</span>
        <span class="badge">⏱️ ${r.time}</span>
        ${r.calories ? `<span class="badge">🥗 ${r.calories} kcal</span>` : ''}
      </div>
      <p>${r.description}</p>
      
      <details>
        <summary>🛒 Ingrédients (${r.ingredients.length})</summary>
        <ul>
          ${r.ingredients.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </details>

      <details>
        <summary>👨‍🍳 Étapes de préparation</summary>
        <ol>
          ${r.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>
      </details>

      ${r.chefTips ? `
        <div class="chef-tips">
          <strong>💡 Conseil du Chef :</strong> ${r.chefTips}
        </div>
      ` : ''}
    </article>
  `).join('');
}

async function suggest() {
  const raw = $ingredients.value.trim();
  const ingredients = raw.split(',').map(s => s.trim()).filter(Boolean);
  
  if (ingredients.length === 0) {
    return renderError('Veuillez entrer au moins un ingrédient (ex: tomate, poulet).');
  }

  renderSpinner();
  $suggest.disabled = true;
  $suggest.textContent = 'Recherche...';

  const prefs = { 
    cuisine: document.getElementById('cuisine').value 
  };
  
  const filters = { 
    vegan: !!document.getElementById('vegan').checked, 
    glutenFree: !!document.getElementById('glutenFree').checked, 
    maxTime: Number(document.getElementById('maxTime').value) || null 
  };

  try {
    const res = await fetch('/api/ai/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients, preferences: prefs, filters })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Erreur serveur');
    }

    const data = await res.json();
    renderRecipes(data);

    // Sauvegarde dans l'historique local
    const history = JSON.parse(localStorage.getItem('cb_history') || '[]');
    history.unshift({ ingredients, date: Date.now() });
    localStorage.setItem('cb_history', JSON.stringify(history.slice(0, 10)));

  } catch (err) {
    console.error('Fetch error:', err);
    renderError(err.message || 'Impossible de contacter le service IA. Vérifiez votre connexion.');
  } finally {
    $suggest.disabled = false;
    $suggest.textContent = 'Suggérer ✨';
  }
}

$suggest.addEventListener('click', suggest);
$ingredients.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') suggest();
});
