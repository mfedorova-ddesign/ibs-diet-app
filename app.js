// Recipes: name, meal type, ingredients, steps (used by meal planner and Recipes section)
var RECIPES = [
  { name: 'Oatmeal with banana and maple syrup', meal: 'breakfast', ingredients: ['40 g gluten-free oats', '1 small ripe banana, sliced', '1–2 tsp maple syrup', 'Water or lactose-free milk', 'Pinch of salt'], steps: ['Bring liquid and salt to a boil. Stir in oats, reduce heat, cook 5–7 min.', 'Top with banana and maple syrup.'] },
  { name: 'Scrambled eggs with spinach', meal: 'breakfast', ingredients: ['2 eggs', 'Handful spinach, well washed', '1 tsp olive oil or butter', 'Salt, pepper'], steps: ['Sauté spinach in oil until wilted. Beat eggs, add to pan, scramble over low heat until set. Season.'] },
  { name: 'Rice porridge (congee)', meal: 'breakfast', ingredients: ['50 g white rice', '400–500 ml water or broth', 'Small piece ginger (optional)', 'Salt'], steps: ['Rinse rice. Boil with water and ginger. Simmer 45–60 min, stirring, until thick. Season.'] },
  { name: 'Lactose-free yogurt with blueberries', meal: 'breakfast', ingredients: ['150 g plain lactose-free yogurt', 'Small handful blueberries', 'Optional: 1 tsp maple syrup'], steps: ['Spoon yogurt into a bowl. Top with blueberries and optional syrup.'] },
  { name: 'Toast with peanut butter', meal: 'breakfast', ingredients: ['1–2 slices sourdough or white bread', '1–2 tbsp natural peanut butter (no added sugar)'], steps: ['Toast bread. Spread with peanut butter.'] },
  { name: 'Grilled chicken breast with steamed rice', meal: 'lunch', ingredients: ['1 chicken breast', '80 g white rice, cooked', 'Olive oil, dried herbs, salt, pepper'], steps: ['Season chicken, grill or pan-fry until cooked through. Serve with steamed rice.'] },
  { name: 'Baked salmon with cucumber and rice', meal: 'lunch', ingredients: ['1 salmon fillet', '80 g rice, cooked', 'Few slices cucumber', 'Lemon, dill, olive oil'], steps: ['Place salmon on foil, drizzle oil, add dill. Bake at 180°C until done. Serve with rice and cucumber.'] },
  { name: 'Turkey and rice soup', meal: 'lunch', ingredients: ['100 g cooked turkey, shredded', '60 g rice', '500 ml low-FODMAP or homemade broth', 'Carrot, celery (if tolerated), salt, pepper'], steps: ['Bring broth to boil. Add rice and veg, simmer until rice is tender. Add turkey, season.'] },
  { name: 'Quinoa bowl with grilled zucchini', meal: 'lunch', ingredients: ['60 g quinoa, cooked', 'Half small zucchini, sliced', 'Olive oil, herbs', 'Optional: lemon juice'], steps: ['Toss zucchini in oil, grill or pan-fry. Serve over quinoa with herbs and lemon.'] },
  { name: 'Tuna salad with rice crackers', meal: 'lunch', ingredients: ['1 can tuna in water, drained', '1 tbsp light mayo or olive oil', 'Rice crackers', 'Lemon, salt, pepper'], steps: ['Flake tuna, mix with mayo or oil and lemon. Season. Serve with rice crackers.'] },
  { name: 'Grilled white fish with mashed potato', meal: 'dinner', ingredients: ['1 white fish fillet (e.g. cod, haddock)', '1 medium potato', 'Lactose-free milk or olive oil', 'Salt, pepper, herbs'], steps: ['Boil potato until tender, mash with milk or oil. Season fish, grill or bake. Serve together.'] },
  { name: 'Chicken stir-fry with rice', meal: 'dinner', ingredients: ['1 chicken breast, sliced', '80 g rice, cooked', 'Carrot, bell pepper, bok choy (low-FODMAP veg)', 'Tamari or soy, ginger, oil'], steps: ['Stir-fry chicken until cooked. Add veg, stir-fry. Add tamari and ginger. Serve over rice.'] },
  { name: 'Lean beef with carrots and rice', meal: 'dinner', ingredients: ['100 g lean beef', '1 small carrot, sliced', '80 g rice, cooked', 'Oil, salt, pepper'], steps: ['Pan-fry or grill beef to taste. Steam or boil carrot. Serve with rice.'] },
  { name: 'Baked cod with roasted potato and green beans', meal: 'dinner', ingredients: ['1 cod fillet', '1 medium potato, cubed', 'Small handful green beans', 'Olive oil, herbs'], steps: ['Toss potato in oil, roast at 200°C until golden. Bake cod with herbs. Steam beans. Serve.'] },
  { name: 'Lentil soup', meal: 'dinner', ingredients: ['60 g red lentils', '400 ml water or broth', 'Small carrot, diced', 'Turmeric, salt'], steps: ['Rinse lentils. Simmer with water, carrot and turmeric until soft. Blend if desired, season. Start with a small portion.'] },
  { name: 'Rice cakes with almond butter', meal: 'snack', ingredients: ['2 plain rice cakes', '1 tbsp almond butter'], steps: ['Spread almond butter on rice cakes.'] },
  { name: 'Ripe banana', meal: 'snack', ingredients: ['1 small ripe banana'], steps: ['Peel and eat. Often better tolerated when ripe.'] },
  { name: 'Strawberries', meal: 'snack', ingredients: ['Small handful strawberries'], steps: ['Wash and eat. Usually low-FODMAP in small servings.'] },
  { name: 'Plain rice crackers', meal: 'snack', ingredients: ['Plain rice crackers (no onion/garlic)'], steps: ['Serve as is.'] },
  { name: 'Carrot sticks with hummus', meal: 'snack', ingredients: ['Carrot sticks', '1–2 tbsp hummus'], steps: ['Serve carrot sticks with a small portion of hummus. Omit if you don’t tolerate legumes.'] },
];

var MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'];

function getRecipesByMeal(meal) {
  return RECIPES.filter(function (r) { return r.meal === meal; });
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
    day[meal] = picked[0] ? picked[0].name : '—';
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
    parts.push('<div class="plan-meal"><strong>' + label + ':</strong> ' + (day[meal] || '—') + '</div>');
  });
  return '<div class="plan-day"><h3>' + title + '</h3>' + parts.join('') + '</div>';
}

function renderPlanForDay() {
  var day = generateDay();
  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var today = dayNames[new Date().getDay()];
  return '<h3>Meal plan for ' + today + '</h3>' + renderDay(day, '').replace('<h3></h3>', '');
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
      var ing = (r.ingredients && r.ingredients.length) ? '<ul class="recipe-ingredients">' + r.ingredients.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>' : '';
      var steps = (r.steps && r.steps.length) ? '<ol class="recipe-steps">' + r.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' : '';
      html += '<article class="recipe-card"><span class="recipe-meal">' + meal + '</span><h3 class="recipe-title">' + r.name + '</h3>' + ing + steps + '</article>';
    });
  });
  list.innerHTML = html || '<p>No recipes loaded.</p>';
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
    planOutput.scrollIntoView({ behavior: 'smooth' });
  }

  if (btnGenerate && planOutput) btnGenerate.addEventListener('click', generatePlan);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
