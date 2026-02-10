// Recipes are loaded from my-recipes.json only
var RECIPES = [];
var PERSONAL_RECIPES = [];  // Only these are used for meal plan generation
var MEAL_ORDER = ['breakfast', 'lunch/dinner', 'snack'];  // for Recipes page
var PLAN_MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'];  // for meal plan display

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
  var parts = [];
  PLAN_MEAL_ORDER.forEach(function (meal) {
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
  var recipes = PLAN_MEAL_ORDER.map(function (m) { return day[m]; }).filter(Boolean);
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
  var mealLabel = formatMealLabel(recipe.meal);
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
    var html = type === 'week' ? renderPlanForWeek() : renderPlanForDay();
    planOutput.innerHTML = html;
    setupPlanDishClicks(planOutput);
    planOutput.scrollIntoView({ behavior: 'smooth' });
  }

  if (btnGenerate && planOutput) btnGenerate.addEventListener('click', generatePlan);
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
