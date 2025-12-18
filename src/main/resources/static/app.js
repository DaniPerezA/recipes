const searchBar = document.getElementById('search-bar');
const suggestions = document.getElementById('suggestions');
const selectedIngredients = document.getElementById('selected-ingredients');
const lookButton = document.getElementById('look-for-recipes');
const recipesDiv = document.getElementById('recipes');
const searchWrapper = document.querySelector('.search-wrapper');
let selected = [];
let allRecipes = [];
let currentPage = 1;
const pageSize = 4;
// Show/hide suggestions dropdown
function showSuggestions() {
    suggestions.classList.add('visible');
}
function hideSuggestions() {
    suggestions.classList.remove('visible');
    suggestions.innerHTML = '';
}
searchBar.addEventListener('input', async () => {
    const query = searchBar.value.trim();
    if (query.length < 2) {
        suggestions.innerHTML = '';
        return;
    }
    try {
        const res = await fetch(`/api/ingredients/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        suggestions.innerHTML = '';
        if (data.length > 0) {
            data.forEach(ing => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = ing.name;
                div.onclick = () => {
                    if (!selected.find(s => s.id === ing.id)) {
                        selected.push(ing);
                        renderSelected();
                    }
                    searchBar.value = '';
                    suggestions.innerHTML = '';
                    searchBar.focus();
                };
                suggestions.appendChild(div);
            });
            showSuggestions();
        }
        else {
            hideSuggestions();
        }
    }
    catch (error) {
        console.error('Error fetching suggestions:', error);
        hideSuggestions();
    }
});
function renderSelected() {
    selectedIngredients.innerHTML = '';
    selected.forEach(ing => {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.textContent = ing.name;
        const remove = document.createElement('span');
        remove.textContent = ' ×';
        remove.onclick = (e) => {
            e.stopPropagation();
            selected = selected.filter(s => s.id !== ing.id);
            renderSelected();
        };
        chip.appendChild(remove);
        selectedIngredients.appendChild(chip);
    });
}
lookButton.addEventListener('click', async () => {
    if (selected.length === 0) {
        alert('Select at least one ingredient.');
        return;
    }
    const ids = selected.map(s => s.id);
    try {
        const res = await fetch('/api/recipes/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ids)
        });
        allRecipes = await res.json();
        currentPage = 1;
        renderRecipes();
        hideSuggestions(); // Ensure dropdown is hidden after search
    }
    catch (error) {
        console.error('Error fetching recipes:', error);
    }
});
// Focus management: show suggestions only when search bar is focused
searchBar.addEventListener('focus', () => {
    if (searchBar.value.trim().length >= 2) {
        // Re-fetch if needed, but usually already shown from input
        // Optional: trigger re-search here if desired
    }
    showSuggestions(); // In case there are cached results
});
searchBar.addEventListener('blur', () => {
    // Delay to allow clicking a suggestion
    setTimeout(() => {
        hideSuggestions();
    }, 200);
});
// ESC key: clear input and hide suggestions
searchBar.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchBar.value = '';
        hideSuggestions();
        searchBar.blur();
    }
});
searchWrapper.addEventListener('click', (e) => {
    if (e.target !== searchBar) {
        searchBar.focus();
    }
});
// Initial state
hideSuggestions();
function renderRecipes() {
    recipesDiv.innerHTML = '';
    if (allRecipes.length === 0) {
        recipesDiv.textContent = 'No recipes found.';
        return;
    }
    const total = allRecipes.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, total);
    const topContainer = document.createElement('div');
    topContainer.className = 'pagination-container top';
    const showingText = document.createElement('div');
    showingText.className = 'showing-text';
    showingText.textContent = `Showing recipes ${start}-${end} of ${total}`;
    topContainer.appendChild(showingText);
    const topPagination = createPagination(totalPages);
    topContainer.appendChild(topPagination);
    recipesDiv.appendChild(topContainer);
    const recipeContainer = document.createElement('div');
    recipeContainer.className = 'recipe-container';
    const currentRecipes = allRecipes.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    currentRecipes.forEach(rec => {
        const div = document.createElement('div');
        div.className = 'recipe-card';
        div.innerHTML = `
            <h3>${rec.title}</h3>
            <img src="${rec.image}" alt="${rec.title}">
            <p>Rating: ${rec.ratings}</p>
            <p>Prep Time: ${rec.prep_time} min | Cook Time: ${rec.cook_time} min</p>
            <p>Ingredients: ${rec.ingredients.join(', ')}</p>
        `;
        recipeContainer.appendChild(div);
    });
    recipesDiv.appendChild(recipeContainer);
    const bottomPagination = createPagination(totalPages);
    const bottomContainer = document.createElement('div');
    bottomContainer.className = 'pagination-container bottom';
    bottomContainer.appendChild(bottomPagination);
    recipesDiv.appendChild(bottomContainer);
}
function createPagination(totalPages) {
    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    const first = document.createElement('button');
    first.textContent = '<<';
    first.disabled = currentPage === 1;
    first.onclick = () => { currentPage = 1; renderRecipes(); };
    pagination.appendChild(first);
    const prev = document.createElement('button');
    prev.textContent = '<';
    prev.disabled = currentPage === 1;
    prev.onclick = () => { currentPage--; renderRecipes(); };
    pagination.appendChild(prev);
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 3);
    if (endPage - startPage < 3) {
        startPage = Math.max(1, endPage - 3);
    }
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i.toString();
        pageBtn.className = i === currentPage ? 'active' : '';
        pageBtn.onclick = () => { currentPage = i; renderRecipes(); };
        pagination.appendChild(pageBtn);
    }
    const next = document.createElement('button');
    next.textContent = '>';
    next.disabled = currentPage === totalPages;
    next.onclick = () => { currentPage++; renderRecipes(); };
    pagination.appendChild(next);
    const last = document.createElement('button');
    last.textContent = '>>';
    last.disabled = currentPage === totalPages;
    last.onclick = () => { currentPage = totalPages; renderRecipes(); };
    pagination.appendChild(last);
    return pagination;
}
