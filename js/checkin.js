/* ====== Check-in System v2 — Multi Custom Type Support ====== */
const Checkin = (() => {
  const btnContainer = document.getElementById('checkin-btns-container');
  const streakCount = document.getElementById('streak-count');
  const stageBadge = document.getElementById('stage-badge');
  const stageName = document.getElementById('stage-name');
  const stageProgress = document.getElementById('stage-progress-bar');
  const stageDaysText = document.getElementById('stage-days-text');
  const encouragementCard = document.getElementById('encouragement-card');
  const encouragementText = document.getElementById('encouragement-text');
  const headerDate = document.getElementById('header-date');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalBox = document.getElementById('modal-box');
  const calendarTypeTabs = document.getElementById('calendar-type-tabs');

  let previousStage = null;
  let currentCalendarFilter = 'all';

  function init() {
    updateHeaderDate();
    renderCheckinButtons();
    renderCalendarTabs();
    updateUI();
    Calendar.init();
    Calendar.refresh('all');

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  function updateHeaderDate() {
    const now = new Date();
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    headerDate.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${weekdays[now.getDay()]}`;
  }

  /* ====== Render Dynamic Buttons ====== */
  function renderCheckinButtons() {
    const types = Storage.get('customCheckinTypes') || [];
    let html = '';

    // Default check-in button
    html += `
      <button class="btn btn-checkin btn-checkin-default" data-type="default" data-typeid="default">
        <span class="btn-icon">&#10004;</span>
        <span>默认打卡</span>
      </button>`;

    // Custom type buttons
    for (const t of types) {
      html += `
        <button class="btn btn-checkin btn-checkin-custom-type" data-type="custom" data-typeid="${t.id}"
                style="border-color:${t.color};color:${t.color}">
          <span class="btn-icon">${t.icon}</span>
          <span>${t.name}</span>
        </button>`;
    }

    // "Manage types" button
    html += `
      <button class="btn btn-checkin btn-checkin-manage" id="btn-manage-types">
        <span class="btn-icon">+</span>
        <span>管理类型</span>
      </button>`;

    btnContainer.innerHTML = html;

    // Bind click events
    btnContainer.querySelectorAll('[data-type]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const typeId = btn.dataset.typeid;
        doCheckin(type, typeId, '');
      });
    });

    document.getElementById('btn-manage-types').addEventListener('click', showManageTypesModal);
  }

  /* ====== Calendar Type Tabs ====== */
  function renderCalendarTabs() {
    const types = Storage.get('customCheckinTypes') || [];
    let html = `<button class="cal-type-tab active" data-filter="all">全部</button>`;
    html += `<button class="cal-type-tab" data-filter="default">默认</button>`;
    for (const t of types) {
      html += `<button class="cal-type-tab" data-filter="${t.id}" style="--tab-color:${t.color}">${t.icon} ${t.name}</button>`;
    }

    calendarTypeTabs.innerHTML = html;

    calendarTypeTabs.querySelectorAll('.cal-type-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        calendarTypeTabs.querySelectorAll('.cal-type-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCalendarFilter = tab.dataset.filter;
        Calendar.refresh(currentCalendarFilter);
      });
    });
  }

  /* ====== Do Check-in ====== */
  function doCheckin(type, typeId, note) {
    const today = Calendar.formatDate(new Date());
    const checkins = Storage.get('checkins') || [];

    // Check duplicate for default type
    if (type === 'default') {
      const todayDefault = checkins.filter(c => c.date === today && c.type === 'default');
      if (todayDefault.length > 0) {
        window._showToast('今天已经默认打卡过了！', 'info');
        return;
      }
    }

    // Check duplicate for the same custom type
    if (type === 'custom' && typeId) {
      const todaySameType = checkins.filter(c => c.date === today && c.typeId === typeId);
      if (todaySameType.length > 0) {
        const types = Storage.get('customCheckinTypes') || [];
        const typeName = types.find(t => t.id === typeId)?.name || '该类型';
        window._showToast(`今天已经「${typeName}」打卡过了！`, 'info');
        return;
      }
    }

    const totalDaysBefore = Calendar.calcTotalDays(checkins);
    previousStage = I18n.getStage(totalDaysBefore);

    checkins.push({ date: today, type, typeId: typeId || type, note: note || '' });
    Storage.set('checkins', checkins);

    // Confetti — find the clicked button position
    const btn = btnContainer.querySelector(`[data-typeid="${typeId || type}"]`);
    if (btn) {
      const rect = btn.getBoundingClientRect();
      Confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 50, 1);
    } else {
      Confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 40, 1);
    }

    // Stage upgrade check
    const totalDaysAfter = Calendar.calcTotalDays(checkins);
    const newStage = I18n.getStage(totalDaysAfter);

    if (previousStage && newStage.id > previousStage.id) {
      setTimeout(() => {
        Confetti.megaBurst(window.innerWidth / 2, window.innerHeight / 2);
        showStageCelebration(newStage);
      }, 800);
    }

    // Show encouragement
    const msg = I18n.getEncouragement(newStage.id);
    showEncouragement(msg);

    // Check achievements
    checkAchievements(checkins);

    updateUI();
    Calendar.refresh(currentCalendarFilter);

    // Get type name for toast
    let typeLabel = '默认';
    if (type === 'custom' && typeId) {
      const types = Storage.get('customCheckinTypes') || [];
      typeLabel = types.find(t => t.id === typeId)?.name || '自定义';
    }
    window._showToast(`「${typeLabel}」打卡成功！`, 'success');
  }

  /* ====== Achievement Check ====== */
  function checkAchievements(checkins) {
    const totalDays = Calendar.calcTotalDays(checkins);
    const streak = Calendar.calcStreak(checkins, 'all');
    const achieved = Storage.get('achievements') || [];

    const milestones = [
      { id: 'days7', name: '坚持一周', desc: '累计打卡满7天', check: () => totalDays >= 7 },
      { id: 'days30', name: '月度之星', desc: '累计打卡满30天', check: () => totalDays >= 30 },
      { id: 'days100', name: '百日英雄', desc: '累计打卡满100天', check: () => totalDays >= 100 },
      { id: 'streak7', name: '连续7天', desc: '连续打卡7天', check: () => streak >= 7 },
      { id: 'streak21', name: '自律大师', desc: '连续打卡21天', check: () => streak >= 21 },
      { id: 'streak50', name: '钢铁意志', desc: '连续打卡50天', check: () => streak >= 50 }
    ];

    for (const m of milestones) {
      if (!achieved.includes(m.id) && m.check()) {
        achieved.push(m.id);
        Storage.set('achievements', achieved);
        window._showToast(`🏆 成就解锁: ${m.name} — ${m.desc}`, 'success');
      }
    }
  }

  /* ====== Manage Types Modal ====== */
  function showManageTypesModal() {
    const types = Storage.get('customCheckinTypes') || [];
    let typeListHtml = types.map(t => `
      <div class="type-manage-item" style="border-left:4px solid ${t.color}">
        <span>${t.icon} ${t.name}</span>
        <span>
          <button class="btn btn-icon-only type-edit-btn" data-id="${t.id}" title="编辑">&#9998;</button>
          <button class="btn btn-icon-only type-delete-btn" data-id="${t.id}" title="删除" style="color:#e74c3c">&#10005;</button>
        </span>
      </div>
    `).join('');

    modalBox.innerHTML = `
      <h3>管理打卡类型</h3>
      <div class="type-list">${typeListHtml || '<p style="color:var(--text-muted)">暂无自定义类型</p>'}</div>
      <div style="margin-top:var(--space-md);padding-top:var(--space-md);border-top:1px solid var(--border-color)">
        <h4 style="font-size:var(--font-size-sm);margin-bottom:var(--space-sm)">新增类型</h4>
        <input type="text" id="new-type-name" placeholder="类型名称，如：冥想" maxlength="10">
        <input type="text" id="new-type-icon" placeholder="Emoji图标，如：🧘" maxlength="4" style="width:80px">
        <input type="color" id="new-type-color" value="#a8d8ea" style="vertical-align:middle">
      </div>
      <div class="modal-actions" style="margin-top:var(--space-md)">
        <button class="btn btn-outline" id="modal-cancel">关闭</button>
        <button class="btn btn-primary" id="modal-add-type" style="width:auto">添加</button>
      </div>
    `;
    modalOverlay.classList.remove('hidden');

    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('modal-add-type').addEventListener('click', () => {
      const name = document.getElementById('new-type-name').value.trim();
      const icon = document.getElementById('new-type-icon').value.trim() || '📌';
      const color = document.getElementById('new-type-color').value || '#a8d8ea';

      if (!name) { window._showToast('请输入类型名称', 'error'); return; }

      const types = Storage.get('customCheckinTypes') || [];
      const id = 'custom_' + Date.now();
      types.push({ id, name, icon, color });
      Storage.set('customCheckinTypes', types);

      closeModal();
      renderCheckinButtons();
      renderCalendarTabs();
      window._showToast(`已添加「${name}」打卡类型`, 'success');
    });

    // Edit buttons
    modalBox.querySelectorAll('.type-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const types = Storage.get('customCheckinTypes') || [];
        const t = types.find(t => t.id === id);
        if (!t) return;
        const newName = prompt('修改名称:', t.name);
        if (newName && newName.trim()) {
          t.name = newName.trim();
          Storage.set('customCheckinTypes', types);
          closeModal();
          renderCheckinButtons();
          renderCalendarTabs();
          window._showToast('类型已更新', 'success');
        }
      });
    });

    // Delete buttons
    modalBox.querySelectorAll('.type-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (!confirm('确定删除此打卡类型？历史打卡记录不会删除。')) return;
        let types = Storage.get('customCheckinTypes') || [];
        types = types.filter(t => t.id !== id);
        Storage.set('customCheckinTypes', types);
        closeModal();
        renderCheckinButtons();
        renderCalendarTabs();
        window._showToast('类型已删除', 'info');
      });
    });
  }

  function closeModal() {
    modalOverlay.classList.add('hidden');
  }

  /* ====== Encouragement & Celebration ====== */
  function showEncouragement(msg) {
    encouragementText.textContent = msg;
    encouragementCard.classList.remove('hidden');
    encouragementCard.classList.add('anim-pop-in');
    setTimeout(() => encouragementCard.classList.remove('anim-pop-in'), 400);
    clearTimeout(window._encourageTimeout);
    window._encourageTimeout = setTimeout(() => {
      encouragementCard.classList.add('hidden');
    }, 6000);
  }

  function showStageCelebration(stage) {
    const overlay = document.createElement('div');
    overlay.className = 'stage-celebration';
    overlay.innerHTML = `<div class="stage-celebration-text">
      恭喜进入<br>第 ${stage.id} 阶段<br>
      <span style="font-size:0.5em">${stage.name}</span>
    </div>`;
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.5s ease';
      setTimeout(() => overlay.remove(), 500);
    }, 3000);
  }

  /* ====== Update UI ====== */
  function updateUI() {
    const checkins = Storage.get('checkins') || [];
    const streak = Calendar.calcStreak(checkins, 'all');
    const totalDays = Calendar.calcTotalDays(checkins);
    const stage = I18n.getStage(totalDays);

    animateNumber(streakCount, streak);
    stageBadge.textContent = stage.badge;
    stageName.textContent = stage.name;

    const progress = calcStageProgress(stage, totalDays);
    stageProgress.style.width = progress + '%';

    if (stage.id < 7) {
      const daysToNext = stage.maxDays - totalDays + 1;
      stageDaysText.textContent = `已完成 ${totalDays} 天打卡，距下一阶段还有 ${daysToNext} 天`;
    } else {
      stageDaysText.textContent = `累计 ${totalDays} 天打卡 — 你已经是传奇！`;
    }
  }

  function calcStageProgress(stage, totalDays) {
    if (stage.id >= 7) return 100;
    const rangeSize = stage.maxDays - stage.minDays + 1;
    const daysIn = totalDays - stage.minDays + 1;
    return Math.min(100, Math.max(0, Math.round((daysIn / rangeSize) * 100)));
  }

  function animateNumber(el, target) {
    const start = parseInt(el.textContent) || 0;
    const diff = target - start;
    if (diff === 0) return;
    const duration = 400;
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + diff * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  return { init, updateUI, doCheckin };
})();
