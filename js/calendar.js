/* ====== Calendar Heatmap v2 — Type-filtered Support ====== */
const Calendar = (() => {
  let currentYear, currentMonth;
  let checkinDates = new Set();
  let filterTypeId = 'all';

  const gridEl = document.getElementById('calendar-grid');
  const monthLabel = document.getElementById('cal-month-label');
  const prevBtn = document.getElementById('cal-prev');
  const nextBtn = document.getElementById('cal-next');
  const legendEl = document.getElementById('calendar-legend');

  const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
  const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  function init() {
    const now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth() + 1;

    prevBtn.addEventListener('click', () => {
      currentMonth--; if (currentMonth < 1) { currentMonth = 12; currentYear--; }
      render();
    });
    nextBtn.addEventListener('click', () => {
      currentMonth++; if (currentMonth > 12) { currentMonth = 1; currentYear++; }
      render();
    });
  }

  function refresh(filterId) {
    filterTypeId = filterId || 'all';
    const allCheckins = Storage.get('checkins') || [];

    if (filterTypeId === 'all') {
      checkinDates = new Set(allCheckins.map(c => c.date));
    } else if (filterTypeId === 'default') {
      checkinDates = new Set(allCheckins.filter(c => c.type === 'default' || c.typeId === 'default').map(c => c.date));
    } else {
      checkinDates = new Set(allCheckins.filter(c => c.typeId === filterTypeId).map(c => c.date));
    }

    render();
  }

  function getColorForDate(dateStr) {
    const allCheckins = Storage.get('checkins') || [];
    const dayCheckins = allCheckins.filter(c => c.date === dateStr);
    if (dayCheckins.length === 0) return null;

    // If showing all, return primary color (or multi-color indicator)
    if (filterTypeId === 'all') {
      const types = [...new Set(dayCheckins.map(c => c.typeId))];
      if (types.length > 1) {
        return 'multi';
      }
      // Single type — use its color
      const typeId = types[0];
      if (typeId === 'default') return 'var(--color-primary)';
      const customTypes = Storage.get('customCheckinTypes') || [];
      const ct = customTypes.find(t => t.id === typeId);
      return ct ? ct.color : 'var(--color-primary)';
    }

    // Filtered view — use associated color
    if (filterTypeId === 'default') return 'var(--color-primary-dark)';
    const customTypes = Storage.get('customCheckinTypes') || [];
    const ct = customTypes.find(t => t.id === filterTypeId);
    return ct ? ct.color : 'var(--color-primary)';
  }

  function render() {
    monthLabel.textContent = `${currentYear}年 ${MONTHS[currentMonth - 1]}`;

    const today = new Date();
    const todayStr = formatDate(today);
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();

    let html = '<div class="calendar-weekdays">';
    for (const d of WEEKDAYS) { html += `<span>${d}</span>`; }
    html += '</div>';

    let day = 1;
    const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

    for (let row = 0; row < totalCells / 7; row++) {
      html += '<div class="calendar-week">';
      for (let col = 0; col < 7; col++) {
        const cellIndex = row * 7 + col;
        if (cellIndex < firstDayOfWeek || day > daysInMonth) {
          const otherDay = cellIndex < firstDayOfWeek ? null : day;
          if (otherDay && day <= daysInMonth) {
            const dateStr = `${currentYear}-${pad(currentMonth)}-${pad(day)}`;
            const checked = checkinDates.has(dateStr);
            const color = checked ? getColorForDate(dateStr) : null;
            const style = color && color !== 'var(--color-primary)' && color !== 'var(--color-primary-dark)' && color !== 'multi'
              ? `style="background:${color}"` : '';
            html += `<div class="calendar-day other-month${checked ? ' checked-in' : ''}${color === 'multi' ? ' multi-type' : ''}" data-date="${dateStr}" ${style}>${day}</div>`;
            day++;
          } else {
            html += '<div class="calendar-day other-month"></div>';
            if (cellIndex >= firstDayOfWeek) day++;
          }
        } else {
          const dateStr = `${currentYear}-${pad(currentMonth)}-${pad(day)}`;
          const checked = checkinDates.has(dateStr);
          const isToday = dateStr === todayStr;
          const color = checked ? getColorForDate(dateStr) : null;

          let cls = 'calendar-day';
          if (checked) {
            cls += ' checked-in';
            if (color === 'multi') cls += ' multi-type';
          }
          if (isToday) cls += ' today';

          const inlineStyle = (checked && color && color !== 'var(--color-primary)' && color !== 'multi')
            ? `style="background:${color};color:#fff"` : '';

          html += `<div class="${cls}" data-date="${dateStr}" ${inlineStyle}>${day}</div>`;
          day++;
        }
      }
      html += '</div>';
    }

    gridEl.innerHTML = html;

    // Update legend
    updateLegend();

    // Click handler
    gridEl.querySelectorAll('.calendar-day[data-date]').forEach(el => {
      el.addEventListener('click', () => {
        const date = el.dataset.date;
        const allCheckins = Storage.get('checkins') || [];
        const entries = allCheckins.filter(c => c.date === date);
        if (entries.length > 0) {
          const labels = entries.map(e => {
            if (e.type === 'default' || e.typeId === 'default') return '默认打卡';
            const types = Storage.get('customCheckinTypes') || [];
            const ct = types.find(t => t.id === e.typeId);
            return ct ? ct.name : '自定义打卡';
          }).join(' + ');
          window._showToast(`${date} — ${labels}${entries[0].note ? '\n' + entries[0].note : ''}`, 'info');
        } else {
          window._showToast(`${date} — 未打卡`, 'info');
        }
      });
    });
  }

  function updateLegend() {
    let legendHtml = '<span class="legend-item"><i class="legend-dot empty"></i> 未打卡</span>';
    if (filterTypeId === 'all') {
      legendHtml += '<span class="legend-item"><i class="legend-dot filled"></i> 默认</span>';
      const types = Storage.get('customCheckinTypes') || [];
      for (const t of types) {
        legendHtml += `<span class="legend-item"><i class="legend-dot filled" style="background:${t.color}"></i> ${t.name}</span>`;
      }
      legendHtml += '<span class="legend-item"><i class="legend-dot multi-dot"></i> 多种打卡</span>';
    } else {
      legendHtml += '<span class="legend-item"><i class="legend-dot filled"></i> 已打卡</span>';
    }
    legendHtml += '<span class="legend-item"><i class="legend-dot today"></i> 今天</span>';
    legendEl.innerHTML = legendHtml;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function formatDate(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function calcStreak(checkins, filterId) {
    if (!checkins || checkins.length === 0) return 0;

    let filtered = checkins;
    if (filterId && filterId !== 'all') {
      if (filterId === 'default') {
        filtered = checkins.filter(c => c.type === 'default' || c.typeId === 'default');
      } else {
        filtered = checkins.filter(c => c.typeId === filterId);
      }
    }

    const dates = [...new Set(filtered.map(c => c.date))].sort().reverse();
    if (dates.length === 0) return 0;

    const today = formatDate(new Date());
    const yesterday = formatDate(new Date(Date.now() - 86400000));
    if (dates[0] !== today && dates[0] !== yesterday) return 0;

    let streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const curr = new Date(dates[i]);
      const prev = new Date(dates[i + 1]);
      const diff = (curr - prev) / 86400000;
      if (Math.round(diff) === 1) streak++;
      else break;
    }
    return streak;
  }

  function calcTotalDays(checkins) {
    return new Set(checkins.map(c => c.date)).size;
  }

  return { init, refresh, calcStreak, calcTotalDays, formatDate };
})();
