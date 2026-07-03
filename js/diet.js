/* ====== Diet Database & Meal Generator (v2 - async JSON load + remote sync) ====== */
const Diet = (() => {
  const btnGen = document.getElementById('btn-gen-meal');
  const mealResultCard = document.getElementById('meal-result-card');
  const mealResultContent = document.getElementById('meal-result-content');
  const btnUpdate = document.getElementById('btn-update-recipes');

  let ingredients = {};
  let recipes = [];
  let loaded = false;

  /* Default remote URL for recipe updates */
  const DEFAULT_REMOTE_URL = '';

  async function loadRecipes(forceRemote) {
    // 1. Try remote if URL configured and (forced or due for check)
    const remoteUrl = Storage.get('settings.recipeRemoteUrl') || DEFAULT_REMOTE_URL;
    const lastUpdate = Storage.get('recipeLastUpdate');

    const shouldCheckRemote = forceRemote || (
      remoteUrl &&
      (!lastUpdate || (Date.now() - new Date(lastUpdate).getTime() > 86400000))
    );

    if (shouldCheckRemote && remoteUrl) {
      try {
        const data = await fetchRemote(remoteUrl);
        if (data) {
          applyRecipeData(data);
          Storage.set('recipeLastUpdate', new Date().toISOString());
          loaded = true;
          if (forceRemote) {
            window._showToast(`食谱已更新！(${recipes.length}道菜谱)`, 'success');
          }
          return;
        }
      } catch (e) {
        console.warn('Remote recipe fetch failed, falling back:', e);
      }
    }

    // 2. Fall back to local recipes.json
    try {
      const resp = await fetch('./recipes.json');
      const data = await resp.json();
      applyRecipeData(data);
      loaded = true;
    } catch (e) {
      // 3. Ultimate fallback: embedded minimal data
      console.warn('Local recipes.json not found, using built-in minimal set:', e);
      applyRecipeData(getBuiltinData());
      loaded = true;
    }
  }

  async function fetchRemote(url) {
    const resp = await fetch(url, { cache: 'no-cache' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    // Validate
    if (!data.recipes || !Array.isArray(data.recipes)) throw new Error('Invalid recipe format');
    return data;
  }

  function applyRecipeData(data) {
    ingredients = data.ingredients || {};
    recipes = data.recipes || [];
  }

  function getBuiltinData() {
    // Minimal fallback — kept small to not bloat JS
    return {
      ingredients: {
        chicken_breast: { name: '鸡胸肉', kcal: 133, protein: 31, carb: 0, fat: 1.2, cat: 'protein' },
        eggs: { name: '鸡蛋', kcal: 144, protein: 13, carb: 2, fat: 9, cat: 'protein' },
        broccoli: { name: '西兰花', kcal: 34, protein: 3, carb: 7, fat: 0.4, cat: 'veggie' },
        brown_rice: { name: '糙米', kcal: 123, protein: 2.7, carb: 26, fat: 0.9, cat: 'staple' },
        spinach: { name: '菠菜', kcal: 23, protein: 3, carb: 4, fat: 0.3, cat: 'veggie' },
        tofu: { name: '豆腐', kcal: 76, protein: 8, carb: 2, fat: 4, cat: 'protein' }
      },
      recipes: [
        {
          id: 'fb01', name: '鸡胸肉西兰花', mealType: 'lunch',
          ingredients: [{ id: 'chicken_breast', amount: 150, unit: 'g' }, { id: 'broccoli', amount: 200, unit: 'g' }, { id: 'brown_rice', amount: 150, unit: 'g（熟重）' }],
          steps: ['鸡胸肉煎熟切片，西兰花焯水，糙米饭煮熟，装盘即可。'],
          rationale: '高蛋白、高纤维、低GI的均衡减脂午餐。'
        },
        {
          id: 'fb02', name: '水煮蛋菠菜沙拉', mealType: 'breakfast',
          ingredients: [{ id: 'eggs', amount: 2, unit: '个' }, { id: 'spinach', amount: 150, unit: 'g' }],
          steps: ['鸡蛋水煮8分钟，菠菜焯水30秒，搭配少许醋和盐调味。'],
          rationale: '简单快捷的高蛋白、低热量早餐。'
        }
      ]
    };
  }

  function init() {
    btnGen.addEventListener('click', generate);
    if (btnUpdate) {
      btnUpdate.addEventListener('click', () => loadRecipes(true));
    }
    // Preload
    loadRecipes(false);
  }

  function generate() {
    if (!loaded) {
      window._showToast('食谱数据加载中，请稍后再试...', 'info');
      return;
    }

    const mealType = document.getElementById('input-meal-type').value;
    const profile = Storage.get('profile');
    if (!profile || !profile.height || !profile.weight) {
      window._showToast('请先在健康页面填写身体数据以获取更精准的推荐', 'info');
    }

    let selected;
    if (mealType === 'all') {
      const breakfasts = recipes.filter(r => r.mealType === 'breakfast');
      const lunches = recipes.filter(r => r.mealType === 'lunch');
      const dinners = recipes.filter(r => r.mealType === 'dinner');
      if (!breakfasts.length || !lunches.length || !dinners.length) {
        window._showToast('食谱数据不足，请尝试更新食谱', 'error');
        return;
      }
      selected = [
        breakfasts[Math.floor(Math.random() * breakfasts.length)],
        lunches[Math.floor(Math.random() * lunches.length)],
        dinners[Math.floor(Math.random() * dinners.length)]
      ];
    } else {
      const candidates = recipes.filter(r => r.mealType === mealType);
      if (!candidates.length) {
        window._showToast('该餐段暂无食谱，请尝试更新食谱', 'error');
        return;
      }
      selected = [candidates[Math.floor(Math.random() * candidates.length)]];
    }

    renderMealPlan(selected, mealType);
  }

  function renderMealPlan(selectedRecipes, mealType) {
    const typeLabel = { all: '全天', breakfast: '早餐', lunch: '午餐', dinner: '晚餐' };
    let totalCalories = 0;
    let html = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-md)">
      <h3 style="margin:0">${typeLabel[mealType]}减肥餐推荐</h3>
      <button class="btn btn-outline" id="btn-reroll" style="font-size:var(--font-size-sm)">&#9733; 换一批</button>
    </div>`;

    for (const recipe of selectedRecipes) {
      const label = recipe.mealType === 'breakfast' ? '早餐' : recipe.mealType === 'lunch' ? '午餐' : '晚餐';
      let mealCalories = 0;
      let ingredientHtml = '';

      for (const item of recipe.ingredients) {
        const ing = ingredients[item.id];
        if (!ing) continue;
        let amountIn100g;
        if (item.unit === 'g' || item.unit === 'ml') amountIn100g = item.amount / 100;
        else if (item.unit === '个') amountIn100g = item.amount * 0.5;
        else if (item.unit === '根') amountIn100g = item.amount * 1.2;
        else amountIn100g = item.amount * 0.5;

        const itemKcal = Math.round(ing.kcal * amountIn100g);
        mealCalories += itemKcal;

        ingredientHtml += `
          <li>
            <span>${ing.name} — ${item.amount}${item.unit}</span>
            <span style="color:var(--text-secondary)">~${itemKcal} kcal</span>
          </li>`;
      }

      totalCalories += mealCalories;

      html += `
        <div class="meal-block">
          <h3>${label}: ${recipe.name} <span class="calorie-badge">~${mealCalories} kcal</span></h3>
          <h4>食材清单</h4>
          <ul class="ingredient-list">${ingredientHtml}</ul>
          <h4>烹饪步骤</h4>
          <ol class="steps-list">${recipe.steps.map(s => `<li>${s}</li>`).join('')}</ol>
          <div class="rationale-box"><strong>营养依据：</strong>${recipe.rationale}</div>
        </div>`;
    }

    if (mealType === 'all') {
      html += `<div style="text-align:center;padding:var(--space-md);font-weight:600;font-size:var(--font-size-lg)">
        全天预估总热量：~${totalCalories} kcal</div>`;
    }

    mealResultContent.innerHTML = html;
    mealResultCard.classList.remove('hidden');
    mealResultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    mealResultCard.classList.remove('anim-fade-in-up');
    void mealResultCard.offsetWidth;
    mealResultCard.classList.add('anim-fade-in-up');

    // Reroll button
    const rerollBtn = document.getElementById('btn-reroll');
    if (rerollBtn) rerollBtn.addEventListener('click', generate);
  }

  function getRecipeCount() { return recipes.length; }
  function getLastUpdate() { return Storage.get('recipeLastUpdate'); }
  function isLoaded() { return loaded; }

  return { init, generate, loadRecipes, getRecipeCount, getLastUpdate, isLoaded };
})();
