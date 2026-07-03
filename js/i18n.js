/* ====== Content Constants & Messages ====== */
const I18n = (() => {

  /* Stage definitions: [minDays, maxDays, name, badge] */
  const stages = [
    { id: 1, minDays: 0,  maxDays: 3,  name: '迈出第一步', badge: '阶段 1' },
    { id: 2, minDays: 4,  maxDays: 7,  name: '习惯萌芽',   badge: '阶段 2' },
    { id: 3, minDays: 8,  maxDays: 14, name: '渐入佳境',   badge: '阶段 3' },
    { id: 4, minDays: 15, maxDays: 21, name: '自律养成',   badge: '阶段 4' },
    { id: 5, minDays: 22, maxDays: 30, name: '化茧成蝶',   badge: '阶段 5' },
    { id: 6, minDays: 31, maxDays: 60, name: '焕然一新',   badge: '阶段 6' },
    { id: 7, minDays: 61, maxDays: Infinity, name: '破茧成蝶', badge: '阶段 7' }
  ];

  /* Encouragement messages per stage */
  const encouragements = {
    1: [
      '千里之行，始于足下。今天的坚持是明天改变的起点！',
      '每一段伟大的旅程都从第一步开始，你已经迈出了最关键的一步！',
      '改变从来不是一蹴而就的，但今天你已经在路上了！',
      '欢迎来到全新的自己！坚持下去，你会感谢今天的你。',
      '恭喜你开始了这段旅程，每一次打卡都是对自己的承诺！'
    ],
    2: [
      '连续打卡好几天了，好习惯正在悄悄发芽！',
      '感觉到变化了吗？身体正在适应你的新节奏。',
      '习惯的养成需要21天，你已经走了三分之一，继续加油！',
      '每一天的坚持都在重塑你的身体和意志力！',
      '小小的坚持正在汇聚成大大的改变，相信自己！'
    ],
    3: [
      '渐入佳境！你已经度过了最难的起步期。',
      '自律正在变成一种习惯，不需要再靠意志力苦苦支撑。',
      '你的身体已经开始适应新的生活方式，继续前进！',
      '两周了！你已经超越了大多数半途而废的人。',
      '每一次想要放弃的时候，回想一下你已经走了多远。'
    ],
    4: [
      '21天成就一个习惯，你已经做到了！这不再是任务，而是生活。',
      '自律给你自由！现在的坚持会变成未来的底气。',
      '你的身体正在发生积极的改变，每一个细胞都在感谢你。',
      '从"坚持"到"享受"，你已经完成了最关键的转变。',
      '一个月快到了，回头看看，你已经比一个月前强大了太多！'
    ],
    5: [
      '化茧成蝶的过程虽然辛苦，但破茧而出的那一刻一切都值得！',
      '你已经坚持了一个月，这是多少人梦寐以求的自律！',
      '蜕变正在进行中，你的努力身体都记得。',
      '一个月前你也许会怀疑自己能不能做到，现在你已经证明了！',
      '自律不是束缚，而是给自己最好的礼物。'
    ],
    6: [
      '焕然一新！你的生活方式已经彻底改变。',
      '超过一个月了！这已经不是一时兴起，而是真正的蜕变。',
      '身边的人应该已经开始注意到你的变化了吧？',
      '你已经把健康生活变成了一种习惯，这才是最大的胜利！',
      '两个月的时间，你可以选择什么也不做，也可以选择让自己焕然一新。你选了后者！'
    ],
    7: [
      '你已经超越了99%的人！这份坚持本身就是一种力量。',
      '破茧成蝶，你已经成为了全新的自己！',
      '两个月以上！你不是在减肥，你是在重新定义自己的生活。',
      '坚持了这么久，你已经不需要任何人的鼓励了，因为你就是鼓励本身！',
      '人生的每一次蜕变都值得庆祝，而你已经完成了最美丽的一次！'
    ]
  };

  function getStage(totalDays) {
    for (const s of stages) {
      if (totalDays >= s.minDays && totalDays <= s.maxDays) return s;
    }
    return stages[stages.length - 1];
  }

  function getEncouragement(stageId) {
    const pool = encouragements[stageId] || encouragements[1];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /* BMI categories (Chinese standard) */
  function getBMIStatus(bmi) {
    if (bmi < 18.5) return { status: '偏瘦', color: '#3498db', advice: '你目前体重偏轻，建议适当增加营养摄入，配合力量训练增肌。减肥餐推荐可能不完全适合你，请结合自身情况调整。' };
    if (bmi < 24)   return { status: '正常', color: '#2ecc71', advice: '你的体重在正常范围内，保持现状就是最好的状态！如需减脂塑形，建议以运动为主，饮食微调。' };
    if (bmi < 28)   return { status: '偏胖', color: '#f39c12', advice: '你的体重略高于正常范围，通过合理的饮食控制与规律运动，可以较快恢复到健康体重。' };
    if (bmi < 30)   return { status: '肥胖 (I级)', color: '#e67e22', advice: '你的体重已进入肥胖范围，建议制定系统的减肥计划，结合打卡功能坚持执行。健康风险开始增加，现在行动还来得及！' };
    if (bmi < 35)   return { status: '肥胖 (II级)', color: '#e74c3c', advice: '体重明显超标，肥胖相关健康风险较高。强烈建议开始科学的减重计划，如有条件可咨询专业医生或营养师。' };
    return { status: '肥胖 (III级)', color: '#c0392b', advice: '重度肥胖，健康风险显著。强烈建议在专业医生指导下进行减重，同时配合饮食控制和适量运动。你并不孤单，从现在开始改变！' };
  }

  /* Ideal weight range (Broca formula approximation) */
  function getIdealWeight(heightCm, gender) {
    if (gender === 'male') {
      return { min: Math.round((heightCm - 100) * 0.85), max: Math.round((heightCm - 100) * 0.95) };
    }
    return { min: Math.round((heightCm - 105) * 0.85), max: Math.round((heightCm - 105) * 0.95) };
  }

  /* BMR using Mifflin-St Jeor */
  function calcBMR(weight, height, age, gender) {
    if (gender === 'male') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    }
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }

  /* BMI */
  function calcBMI(weight, height) {
    const h = height / 100;
    return Math.round((weight / (h * h)) * 10) / 10;
  }

  return {
    stages,
    encouragements,
    getStage,
    getEncouragement,
    getBMIStatus,
    getIdealWeight,
    calcBMR,
    calcBMI
  };
})();
