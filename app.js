// Recipes are loaded from my-recipes.json only
var RECIPES = [];
var PERSONAL_RECIPES = [];  // Only these are used for meal plan generation
var MEAL_ORDER = ['breakfast', 'lunch/dinner', 'snack'];  // for Recipes page
var PLAN_MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'];  // for meal plan display

// 3-day reintroduction: one random dish per day gets this adjustment (small → medium → large)
var REINTRODUCTION_GRAINS = [
  'Add 20g white bread on the side (or a small piece)',
  'Add 40g white bread or a small portion of pasta/spaghetti',
  'Add 60g white bread or a larger portion of grains'
];
var REINTRODUCTION_LACTOSE = [
  'Use normal milk instead of lactose-free in this dish (small amount)',
  'Use normal milk instead of lactose-free (medium amount)',
  'Use normal milk instead of lactose-free (larger amount)'
];

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

function formatMealLabel(meal) {
  if (meal === 'lunch/dinner') return 'Lunch / Dinner';
  return meal ? meal.charAt(0).toUpperCase() + meal.slice(1) : '';
}

// For plan only: use personal recipes; lunch and dinner share pool "lunch/dinner", no repeat same day
function getRecipesForPlan(meal) {
  if (meal === 'lunch' || meal === 'dinner') {
    return PERSONAL_RECIPES.filter(function (r) { return r.meal === 'lunch/dinner'; });
  }
  return PERSONAL_RECIPES.filter(function (r) { return r.meal === meal; });
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
  var lunchDinnerPool = getRecipesForPlan('lunch').slice();
  var lunchPicked = pickRandom(lunchDinnerPool, 1)[0] || null;
  var dinnerPicked = null;
  if (lunchPicked && lunchDinnerPool.length > 1) {
    var rest = lunchDinnerPool.filter(function (r) { return r !== lunchPicked; });
    dinnerPicked = pickRandom(rest, 1)[0] || null;
  } else if (lunchPicked && lunchDinnerPool.length === 1) {
    dinnerPicked = null;
  }
  day.breakfast = pickRandom(getRecipesForPlan('breakfast'), 1)[0] || null;
  day.lunch = lunchPicked;
  day.dinner = dinnerPicked;
  day.snack = pickRandom(getRecipesForPlan('snack'), 1)[0] || null;
  return day;
}

function generateWeek() {
  var week = [];
  for (var i = 0; i < 7; i++) week.push(generateDay());
  return week;
}

function renderDay(day, title) {
  return renderDayCore(day, title, null);
}

function renderDayCore(day, title, adjustmentForDay) {
  var parts = [];
  PLAN_MEAL_ORDER.forEach(function (meal) {
    var label = meal.charAt(0).toUpperCase() + meal.slice(1);
    var r = day[meal];
    var dishHtml;
    if (r && r.name) {
      var nameEsc = escapeHtml(r.name);
      var dataAdd = (adjustmentForDay && adjustmentForDay.meal === meal && adjustmentForDay.text)
        ? ' data-additions="' + escapeHtml(adjustmentForDay.text) + '"'
        : '';
      var addClass = (adjustmentForDay && adjustmentForDay.meal === meal) ? ' plan-dish-with-addition' : '';
      dishHtml = '<button type="button" class="plan-dish' + addClass + '" data-recipe-name="' + nameEsc + '"' + dataAdd + '>' + nameEsc + '</button>';
    } else {
      dishHtml = '—';
    }
    parts.push('<div class="plan-meal"><strong>' + label + ':</strong> ' + dishHtml + '</div>');
  });
  var recipes = PLAN_MEAL_ORDER.map(function (m) { return day[m]; }).filter(Boolean);
  var dayTotal = sumNutrition(recipes);
  var nutritionLine = (recipes.length > 0) ? '<div class="plan-day-nutrition">' + formatNutritionInlineHtml(dayTotal) + '</div>' : '';
  return '<div class="plan-day"><h3>' + title + '</h3>' + parts.join('') + nutritionLine + '</div>';
}

