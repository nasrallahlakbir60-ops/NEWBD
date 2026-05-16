// --- CONFIGURATION ---
const STORAGE_KEYS = {
    recipes: 'cb_pro_recipes',
    favorites: 'cb_pro_favs',
    theme: 'cb_pro_theme',
};

const EMOJIS = {
    Plat: '🍽️',
    Entrée: '🥗',
    Dessert: '🍰',
    Soupe: '🥣',
    Boisson: '🥤',
};

const FALLBACK_IMAGES = {
    'Tarte aux pommes maison': 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=1200&q=80',
    'Soupe de tomates rôtées': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
    'Pasta Carbonara classique': 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=1200&q=80',
    'Salade Caesar maison': 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=1200&q=80',
    'Smoothie tropical': 'https://images.unsplash.com/photo-1525385133335-842822916523?auto=format&fit=crop&w=1200&q=80',
};

const defaultRecipes = [
    {
        id: 1,
        titre: 'Tarte aux pommes maison',
        description: 'Une tarte dorée et parfumée, aux pommes fondantes et à la cannelle.',
        categorie: 'Dessert',
        difficulte: 'moyen',
        preparation: 30,
        cuisson: 45,
        personnes: 6,
        createur: 'Marie',
        note: 4.5,
        votes: 12,
        date: '2026-04-12',
        ingredients: [
            { nom: 'Pâte brisée', qty: '1', unit: 'rouleau' },
            { nom: 'Pommes', qty: '5', unit: 'pièces' },
        ],
        etapes: ['Préchauffer le four à 200°C.', 'Étaler la pâte.', 'Couper les pommes.', 'Disposer les quartiers de pommes et enfourner.'],
    },
    {
        id: 2,
        titre: 'Soupe de tomates rôtées',
        description: 'Une soupe veloutée et savoureuse à base de tomates confites au four.',
        categorie: 'Soupe',
        difficulte: 'facile',
        preparation: 15,
        cuisson: 40,
        personnes: 4,
        createur: 'Ahmed',
        note: 4.8,
        votes: 7,
        date: '2026-04-02',
        ingredients: [
            { nom: 'Tomates', qty: '800', unit: 'g' },
            { nom: 'Ail', qty: '3', unit: 'gousses' },
        ],
        etapes: ['Rôtir les tomates.', 'Mixer le tout.', 'Ajouter de la crème et ajuster l’assaisonnement.'],
    },
    {
        id: 3,
        titre: 'Pasta Carbonara classique',
        description: 'La vraie carbonara romaine : oeufs, guanciale et pecorino.',
        categorie: 'Plat',
        difficulte: 'moyen',
        preparation: 10,
        cuisson: 15,
        personnes: 2,
        createur: 'Giulia',
        note: 4.9,
        votes: 23,
        date: '2026-03-27',
        ingredients: [
            { nom: 'Spaghettis', qty: '200', unit: 'g' },
            { nom: 'Guanciale', qty: '100', unit: 'g' },
        ],
        etapes: ['Cuire les pâtes.', 'Préparer la sauce aux œufs et fromage.', 'Mélanger hors du feu pour obtenir une texture onctueuse.'],
    },
    {
        id: 4,
        titre: 'Salade Caesar maison',
        description: 'La classique salade Caesar avec croûtons croustillants.',
        categorie: 'Entrée',
        difficulte: 'facile',
        preparation: 20,
        cuisson: 10,
        personnes: 4,
        createur: 'Sophie',
        note: 4.2,
        votes: 9,
        date: '2026-04-18',
        ingredients: [
            { nom: 'Laitue', qty: '1', unit: 'tête' },
            { nom: 'Parmesan', qty: '50', unit: 'g' },
        ],
        etapes: ['Laver la salade.', 'Préparer la sauce.', 'Assembler et parsemer de parmesan.'],
    },
    {
        id: 5,
        titre: 'Smoothie tropical',
        description: 'Un smoothie rafraîchissant à la mangue et coco.',
        categorie: 'Boisson',
        difficulte: 'facile',
        preparation: 5,
        cuisson: 0,
        personnes: 2,
        createur: 'Léa',
        note: 4.6,
        votes: 5,
        date: '2026-04-22',
        ingredients: [
            { nom: 'Mangue', qty: '1', unit: 'pièce' },
            { nom: 'Lait de coco', qty: '200', unit: 'ml' },
        ],
        etapes: ['Mixer les fruits.', 'Ajouter le lait de coco et servir frais.'],
    },
];

