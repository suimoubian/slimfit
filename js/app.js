/* ====== Main App Router & Initialization v2 ====== */
const App = (() => {
  const views = {
    checkin: document.getElementById('view-checkin'),
    health: document.getElementById('view-health'),
    plan: document.getElementById('view-plan'),
    summary: document.getElementById('view-summary'),
    settings: document.getElementById('view-settings')
  };

  let currentRoute = 'checkin';

  /* ====== Toast System ====== */
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type || 'info'}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  window._showToast = showToast;

  /* ====== Router ====== */
  function navigate(route) {
    if (currentRoute === route) return;

    Object.values(views).forEach(v => v.classList.remove('active'));

    if (views[route]) {
      views[route].classList.add('active');
    }

    document.querySelectorAll('.nav-link, .tab-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.route === route) link.classList.add('active');
    });

    currentRoute = route;

    // Refresh view-specific data
    if (route === 'checkin') {
      Checkin.updateUI();
    }
    if (route === 'summary') {
      Summary.render();
    }
  }

  function initRouter() {
    document.querySelectorAll('.nav-link, .tab-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = link.dataset.route;
        navigate(route);
        history.replaceState(null, null, '#' + route);
      });
    });

    const hash = window.location.hash.replace('#', '');
    if (hash && views[hash]) {
      navigate(hash);
    }

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && views[hash]) navigate(hash);
    });
  }

  /* ====== Init ====== */
  function init() {
    initRouter();

    // Checkin module manages its own calendar init
    Checkin.init();
    Health.init();
    Diet.init();
    Plan.init();
    Summary.init();
    Settings.init();
    Confetti.resize();

    // Periodically update recipe status indicator
    updateRecipeStatus();
    setInterval(updateRecipeStatus, 3000);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }

    const currentPlan = Storage.get('currentPlan');
    if (currentPlan) {
      console.log('Active plan:', currentPlan.planName, 'started', currentPlan.startDate);
    }
  }

  function updateRecipeStatus() {
    const el = document.getElementById('recipe-status');
    if (!el) return;
    if (Diet.isLoaded()) {
      const count = Diet.getRecipeCount();
      const last = Diet.getLastUpdate();
      const lastStr = last ? new Date(last).toLocaleDateString('zh-CN') : '未更新';
      el.textContent = `已加载 ${count} 道菜谱 | 上次更新: ${lastStr}`;
    } else {
      el.textContent = '食谱数据: 加载中...';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { navigate, showToast };
})();