function generate3DayPlan() {
  return [generateDay(), generateDay(), generateDay()];
}

function pickRandomMealWithRecipe(day) {
  var available = PLAN_MEAL_ORDER.filter(function (m) { return day[m] && day[m].name; });
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

function get3DayAdjustments(days, addGrains, addLactose) {
  var out = [];
  for (var i = 0; i < 3; i++) {
    var day = days[i];
    var meal = day ? pickRandomMealWithRecipe(day) : null;
    var parts = [];
    if (addGrains && REINTRODUCTION_GRAINS[i]) parts.push(REINTRODUCTION_GRAINS[i]);
    if (addLactose && REINTRODUCTION_LACTOSE[i]) parts.push(REINTRODUCTION_LACTOSE[i]);
    var text = parts.length ? parts.join('. ') : '';
    out.push(meal && text ? { meal: meal, text: text } : null);
  }
  return out;
}

function render3DayPlan(days, addGrains, addLactose) {
  var dayLabels = ['Day 1', 'Day 2', 'Day 3'];
  var html = '<h3>3-day reintroduction plan</h3>';
  var adjustments = (addGrains || addLactose) ? get3DayAdjustments(days, addGrains, addLactose) : [];
  days.forEach(function (day, i) {
    var adj = (adjustments[i] && adjustments[i].text) ? adjustments[i] : null;
    html += renderDayCore(day, dayLabels[i], adj);
  });
  return html;
}

var currentPlan = null;
var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function renderPlanFromData(plan) {
  if (!plan || !plan.days || !plan.days.length) return '';
  var title = plan.type === 'week'
    ? '<h3>Meal plan for the week</h3>'
    : '<h3>Meal plan for ' + dayNames[new Date().getDay()] + '</h3>';
  var daysHtml = plan.days.map(function (day, i) {
    return renderDay(day, plan.type === 'week' ? dayNames[i] : '');
  }).join('');
  return title + daysHtml;
}

function renderPlanForDay() {
  var day = generateDay();
  return renderPlanFromData({ type: 'day', days: [day] });
}

function renderPlanForWeek() {
  var week = generateWeek();
  return renderPlanFromData({ type: 'week', days: week });
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

function buildRecipeModalBodyHtml(recipe, additions) {
  if (!recipe) return '';
  var ing = (recipe.ingredients && recipe.ingredients.length)
    ? '<ul class="recipe-modal-ingredients">' + recipe.ingredients.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') + '</ul>'
    : '';
  var steps = (recipe.steps && recipe.steps.length)
    ? '<ol class="recipe-modal-steps">' + recipe.steps.map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') + '</ol>'
    : '';
  var mealLabel = formatMealLabel(recipe.meal);
  var nutritionHtml = recipe.nutrition ? '<div class="recipe-modal-nutrition">' + formatNutritionInlineHtml(recipe.nutrition) + '</div>' : '';
  var additionsBlock = additions
    ? '<div class="recipe-modal-additions"><span class="recipe-modal-additions-label">Update in this plan</span> ' + escapeHtml(additions) + '</div>'
    : '';
  return '<span class="recipe-modal-meal">' + escapeHtml(mealLabel) + '</span><h2 class="recipe-modal-title">' + escapeHtml(recipe.name) + '</h2>' + additionsBlock + ing + steps + nutritionHtml;
}

function openRecipeModal(recipe, additions) {
  if (!recipe) return;
  var modal = getOrCreateRecipeModal();
  var body = modal.querySelector('.recipe-modal-body');
  if (body) body.innerHTML = buildRecipeModalBodyHtml(recipe, additions || '');
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
      var additions = btn.getAttribute ? btn.getAttribute('data-additions') : null;
      openRecipeModal(recipe, additions);
    });
  });
}