const appState = {
    recipes: getLocalData(STORAGE_KEYS.recipes, defaultRecipes),
    favorites: getLocalData(STORAGE_KEYS.favorites, []),
    currentCategory: 'all',
};

const SELECTORS = {
    pages: '.page',
    navButtons: '.nav-btn',
    filterChips: '.filter-chip',
    recipeGrid: 'recipe-grid',
    favoritesGrid: 'favorites-grid',
    recipeDetail: 'recipe-detail-content',
    toastContainer: 'toast-container',
    mainSearch: 'main-search',
    aiLoading: 'ai-loading',
    aiResults: 'ai-results',
    ingredientsList: 'f-ingredients-list',
    stepsList: 'f-steps-list',
    aiInput: 'ai-input',
};

window.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    initTheme();
    renderRecipes();
    initRecipeForm();
}

function getLocalData(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : fallback;
    } catch {
        return fallback;
    }
}

function saveLocalData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function showPage(pageId) {
    document.querySelectorAll(SELECTORS.pages).forEach(page => page.classList.remove('active'));
    document.querySelectorAll(SELECTORS.navButtons).forEach(button => button.classList.remove('active'));

    const page = document.getElementById(`page-${pageId}`);
    if (!page) return;

    page.classList.add('active');
    setActiveNav(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pageId === 'home') renderRecipes();
    if (pageId === 'favorites') renderFavorites();
    if (pageId === 'add-recipe') initRecipeForm();
}

function setActiveNav(pageId) {
    const pageKey = pageId.split('-')[0];
    const button = Array.from(document.querySelectorAll(SELECTORS.navButtons)).find(btn => btn.textContent.trim().toLowerCase().includes(pageKey));
    if (button) button.classList.add('active');
}

function toggleTheme() {
    const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = nextTheme === 'dark' ? 'dark' : '';
    saveLocalData(STORAGE_KEYS.theme, nextTheme);
}

function initTheme() {
    const theme = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
    if (theme === 'dark') document.body.dataset.theme = 'dark';
}

function renderRecipes(list = appState.recipes, containerId = SELECTORS.recipeGrid) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!list.length) {
        container.innerHTML = renderEmptyState('Aucune recette trouvée', 'Affinez la recherche ou ajoutez une nouvelle recette.');
        return;
    }

    container.innerHTML = list.map(createRecipeCard).join('');
}

function createRecipeCard(recipe) {
    const isFav = appState.favorites.includes(recipe.id);
    const imageUrl = getRecipeImage(recipe);
    const totalTime = recipe.preparation + recipe.cuisson;

    return `
        <article class="recipe-card" onclick="showRecipeDetail(${recipe.id})">
            <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(event, ${recipe.id})" aria-label="Favoris">
                ${isFav ? '❤️' : '🤍'}
            </button>
            <div class="card-image">
                <img src="${imageUrl}" alt="${recipe.titre}" loading="lazy" onerror="this.src='https://via.placeholder.com/800x600?text=${encodeURIComponent(recipe.categorie)}'">
            </div>
            <div class="card-content">
                <div class="card-tag">${recipe.categorie}</div>
                <h3 class="card-title">${recipe.titre}</h3>
                <p class="card-description">${recipe.description}</p>
                <div class="card-info">
                    <span>⏱ ${totalTime} min</span>
                    <span>👤 ${recipe.personnes} pers.</span>
                </div>
                <div class="card-footer">
                    <div class="rating">★ ${recipe.note.toFixed(1)}</div>
                    <div class="difficulty diff-${recipe.difficulte}">${recipe.difficulte}</div>
                </div>
            </div>
        </article>
    `;
}

function renderFavorites() {
    const favoriteRecipes = appState.recipes.filter(recipe => appState.favorites.includes(recipe.id));
    renderRecipes(favoriteRecipes, SELECTORS.favoritesGrid);
}

