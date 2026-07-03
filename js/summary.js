/* ====== Summary / Report Module — Weekly, Monthly, Quarterly ====== */
const Summary = (() => {
  const PERIODS = ['week', 'month', 'quarter'];
  let currentPeriod = 'week';

  function init() {
    document.querySelectorAll('.summary-period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.summary-period-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPeriod = btn.dataset.period;
        render();
      });
    });
    render();
  }

  function getDateRange(period) {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let start;

    if (period === 'week') {
      const dayOfWeek = now.getDay();
      start = new Date(now);
      start.setDate(now.getDate() - dayOfWeek);
    } else if (period === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      // quarter
      const qMonth = Math.floor(now.getMonth() / 3) * 3;
      start = new Date(now.getFullYear(), qMonth, 1);
    }

    return { start, end };
  }

  function getPrevDateRange(period) {
    const { start, end } = getDateRange(period);
    const duration = end.getTime() - start.getTime();
    const prevEnd = new Date(start.getTime() - 86400000);
    const prevStart = new Date(prevEnd.getTime() - duration);
    return { start: prevStart, end: prevEnd };
  }

  function render() {
    const checkins = Storage.get('checkins') || [];
    const { start, end } = getDateRange(currentPeriod);
    const prev = getPrevDateRange(currentPeriod);

    const periodLabel = { week: '本周', month: '本月', quarter: '本季度' };

    // Filter checkins in range
    const sStr = Calendar.formatDate(start);
    const eStr = Calendar.formatDate(end);
    const inRange = checkins.filter(c => c.date >= sStr && c.date <= eStr);
    const prevInRange = checkins.filter(c => {
      const d = c.date;
      return d >= Calendar.formatDate(prev.start) && d <= Calendar.formatDate(prev.end);
    });

    const totalDays = daysInRange(start, end);
    const uniqueDays = new Set(inRange.map(c => c.date)).size;
    const checkinRate = totalDays > 0 ? Math.round((uniqueDays / totalDays) * 100) : 0;
    const totalChecks = inRange.length;

    const prevUniqueDays = new Set(prevInRange.map(c => c.date)).size;
    const trend = uniqueDays > prevUniqueDays ? 'up' : uniqueDays < prevUniqueDays ? 'down' : 'flat';

    // Per-type breakdown
    const types = Storage.get('customCheckinTypes') || [];
    const allTypes = [{ id: 'default', name: '默认打卡', color: 'var(--color-primary)' }, ...types];
    const typeBreakdown = allTypes.map(t => {
      const count = inRange.filter(c => (c.typeId || c.type) === t.id).length;
      return { ...t, count };
    }).filter(t => t.count > 0).sort((a, b) => b.count - a.count);

    const totalTypeChecks = typeBreakdown.reduce((sum, t) => sum + t.count, 0);

    // Streak info
    const currentStreak = Calendar.calcStreak(checkins, 'all');
    const maxStreak = calcMaxStreak(checkins);

    // Stage
    const totalAllDays = Calendar.calcTotalDays(checkins);
    const stage = I18n.getStage(totalAllDays);

    // Achievements
    const achievements = Storage.get('achievements') || [];
    const achievementDefs = [
      { id: 'days7', name: '坚持一周', icon: '🌟' },
      { id: 'days30', name: '月度之星', icon: '🏅' },
      { id: 'days100', name: '百日英雄', icon: '👑' },
      { id: 'streak7', name: '连续7天', icon: '🔥' },
      { id: 'streak21', name: '自律大师', icon: '💎' },
      { id: 'streak50', name: '钢铁意志', icon: '⚡' }
    ];

    // Build HTML
    const container = document.getElementById('summary-content');
    if (!container) return;

    container.innerHTML = `
      <!-- Stats Row -->
      <div class="summary-stats-row">
        <div class="summary-stat">
          <div class="summary-stat-num">${totalChecks}</div>
          <div class="summary-stat-label">总打卡次数</div>
        </div>
        <div class="summary-stat">
          <div class="summary-stat-num">${uniqueDays}</div>
          <div class="summary-stat-label">打卡天数</div>
        </div>
        <div class="summary-stat">
          <div class="summary-stat-num">${checkinRate}%</div>
          <div class="summary-stat-label">打卡率</div>
        </div>
        <div class="summary-stat">
          <div class="summary-stat-num">${currentStreak}</div>
          <div class="summary-stat-label">当前连续</div>
        </div>
      </div>

      <!-- Rate Bar -->
      <div class="card">
        <h3 class="card-title">打卡率</h3>
        <div class="rate-bar-container">
          <div class="rate-bar-fill" style="width:${checkinRate}%"></div>
        </div>
        <p style="text-align:center;font-size:var(--font-size-sm);color:var(--text-secondary);margin-top:8px">
          ${periodLabel[currentPeriod]} ${uniqueDays}/${totalDays} 天
          ${trend === 'up' ? ' &#8593; 比上周期进步！' : trend === 'down' ? ' &#8595; 比上周期退步，加油！' : ' &#8594; 与上周期持平'}
        </p>
      </div>

      <!-- Type Breakdown -->
      <div class="card">
        <h3 class="card-title">打卡分布</h3>
        ${typeBreakdown.length > 0 ? `
          <div class="type-breakdown">
            ${typeBreakdown.map((t, i) => `
              <div class="type-breakdown-row">
                <span>${t.icon || ''} ${t.name}</span>
                <div class="type-breakdown-bar-track">
                  <div class="type-breakdown-bar-fill" style="width:${totalTypeChecks > 0 ? Math.round((t.count / totalTypeChecks) * 100) : 0}%;background:${t.color}"></div>
                </div>
                <span style="font-weight:600">${t.count}</span>
              </div>
            `).join('')}
          </div>
        ` : '<p style="color:var(--text-muted);text-align:center">本周期暂无打卡记录</p>'}
      </div>

      <!-- Streak & Stage -->
      <div class="card">
        <h3 class="card-title">连续 & 阶段</h3>
        <div style="display:flex;gap:var(--space-lg);flex-wrap:wrap">
          <div style="flex:1;min-width:120px">
            <div style="font-size:var(--font-size-2xl);font-weight:800;color:var(--color-primary-dark)">${currentStreak} 天</div>
            <div style="font-size:var(--font-size-sm);color:var(--text-secondary)">当前连续打卡</div>
          </div>
          <div style="flex:1;min-width:120px">
            <div style="font-size:var(--font-size-2xl);font-weight:800;color:var(--color-accent-dark)">${maxStreak} 天</div>
            <div style="font-size:var(--font-size-sm);color:var(--text-secondary)">历史最长连续</div>
          </div>
          <div style="flex:1;min-width:120px">
            <div style="font-size:var(--font-size-xl);font-weight:700">${stage.badge}</div>
            <div style="font-size:var(--font-size-sm);color:var(--text-secondary)">${stage.name}</div>
          </div>
        </div>
      </div>

      <!-- Achievements -->
      <div class="card">
        <h3 class="card-title">成就徽章</h3>
        <div class="achievement-grid">
          ${achievementDefs.map(a => `
            <div class="achievement-badge ${achievements.includes(a.id) ? 'unlocked' : 'locked'}">
              <div class="achievement-icon">${achievements.includes(a.id) ? a.icon : '🔒'}</div>
              <div class="achievement-name">${a.name}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- AI Summary -->
      <div class="card">
        <h3 class="card-title">${periodLabel[currentPeriod]}小结</h3>
        <div class="rationale-box">
          ${generateSummaryText(checkinRate, totalChecks, trend, stage, uniqueDays, currentPeriod, periodLabel)}
        </div>
      </div>
    `;
  }

  function generateSummaryText(rate, total, trend, stage, uniqueDays, period, periodLabel) {
    const lines = [];
    if (total === 0) {
      lines.push(`${periodLabel}还没有打卡记录哦！从今天开始迈出第一步吧。`);
      return lines.join('<br>');
    }
    lines.push(`${periodLabel}你总共打卡了 <strong>${total}</strong> 次，覆盖了 <strong>${uniqueDays}</strong> 天。`);
    if (rate >= 90) lines.push('打卡率非常出色，自律已成为你的习惯！继续保持这个节奏。');
    else if (rate >= 60) lines.push('打卡率不错，还有提升空间。试着在周末也保持打卡节奏。');
    else lines.push('打卡率有待提升，建议设定每日提醒，先从连续7天的小目标开始。');

    if (trend === 'up') lines.push('相比上个周期，你的打卡有明显进步，继续保持向上的势头！');
    else if (trend === 'down') lines.push('与上个周期相比有所下滑。没关系，波动是正常的，明天重新开始！');

    lines.push(`你当前处于<strong>${stage.name}</strong>阶段，每一天的坚持都在书写属于你的蜕变故事。`);
    return lines.join('<br>');
  }

  function calcMaxStreak(checkins) {
    if (!checkins || checkins.length === 0) return 0;
    const dates = [...new Set(checkins.map(c => c.date))].sort();
    let maxStreak = 0, currentRun = 1;

    for (let i = 1; i < dates.length; i++) {
      const curr = new Date(dates[i]);
      const prev = new Date(dates[i - 1]);
      const diff = (curr - prev) / 86400000;
      if (Math.round(diff) === 1) {
        currentRun++;
      } else {
        if (currentRun > maxStreak) maxStreak = currentRun;
        currentRun = 1;
      }
    }
    if (currentRun > maxStreak) maxStreak = currentRun;
    return maxStreak;
  }

  function daysInRange(start, end) {
    return Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  }

  return { init, render };
})();
