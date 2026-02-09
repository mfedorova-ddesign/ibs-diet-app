// Recipes: name, meal type, ingredients, steps, nutrition (per serving: kcal, g)
var RECIPES = [
  { name: 'Oatmeal with banana and maple syrup', meal: 'breakfast', ingredients: ['40 g gluten-free oats', '1 small ripe banana, sliced', '1–2 tsp maple syrup', 'Water or lactose-free milk', 'Pinch of salt'], steps: ['Bring liquid and salt to a boil. Stir in oats, reduce heat, cook 5–7 min.', 'Top with banana and maple syrup.'], nutrition: { calories: 285, protein: 8, carbs: 52, fat: 5, fiber: 6 } },
  { name: 'Scrambled eggs with spinach', meal: 'breakfast', ingredients: ['2 eggs', 'Handful spinach, well washed', '1 tsp olive oil or butter', 'Salt, pepper'], steps: ['Sauté spinach in oil until wilted. Beat eggs, add to pan, scramble over low heat until set. Season.'], nutrition: { calories: 220, protein: 14, carbs: 2, fat: 18, fiber: 1 } },
  { name: 'Rice porridge (congee)', meal: 'breakfast', ingredients: ['50 g white rice', '400–500 ml water or broth', 'Small piece ginger (optional)', 'Salt'], steps: ['Rinse rice. Boil with water and ginger. Simmer 45–60 min, stirring, until thick. Season.'], nutrition: { calories: 180, protein: 3, carbs: 40, fat: 0, fiber: 0 } },
  { name: 'Lactose-free yogurt with blueberries', meal: 'breakfast', ingredients: ['150 g plain lactose-free yogurt', 'Small handful blueberries', 'Optional: 1 tsp maple syrup'], steps: ['Spoon yogurt into a bowl. Top with blueberries and optional syrup.'], nutrition: { calories: 145, protein: 8, carbs: 18, fat: 4, fiber: 1 } },
  { name: 'Toast with peanut butter', meal: 'breakfast', ingredients: ['1–2 slices sourdough or white bread', '1–2 tbsp natural peanut butter (no added sugar)'], steps: ['Toast bread. Spread with peanut butter.'], nutrition: { calories: 320, protein: 12, carbs: 28, fat: 18, fiber: 2 } },
  { name: 'Grilled chicken breast with steamed rice', meal: 'lunch', ingredients: ['1 chicken breast', '80 g white rice, cooked', 'Olive oil, dried herbs, salt, pepper'], steps: ['Season chicken, grill or pan-fry until cooked through. Serve with steamed rice.'], nutrition: { calories: 420, protein: 42, carbs: 45, fat: 8, fiber: 1 } },
  { name: 'Baked salmon with cucumber and rice', meal: 'lunch', ingredients: ['1 salmon fillet', '80 g rice, cooked', 'Few slices cucumber', 'Lemon, dill, olive oil'], steps: ['Place salmon on foil, drizzle oil, add dill. Bake at 180°C until done. Serve with rice and cucumber.'], nutrition: { calories: 465, protein: 35, carbs: 42, fat: 18, fiber: 1 } },
  { name: 'Turkey and rice soup', meal: 'lunch', ingredients: ['100 g cooked turkey, shredded', '60 g rice', '500 ml low-FODMAP or homemade broth', 'Carrot, celery (if tolerated), salt, pepper'], steps: ['Bring broth to boil. Add rice and veg, simmer until rice is tender. Add turkey, season.'], nutrition: { calories: 285, protein: 28, carbs: 28, fat: 4, fiber: 1 } },
  { name: 'Quinoa bowl with grilled zucchini', meal: 'lunch', ingredients: ['60 g quinoa, cooked', 'Half small zucchini, sliced', 'Olive oil, herbs', 'Optional: lemon juice'], steps: ['Toss zucchini in oil, grill or pan-fry. Serve over quinoa with herbs and lemon.'], nutrition: { calories: 245, protein: 9, carbs: 32, fat: 9, fiber: 4 } },
  { name: 'Tuna salad with rice crackers', meal: 'lunch', ingredients: ['1 can tuna in water, drained', '1 tbsp light mayo or olive oil', 'Rice crackers', 'Lemon, salt, pepper'], steps: ['Flake tuna, mix with mayo or oil and lemon. Season. Serve with rice crackers.'], nutrition: { calories: 260, protein: 28, carbs: 18, fat: 8, fiber: 1 } },
  { name: 'Grilled white fish with mashed potato', meal: 'dinner', ingredients: ['1 white fish fillet (e.g. cod, haddock)', '1 medium potato', 'Lactose-free milk or olive oil', 'Salt, pepper, herbs'], steps: ['Boil potato until tender, mash with milk or oil. Season fish, grill or bake. Serve together.'], nutrition: { calories: 380, protein: 32, carbs: 42, fat: 10, fiber: 3 } },
  { name: 'Chicken stir-fry with rice', meal: 'dinner', ingredients: ['1 chicken breast, sliced', '80 g rice, cooked', 'Carrot, bell pepper, bok choy (low-FODMAP veg)', 'Tamari or soy, ginger, oil'], steps: ['Stir-fry chicken until cooked. Add veg, stir-fry. Add tamari and ginger. Serve over rice.'], nutrition: { calories: 435, protein: 40, carbs: 48, fat: 9, fiber: 2 } },
  { name: 'Lean beef with carrots and rice', meal: 'dinner', ingredients: ['100 g lean beef', '1 small carrot, sliced', '80 g rice, cooked', 'Oil, salt, pepper'], steps: ['Pan-fry or grill beef to taste. Steam or boil carrot. Serve with rice.'], nutrition: { calories: 445, protein: 38, carbs: 48, fat: 10, fiber: 2 } },
  { name: 'Baked cod with roasted potato and green beans', meal: 'dinner', ingredients: ['1 cod fillet', '1 medium potato, cubed', 'Small handful green beans', 'Olive oil, herbs'], steps: ['Toss potato in oil, roast at 200°C until golden. Bake cod with herbs. Steam beans. Serve.'], nutrition: { calories: 365, protein: 32, carbs: 42, fat: 8, fiber: 4 } },
  { name: 'Lentil soup', meal: 'dinner', ingredients: ['60 g red lentils', '400 ml water or broth', 'Small carrot, diced', 'Turmeric, salt'], steps: ['Rinse lentils. Simmer with water, carrot and turmeric until soft. Blend if desired, season. Start with a small portion.'], nutrition: { calories: 245, protein: 14, carbs: 42, fat: 1, fiber: 8 } },
  { name: 'Rice cakes with almond butter', meal: 'snack', ingredients: ['2 plain rice cakes', '1 tbsp almond butter'], steps: ['Spread almond butter on rice cakes.'], nutrition: { calories: 165, protein: 4, carbs: 18, fat: 9, fiber: 1 } },
  { name: 'Ripe banana', meal: 'snack', ingredients: ['1 small ripe banana'], steps: ['Peel and eat. Often better tolerated when ripe.'], nutrition: { calories: 90, protein: 1, carbs: 23, fat: 0, fiber: 3 } },
  { name: 'Strawberries', meal: 'snack', ingredients: ['Small handful strawberries'], steps: ['Wash and eat. Usually low-FODMAP in small servings.'], nutrition: { calories: 35, protein: 0, carbs: 8, fat: 0, fiber: 2 } },
  { name: 'Plain rice crackers', meal: 'snack', ingredients: ['Plain rice crackers (no onion/garlic)'], steps: ['Serve as is.'], nutrition: { calories: 70, protein: 1, carbs: 14, fat: 1, fiber: 0 } },
  { name: 'Carrot sticks with hummus', meal: 'snack', ingredients: ['Carrot sticks', '1–2 tbsp hummus'], steps: ['Serve carrot sticks with a small portion of hummus. Omit if you don’t tolerate legumes.'], nutrition: { calories: 95, protein: 3, carbs: 10, fat: 5, fiber: 3 } },
];

var MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'];

function recipeSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s+/g, '-');
}

function getRecipeByName(name) {
  return RECIPES.filter(function (r) { return r.name === name; })[0];
}

function shortDescription(recipe) {
  if (!recipe) return '';
  var text = (recipe.steps && recipe.steps[0]) ? recipe.steps[0] : (recipe.ingredients && recipe.ingredients[0]) ? recipe.ingredients[0] : '';
  return text.length > 85 ? text.slice(0, 82) + '…' : text;
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getRecipesByMeal(meal) {
  return RECIPES.filter(function (r) { return r.meal === meal; });
}

function sumNutrition(recipes) {
  var out = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  recipes.forEach(function (r) {
    if (r && r.nutrition) {
      out.calories += r.nutrition.calories || 0;
      out.protein += r.nutrition.protein || 0;
      out.carbs += r.nutrition.carbs || 0;
      out.fat += r.nutrition.fat || 0;
      out.fiber += r.nutrition.fiber || 0;
    }
  });
  return out;
}

function formatNutritionPills(n) {
  if (!n || (n.calories === 0 && n.protein === 0)) return '';
  var parts = [
    '<span class="nutrition-pill nutrition-cal">' + (n.calories || 0) + ' kcal</span>',
    '<span class="nutrition-pill nutrition-protein">' + (n.protein || 0) + 'g protein</span>',
    '<span class="nutrition-pill nutrition-carbs">' + (n.carbs || 0) + 'g carbs</span>',
    '<span class="nutrition-pill nutrition-fat">' + (n.fat || 0) + 'g fat</span>',
    '<span class="nutrition-pill nutrition-fiber">' + (n.fiber || 0) + 'g fiber</span>'
  ];
  return '<div class="nutrition-row">' + parts.join('') + '</div>';
}

function formatNutritionInline(n) {
  if (!n || (n.calories === 0 && n.protein === 0)) return '';
  var parts = [(n.calories || 0) + ' kcal', (n.protein || 0) + 'g protein', (n.carbs || 0) + 'g carbs', (n.fat || 0) + 'g fat', (n.fiber || 0) + 'g fiber'];
  return parts.join(' · ');
}

function formatNutritionInlineHtml(n) {
  if (!n || (n.calories === 0 && n.protein === 0)) return '';
  var sep = ' <span class="nut-sep">·</span> ';
  var parts = [
    '<span class="nut-cal">' + (n.calories || 0) + ' kcal</span>',
    '<span class="nut-protein">' + (n.protein || 0) + 'g protein</span>',
    '<span class="nut-carbs">' + (n.carbs || 0) + 'g carbs</span>',
    '<span class="nut-fat">' + (n.fat || 0) + 'g fat</span>',
    '<span class="nut-fiber">' + (n.fiber || 0) + 'g fiber</span>'
  ];
  return parts.join(sep);
}

function pickRandom(arr, count) {
  var copy = arr.slice(), out = [], n = Math.min(count, copy.length);
  for (var i = 0; i < n; i++) {
    var idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function generateDay() {
  var day = {};
  MEAL_ORDER.forEach(function (meal) {
    var options = getRecipesByMeal(meal), picked = pickRandom(options, 1);
    day[meal] = picked[0] ? picked[0] : null;
  });
  return day;
}

function generateWeek() {
  var week = [];
  for (var i = 0; i < 7; i++) week.push(generateDay());
  return week;
}

function renderDay(day, title) {
  var parts = [];
  MEAL_ORDER.forEach(function (meal) {
    var label = meal.charAt(0).toUpperCase() + meal.slice(1);
    var r = day[meal];
    var dishHtml;
    if (r && r.name) {
      var nameEsc = escapeHtml(r.name);
      dishHtml = '<button type="button" class="plan-dish" data-recipe-name="' + nameEsc + '">' + nameEsc + '</button>';
    } else {
      dishHtml = '—';
    }
    parts.push('<div class="plan-meal"><strong>' + label + ':</strong> ' + dishHtml + '</div>');
  });
  var recipes = MEAL_ORDER.map(function (m) { return day[m]; }).filter(Boolean);
  var dayTotal = sumNutrition(recipes);
  var nutritionLine = (recipes.length > 0) ? '<div class="plan-day-nutrition">' + formatNutritionInlineHtml(dayTotal) + '</div>' : '';
  return '<div class="plan-day"><h3>' + title + '</h3>' + parts.join('') + nutritionLine + '</div>';
}

function renderPlanForDay() {
  var day = generateDay();
  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var today = dayNames[new Date().getDay()];
  return '<h3>Meal plan for ' + today + '</h3>' + renderDay(day, '').replace('<h3></h3>', '');
}

function getOrCreateRecipeModal() {
  var modal = document.getElementById('recipe-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'recipe-modal';
    modal.className = 'recipe-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = '<div class="recipe-modal-backdrop"></div><div class="recipe-modal-card"><button type="button" class="recipe-modal-close" aria-label="Close">×</button><div class="recipe-modal-body"></div></div>';
    document.body.appendChild(modal);
    modal.querySelector('.recipe-modal-backdrop').addEventListener('click', closeRecipeModal);
    modal.querySelector('.recipe-modal-close').addEventListener('click', closeRecipeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-visible')) closeRecipeModal();
    });
  }
  return modal;
}

function buildRecipeModalBodyHtml(recipe) {
  if (!recipe) return '';
  var ing = (recipe.ingredients && recipe.ingredients.length)
    ? '<ul class="recipe-modal-ingredients">' + recipe.ingredients.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') + '</ul>'
    : '';
  var steps = (recipe.steps && recipe.steps.length)
    ? '<ol class="recipe-modal-steps">' + recipe.steps.map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') + '</ol>'
    : '';
  var mealLabel = recipe.meal ? recipe.meal.charAt(0).toUpperCase() + recipe.meal.slice(1) : '';
  var nutritionHtml = recipe.nutrition ? '<div class="recipe-modal-nutrition">' + formatNutritionInlineHtml(recipe.nutrition) + '</div>' : '';
  return '<span class="recipe-modal-meal">' + escapeHtml(mealLabel) + '</span><h2 class="recipe-modal-title">' + escapeHtml(recipe.name) + '</h2>' + ing + steps + nutritionHtml;
}

function openRecipeModal(recipe) {
  if (!recipe) return;
  var modal = getOrCreateRecipeModal();
  var body = modal.querySelector('.recipe-modal-body');
  if (body) body.innerHTML = buildRecipeModalBodyHtml(recipe);
  modal.classList.add('is-visible');
  modal.setAttribute('aria-hidden', 'false');
  modal.querySelector('.recipe-modal-close').focus();
}

function closeRecipeModal() {
  var modal = document.getElementById('recipe-modal');
  if (modal) {
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function setupPlanDishClicks(container) {
  if (!container) return;
  container.querySelectorAll('.plan-dish').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var recipe = getRecipeByName(btn.getAttribute('data-recipe-name'));
      openRecipeModal(recipe);
    });
  });
}

