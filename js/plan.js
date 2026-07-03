/* ====== Weight Loss Plan Generator v2 — 6 Tiers + Questionnaire ====== */
const Plan = (() => {
  const planList = document.getElementById('plan-list');
  const planDetailCard = document.getElementById('plan-detail-card');
  const planDetailContent = document.getElementById('plan-detail-content');
  const questionnaireEl = document.getElementById('plan-questionnaire');

  let questionnaireDone = false;

  const plans = [
    {
      id: 'trial',
      name: '体验减',
      icon: '&#127807;',
      description: '零压力起步，了解自己的身体',
      deficit: 150,
      monthlyLoss: '0.5-1 kg',
      exercise: '无运动要求，仅建议饭后散步10分钟',
      strictness: '极宽松',
      duration: '无限制',
      color: '#a8d8ea',
      suitable: '完全新手、体重正常仅想微调、对减肥没有紧迫需求的人群',
      notSuitable: 'BMI超28且有明确短期减重目标的人群',
      risks: '减重速度较慢，可能因看不到明显效果而失去动力。建议以月度为单位观察变化。',
      details: {
        targetRatio: { protein: 20, carb: 50, fat: 30 },
        meals: {
          breakfast: '正常早餐，无需特别限制。建议：全麦面包+蛋+牛奶，或燕麦+水果。热量约400kcal。',
          lunch: '正常午餐，主食吃饱即可。建议：米饭+肉+蔬菜，吃到七八分饱。热量约600kcal。',
          dinner: '晚餐主食减半，增加蔬菜。建议：半碗饭+蒸鱼+两种蔬菜。热量约450kcal。'
        },
        weeklyMealPlan: [
          { day: '周一', breakfast: '全麦面包+水煮蛋+牛奶', lunch: '米饭+清蒸鱼+西兰花', dinner: '豆腐汤+凉拌黄瓜', snack: '苹果1个' },
          { day: '周二', breakfast: '燕麦粥+蓝莓', lunch: '糙米饭+鸡胸肉+菠菜', dinner: '番茄蛋汤+蒸南瓜', snack: '酸奶1杯' },
          { day: '周三', breakfast: '希腊酸奶+坚果+水果', lunch: '荞麦面+虾仁+蔬菜', dinner: '紫菜蛋花汤+凉拌海带', snack: '圣女果10颗' },
          { day: '周四', breakfast: '水煮蛋2个+全麦吐司', lunch: '米饭+瘦牛肉+炒时蔬', dinner: '蔬菜沙拉+煎豆腐', snack: '坚果15g' },
          { day: '周五', breakfast: '红薯+酸奶', lunch: '糙米饭+三文鱼+西兰花', dinner: '菌菇汤+蒸蛋', snack: '柚子2瓣' },
          { day: '周六', breakfast: '鸡蛋饼+豆浆', lunch: '意面+虾仁+番茄酱', dinner: '自由餐（注意分量）', snack: '黑巧10g' },
          { day: '周日', breakfast: '水果燕麦碗', lunch: '自由搭配（不过量）', dinner: '蔬菜汤+煎鸡胸', snack: '黄瓜不限量' }
        ],
        workoutPlan: [
          '每天饭后散步10-15分钟',
          '周末可选户外活动（骑车/徒步）30分钟',
          '每周2次简单拉伸（5分钟即可）'
        ],
        timeline: [
          '第1周: 记录饮食和体重，建立数据意识',
          '第2周: 开始减少含糖饮料，晚餐后不进食',
          '第1个月: 体重可能有微小变化，主要是水分调节',
          '第3个月: 预计减重1.5-3kg，身体围度开始变化'
        ]
      }
    },
    {
      id: 'easy',
      name: '随心减',
      icon: '&#127793;',
      description: '轻松起步，无痛减重',
      deficit: 300,
      monthlyLoss: '1-2 kg',
      exercise: '无强制要求，建议每天散步30分钟',
      strictness: '宽松',
      duration: '无限制',
      color: '#6bcb77',
      suitable: 'BMI 24-28、想健康减重但不希望影响日常生活的人群',
      notSuitable: '急需短期显著减重（如婚前/体检前）的人群',
      risks: '减重速度温和，需要耐心。如果饮食控制不严格可能效果不明显。',
      details: {
        targetRatio: { protein: 25, carb: 45, fat: 30 },
        meals: {
          breakfast: '低GI主食搭配优质蛋白，如：全麦面包+鸡蛋+牛奶，或燕麦粥+坚果。早餐热量350-400kcal。',
          lunch: '正常吃，主食减量1/3，蔬菜占盘子一半。推荐：糙米饭+瘦肉+两种蔬菜。午餐热量500-550kcal。',
          dinner: '晚餐少吃主食，以蛋白质和蔬菜为主。推荐：蒸鱼/鸡胸+时蔬+少量粗粮。晚餐350-400kcal。'
        },
        weeklyMealPlan: [
          { day: '周一', breakfast: '全麦面包+水煮蛋+脱脂奶', lunch: '糙米饭+鸡胸肉+西兰花+胡萝卜', dinner: '蒸鳕鱼+菠菜+半碗藜麦', snack: '原味坚果15g' },
          { day: '周二', breakfast: '燕麦粥+蓝莓+水煮蛋', lunch: '荞麦面+虾仁+黄瓜+番茄', dinner: '豆腐蔬菜杂烩+紫菜汤', snack: '希腊酸奶100g' },
          { day: '周三', breakfast: '希腊酸奶+坚果+香蕉', lunch: '糙米饭+瘦牛肉+彩椒+蘑菇', dinner: '番茄菌菇豆腐汤+半根玉米', snack: '苹果1个' },
          { day: '周四', breakfast: '蛋饼+生菜+全麦吐司', lunch: '红薯+鸡胸+炒青菜', dinner: '蔬菜沙拉+水煮蛋2个+牛油果1/4', snack: '圣女果200g' },
          { day: '周五', breakfast: '水煮蛋2个+黄瓜+红薯', lunch: '藜麦+三文鱼+芦笋', dinner: '海带豆腐汤+蒸南瓜', snack: '海苔5g' },
          { day: '周六', breakfast: '全麦吐司+牛油果+蛋', lunch: '糙米饭+清蒸鱼+炒时蔬', dinner: '鸡胸沙拉+玉米半根', snack: '黑巧克力10g' },
          { day: '周日', breakfast: '燕麦+牛奶+蓝莓', lunch: '自由搭配（控制主食量）', dinner: '蔬菜汤+煎豆腐+蘑菇', snack: '柚子2瓣' }
        ],
        workoutPlan: [
          '每天快走30分钟（可分两次进行）',
          '每周2次居家力量训练（深蹲、平板支撑、俯卧撑各3组）',
          '周末1次较长有氧（骑行/游泳/慢跑40分钟）'
        ],
        timeline: [
          '第1周: 适应新的饮食节奏，戒含糖饮料',
          '第2周: 体重开始下降（主要是水分），精力变好',
          '第1个月: 预计减重1-2kg，腰围开始缩小',
          '第3个月: 预计减重3-6kg，身体明显轻盈'
        ]
      }
    },
    {
      id: 'moderate',
      name: '认真减',
      icon: '&#128170;',
      description: '科学减脂，稳步见效',
      deficit: 500,
      monthlyLoss: '2-3 kg',
      exercise: '每周3次有氧运动，每次30-45分钟',
      strictness: '适中',
      duration: '建议持续3-6个月',
      color: '#f39c12',
      suitable: 'BMI 26-32、有明确减重目标、能坚持规律运动的人群',
      notSuitable: '有关节问题或运动受限未咨询医生者、孕妇',
      risks: '热量缺口较大可能导致初期饥饿感，建议多摄入高纤维蔬菜增加饱腹感。运动初期注意热身防受伤。',
      details: {
        targetRatio: { protein: 30, carb: 40, fat: 30 },
        meals: {
          breakfast: '高蛋白早餐：2个鸡蛋+全麦面包1片+蔬菜。或蛋白粉+燕麦+水果。热量300-350kcal。',
          lunch: '主食控制在1小碗（约150g熟重），蛋白质手掌大小，蔬菜不限量。热量450-500kcal。',
          dinner: '晚餐轻碳水或无碳水：蛋白质+大量蔬菜。如：鸡胸沙拉、蒸鱼配西兰花。热量300-350kcal。'
        },
        weeklyMealPlan: [
          { day: '周一', breakfast: '水煮蛋2个+全麦面包1片+黄瓜', lunch: '糙米饭150g+鸡胸150g+西兰花200g', dinner: '清蒸鳕鱼+菠菜+蘑菇', snack: '蛋白2个' },
          { day: '周二', breakfast: '燕麦30g+蛋白粉1勺+蓝莓', lunch: '藜麦100g+虾仁150g+生菜沙拉', dinner: '豆腐蔬菜杂烩', snack: '无糖酸奶100g' },
          { day: '周三', breakfast: '蛋清3个+全蛋1个+番茄', lunch: '红薯200g+瘦牛肉120g+彩椒', dinner: '番茄菌菇汤+煎鸡胸', snack: '黄瓜不限量' },
          { day: '周四', breakfast: '希腊酸奶150g+坚果10g+苹果', lunch: '糙米饭150g+三文鱼120g+西兰花', dinner: '蔬菜沙拉+水煮蛋2个', snack: '蛋白棒1根(低糖)' },
          { day: '周五', breakfast: '全麦吐司+牛油果1/4+水煮蛋2个', lunch: '荞麦面+火鸡胸120g+蔬菜', dinner: '海带豆腐汤+蒸南瓜', snack: '圣女果200g' },
          { day: '周六', breakfast: '蛋白粉+燕麦+香蕉半根', lunch: '糙米饭150g+清蒸鱼150g+炒时蔬', dinner: '鸡胸沙拉+牛油果1/4', snack: '牛肉干20g' },
          { day: '周日', breakfast: '水煮蛋2个+蔬菜', lunch: '自由搭配（控制碳水）', dinner: '花菜炒鸡胸（伪炒饭）', snack: '柚子2瓣' }
        ],
        workoutPlan: [
          '周一: 慢跑/快走35分钟 + 核心训练10分钟（平板支撑、卷腹）',
          '周三: HIIT 20分钟 + 力量训练（深蹲、俯卧撑、哑铃划船各3组x12次）',
          '周五: 游泳/骑行/跳绳40分钟',
          '每天: 保证8000步以上'
        ],
        timeline: [
          '第1周: 严格执行三餐，戒糖戒酒，完成3次运动',
          '第2周: 体重明显下降，运动耐力提升',
          '第1个月: 预计减重2-3kg，腰围缩小2-4cm',
          '第3个月: 预计减重6-9kg，体态明显改善'
        ]
      }
    },
    {
      id: 'strict',
      name: '严格减',
      icon: '&#127942;',
      description: '全力以赴，快速蜕变',
      deficit: 700,
      monthlyLoss: '3-4 kg',
      exercise: '每周5次运动（3次有氧+2次力量），每次45-60分钟',
      strictness: '严格',
      duration: '建议不超过3个月，之后转为认真减',
      color: '#e74c3c',
      suitable: 'BMI 28+、有明确短期目标（如婚礼/体检）、有运动基础的人群',
      notSuitable: '孕妇、有心血管疾病、饮食失调史、BMI<24、青少年',
      risks: '较大热量缺口可能导致代谢适应性下降。不建议长期执行（超3个月）。如出现头晕、乏力、脱发等，立即停止并增加热量摄入。',
      details: {
        targetRatio: { protein: 35, carb: 30, fat: 35 },
        meals: {
          breakfast: '蛋白质为主：3个蛋白+1个全蛋+蔬菜。或蛋白粉+希腊酸奶+蓝莓。热量250-300kcal。',
          lunch: '主食极少量（约100g熟重）或红薯/南瓜替代。蛋白质+大量蔬菜。热量400-450kcal。',
          dinner: '几乎零碳水：纯蛋白质+蔬菜。如：煎鸡胸+西兰花+蘑菇。热量250-300kcal。'
        },
        weeklyMealPlan: [
          { day: '周一', breakfast: '蛋清3个+全蛋1个+菠菜', lunch: '鸡胸200g+西兰花+南瓜200g', dinner: '鳕鱼150g+西兰花+蘑菇', snack: '蛋白2个' },
          { day: '周二', breakfast: '蛋白粉1勺+希腊酸奶+蓝莓', lunch: '虾仁200g+生菜沙拉+红薯150g', dinner: '豆腐200g+菠菜+海带', snack: '黄瓜不限量' },
          { day: '周三', breakfast: '蛋清3个+全蛋1个+番茄', lunch: '瘦牛肉150g+藜麦80g+彩椒', dinner: '鸡胸150g+花菜+蘑菇', snack: '零卡果冻' },
          { day: '周四', breakfast: '希腊酸奶200g+坚果10g', lunch: '三文鱼150g+西兰花+南瓜', dinner: '蔬菜沙拉+水煮蛋3个蛋白', snack: '蛋白粉冲水' },
          { day: '周五', breakfast: '蛋清3个+黄瓜+番茄', lunch: '火鸡胸150g+红薯150g+菠菜', dinner: '豆腐蔬菜汤+煎鸡胸100g', snack: '芹菜不限量' },
          { day: '周六', breakfast: '蛋白粉+燕麦20g+蓝莓', lunch: '鸡胸200g+西兰花+藜麦80g', dinner: '鳕鱼150g+花菜+蘑菇', snack: '牛肉干20g' },
          { day: '周日', breakfast: '蛋清3个+蔬菜', lunch: '自由搭配（低碳水高蛋白）', dinner: '番茄菌菇汤+鸡胸150g', snack: '圣女果100g' }
        ],
        workoutPlan: [
          '周一/四: 力量训练45分钟（深蹲、硬拉、卧推、划船、推举各3组x10次）+ 有氧15分钟',
          '周二/五: HIIT 25分钟 + 核心训练15分钟',
          '周三: 有氧50分钟（慢跑/游泳/骑行，心率控制在燃脂区间）',
          '周六: 户外活动（爬山/球类）或休息',
          '周日: 主动恢复（瑜伽/拉伸30分钟）',
          '每天: 10000步以上'
        ],
        timeline: [
          '第1周: 可能出现饥饿感和疲劳感，大量喝水，多吃蔬菜填补',
          '第2周: 身体适应，能量回升，体重快速下降（水分+脂肪）',
          '第1个月: 预计减重3-4kg，效果显著',
          '第8周: 预计减重6-8kg，建议此后切换至"认真减"方案维持'
        ]
      }
    },
    {
      id: 'sprint',
      name: '冲刺减',
      icon: '&#128293;',
      description: '短期冲刺，极限燃脂',
      deficit: 900,
      monthlyLoss: '4-5 kg',
      exercise: '每周6次运动（4次有氧+2次力量），每次50-70分钟',
      strictness: '非常严格',
      duration: '严格限制4-8周，不可延长',
      color: '#8e44ad',
      suitable: 'BMI 30+、有紧急减重需求（如手术前/重要活动）、有专业指导、意志力极强者',
      notSuitable: 'BMI<26、无运动基础者、有慢性疾病、孕妇、青少年、曾有饮食障碍者',
      risks: '此为极限方案，必须严格限制在8周内。可能的风险包括：肌肉流失、代谢下降、月经紊乱、胆结石风险增加、免疫力下降。执行前强烈建议咨询医生。如出现任何不适立即停止。',
      details: {
        targetRatio: { protein: 40, carb: 20, fat: 40 },
        meals: {
          breakfast: '纯蛋白+少量脂肪：3个蛋白+1个全蛋+牛油果1/4。或蛋白粉+希腊酸奶。热量200-250kcal。',
          lunch: '大量蛋白+蔬菜+极少量碳水：鸡胸200g+西兰花+菠菜。热量350-400kcal。',
          dinner: '零碳水：纯蛋白+蔬菜。鸡胸/鱼/虾150g+蔬菜不限量。热量200-250kcal。'
        },
        weeklyMealPlan: [
          { day: '周一', breakfast: '蛋清3个+全蛋1个+牛油果1/4', lunch: '鸡胸200g+西兰花+菠菜', dinner: '鳕鱼150g+花菜+海带', snack: '蛋白2个' },
          { day: '周二', breakfast: '蛋白粉1勺+希腊酸奶100g', lunch: '虾仁200g+生菜+黄瓜', dinner: '鸡胸150g+西兰花+蘑菇', snack: '零卡果冻' },
          { day: '周三', breakfast: '蛋清3个+全蛋1个+番茄', lunch: '瘦牛肉150g+彩椒+西兰花', dinner: '豆腐200g+菠菜+海带汤', snack: '芹菜不限量' },
          { day: '周四', breakfast: '希腊酸奶150g+坚果5g', lunch: '三文鱼150g+花菜+菠菜', dinner: '鸡胸150g+西兰花', snack: '蛋白粉冲水' },
          { day: '周五', breakfast: '蛋清3个+牛油果1/4', lunch: '火鸡胸200g+黄瓜+生菜', dinner: '鳕鱼150g+蘑菇+海带', snack: '黄瓜不限量' },
          { day: '周六', breakfast: '蛋白粉1勺+水', lunch: '鸡胸200g+西兰花+南瓜100g', dinner: '蔬菜沙拉+虾仁150g', snack: '牛肉干15g' },
          { day: '周日', breakfast: '蛋清3个+蔬菜', lunch: '高蛋白自由搭配（碳水<50g）', dinner: '番茄菌菇汤+鸡胸150g', snack: '圣女果50g' }
        ],
        workoutPlan: [
          '周一/三/五: 力量训练50分钟（大肌群为主）+ 有氧20分钟',
          '周二/四/六: 有氧60分钟（晨起空腹快走或慢跑，心率控制在60-70%最大心率）',
          '周日: 主动恢复/拉伸',
          '每天: 12000步以上',
          '尝试16:8间歇断食（8小时内吃完三餐，16小时禁食，可喝水/黑咖啡/茶）'
        ],
        timeline: [
          '第1周: 身体冲击期，饥饿感强烈，多喝水+黑咖啡+零卡饮料辅助',
          '第2周: 酮症适应期（低碳水可能导致"酮流感"），补充电解质',
          '第4周: 预计减重4-5kg，体能适应，效果显著',
          '第8周: 预计减重8-10kg，必须强制切换至过渡方案（逐渐增加碳水）',
          '警告: 第8周后必须停止！不可长期执行！'
        ]
      }
    },
    {
      id: 'sculpt',
      name: '塑形减',
      icon: '&#128170;',
      description: '不减重，只塑形',
      deficit: 0,
      monthlyLoss: '体重不变，体脂率降低',
      exercise: '每周4-5次力量训练，每次50-60分钟',
      strictness: '技术型',
      duration: '无限制，建议至少3个月',
      color: '#3498db',
      suitable: 'BMI正常但体脂率偏高（瘦胖子）、想增肌减脂同时进行、对体重数字不在意更关注体型的人群',
      notSuitable: 'BMI超28且需要先减重的、完全无运动基础的（建议先体验减适应运动）',
      risks: '体重可能不降反升（肌肉增加），如只看体重数字会误以为没效果。建议用体脂秤、量尺和拍照记录变化。',
      details: {
        targetRatio: { protein: 35, carb: 35, fat: 30 },
        meals: {
          breakfast: '高蛋白+适量碳水：2个蛋+燕麦50g+牛奶。热量约400kcal。',
          lunch: '均衡搭配：糙米饭+瘦肉/鱼+大量蔬菜。热量约550kcal。',
          dinner: '蛋白质+蔬菜为主，适量碳水：鸡胸+西兰花+红薯。热量约400kcal。'
        },
        weeklyMealPlan: [
          { day: '周一', breakfast: '燕麦50g+蛋白粉1勺+蓝莓', lunch: '糙米饭+鸡胸180g+西兰花', dinner: '三文鱼150g+红薯+菠菜', snack: '希腊酸奶150g' },
          { day: '周二', breakfast: '全麦面包+蛋2个+牛油果', lunch: '藜麦+瘦牛肉150g+彩椒', dinner: '豆腐蔬菜杂烩+玉米半根', snack: '坚果20g' },
          { day: '周三', breakfast: '蛋白粉+燕麦+香蕉', lunch: '糙米饭+虾仁180g+蔬菜', dinner: '鸡胸+南瓜+西兰花', snack: '蛋白棒1根' },
          { day: '周四', breakfast: '蛋2个+全麦吐司+番茄', lunch: '红薯+火鸡胸150g+菠菜', dinner: '鳕鱼+藜麦+蘑菇', snack: '酸奶+蓝莓' },
          { day: '周五', breakfast: '希腊酸奶+燕麦+坚果+水果', lunch: '糙米饭+三文鱼+蔬菜', dinner: '鸡胸沙拉+红薯', snack: '水煮蛋2个' },
          { day: '周六', breakfast: '蛋白粉+全麦面包+蛋', lunch: '自由搭配(高蛋白均衡)', dinner: '牛排+蔬菜+红薯', snack: '牛肉干+水果' },
          { day: '周日', breakfast: '蛋2个+燕麦+水果', lunch: '自由搭配', dinner: '蔬菜汤+鸡胸+藜麦', snack: '希腊酸奶' }
        ],
        workoutPlan: [
          '周一: 胸部+三头肌（卧推、飞鸟、臂屈伸、俯卧撑各4组x10次）',
          '周二: 背部+二头肌（引体向上、划船、下拉、弯举各4组x10次）',
          '周三: 休息或轻度有氧30分钟',
          '周四: 腿部+肩部（深蹲、硬拉、推举、侧平举各4组x10次）',
          '周五: 全身循环训练 + 核心（波比跳、壶铃摇摆、平板支撑）',
          '周六: 户外运动/有氧40分钟',
          '周日: 休息',
          '重点: 渐进性超负荷——每周增加重量或次数，拍照记录体型变化而非只看体重秤'
        ],
        timeline: [
          '第1-2周: 学习动作标准，找到合适的训练重量',
          '第1个月: 力量明显提升，体型开始紧致',
          '第3个月: 体脂率下降2-4%，肌肉线条初步显现',
          '第6个月: 体型明显改变，基础代谢提升，减脂更容易'
        ]
      }
    }
  ];

  function init() {
    renderQuestionnaire();
    renderPlanList();
  }

  /* ====== Questionnaire ====== */
  function renderQuestionnaire() {
    if (!questionnaireEl) return;
    questionnaireEl.innerHTML = `
      <div class="card" id="quiz-card">
        <h2 class="card-title">找到最适合你的方案</h2>
        <p style="color:var(--text-secondary);margin-bottom:var(--space-md);font-size:var(--font-size-sm)">回答3个问题，帮你推荐最合适的减肥方案</p>

        <div class="quiz-question" id="quiz-q1">
          <p class="quiz-label">1. 你的减重目标是什么？</p>
          <div class="quiz-options">
            <button class="btn btn-outline quiz-opt" data-q="1" data-a="1">只是想了解一下</button>
            <button class="btn btn-outline quiz-opt" data-q="1" data-a="2">慢慢减，不急</button>
            <button class="btn btn-outline quiz-opt" data-q="1" data-a="3">有明确的减重计划</button>
            <button class="btn btn-outline quiz-opt" data-q="1" data-a="4">需要较快看到效果</button>
            <button class="btn btn-outline quiz-opt" data-q="1" data-a="5">紧急需要在短期内减重</button>
            <button class="btn btn-outline quiz-opt" data-q="1" data-a="6">体重OK，想塑形变紧致</button>
          </div>
        </div>

        <div class="quiz-question hidden" id="quiz-q2">
          <p class="quiz-label">2. 你目前运动习惯如何？</p>
          <div class="quiz-options">
            <button class="btn btn-outline quiz-opt" data-q="2" data-a="1">几乎不运动</button>
            <button class="btn btn-outline quiz-opt" data-q="2" data-a="2">偶尔散步/轻度活动</button>
            <button class="btn btn-outline quiz-opt" data-q="2" data-a="3">每周运动2-3次</button>
            <button class="btn btn-outline quiz-opt" data-q="2" data-a="4">每周运动4次以上，有力量训练基础</button>
          </div>
        </div>

        <div class="quiz-question hidden" id="quiz-q3">
          <p class="quiz-label">3. 你对饮食控制的态度？</p>
          <div class="quiz-options">
            <button class="btn btn-outline quiz-opt" data-q="3" data-a="1">不想太控制，正常吃就行</button>
            <button class="btn btn-outline quiz-opt" data-q="3" data-a="2">可以适当调整，但不能太严格</button>
            <button class="btn btn-outline quiz-opt" data-q="3" data-a="3">愿意认真控制饮食</button>
            <button class="btn btn-outline quiz-opt" data-q="3" data-a="4">可以严格自律，短期极限没问题</button>
          </div>
        </div>

        <div id="quiz-result" class="hidden" style="margin-top:var(--space-md)"></div>
      </div>
    `;

    let answers = {};
    document.querySelectorAll('.quiz-opt').forEach(btn => {
      btn.addEventListener('click', function () {
        const q = parseInt(this.dataset.q);
        const a = parseInt(this.dataset.a);
        answers[q] = a;

        // Highlight selected
        this.parentElement.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Show next question or result
        if (q === 1) document.getElementById('quiz-q2').classList.remove('hidden');
        if (q === 2) document.getElementById('quiz-q3').classList.remove('hidden');
        if (q === 3 && answers[1] && answers[2] && answers[3]) {
          showQuizResult(answers);
        }
      });
    });
  }

  function showQuizResult(answers) {
    const resultEl = document.getElementById('quiz-result');
    // Scoring: sum answers, lower = easier plan
    const score = answers[1] + answers[2] + answers[3];

    let recommended;
    if (answers[1] === 6) recommended = 'sculpt';
    else if (score <= 4) recommended = 'trial';
    else if (score <= 6) recommended = 'easy';
    else if (score <= 8) recommended = 'moderate';
    else if (score <= 10) recommended = 'strict';
    else recommended = 'sprint';

    // Warn if sprint recommended but exercise is low
    if (recommended === 'sprint' && answers[2] < 3) {
      recommended = 'strict';
    }

    const plan = plans.find(p => p.id === recommended);
    resultEl.classList.remove('hidden');
    resultEl.innerHTML = `
      <div style="background:${plan.color}22;border:2px solid ${plan.color};border-radius:var(--border-radius);padding:var(--space-md);text-align:center">
        <p style="font-weight:700;font-size:var(--font-size-lg);margin-bottom:4px">推荐方案: ${plan.icon} ${plan.name}</p>
        <p style="color:var(--text-secondary);font-size:var(--font-size-sm)">${plan.description}</p>
        <button class="btn btn-primary" style="margin-top:var(--space-sm);width:auto" id="btn-goto-plan" data-plan="${plan.id}">查看详细方案</button>
      </div>
    `;

    document.getElementById('btn-goto-plan').addEventListener('click', function () {
      const pid = this.dataset.plan;
      const plan = plans.find(p => p.id === pid);
      // Highlight the recommended plan card
      document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
      const card = document.querySelector(`.plan-card[data-plan="${pid}"]`);
      if (card) {
        card.classList.add('selected');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      showPlanDetail(plan);
    });
  }

  /* ====== Plan List ====== */
  function renderPlanList() {
    planList.innerHTML = plans.map(p => `
      <div class="card plan-card" data-plan="${p.id}" style="border-left: 4px solid ${p.color}">
        <div class="plan-tier">
          <span>${p.icon}</span> ${p.name}
          <span style="font-size:var(--font-size-sm);color:var(--text-secondary);font-weight:400;margin-left:8px">${p.strictness}</span>
        </div>
        <p style="color:var(--text-secondary);margin-bottom:var(--space-sm)">${p.description}</p>
        <div class="plan-meta">
          <span class="plan-meta-item">&#128293; 缺口: ${p.deficit} kcal</span>
          <span class="plan-meta-item">&#9878; 月减: ${p.monthlyLoss}</span>
          <span class="plan-meta-item">&#9200; 周期: ${p.duration}</span>
        </div>
      </div>
    `).join('');

    planList.querySelectorAll('.plan-card').forEach(card => {
      card.addEventListener('click', () => {
        const plan = plans.find(p => p.id === card.dataset.plan);
        planList.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        showPlanDetail(plan);
      });
    });
  }

  function showPlanDetail(plan) {
    const d = plan.details;
    let html = `
      <h2 class="card-title">${plan.icon} ${plan.name} — 详细方案</h2>

      <div class="plan-meta" style="margin-bottom:var(--space-md);flex-wrap:wrap">
        <span class="plan-meta-item">&#128293; 日热量缺口: ${plan.deficit} kcal</span>
        <span class="plan-meta-item">&#9878; 预期月减: ${plan.monthlyLoss}</span>
        <span class="plan-meta-item">&#9200; 建议周期: ${plan.duration}</span>
        <span class="plan-meta-item">&#127758; 难度: ${plan.strictness}</span>
      </div>

      <div class="plan-section" style="display:flex;gap:var(--space-md);flex-wrap:wrap">
        <div style="flex:1;min-width:200px;background:#2ecc7122;padding:var(--space-md);border-radius:var(--border-radius);font-size:var(--font-size-sm)">
          <strong style="color:#27ae60">&#10004; 适用人群</strong>
          <p style="margin-top:4px">${plan.suitable}</p>
        </div>
        <div style="flex:1;min-width:200px;background:#e74c3c22;padding:var(--space-md);border-radius:var(--border-radius);font-size:var(--font-size-sm)">
          <strong style="color:#c0392b">&#10008; 不适用人群</strong>
          <p style="margin-top:4px">${plan.notSuitable}</p>
        </div>
      </div>

      <div class="plan-section">
        <h4>&#9888; 风险提示</h4>
        <p style="font-size:var(--font-size-sm);color:#e67e22">${plan.risks}</p>
      </div>

      <div class="plan-section">
        <h4>营养素配比</h4>
        <p style="font-size:var(--font-size-sm)">
          蛋白质 ${d.targetRatio.protein}% | 碳水 ${d.targetRatio.carb}% | 脂肪 ${d.targetRatio.fat}%
        </p>
      </div>

      <div class="plan-section">
        <h4>&#127749; 早餐</h4>
        <p style="font-size:var(--font-size-sm)">${d.meals.breakfast}</p>
      </div>
      <div class="plan-section">
        <h4>&#127747; 午餐</h4>
        <p style="font-size:var(--font-size-sm)">${d.meals.lunch}</p>
      </div>
      <div class="plan-section">
        <h4>&#127748; 晚餐</h4>
        <p style="font-size:var(--font-size-sm)">${d.meals.dinner}</p>
      </div>

      <div class="plan-section">
        <h4>&#128197; 每周食谱</h4>
        <div style="overflow-x:auto">
          <table class="weekly-meal-table">
            <thead><tr><th>日期</th><th>早餐</th><th>午餐</th><th>晚餐</th><th>零食</th></tr></thead>
            <tbody>
              ${d.weeklyMealPlan.map(m => `
                <tr><td>${m.day}</td><td>${m.breakfast}</td><td>${m.lunch}</td><td>${m.dinner}</td><td>${m.snack}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="plan-section">
        <h4>&#127947; 运动计划</h4>
        ${d.workoutPlan.map(w => `<p style="font-size:var(--font-size-sm);padding:2px 0">&#8226; ${w}</p>`).join('')}
      </div>

      <div class="plan-section">
        <h4>&#9200; 预期时间线</h4>
        ${d.timeline.map(t => `<p style="font-size:var(--font-size-sm);padding:4px 0;border-bottom:1px dotted var(--border-color)">${t}</p>`).join('')}
      </div>

      <button class="btn btn-primary" style="margin-top:var(--space-md)" id="btn-select-plan" data-plan="${plan.id}">
        选择「${plan.name}」方案
      </button>
    `;

    planDetailContent.innerHTML = html;
    planDetailCard.classList.remove('hidden');
    planDetailCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    planDetailCard.classList.remove('anim-fade-in-up');
    void planDetailCard.offsetWidth;
    planDetailCard.classList.add('anim-fade-in-up');

    document.getElementById('btn-select-plan').addEventListener('click', () => {
      const profile = Storage.get('profile');
      if (!profile || !profile.weight) {
        window._showToast('请先在健康页面填写身体数据', 'info');
        return;
      }
      Storage.set('currentPlan', {
        tier: plan.id,
        startDate: Calendar.formatDate(new Date()),
        startWeight: profile.weight,
        planName: plan.name,
        deficit: plan.deficit
      });
      window._showToast(`已选择「${plan.name}」方案！开始你的减肥之旅吧！`, 'success');
      Confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 60, 1.2);
    });
  }

  return { init };
})();
