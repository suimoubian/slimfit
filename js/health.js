/* ====== Health Calculator ====== */
const Health = (() => {
  const btnCalc = document.getElementById('btn-calc-health');
  const bmiResultCard = document.getElementById('bmi-result-card');
  const bmiValue = document.getElementById('bmi-value');
  const bmiRingFill = document.getElementById('bmi-ring-fill');
  const bmiStatus = document.getElementById('bmi-status');
  const bmiExtra = document.getElementById('bmi-extra');

  function init() {
    // Load saved profile
    const profile = Storage.get('profile');
    if (profile) {
      if (profile.height) document.getElementById('input-height').value = profile.height;
      if (profile.weight) document.getElementById('input-weight').value = profile.weight;
      if (profile.gender) document.getElementById('input-gender').value = profile.gender;
      if (profile.age) document.getElementById('input-age').value = profile.age;
    }

    btnCalc.addEventListener('click', calculate);
  }

  function calculate() {
    const height = parseFloat(document.getElementById('input-height').value);
    const weight = parseFloat(document.getElementById('input-weight').value);
    const gender = document.getElementById('input-gender').value;
    const age = parseInt(document.getElementById('input-age').value);

    if (!height || !weight || !age) {
      window._showToast('请填写完整的身高、体重和年龄', 'error');
      return;
    }

    if (height < 100 || height > 250) {
      window._showToast('请输入合理的身高 (100-250 cm)', 'error');
      return;
    }
    if (weight < 30 || weight > 300) {
      window._showToast('请输入合理的体重 (30-300 kg)', 'error');
      return;
    }
    if (age < 10 || age > 120) {
      window._showToast('请输入合理的年龄 (10-120)', 'error');
      return;
    }

    // Save profile
    Storage.set('profile', { height, weight, gender, age });

    // Calculate
    const bmi = I18n.calcBMI(weight, height);
    const bmiStatusObj = I18n.getBMIStatus(bmi);
    const idealWeight = I18n.getIdealWeight(height, gender);
    const bmr = I18n.calcBMR(weight, height, age, gender);

    // BMI ring: normalize to 0-40 BMI range for visual
    const ringMax = 40;
    const ringProgress = Math.min(bmi / ringMax, 1);
    const circumference = 326.73; // 2 * PI * 52
    const offset = circumference - (ringProgress * circumference);

    bmiValue.textContent = bmi;
    bmiRingFill.style.strokeDashoffset = offset;
    bmiRingFill.style.stroke = bmiStatusObj.color;

    bmiStatus.innerHTML = `
      <span style="color:${bmiStatusObj.color}">${bmiStatusObj.status}</span>
    `;

    bmiExtra.innerHTML = `
      <p>理想体重范围: <strong>${idealWeight.min} - ${idealWeight.max} kg</strong></p>
      <p>基础代谢 (BMR): <strong>${bmr} kcal/天</strong></p>
      <p style="margin-top:8px;font-size:0.85rem;color:var(--text-secondary)">${bmiStatusObj.advice}</p>
    `;

    bmiResultCard.classList.remove('hidden');
    bmiResultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  return { init, calculate };
})();