function renderPlanForWeek() {
  var week = generateWeek();
  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var html = '<h3>Meal plan for the week</h3>';
  week.forEach(function (day, i) { html += renderDay(day, dayNames[i]); });
  return html;
}

function renderRecipes() {
  var list = document.getElementById('recipes-list');
  if (!list) return;
  var html = '';
  MEAL_ORDER.forEach(function (meal) {
    getRecipesByMeal(meal).forEach(function (r) {
      var slug = recipeSlug(r.name);
      var desc = escapeHtml(shortDescription(r));
      html += '<article class="recipe-list-item" id="recipe-' + slug + '" data-recipe-name="' + escapeHtml(r.name) + '" role="button" tabindex="0"><span class="recipe-list-meal">' + meal + '</span><h3 class="recipe-list-title">' + escapeHtml(r.name) + '</h3><p class="recipe-list-desc">' + desc + '</p></article>';
    });
  });
  list.innerHTML = html || '<p>No recipes loaded.</p>';
  list.querySelectorAll('.recipe-list-item').forEach(function (el) {
    var openModal = function () {
      openRecipeModal(getRecipeByName(el.getAttribute('data-recipe-name')));
    };
    el.addEventListener('click', openModal);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
    });
  });
  if (location.hash) {
    var el = document.getElementById(location.hash.slice(1));
    if (el) setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  }
}

function init() {
  renderRecipes();
  var planOutput = document.getElementById('plan-output');
  var btnGenerate = document.getElementById('btn-generate');

  function getSelectedPlanType() {
    var checked = document.querySelector('input[name="plan-type"]:checked');
    return checked ? checked.value : 'day';
  }

  function generatePlan() {
    var type = getSelectedPlanType();
    var html = type === 'week' ? renderPlanForWeek() : renderPlanForDay();
    planOutput.innerHTML = html;
    setupPlanDishClicks(planOutput);
    planOutput.scrollIntoView({ behavior: 'smooth' });
  }

  if (btnGenerate && planOutput) btnGenerate.addEventListener('click', generatePlan);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