function renderPlanForWeek() {
  var week = generateWeek();
  return renderPlanFromData({ type: 'week', days: week });
}

function getGrocerySectionHtml(plan) {
  var scope = plan && plan.type === 'week' ? 'for the week' : 'for today';
  return '<div id="grocery-section" class="grocery-section">' +
    '<h3 class="grocery-heading">Grocery list ' + scope + '</h3>' +
    '<div class="grocery-controls">' +
    '<label for="grocery-people">Number of people</label>' +
    '<select id="grocery-people" class="grocery-people">' +
    '<option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option>' +
    '</select>' +
    '<button type="button" id="btn-grocery-list" class="btn btn-primary">Generate grocery list</button>' +
    '</div>' +
    '<div id="grocery-list" class="grocery-list" aria-live="polite"></div>' +
    '</div>';
}

function parseIngredient(str) {
  if (!str || typeof str !== 'string') return null;
  var s = str.trim();
  var amount = 1;
  var unit = '';
  var name = s;
  var numMatch = s.match(/^(\d+(?:\.\d+)?|\d+\/\d+)\s*/);
  if (numMatch) {
    var numStr = numMatch[1];
    amount = numStr.indexOf('/') !== -1
      ? parseInt(numStr.split('/')[0], 10) / parseInt(numStr.split('/')[1], 10)
      : parseFloat(numStr);
    s = s.slice(numMatch[0].length).trim();
  }
  var unitMatch = s.match(/^(g|kg|ml|L|l|tbsp|tsp|oz|cup|cups)\s+/i);
  if (unitMatch) {
    unit = unitMatch[1];
    if (unit.toLowerCase() === 'l') unit = 'L';
    s = s.slice(unitMatch[0].length).trim();
  }
  name = s || (unit ? 'ingredient' : '');
  if (!name && !unit) return null;
  return { amount: amount, unit: unit, name: name || str };
}

function roundAmount(n) {
  if (n >= 100) return Math.round(n);
  if (n >= 10) return Math.round(n * 2) / 2;
  if (n >= 1) return Math.round(n * 2) / 2;
  if (n >= 0.25) return Math.round(n * 4) / 4;
  return n;
}

function formatIngredientLine(amount, unit, name) {
  if (amount <= 0) return name;
  var a = roundAmount(amount);
  if (unit) return a + ' ' + unit + ' ' + name;
  if (a === 1) return name;
  return a + ' ' + name;
}

function buildGroceryList(plan, people) {
  if (!plan || !plan.days || !people || people < 1) return [];
  var map = {};
  plan.days.forEach(function (day) {
    PLAN_MEAL_ORDER.forEach(function (meal) {
      var r = day[meal];
      if (!r || !r.ingredients) return;
      r.ingredients.forEach(function (ingStr) {
        var parsed = parseIngredient(ingStr);
        if (!parsed) return;
        var key = (parsed.unit || '') + '|' + parsed.name.toLowerCase();
        if (!map[key]) map[key] = { amount: 0, unit: parsed.unit, name: parsed.name };
        var scale = (parsed.unit || parsed.amount !== 1) ? people : 1;
        map[key].amount += parsed.amount * scale;
      });
    });
  });
  return Object.keys(map).sort().map(function (k) {
    var o = map[k];
    return formatIngredientLine(o.amount, o.unit, o.name);
  });
}

function setupGroceryListButton(container) {
  if (!container) return;
  var btn = container.querySelector('#btn-grocery-list');
  var listEl = container.querySelector('#grocery-list');
  var peopleEl = container.querySelector('#grocery-people');
  if (!btn || !listEl) return;
  btn.addEventListener('click', function () {
    var people = parseInt(peopleEl.value, 10) || 1;
    var items = buildGroceryList(currentPlan, people);
    if (items.length === 0) {
      listEl.innerHTML = '<p class="grocery-empty">No ingredients in the current plan.</p>';
      return;
    }
    listEl.innerHTML = '<ul class="grocery-items">' + items.map(function (item) {
      return '<li>' + escapeHtml(item) + '</li>';
    }).join('') + '</ul>';
  });
}

