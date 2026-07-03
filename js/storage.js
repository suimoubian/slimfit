/* ====== LocalStorage Wrapper ====== */
const Storage = (() => {
  const KEY = 'slimfit_data';

  const defaults = {
    profile: {
      height: null,
      weight: null,
      gender: 'male',
      age: null
    },
    checkins: [],
    customCheckinTypes: [
      { id: 'exercise', name: '运动打卡', icon: '\u{1F3C3}', color: '#ff6b6b' },
      { id: 'diet', name: '饮食打卡', icon: '\u{1F957}', color: '#6bcb77' },
      { id: 'water', name: '饮水打卡', icon: '\u{1F4A7}', color: '#4d96ff' }
    ],
    currentPlan: null,
    recipeLastUpdate: null,
    recipeRemoteUrl: '',
    achievements: [],
    settings: {
      themeColor: '#a8d8ea',
      backgroundColor: '#f5f5f5',
      bgType: 'solid',
      backgroundImage: '',
      darkMode: false,
      fontSize: 'medium',
      recipeRemoteUrl: ''
    }
  };

  let data = null;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        data = JSON.parse(raw);
        // Merge with defaults for forward compatibility
        data = deepMerge(defaults, data);
      } else {
        data = JSON.parse(JSON.stringify(defaults));
      }
    } catch (e) {
      console.warn('Failed to load data, using defaults:', e);
      data = JSON.parse(JSON.stringify(defaults));
    }
    return data;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }

  function deepMerge(base, override) {
    const result = JSON.parse(JSON.stringify(base));
    for (const key of Object.keys(override)) {
      if (override[key] !== undefined && override[key] !== null) {
        if (typeof base[key] === 'object' && !Array.isArray(base[key]) && base[key] !== null) {
          result[key] = deepMerge(base[key], override[key]);
        } else {
          result[key] = override[key];
        }
      }
    }
    return result;
  }

  function get(path) {
    if (!data) load();
    const keys = path.split('.');
    let val = data;
    for (const k of keys) {
      if (val === undefined || val === null) return undefined;
      val = val[k];
    }
    return val;
  }

  function set(path, value) {
    if (!data) load();
    const keys = path.split('.');
    let obj = data;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    save();
  }

  function getAll() {
    if (!data) load();
    return data;
  }

  function reset() {
    data = JSON.parse(JSON.stringify(defaults));
    save();
  }

  function exportJSON() {
    if (!data) load();
    return JSON.stringify(data, null, 2);
  }

  function importJSON(jsonStr) {
    const imported = JSON.parse(jsonStr);
    data = deepMerge(defaults, imported);
    save();
    return data;
  }

  // Initialize on load
  load();

  return { get, set, getAll, reset, exportJSON, importJSON, save };
})();