function renderEmptyState(title, subtitle) {
    return `
        <div class="empty-state">
            <h3>${title}</h3>
            <p>${subtitle}</p>
        </div>
    `;
}

function getRecipeImage(recipe) {
    return FALLBACK_IMAGES[recipe.titre] || `https://source.unsplash.com/800x600/?food,${encodeURIComponent(recipe.categorie.toLowerCase())}`;
}

function handleSearch() {
    const query = document.getElementById(SELECTORS.mainSearch).value.toLowerCase().trim();

    const filtered = appState.recipes.filter(recipe => {
        const matchesCategory = appState.currentCategory === 'all' || recipe.categorie === appState.currentCategory;
        const searchableText = [recipe.titre, recipe.description, ...recipe.ingredients.map(item => item.nom)].join(' ').toLowerCase();
        return matchesCategory && searchableText.includes(query);
    });

    renderRecipes(filtered);
}

function filterByCategory(button, category) {
    document.querySelectorAll(SELECTORS.filterChips).forEach(chip => chip.classList.remove('active'));
    button.classList.add('active');
    appState.currentCategory = category;
    handleSearch();
}

function toggleFavorite(event, recipeId) {
    event.stopPropagation();
    const index = appState.favorites.indexOf(recipeId);

    if (index >= 0) {
        appState.favorites.splice(index, 1);
        showToast('Retiré des favoris', 'info');
    } else {
        appState.favorites.push(recipeId);
        showToast('Ajouté aux favoris !', 'success');
    }

    saveLocalData(STORAGE_KEYS.favorites, appState.favorites);
    refreshCurrentView();
}

function refreshCurrentView() {
    if (document.getElementById('page-favorites').classList.contains('active')) {
        renderFavorites();
    } else {
        renderRecipes();
    }
}