function renderRecipes() {
  var list = document.getElementById('recipes-list');
  if (!list) return;
  var html = '';
  MEAL_ORDER.forEach(function (meal) {
    getRecipesByMeal(meal).forEach(function (r) {
      var slug = recipeSlug(r.name);
      var desc = escapeHtml(shortDescription(r));
      html += '<article class="recipe-list-item" id="recipe-' + slug + '" data-recipe-name="' + escapeHtml(r.name) + '" role="button" tabindex="0"><span class="recipe-list-meal">' + formatMealLabel(meal) + '</span><h3 class="recipe-list-title">' + escapeHtml(r.name) + '</h3><p class="recipe-list-desc">' + desc + '</p></article>';
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

function normalizeRecipe(r) {
  if (!r || typeof r.name !== 'string' || typeof r.meal !== 'string') return null;
  return {
    name: r.name,
    meal: r.meal,
    ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
    steps: Array.isArray(r.steps) ? r.steps : [],
    nutrition: r.nutrition && typeof r.nutrition === 'object'
      ? {
          calories: Number(r.nutrition.calories) || 0,
          protein: Number(r.nutrition.protein) || 0,
          carbs: Number(r.nutrition.carbs) || 0,
          fat: Number(r.nutrition.fat) || 0,
          fiber: Number(r.nutrition.fiber) || 0
        }
      : { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  };
}

function startApp() {
  renderRecipes();
  var planOutput = document.getElementById('plan-output');
  var btnGenerate = document.getElementById('btn-generate');

  function getSelectedPlanType() {
    var checked = document.querySelector('input[name="plan-type"]:checked');
    return checked ? checked.value : 'day';
  }

  function generatePlan() {
    var type = getSelectedPlanType();
    currentPlan = type === 'week'
      ? { type: 'week', days: generateWeek() }
      : { type: 'day', days: [generateDay()] };
    var html = renderPlanFromData(currentPlan) + getGrocerySectionHtml(currentPlan);
    planOutput.innerHTML = html;
    setupPlanDishClicks(planOutput);
    setupGroceryListButton(planOutput);
    planOutput.scrollIntoView({ behavior: 'smooth' });
  }

  if (btnGenerate && planOutput) btnGenerate.addEventListener('click', generatePlan);

  var planOutput3day = document.getElementById('plan-output-3day');
  if (planOutput3day) initPersonalization(planOutput3day);
}

function initPersonalization(container) {
  var btn = document.getElementById('btn-generate-3day');
  var addGrains = document.getElementById('add-grains');
  var addLactose = document.getElementById('add-lactose');
  if (!btn || !container) return;
  btn.addEventListener('click', function () {
    var grains = addGrains && addGrains.checked;
    var lactose = addLactose && addLactose.checked;
    if (!grains && !lactose) {
      container.innerHTML = '<p class="placeholder">Select at least one option (Add grains or Add lactose) and click Generate.</p>';
      return;
    }
    var days = generate3DayPlan();
    container.innerHTML = render3DayPlan(days, grains, lactose);
    setupPlanDishClicks(container);
    container.scrollIntoView({ behavior: 'smooth' });
  });
}

function init() {
  fetch('my-recipes.json')
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (data) {
      RECIPES = [];
      PERSONAL_RECIPES = [];
      if (Array.isArray(data)) {
        data.forEach(function (r) {
          var recipe = normalizeRecipe(r);
          if (recipe) {
            PERSONAL_RECIPES.push(recipe);
            RECIPES.push(recipe);
          }
        });
      }
      startApp();
    })
    .catch(function () {
      RECIPES = [];
      PERSONAL_RECIPES = [];
      startApp();
    });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
