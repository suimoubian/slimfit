/* ====== Settings Panel ====== */
const Settings = (() => {
  const PRESET_COLORS = [
    '#a8d8ea', // Soft Blue
    '#b8e0d2', // Mint Green
    '#f7c59f', // Warm Peach
    '#d5b9df', // Soft Lavender
    '#ffd3b6', // Light Coral
    '#c9e4de', // Sage
    '#f9d5e5', // Blush Pink
    '#e3f0c9'  // Pale Lime
  ];

  function init() {
    loadSettings();
    renderColorPresets();
    bindEvents();
  }

  function loadSettings() {
    const settings = Storage.get('settings');

    // Apply theme color
    if (settings.themeColor) {
      applyThemeColor(settings.themeColor);
      document.getElementById('input-custom-color').value = settings.themeColor;
    }

    // Apply background
    applyBackground(settings);

    // Apply dark mode
    if (settings.darkMode) {
      document.body.classList.add('dark');
      document.getElementById('input-dark-mode').checked = true;
    }

    // Apply font size
    if (settings.fontSize && settings.fontSize !== 'medium') {
      document.body.classList.add('font-' + settings.fontSize);
      document.querySelectorAll('.toggle-option[data-font]').forEach(b => b.classList.remove('active'));
      const activeBtn = document.querySelector(`.toggle-option[data-font="${settings.fontSize}"]`);
      if (activeBtn) activeBtn.classList.add('active');
    }

    // Background type select
    if (settings.bgType) {
      document.getElementById('input-bg-type').value = settings.bgType;
      updateBgControls(settings.bgType);
      if (settings.bgType === 'solid') {
        document.getElementById('input-bg-color').value = settings.backgroundColor || '#f5f5f5';
      } else if (settings.bgType === 'image') {
        document.getElementById('input-bg-url').value = settings.backgroundImage || '';
      }
    }
  }

  function renderColorPresets() {
    const container = document.getElementById('color-presets');
    const currentColor = Storage.get('settings').themeColor || '#a8d8ea';

    container.innerHTML = PRESET_COLORS.map(color => `
      <div class="color-preset${color === currentColor ? ' active' : ''}"
           style="background:${color}"
           data-color="${color}"
           title="${color}"></div>
    `).join('');

    container.querySelectorAll('.color-preset').forEach(el => {
      el.addEventListener('click', () => {
        const color = el.dataset.color;
        applyThemeColor(color);
        Storage.set('settings.themeColor', color);
        document.getElementById('input-custom-color').value = color;

        container.querySelectorAll('.color-preset').forEach(e => e.classList.remove('active'));
        el.classList.add('active');
      });
    });
  }

  function applyThemeColor(color) {
    document.documentElement.style.setProperty('--color-primary', color);
    // Derive dark and light variants
    const dark = adjustColor(color, -25);
    const light = adjustColor(color, 30);
    document.documentElement.style.setProperty('--color-primary-dark', dark);
    document.documentElement.style.setProperty('--color-primary-light', light);
  }

  function adjustColor(hex, amount) {
    // Simple lightness adjust
    let r, g, b;
    if (hex.startsWith('#')) {
      const num = parseInt(hex.slice(1), 16);
      r = (num >> 16) & 0xff;
      g = (num >> 8) & 0xff;
      b = num & 0xff;
    } else {
      return hex;
    }
    r = Math.min(255, Math.max(0, r + amount));
    g = Math.min(255, Math.max(0, g + amount));
    b = Math.min(255, Math.max(0, b + amount));
    return `rgb(${r},${g},${b})`;
  }

  function applyBackground(settings) {
    const bgType = settings.bgType || 'solid';
    if (bgType === 'solid') {
      document.body.style.background = settings.backgroundColor || '#f5f5f5';
      document.body.style.backgroundImage = 'none';
    } else if (bgType === 'gradient') {
      document.body.style.background = `linear-gradient(135deg, ${settings.backgroundColor || '#f5f5f5'}, ${settings.themeColor || '#a8d8ea'}33)`;
    } else if (bgType === 'image' && settings.backgroundImage) {
      document.body.style.background = `url(${settings.backgroundImage}) center/cover fixed`;
    }
  }

  function updateBgControls(type) {
    const colorGroup = document.getElementById('bg-color-group');
    const urlGroup = document.getElementById('bg-url-group');

    colorGroup.classList.add('hidden');
    urlGroup.classList.add('hidden');

    if (type === 'solid' || type === 'gradient') {
      colorGroup.classList.remove('hidden');
    } else if (type === 'image') {
      urlGroup.classList.remove('hidden');
    }
  }

  function bindEvents() {
    // Custom color picker
    document.getElementById('input-custom-color').addEventListener('input', (e) => {
      const color = e.target.value;
      applyThemeColor(color);
      Storage.set('settings.themeColor', color);

      // Update preset selection
      document.querySelectorAll('.color-preset').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.color === color) el.classList.add('active');
      });
    });

    // Background type
    document.getElementById('input-bg-type').addEventListener('change', (e) => {
      updateBgControls(e.target.value);
      Storage.set('settings.bgType', e.target.value);
    });

    // Apply background
    document.getElementById('btn-apply-bg').addEventListener('click', () => {
      const bgType = document.getElementById('input-bg-type').value;
      const bgColor = document.getElementById('input-bg-color').value;
      const bgUrl = document.getElementById('input-bg-url').value;

      Storage.set('settings.bgType', bgType);
      Storage.set('settings.backgroundColor', bgColor);
      Storage.set('settings.backgroundImage', bgUrl);

      applyBackground({ bgType, backgroundColor: bgColor, backgroundImage: bgUrl });
      window._showToast('背景已更新', 'success');
    });

    // Font size
    document.querySelectorAll('.toggle-option[data-font]').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.dataset.font;
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        if (size !== 'medium') document.body.classList.add('font-' + size);

        document.querySelectorAll('.toggle-option[data-font]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        Storage.set('settings.fontSize', size);
      });
    });

    // Dark mode
    document.getElementById('input-dark-mode').addEventListener('change', (e) => {
      const isDark = e.target.checked;
      if (isDark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      Storage.set('settings.darkMode', isDark);
    });

    // Data export
    document.getElementById('btn-export-data').addEventListener('click', () => {
      const json = Storage.exportJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `slimfit-backup-${Calendar.formatDate(new Date())}.json`;
      a.click();
      URL.revokeObjectURL(url);
      window._showToast('数据已导出', 'success');
    });

    // Data import
    document.getElementById('btn-import-data').addEventListener('click', () => {
      document.getElementById('import-file-input').click();
    });

    document.getElementById('import-file-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          Storage.importJSON(ev.target.result);
          window._showToast('数据已导入，页面将刷新', 'success');
          setTimeout(() => location.reload(), 1000);
        } catch (err) {
          window._showToast('导入失败：文件格式不正确', 'error');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    // Recipe URL
    const recipeUrlInput = document.getElementById('input-recipe-url');
    const savedRecipeUrl = Storage.get('settings.recipeRemoteUrl') || '';
    if (recipeUrlInput && savedRecipeUrl) recipeUrlInput.value = savedRecipeUrl;

    document.getElementById('btn-save-recipe-url').addEventListener('click', () => {
      const url = document.getElementById('input-recipe-url').value.trim();
      Storage.set('settings.recipeRemoteUrl', url);
      Storage.set('recipeRemoteUrl', url);
      window._showToast('食谱更新URL已保存', 'success');
    });

    document.getElementById('btn-check-recipes').addEventListener('click', () => {
      window._showToast('正在检查食谱更新...', 'info');
      Diet.loadRecipes(true);
    });

    // Data reset
    document.getElementById('btn-reset-data').addEventListener('click', () => {
      if (confirm('确定要删除所有数据吗？此操作不可恢复！\n\n建议先导出数据备份。')) {
        Storage.reset();
        window._showToast('数据已重置', 'success');
        setTimeout(() => location.reload(), 800);
      }
    });
  }

  return { init };
})();