function showRecipeDetail(recipeId) {
    const recipe = appState.recipes.find(item => item.id === recipeId);
    if (!recipe) return;

    const imageUrl = getRecipeImage(recipe).replace('800x600', '1200x800');
    const isFav = appState.favorites.includes(recipe.id);
    const totalTime = recipe.preparation + recipe.cuisson;

    document.getElementById(SELECTORS.recipeDetail).innerHTML = `
        <div class="detail-header animate-fade-up">
            <div class="detail-visual">
                <img src="${imageUrl}" alt="${recipe.titre}" loading="lazy">
            </div>
            <div class="detail-info">
                <div class="card-tag">${recipe.categorie}</div>
                <h1>${recipe.titre}</h1>
                <p class="detail-description">${recipe.description}</p>
                <div class="detail-meta-grid">
                    <div class="meta-item">
                        <span class="meta-label">Préparation</span>
                        <span class="meta-value">${recipe.preparation} min</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Cuisson</span>
                        <span class="meta-value">${recipe.cuisson} min</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Temps total</span>
                        <span class="meta-value">${totalTime} min</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Difficulté</span>
                        <span class="meta-value">${capitalize(recipe.difficulte)}</span>
                    </div>
                </div>
                <div class="detail-actions">
                    <button class="btn-primary" onclick="window.print()">Imprimer la recette</button>
                    <button class="nav-btn" style="border: 1px solid var(--border)" onclick="toggleFavorite(event, ${recipe.id})">
                        ${isFav ? '❤️ Enregistré' : '🤍 Ajouter aux favoris'}
                    </button>
                </div>
            </div>
        </div>
        <div class="detail-body animate-fade-up delay-1">
            <aside class="ingredients-card">
                <h2>Ingrédients</h2>
                <ul class="ingredients-list">
                    ${recipe.ingredients
                        .map(item => `
                            <li class="ingredient-row">
                                <span>${item.nom}</span>
                                <span class="ingredient-value">${item.qty} ${item.unit}</span>
                            </li>
                        `)
                        .join('')}
                </ul>
            </aside>
            <main>
                <h2>Préparation</h2>
                <div class="steps-list">
                    ${recipe.etapes
                        .map((step, index) => `
                            <div class="step-item">
                                <div class="step-number">${index + 1}</div>
                                <div class="step-content"><p>${step}</p></div>
                            </div>
                        `)
                        .join('')}
                </div>
            </main>
        </div>
    `;

    showPage('detail');
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function initRecipeForm() {
    const ingredientsList = document.getElementById(SELECTORS.ingredientsList);
    const stepsList = document.getElementById(SELECTORS.stepsList);

    if (ingredientsList) ingredientsList.innerHTML = '';
    if (stepsList) stepsList.innerHTML = '';

    addIngredientRow();
    addIngredientRow();
    addStepRow();
}

function addIngredientRow() {
    const container = document.getElementById(SELECTORS.ingredientsList);
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <input type="text" placeholder="Ingrédient" class="ing-nom">
        <input type="text" placeholder="Qté" class="ing-qty">
        <input type="text" placeholder="Unité" class="ing-unit">
        <button class="btn-icon" type="button" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(row);
}

function addStepRow() {
    const container = document.getElementById(SELECTORS.stepsList);
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <textarea placeholder="Décrivez l'étape..." class="step-txt"></textarea>
        <button class="btn-icon" type="button" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(row);
}

function saveNewRecipe() {
    const title = document.getElementById('f-title').value.trim();
    const description = document.getElementById('f-desc').value.trim();
    const category = document.getElementById('f-cat').value;
    const difficulty = document.getElementById('f-diff').value;
    const preparation = parseInt(document.getElementById('f-prep').value, 10) || 0;
    const cuisson = parseInt(document.getElementById('f-cook').value, 10) || 0;

    if (!title) return showToast('Le titre est requis', 'danger');

    const ingredients = Array.from(document.querySelectorAll('#f-ingredients-list .dynamic-row'))
        .map(row => {
            const nom = row.querySelector('.ing-nom')?.value.trim();
            if (!nom) return null;
            return {
                nom,
                qty: row.querySelector('.ing-qty')?.value.trim() || '-',
                unit: row.querySelector('.ing-unit')?.value.trim() || '',
            };
        })
        .filter(Boolean);

    const etapes = Array.from(document.querySelectorAll('.step-txt'))
        .map(field => field.value.trim())
        .filter(Boolean);

    if (!ingredients.length || !etapes.length) {
        return showToast('Ajoutez au moins un ingrédient et une étape', 'danger');
    }

    const newRecipe = {
        id: Date.now(),
        titre: title,
        description,
        categorie: category,
        difficulte: difficulty,
        preparation,
        cuisson,
        personnes: 4,
        createur: 'Moi',
        note: 5.0,
        votes: 1,
        date: new Date().toISOString().split('T')[0],
        ingredients,
        etapes,
    };

    appState.recipes.unshift(newRecipe);
    saveLocalData(STORAGE_KEYS.recipes, appState.recipes);
    showToast('Recette publiée avec succès !', 'success');
    setTimeout(() => showPage('home'), 1200);
}

function simulateAISearch() {
    const query = document.getElementById(SELECTORS.aiInput).value.trim().toLowerCase();
    if (!query) return showToast('Saisissez au moins un ingrédient', 'danger');

    const loading = document.getElementById(SELECTORS.aiLoading);
    const results = document.getElementById(SELECTORS.aiResults);

    loading.style.display = 'block';
    results.innerHTML = '';

    setTimeout(() => {
        loading.style.display = 'none';
        const ingredients = query.split(',').map(item => item.trim()).filter(Boolean);

        const matches = appState.recipes.filter(recipe => ingredients.some(term => {
            return recipe.titre.toLowerCase().includes(term) || recipe.ingredients.some(item => item.nom.toLowerCase().includes(term));
        }));

        if (!matches.length) {
            results.innerHTML = renderEmptyState('Aucune suggestion trouvée', 'Essayez avec tomate, poulet, fromage ou chocolat.');
            return;
        }

        results.innerHTML = `
            <div class="ai-results-header">
                <h3>Je vous propose ces recettes :</h3>
                <p>${matches.length} résultat(s)</p>
            </div>
            <div class="recipe-grid" id="ai-recipe-grid"></div>
        `;

        renderRecipes(matches, 'ai-recipe-grid');
    }, 1400);
}

function showToast(message, type = 'success') {
    const container = document.getElementById(SELECTORS.toastContainer);
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));

    setTimeout(() => {
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 3200);
}
