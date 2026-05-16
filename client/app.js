const $ingredients = document.getElementById('ingredients');
const $suggest = document.getElementById('suggest');
const $results = document.getElementById('results');

function renderSpinner(){
  $results.innerHTML = '<div class="spinner" aria-hidden></div>';
}

function renderError(msg){
  $results.innerHTML = `<div class="card"><strong>Erreur:</strong> ${msg}</div>`;
}

function renderRecipes(data){
  if (!data || !data.recipes) return renderError('Aucune recette reçue');
  $results.innerHTML = data.recipes.map(r=>`
    <article class="card">
      <h3>${r.title}</h3>
      <div class="badge">${r.difficulty}</div>
      <div class="badge">${r.time}</div>
      <p>${r.description}</p>
      <details>
        <summary>Ingrédients (${r.ingredients.length})</summary>
        <ul>${r.ingredients.map(i=>`<li>${i}</li>`).join('')}</ul>
      </details>
      <details>
        <summary>Étapes</summary>
        <ol>${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
      </details>
      <p><em>Conseil:</em> ${r.chefTips}</p>
    </article>
  `).join('');
}

async function suggest(){
  const raw = $ingredients.value.trim();
  const ingredients = raw.split(',').map(s=>s.trim()).filter(Boolean);
  if (ingredients.length === 0) return renderError('Entrez au moins un ingrédient.');

  renderSpinner();

  const prefs = { cuisine: document.getElementById('cuisine').value };
  const filters = { vegan: !!document.getElementById('vegan').checked, glutenFree: !!document.getElementById('glutenFree').checked, maxTime: Number(document.getElementById('maxTime').value)||null };

  try{
    const res = await fetch('/api/ai/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients, preferences: prefs, filters })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    renderRecipes(data);
    // save history
    const history = JSON.parse(localStorage.getItem('cb_history')||'[]');
    history.unshift({ ingredients, date: Date.now() });
    localStorage.setItem('cb_history', JSON.stringify(history.slice(0,20)));
  }catch(err){
    console.error(err);
    renderError('Échec de la requête IA');
  }
}

$suggest.addEventListener('click', suggest);
$ingredients.addEventListener('keydown', (e)=>{ if(e.key==='Enter') suggest(); });
