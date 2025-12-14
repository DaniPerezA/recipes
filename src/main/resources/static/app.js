const searchBar = document.getElementById('search-bar');
const suggestions = document.getElementById('suggestions');
const selectedIngredients = document.getElementById('selected-ingredients');
const lookButton = document.getElementById('look-for-recipes');
const recipesDiv = document.getElementById('recipes');
let selected = [];
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
            };
            suggestions.appendChild(div);
        });
    }
    catch (error) {
        console.error('Error fetching suggestions:', error);
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
        remove.onclick = () => {
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
        const recipes = await res.json();
        recipesDiv.innerHTML = '';
        recipes.forEach(rec => {
            const div = document.createElement('div');
            div.className = 'recipe-card';
            div.innerHTML = `
                <h3>${rec.title}</h3>
                <img src="${rec.image}" alt="${rec.title}" style="max-width: 200px;">
                <p>Rating: ${rec.ratings}</p>
                <p>Prep Time: ${rec.prep_time} min | Cook Time: ${rec.cook_time} min</p>
                <p>Ingredients: ${rec.ingredients.join(', ')}</p>
            `;
            recipesDiv.appendChild(div);
        });
    }
    catch (error) {
        console.error('Error fetching recipes:', error);
    }
});
