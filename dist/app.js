const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const STORAGE_KEY = "who_cares_family_v2";

const CATEGORIES = {
  health: { name: "健康照护", icon: "🩺", keywords: ["医院", "体检", "看病", "吃药", "药房", "复诊", "健康", "生病", "医生"], steps: ["发现健康需求", "比较医院与时间", "完成预约", "准备证件", "设置提醒", "现场陪同", "记录医嘱", "后续观察"] },
  meals: { name: "一周饮食", icon: "🍲", keywords: ["做饭", "顿饭", "晚饭", "早餐", "午饭", "吃什么", "食材", "菜", "烹饪", "外卖"], steps: ["确认家人时间", "决定吃什么", "查看现有食材", "考虑营养与忌口", "列采购清单", "完成烹饪", "处理剩余食材", "计划下一餐"] },
  inventory: { name: "日用品库存", icon: "🧻", keywords: ["日用品", "库存", "快用完", "采购", "买菜", "购物", "超市", "纸巾", "洗衣液"], steps: ["留意消耗速度", "检查现有库存", "比较购买渠道", "列出清单", "完成购买", "核对遗漏", "分类归位", "预测下次补充"] },
  cleaning: { name: "清洁整理", icon: "🧹", keywords: ["打扫", "洗碗", "垃圾", "清洁", "保洁", "洗衣", "收拾", "整理", "拖地"], steps: ["发现需要清理", "安排清洁时间", "准备清洁用品", "完成清洁", "分类与归位", "处理垃圾", "检查遗漏", "维持日常秩序"] },
  bills: { name: "家庭账单", icon: "🧾", keywords: ["账单", "水电", "缴费", "报销", "预算", "房租", "物业", "保险", "费用"], steps: ["记住截止日期", "核对金额", "协调家庭预算", "完成缴费", "保存凭证", "检查扣款", "记录支出", "提醒下个周期"] },
  repair: { name: "家庭维修", icon: "🔧", keywords: ["维修", "修好", "坏了", "水龙头", "灯泡", "师傅", "安装", "漏水", "家具", "粉刷", "粉刷匠", "油漆", "装修"], steps: ["发现故障", "判断紧急程度", "查找解决办法", "购买配件", "联系维修人员", "现场维修", "清理现场", "检查是否复发"] },
  transport: { name: "出行与车辆", icon: "🚗", keywords: ["开车", "接送", "加油", "车辆", "洗车", "通勤", "停车", "保养", "车"], steps: ["确认出发时间", "规划路线", "协调接送", "检查车辆状态", "准备随身物品", "现场执行", "处理停车与加油", "安排维护"] },
  children: { name: "孩子成长", icon: "🎒", keywords: ["孩子", "学校", "老师", "作业", "家长会", "兴趣班", "幼儿园", "辅导", "学习"], steps: ["留意孩子状态", "查看学校通知", "协调家庭时间", "准备材料", "提醒重要节点", "陪伴完成", "与老师沟通", "跟进后续变化"] },
  outings: { name: "家庭活动", icon: "⛺", keywords: ["周末", "出游", "旅行", "门票", "露营", "订票", "酒店", "天气", "行程"], steps: ["提出备选方案", "确认家人偏好", "查看天气", "比较预算", "完成预订", "准备随身物品", "规划路线", "安排返程"] },
  pets: { name: "宠物照护", icon: "🐕", keywords: ["宠物", "狗", "猫", "猫砂", "狗粮", "猫粮", "兽医", "疫苗", "铲屎"], patterns: [/遛.*狗/, /喂.*(?:狗|猫)/, /(?:狗|猫).*(?:洗澡|看病|吃药)/], steps: ["留意宠物状态", "安排喂食与活动", "检查食物用品", "遛狗或陪伴活动", "清理排泄与环境", "安排洗护或就医", "设置用药提醒", "持续观察变化"] },
  relationships: { name: "亲友联络", icon: "💬", keywords: ["父母", "家人", "老人", "电话", "生日", "礼物", "聚会", "亲戚", "朋友"], steps: ["记住重要日期", "留意亲友情绪", "协调联系时间", "准备礼物", "主动联络", "安排见面", "传达家庭信息", "后续关心"] },
  other: { name: "其他家庭事务", icon: "🏠", keywords: [], steps: ["发现需要处理", "明确任务边界", "收集必要信息", "安排时间", "完成执行", "告知相关成员", "检查结果", "记录下次提醒"] }
};

const DOMAINS = {
  daily: { name: "日常生活", icon: "🍲", categories: ["meals", "inventory", "cleaning"] },
  care: { name: "照护与关系", icon: "🤲", categories: ["health", "children", "pets", "relationships"] },
  home: { name: "家庭运营", icon: "🏠", categories: ["bills", "repair", "other"] },
  mobility: { name: "出行与活动", icon: "🚗", categories: ["transport", "outings"] }
};
const CATEGORY_DOMAIN = Object.fromEntries(Object.entries(DOMAINS).flatMap(([domain, value]) => value.categories.map((category) => [category, domain])));

const ACTIONS = {
  planning: { name: "计划准备", keywords: ["计划", "安排", "查", "选择", "决定", "比较", "预约", "准备", "规划", "订", "列", "找"] },
  reminder: { name: "持续提醒", keywords: ["记着", "记得", "提醒", "留意", "关注", "担心", "惦记"] },
  coordination: { name: "协调沟通", keywords: ["联系", "沟通", "协调", "确认", "请假", "商量", "通知"] },
  execution: { name: "现场执行", keywords: ["做", "洗", "打扫", "开车", "陪", "修", "取", "买", "送", "接", "完成", "收拾", "倒", "搬", "交", "遛", "盯", "监督", "值守"] },
  followup: { name: "后续跟进", keywords: ["跟进", "复诊", "记录", "观察", "核对", "检查", "复盘", "验收"] }
};

const DEMO_A = "这周我给孩子查了三家医院，预约了体检，准备证件，还一直记着复诊时间。我每天决定晚饭吃什么，查看冰箱缺什么并列购物清单。周末出游也是我查天气、找地方、订票和准备孩子的东西。我还提醒交水电费，联系了保洁，并记着给双方父母打电话。";
const DEMO_B = "这周我请假开车带孩子体检，在医院陪诊并去药房取药。我做了三次晚饭，负责每天洗碗和倒垃圾。周末我开车，搬了露营装备。我还修好了卫生间的水龙头，取了两个快递，给车加油并做了清洁。";
const DEMO_C = "这周我接送孩子上了两次兴趣班，和老师确认了下周的材料。我买了日用品，整理了客厅，还预约师傅检查漏水。";
const DEMO_TEXTS = [DEMO_A, DEMO_B, DEMO_C];
const MEMBER_COLORS = ["a", "b", "c", "d", "e", "f"];
const MEMBER_COLOR_OPTIONS = {
  a: { name: "珊瑚", hex: "#df765d" }, b: { name: "雾蓝", hex: "#6e88c9" }, c: { name: "鼠尾草", hex: "#739b87" },
  d: { name: "浅紫", hex: "#b487b9" }, e: { name: "赭金", hex: "#c59b55" }, f: { name: "湖蓝", hex: "#5d9fa5" }
};

let state = normalizeState(loadState()) || { family: null, currentMemberId: null, assignments: {}, clarifications: {}, demo: false };
let currentAnalysis = null;
let activeDomain = null;
let activeTopic = null;
let pendingRemovalId = null;
let draggedContributionId = null;

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}
function normalizeState(saved) {
  if (!saved?.family?.members?.length) return saved;
  saved.assignments ||= {};
  saved.clarifications ||= {};
  saved.family.ownerId ||= saved.family.members[0].id;
  saved.family.members.forEach((member, index) => {
    member.role = member.id === saved.family.ownerId ? "owner" : "member";
    member.color ||= MEMBER_COLORS[index % MEMBER_COLORS.length];
    member.initial ||= initials(member.name);
  });
  return saved;
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function initials(name) { return (name || "家").slice(-1); }
function memberColorHex(member) { return MEMBER_COLOR_OPTIONS[member?.color]?.hex || MEMBER_COLOR_OPTIONS.a.hex; }
function escapeHtml(value = "") { return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }
function makeCode(name) {
  const letters = (name.match(/[A-Za-z]/g) || ["H", "M"]).join("").slice(0, 2).toUpperCase().padEnd(2, "H");
  return `${letters}${Math.floor(1000 + Math.random() * 9000)}`;
}
function showToast(message) {
  const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2300);
}
function showSection(id) {
  ["hero", "onboarding", "familySpace", "recordSpace", "waitingSpace", "clarifySpace", "results"].forEach((section) => $(`#${section}`).classList.add("hidden"));
  $(`#${id}`).classList.remove("hidden"); window.scrollTo({ top: 0, behavior: "smooth" });
}

function splitSentences(text) {
  const fragments = text.split(/[。！？!?；;\n]+/).flatMap((block) => block.split(/[，,、]+/)).map((item) => item.trim()).filter((item) => item.length > 1);
  return fragments.reduce((sentences, item) => {
    const isMeasure = /^(?:每天|每周|每月|一周|每次|共|总共|大约|约|持续|花了|用了)/.test(item)
      && /(?:\d+|[一二三四五六七八九十两]+)\s*(?:次|小时|天|分钟)/.test(item);
    if (isMeasure && sentences.length) sentences[sentences.length - 1] += `，${item}`;
    else sentences.push(item);
    return sentences;
  }, []);
}
function parseCount(value) {
  if (/^\d+$/.test(value)) return Number(value);
  const digits = { 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
  if (value === "十") return 10;
  if (value.includes("十")) {
    const [before, after] = value.split("十");
    return (before ? digits[before] : 1) * 10 + (after ? digits[after] : 0);
  }
  return digits[value] || 1;
}
function estimateEffort(sentence, actions) {
  const weights = { planning: 2.2, reminder: 1.8, coordination: 2.4, execution: 3, followup: 2.2 };
  const uniqueActions = [...new Set(actions)];
  let score = uniqueActions.reduce((sum, action) => sum + (weights[action] || 1.5), 0);
  const breakdown = uniqueActions.map((action) => `${ACTIONS[action].name} ${weights[action] || 1.5}`);
  const reasons = [];
  if (/全天候|一整天|整天|全天/.test(sentence)) { score += 6; reasons.push("长时间在场"); breakdown.push("全天投入 +6"); }
  else if (/半天/.test(sentence)) { score += 4; reasons.push("半天投入"); breakdown.push("半天投入 +4"); }
  else if (/\d+\s*小时|[一二三四五六七八九十两]+\s*个?小时/.test(sentence)) { score += 3; reasons.push("明确时长"); breakdown.push("明确时长 +3"); }
  const daily = sentence.match(/每天(?:\s*(\d+|[一二三四五六七八九十两]+)\s*次)?/);
  const repeat = sentence.match(/(\d+|[一二三四五六七八九十两]+)\s*次/);
  if (daily) {
    const perDay = daily[1] ? parseCount(daily[1]) : 1; const count = perDay * 7; const repeatScore = Math.min(4, Math.max(0, count - 1));
    score += repeatScore; reasons.push(`每周约 ${count} 次`); breakdown.push(`每天 ${perDay} 次（按一周 ${count} 次） +${repeatScore}`);
  } else if (repeat) {
    const count = parseCount(repeat[1]); const repeatScore = Math.min(4, Math.max(0, count - 1)); score += repeatScore; reasons.push(`${count} 次重复`); breakdown.push(`${count} 次重复 +${repeatScore}`);
  }
  if (/盯|监督|值守|陪同|来回|搬运|清洁现场|照护/.test(sentence)) { score += 2; reasons.push("持续现场投入"); breakdown.push("持续现场 +2"); }
  if (!reasons.length) {
    if (/预约|联系|确认|安排|查|比较/.test(sentence)) reasons.push("计划与协调");
    else if (actions.includes("execution")) reasons.push("实际执行");
    else reasons.push("持续心智投入");
  }
  const value = Math.max(1, Math.min(12, Math.round(score)));
  return { value, reason: reasons.slice(0, 2).join("、"), breakdown: `${breakdown.join(" + ")} ≈ ${value} 点` };
}
function isNonContribution(sentence) {
  const compact = sentence.replace(/\s/g, "");
  return /(?:什么|啥)(?:也|都)?没(?:做|干)|没(?:做|干)什么|没有(?:做|干|承担|参与|负责)(?:任何|什么|家务|事情)?|(?:这周|本周)?没(?:做|干|参与|负责)(?:任何|什么|家务|事情)?|不(?:参与|负责)/.test(compact);
}
function analyzeText(text, memberId) {
  const sentences = splitSentences(text).filter((sentence) => !isNonContribution(sentence)).map((sentence, index) => {
    const normalized = sentence.replace(/[了着过]/g, "");
    let categories = Object.entries(CATEGORIES).filter(([key, value]) => key !== "other" && (value.keywords.some((word) => normalized.includes(word)) || value.patterns?.some((pattern) => pattern.test(normalized)))).map(([key]) => key);
    if (!categories.length) categories = ["other"];
    let actions = Object.entries(ACTIONS).filter(([, value]) => value.keywords.some((word) => normalized.includes(word))).map(([key]) => key);
    if (!actions.length) actions = ["execution"];
    const fineCategory = categories[0];
    return { id: `contrib-${memberId}-${index}`, text: sentence, categories, fineCategory, domain: CATEGORY_DOMAIN[fineCategory] || "home", actions, effort: estimateEffort(sentence, actions), memberId };
  });
  const categories = {};
  sentences.forEach((sentence) => sentence.categories.forEach((key) => {
    if (!categories[key]) categories[key] = { score: 0, mental: 0, execution: 0, sentences: [], actions: {} };
    const bucket = categories[key]; bucket.sentences.push(sentence.text);
    const mentalActions = sentence.actions.filter((action) => action !== "execution").length;
    const executionActions = sentence.actions.filter((action) => action === "execution").length;
    const actionTotal = mentalActions + executionActions || 1;
    const categoryShare = 1 / sentence.categories.length;
    bucket.score += sentence.effort.value * categoryShare;
    bucket.mental += sentence.effort.value * mentalActions / actionTotal * categoryShare;
    bucket.execution += sentence.effort.value * executionActions / actionTotal * categoryShare;
    sentence.actions.forEach((action) => {
      bucket.actions[action] = (bucket.actions[action] || 0) + 1;
    });
  }));
  const mental = Object.values(categories).reduce((sum, item) => sum + item.mental, 0);
  const execution = Object.values(categories).reduce((sum, item) => sum + item.execution, 0);
  return { sentences, categories, mental, execution, total: mental + execution };
}

function recognizedSummary(text) {
  if (text.trim().length < 4) return "开始输入后，这里会显示识别到的劳动类型。";
  const analysis = analyzeText(text, "preview");
  if (!analysis.sentences.length) return "暂未识别到具体劳动；“什么也没做”这类否定描述不会计入投入。";
  const categories = Object.keys(analysis.categories).slice(0, 4).map((key) => `${CATEGORIES[key].icon} ${CATEGORIES[key].name}`);
  const actionKeys = [...new Set(analysis.sentences.flatMap((sentence) => sentence.actions))];
  return `已识别 ${analysis.sentences.length} 项劳动，涉及 ${categories.join("、")}；其中包含${actionKeys.map((key) => ACTIONS[key].name).join("、")}。`;
}

function openOnboarding(mode) {
  showSection("onboarding");
  const joining = mode === "join";
  $("#createPanel").classList.toggle("hidden", joining); $("#joinPanel").classList.toggle("hidden", !joining);
  $("#onboardingEyebrow").textContent = joining ? "加入家庭空间" : "创建家庭空间";
  $("#onboardingTitle").textContent = joining ? "输入家人发给你的邀请码。" : "先给你们的家庭起个名字。";
  $("#onboardingDescription").textContent = joining ? (state.family ? `你目前在“${state.family.name}”。加入其他家庭后，本浏览器会切换到新的家庭空间。` : "加入后，你只需要在自己的手机上填写自己的记录。") : "创建后会得到一个邀请码和邀请链接，其他成员可以在自己的手机上加入。";
}

function openLeaveModal() {
  if (!state.family) return;
  $("#leaveFamilyName").textContent = state.family.name;
  $("#leaveModal").classList.remove("hidden");
  $("#cancelLeaveButton").focus();
}

function closeLeaveModal() { $("#leaveModal").classList.add("hidden"); }

function leaveFamily() {
  const familyName = state.family?.name || "当前家庭";
  state = { family: null, currentMemberId: null, assignments: {}, clarifications: {}, demo: false };
  localStorage.removeItem(STORAGE_KEY);
  history.replaceState({}, "", location.pathname);
  closeLeaveModal();
  showSection("hero");
  showToast(`已离开“${familyName}”，本地家庭记录已清除。`);
}

function createFamily() {
  const familyName = $("#familyName").value.trim() || "我们的家";
  const ownerName = $("#ownerName").value.trim() || "我";
  state = { family: { name: familyName, code: makeCode("HM"), ownerId: "a", members: [{ id: "a", name: ownerName, initial: initials(ownerName), role: "owner", status: "draft", text: "", color: "a" }] }, currentMemberId: "a", assignments: {}, clarifications: {}, demo: false };
  saveState(); renderFamily(); showSection("familySpace"); showToast("家庭空间已创建，可以邀请家人加入了。");
}

function joinFamily() {
  const code = $("#inviteCodeInput").value.trim().replace(/\s/g, "").toUpperCase();
  const name = $("#joinName").value.trim();
  if (code.length < 6 || !name) { showToast("请填写完整邀请码和你的称呼。"); return; }
  state = { family: { name: code === "SG4826" ? "松果之家" : "我们的家", code, ownerId: "a", members: [{ id: "a", name: "林予", initial: "予", role: "owner", status: "submitted", text: DEMO_A, color: "a" }, { id: "b", name, initial: initials(name), role: "member", status: "draft", text: "", color: "b" }] }, currentMemberId: "b", assignments: {}, clarifications: {}, demo: true };
  saveState(); renderFamily(); showSection("familySpace"); showToast(`你已加入“${state.family.name}”。`);
}

function loadDemoFamily() {
  state = { family: { name: "松果之家", code: "SG4826", ownerId: "a", members: [{ id: "a", name: "林予", initial: "予", role: "owner", status: "draft", text: DEMO_A, color: "a" }, { id: "b", name: "周然", initial: "然", role: "member", status: "submitted", text: DEMO_B, color: "b" }] }, currentMemberId: "a", assignments: {}, clarifications: {}, demo: true };
  saveState(); renderFamily(); showSection("familySpace"); showToast("演示家庭已载入。周然已在自己的设备上提交。");
}

function currentMember() { return state.family?.members.find((member) => member.id === state.currentMemberId); }
function isCurrentAdmin() { return state.family?.ownerId === state.currentMemberId; }
function renderFamily() {
  if (!state.family) return;
  $("#familyDisplayName").textContent = state.family.name; $("#inviteCode").textContent = state.family.code;
  const members = state.family.members; const submitted = members.filter((member) => member.status === "submitted").length;
  $("#memberCount").textContent = `${members.length} / 6`; $("#submittedCount").textContent = submitted;
  $("#memberTotal").textContent = Math.max(2, members.length);
  $("#submissionProgress").style.width = `${Math.round(submitted / Math.max(2, members.length) * 100)}%`;
  $("#submissionLegend").innerHTML = members.map((member) => `<span class="${member.status === "submitted" ? "done" : "waiting"}"><i></i>${escapeHtml(member.name)} · ${member.status === "submitted" ? "已提交" : "待提交"}</span>`).join("");
  const admin = isCurrentAdmin();
  const rows = members.map((member) => {
    const role = member.id === state.family.ownerId ? `<span class="role-badge">管理员</span>` : "";
    const switchButton = state.demo && member.id !== state.currentMemberId ? `<button class="member-action" data-switch-member="${member.id}">切换测试视角</button>` : "";
    const adminButtons = admin && member.id !== state.family.ownerId ? `<button class="member-action" data-transfer-admin="${member.id}">设为管理员</button><button class="member-action danger" data-remove-member="${member.id}">移除</button>` : "";
    const colorPicker = member.id === state.currentMemberId ? `<div class="member-color-picker"><span>我的代表色</span>${MEMBER_COLORS.map((color) => `<button class="color-swatch${member.color === color ? " active" : ""}" data-member-color="${color}" data-color-member="${member.id}" style="--swatch:${MEMBER_COLOR_OPTIONS[color].hex}" aria-label="选择${MEMBER_COLOR_OPTIONS[color].name}" title="${MEMBER_COLOR_OPTIONS[color].name}"></button>`).join("")}</div>` : "";
    return `<div class="member-row" style="--member-color:${memberColorHex(member)}"><div class="member-avatar avatar-${member.color}">${escapeHtml(member.initial)}</div><div class="member-info"><strong>${escapeHtml(member.name)}${member.id === state.currentMemberId ? "（我）" : ""}${role}</strong><small>${member.id === state.currentMemberId ? "当前设备" : "通过邀请链接加入"}</small><div class="member-actions">${switchButton}${adminButtons}</div>${colorPicker}</div><span class="member-status ${member.status === "submitted" ? "done" : "waiting"}">${member.status === "submitted" ? "本周已提交" : "等待记录"}</span></div>`;
  });
  if (members.length < 2) rows.push(`<div class="member-row"><div class="member-avatar" style="background:#d9ded9;color:#80918b">+</div><div><strong>等待家人加入</strong><small>发送邀请码 ${state.family.code}</small></div><span class="member-status">尚未加入</span></div>`);
  $("#memberList").innerHTML = rows.join("");
  $("#adminPanel").classList.toggle("hidden", !admin);
  $$('[data-switch-member]').forEach((button) => button.addEventListener("click", () => switchTestMember(button.dataset.switchMember)));
  $$('[data-transfer-admin]').forEach((button) => button.addEventListener("click", () => transferAdmin(button.dataset.transferAdmin)));
  $$('[data-remove-member]').forEach((button) => button.addEventListener("click", () => openRemoveMemberModal(button.dataset.removeMember)));
  $$('[data-member-color]').forEach((button) => button.addEventListener("click", () => updateMemberColor(button.dataset.colorMember, button.dataset.memberColor)));
  const mine = currentMember(); $("#recordMineButton").textContent = mine?.status === "submitted" ? "修改我的记录" : "记录我的一周";
  const ready = members.length >= 2 && members.every((member) => member.status === "submitted");
  $("#viewResultsButton").disabled = !ready; $("#viewResultsButton").textContent = ready ? "查看共同劳动地图" : "等待其他成员";
  $("#progressCopy").textContent = ready ? "所有成员已经完成，本周共同视角现已解锁。" : "你可以先完成自己的记录，系统会在其他成员提交后通知你。";
}

function updateMemberColor(memberId, color) {
  if (memberId !== state.currentMemberId || !MEMBER_COLOR_OPTIONS[color]) return;
  const member = currentMember(); if (!member) return;
  member.color = color; saveState(); renderFamily(); showToast(`已将你的代表色改为${MEMBER_COLOR_OPTIONS[color].name}。`);
}

function addTestMember() {
  if (!isCurrentAdmin()) { showToast("只有家庭管理员可以添加测试成员。"); return; }
  if (state.family.members.length >= 6) { showToast("演示家庭最多支持 6 位成员。"); return; }
  const field = $("#testMemberName"); const fallbackNames = ["陈昕", "赵宁", "韩舟", "许安"];
  const name = field.value.trim() || fallbackNames[state.family.members.length - 2] || `成员${state.family.members.length + 1}`;
  const id = `m${Date.now().toString(36)}`; const index = state.family.members.length;
  state.family.members.push({ id, name, initial: initials(name), role: "member", status: "draft", text: "", color: MEMBER_COLORS[index % MEMBER_COLORS.length] });
  state.currentMemberId = id; state.demo = true; field.value = ""; saveState(); renderFamily(); openRecord();
  showToast(`已添加“${name}”，现在模拟在其设备上填写。`);
}

function switchTestMember(memberId) {
  const member = state.family.members.find((item) => item.id === memberId); if (!member || !state.demo) return;
  state.currentMemberId = memberId; saveState(); renderFamily(); showToast(`已切换到“${member.name}”的测试视角。`);
}

function transferAdmin(memberId) {
  if (!isCurrentAdmin()) return;
  const member = state.family.members.find((item) => item.id === memberId); if (!member) return;
  state.family.ownerId = memberId; state.family.members.forEach((item) => { item.role = item.id === memberId ? "owner" : "member"; });
  saveState(); renderFamily(); showToast(`已将家庭管理员转让给“${member.name}”。`);
}

function openRemoveMemberModal(memberId) {
  if (!isCurrentAdmin() || memberId === state.family.ownerId) return;
  const member = state.family.members.find((item) => item.id === memberId); if (!member) return;
  pendingRemovalId = memberId; $("#removeMemberName").textContent = member.name; $("#removeMemberModal").classList.remove("hidden"); $("#cancelRemoveMemberButton").focus();
}

function closeRemoveMemberModal() { pendingRemovalId = null; $("#removeMemberModal").classList.add("hidden"); }
function confirmRemoveMember() {
  if (!isCurrentAdmin() || !pendingRemovalId) return;
  const member = state.family.members.find((item) => item.id === pendingRemovalId); if (!member) { closeRemoveMemberModal(); return; }
  state.family.members = state.family.members.filter((item) => item.id !== pendingRemovalId);
  Object.keys(state.assignments).forEach((key) => { if (state.assignments[key] === pendingRemovalId) delete state.assignments[key]; });
  closeRemoveMemberModal(); saveState(); renderFamily(); showToast(`已将“${member.name}”移出家庭。`);
}

function openRecord() {
  if (!state.family) { openOnboarding("create"); return; }
  const member = currentMember(); $("#currentMemberName").textContent = member.name; $("#memberInput").value = member.text || "";
  $("#analysisPreview").querySelector("strong").textContent = recognizedSummary(member.text || ""); showSection("recordSpace");
}

function buildClarificationQuestions(member) {
  const current = analyzeText(member.text, member.id);
  const others = state.family.members.filter((item) => item.id !== member.id && item.status === "submitted").map((item) => ({ member: item, data: analyzeText(item.text, item.id) }));
  const questions = [];
  const vague = current.sentences.find((item) => /很多|一些|经常|一直|不少|各种|处理|帮忙/.test(item.text) || (!/(?:\d+|[一二三四五六七八九十两]+)\s*(?:次|小时|天|分钟)|全天|半天/.test(item.text) && item.effort.value <= 3));
  if (vague) {
    const hasCoordination = vague.actions.some((action) => action === "planning" || action === "coordination" || action === "followup");
    const hasReminder = vague.actions.includes("reminder");
    const prompt = hasCoordination ? `“${vague.text}”大约花了多久、联系了几次，还做了哪些准备或跟进？` : hasReminder ? `“${vague.text}”这一周提醒或惦记了几次，每次大约花了多久？` : `“${vague.text}”每次大约花了多久，这一周做了几次？`;
    const placeholder = hasCoordination ? "例如：前后联系了 3 次，总共约 40 分钟。" : hasReminder ? "例如：这周提醒了 4 次，每次约 5 分钟。" : "例如：每天 1 次，每次约 20 分钟。";
    questions.push({ type: "detail", context: vague.text, label: "把投入量化", prompt, placeholder });
  }
  const currentCategories = new Set(current.sentences.map((item) => item.fineCategory));
  const categoryMentions = {};
  others.forEach(({ member: otherMember, data }) => new Set(data.sentences.map((item) => item.fineCategory)).forEach((key) => {
    categoryMentions[key] ||= []; categoryMentions[key].push(otherMember.name);
  }));
  const omitted = Object.entries(categoryMentions).filter(([key, names]) => !currentCategories.has(key) && names.length >= 2).sort((a, b) => b[1].length - a[1].length)[0]
    || Object.entries(categoryMentions).filter(([key]) => !currentCategories.has(key)).sort((a, b) => b[1].length - a[1].length)[0];
  if (omitted) {
    const [key, names] = omitted;
    questions.push({ type: "gap", context: CATEGORIES[key].name, label: "核对可能遗漏", prompt: `${names.join("、")}提到了“${CATEGORIES[key].name}”。你在这件事里是否也承担了计划、提醒、采购、现场执行或收尾？`, placeholder: "有的话写下你实际承担的部分；没有可以留空。" });
  }
  return questions.slice(0, 2);
}

function openClarification() {
  const member = currentMember(); if (!member) return;
  const questions = buildClarificationQuestions(member);
  $("#clarificationMemberName").textContent = member.name;
  $("#clarificationList").innerHTML = questions.length ? questions.map((question, index) => `<article class="clarification-card"><span>${question.label}</span><h3>${escapeHtml(question.prompt)}</h3><textarea data-clarification-answer="${index}" data-context="${escapeHtml(question.context)}" placeholder="${escapeHtml(question.placeholder)}"></textarea></article>`).join("") : `<article class="clarification-card complete"><span>信息完整</span><h3>目前的描述已经包含清晰的劳动事项，可以生成劳动地图。</h3></article>`;
  showSection("clarifySpace");
}

function finishClarification(applyAnswers) {
  const member = currentMember(); if (!member) return;
  if (applyAnswers) {
    const additions = $$('[data-clarification-answer]').map((field) => ({ answer: field.value.trim(), context: field.dataset.context })).filter((item) => item.answer);
    additions.forEach((item) => {
      const detail = item.answer.replace(/[，,、；;。！？!?]+/g, " ");
      if (member.text.includes(item.context)) member.text = member.text.replace(item.context, `${item.context}（补充：${detail}）`);
      else member.text += `\n${item.context}（补充：${detail}）`;
    });
  }
  state.clarifications[member.id] = member.text; state.assignments = {}; saveState(); renderResults(); showSection("results"); showToast("补充确认完成，劳动地图已更新。");
}

function openAnalysisFlow() {
  const member = currentMember();
  if (member && state.clarifications[member.id] === member.text) { renderResults(); showSection("results"); }
  else openClarification();
}

function submitRecord() {
  const text = $("#memberInput").value.trim();
  if (text.length < 4) { showToast("至少写下一件你实际承担的事情。"); return; }
  const member = currentMember(); member.text = text; member.status = "submitted"; state.assignments = {}; delete state.clarifications[member.id]; saveState(); renderFamily();
  const ready = state.family.members.length >= 2 && state.family.members.every((item) => item.status === "submitted");
  if (ready) { openClarification(); showToast("记录已提交，请补充两个细节。"); }
  else { showSection("waitingSpace"); showToast("你的记录已提交，正在等待家人。"); }
}

function simulateFamilySubmission() {
  if (state.family.members.length < 2) state.family.members.push({ id: "b", name: "周然", initial: "然", role: "member", status: "submitted", text: DEMO_B, color: "b" });
  state.family.members.forEach((member, index) => {
    if (member.id !== state.currentMemberId && member.status !== "submitted") { member.status = "submitted"; member.text ||= DEMO_TEXTS[index % DEMO_TEXTS.length]; }
  });
  saveState(); renderFamily(); openClarification(); showToast("家人的演示记录已同步，请补充两个细节。");
}

async function copyInvite(kind = "link") {
  if (!state.family) return;
  const link = `${location.origin}${location.pathname}?join=${encodeURIComponent(state.family.code)}`;
  const value = kind === "code" ? state.family.code : link;
  try { await navigator.clipboard.writeText(value); showToast(kind === "code" ? "邀请码已复制。" : "邀请链接已复制，可以发给家人了。"); }
  catch { showToast(`邀请码：${state.family.code}`); }
}

function buildCombinedAnalysis() {
  const members = state.family.members.filter((member) => member.status === "submitted");
  const analyses = members.map((member) => ({ member, data: analyzeText(member.text, member.id) }));
  const contributions = analyses.flatMap(({ member, data }) => data.sentences.map((sentence) => ({ ...sentence, member })));
  const categoryKeys = [...new Set(contributions.map((item) => item.fineCategory))];
  const topics = categoryKeys.map((key) => ({
    id: key,
    name: CATEGORIES[key].name,
    icon: CATEGORIES[key].icon,
    domain: CATEGORY_DOMAIN[key] || "home",
    contributions: contributions.filter((item) => item.fineCategory === key)
  })).sort((a, b) => b.contributions.reduce((sum, item) => sum + item.effort.value, 0) - a.contributions.reduce((sum, item) => sum + item.effort.value, 0));
  const domains = [...new Set(topics.map((topic) => topic.domain))];
  const shared = topics.filter((topic) => new Set(topic.contributions.map((item) => item.memberId)).size >= 2);
  return { members, analyses, contributions, topics, domains, shared };
}

function renderResults() {
  currentAnalysis = buildCombinedAnalysis();
  if (currentAnalysis.members.length < 2) return;
  $("#analysisFamilyName").textContent = `${state.family.name} · 本周共同视角`;
  $("#sharedMetric").innerHTML = `${currentAnalysis.domains.length}<small>个</small>`;
  $("#taskMetric").innerHTML = `${currentAnalysis.contributions.length}<small>项</small>`;
  $("#packageMetric").innerHTML = `${currentAnalysis.shared.length}<small>件</small>`;
  const totalMental = currentAnalysis.analyses.reduce((sum, item) => sum + item.data.mental, 0) || 1;
  const totalVisible = currentAnalysis.analyses.reduce((sum, item) => sum + item.data.execution, 0) || 1;
  const baseline = balanceFor({});
  const highestTotal = [...currentAnalysis.analyses].sort((a, b) => baseline.totals[b.member.id] - baseline.totals[a.member.id])[0];
  const totalShare = Math.round(baseline.shares[highestTotal.member.id]);
  const mentalShare = Math.round(highestTotal.data.mental / totalMental * 100);
  const visibleShare = Math.round(highestTotal.data.execution / totalVisible * 100);
  $("#headlineInsight").innerHTML = `${escapeHtml(highestTotal.member.name)}的总投入最高，占本周家庭投入的 <b>${totalShare}%</b>。其中，可见执行占全家的 <b>${visibleShare}%</b>，计划、提醒与协调占 <b>${mentalShare}%</b>。`;
  $("#headlineDetail").textContent = "总投入占比与下方平衡模拟的初始占比采用同一套点数；点数综合劳动方式、时长、周频次和持续投入。";
  activeDomain = currentAnalysis.domains[0] || "home";
  activeTopic = currentAnalysis.topics.find((topic) => topic.domain === activeDomain)?.id || "other";
  renderRawRecords(); renderDomainTabs(); renderIceberg(activeDomain); renderTopicCarousel(); renderComparison(activeTopic); renderBalanceSimulator();
}

function renderRawRecords() {
  $("#rawRecordGrid").innerHTML = currentAnalysis.members.map((member) => `<article class="raw-record-card" style="--member-color:${memberColorHex(member)}"><div class="raw-record-head"><span class="member-avatar avatar-${member.color}">${escapeHtml(member.initial)}</span><div><strong>${escapeHtml(member.name)}</strong><small>${member.id === state.family.ownerId ? "家庭管理员" : "家庭成员"}</small></div></div><p>${escapeHtml(member.text)}</p></article>`).join("");
}

function renderDomainTabs() {
  $("#categoryTabs").innerHTML = currentAnalysis.domains.map((key) => `<button class="${key === activeDomain ? "active" : ""}" data-domain="${key}">${DOMAINS[key].icon} ${DOMAINS[key].name}</button>`).join("");
  $$('[data-domain]').forEach((button) => button.addEventListener("click", () => {
    activeDomain = button.dataset.domain;
    activeTopic = currentAnalysis.topics.find((topic) => topic.domain === activeDomain)?.id;
    renderDomainTabs(); renderIceberg(activeDomain); renderTopicCarousel(); renderComparison(activeTopic);
  }));
}
function shorten(text, max = 23) { return text.length > max ? `${text.slice(0, max)}…` : text; }
function renderIceberg(domain) {
  const items = currentAnalysis.contributions.filter((item) => item.domain === domain);
  const containsMentalWork = (item) => item.actions.some((action) => action !== "execution");
  const visible = items.filter((item) => item.actions.includes("execution") && !containsMentalWork(item));
  const hidden = items.filter(containsMentalWork);
  const chip = (item) => `<span class="ice-item"><b>${escapeHtml(item.member.name)}</b> · ${escapeHtml(shorten(item.text, 17))}</span>`;
  $("#visibleTaskList").innerHTML = visible.length ? visible.slice(0, 5).map(chip).join("") : `<span class="ice-item">本周没有明确写出现场执行</span>`;
  $("#hiddenTaskList").innerHTML = hidden.length ? hidden.slice(0, 7).map(chip).join("") : `<span class="ice-item">本周没有明确写出计划、提醒或跟进</span>`;
}

function renderTopicCarousel() {
  const topics = currentAnalysis.topics.filter((topic) => topic.domain === activeDomain);
  $("#topicCarousel").innerHTML = topics.map((topic) => {
    const members = new Set(topic.contributions.map((item) => item.memberId)).size;
    const effort = topic.contributions.reduce((sum, item) => sum + item.effort.value, 0);
    return `<button class="topic-card ${topic.id === activeTopic ? "active" : ""}" data-topic="${topic.id}"><span>${topic.icon}</span><strong>${topic.name}</strong><small>${topic.contributions.length} 条贡献 · ${members} 人 · ${effort} 点</small></button>`;
  }).join("");
  $$('[data-topic]').forEach((button) => button.addEventListener("click", () => { activeTopic = button.dataset.topic; renderTopicCarousel(); renderComparison(activeTopic); }));
}

function renderComparison(topicId) {
  const topic = currentAnalysis.topics.find((item) => item.id === topicId);
  if (!topic) return;
  const memberCount = new Set(topic.contributions.map((item) => item.memberId)).size;
  const totalEffort = topic.contributions.reduce((sum, item) => sum + item.effort.value, 0);
  $("#compareCategory").textContent = topic.name;
  $("#compareBadge").textContent = `${memberCount} 位成员 · ${topic.contributions.length} 条具体贡献 · ${totalEffort} 点投入`;
  $("#voiceList").innerHTML = currentAnalysis.members.map((member) => {
    const items = topic.contributions.filter((item) => item.memberId === member.id);
    const cards = items.length ? items.map((item) => `<div class="contribution-quote"><p>“${escapeHtml(item.text)}。”</p><div><span>${item.actions.map((action) => ACTIONS[action].name).join(" · ")}</span><strong>${item.effort.value} 点</strong><small>${item.effort.breakdown}</small></div></div>`).join("") : `<p class="no-mention">这位成员的记录中没有提到这一具体事项。</p>`;
    return `<div class="voice-card" style="--member-color:${memberColorHex(member)}"><div class="mini-avatar avatar-${member.color}">${escapeHtml(member.initial)}</div><div class="voice-copy"><strong>${escapeHtml(member.name)}</strong>${cards}</div></div>`;
  }).join("");
  $("#contributionSummary").innerHTML = `<strong>这里逐条比较每位成员的具体贡献。</strong><p>例如“预约粉刷匠”计入计划协调；“全天在家盯着粉刷匠”叠加全天投入和持续现场投入。</p>`;
}

function balanceFor(assignments = {}) {
  const totals = Object.fromEntries(currentAnalysis.members.map((member) => [member.id, 0]));
  currentAnalysis.contributions.forEach((item) => { const owner = assignments[item.id] || item.memberId; totals[owner] = (totals[owner] || 0) + item.effort.value; });
  const total = Object.values(totals).reduce((sum, value) => sum + value, 0) || 1;
  const ideal = 100 / currentAnalysis.members.length;
  const shares = Object.fromEntries(Object.entries(totals).map(([id, value]) => [id, value / total * 100]));
  const imbalance = Object.values(shares).reduce((sum, share) => sum + Math.abs(share - ideal), 0) / 2;
  return { totals, shares, score: Math.max(0, Math.round(100 - imbalance)) };
}

function renderBalanceSimulator() {
  const members = currentAnalysis.members; const baseline = balanceFor({}); const simulated = balanceFor(state.assignments);
  const changed = currentAnalysis.contributions.filter((item) => state.assignments[item.id] && state.assignments[item.id] !== item.memberId).length;
  $("#currentBalanceScore").textContent = `${baseline.score}%`;
  $("#simulatedBalanceScore").textContent = `${simulated.score}%`;
  const delta = simulated.score - baseline.score;
  $("#balanceDelta").textContent = delta === 0 ? (changed ? "成员占比已变化，整体平衡度持平" : "尚未调整") : `${delta > 0 ? "+" : ""}${delta} 个百分点`;
  $("#balanceDelta").className = delta > 0 ? "positive" : delta < 0 ? "negative" : "";
  $("#burdenBars").innerHTML = members.map((member) => `<div class="burden-row" style="--member-color:${memberColorHex(member)}"><span><i class="avatar-${member.color}"></i>${escapeHtml(member.name)}</span><div><b style="width:${baseline.shares[member.id]}%"></b><em style="width:${simulated.shares[member.id]}%"></em></div><small>${Math.round(baseline.shares[member.id])}% → ${Math.round(simulated.shares[member.id])}%</small></div>`).join("");
  const cardFor = (item) => {
    const owner = state.assignments[item.id] || item.memberId;
    const options = members.map((member) => `<option value="${member.id}"${owner === member.id ? " selected" : ""}>${escapeHtml(member.name)}</option>`).join("");
    const original = owner !== item.memberId ? `<small class="original-owner">原记录：${escapeHtml(item.member.name)}</small>` : "";
    return `<article class="contribution-card" data-contribution-card="${item.id}"><span class="package-handle" draggable="true" data-contribution-drag="${item.id}" title="拖动这条具体劳动">⠿</span><div class="contribution-main"><span>${CATEGORIES[item.fineCategory].icon} ${CATEGORIES[item.fineCategory].name}</span><strong>${escapeHtml(item.text)}</strong><small>${item.effort.breakdown}</small>${original}</div><b class="effort-score">${item.effort.value}<small>点</small></b><label class="owner-picker contribution-owner"><span>模拟改由</span><select data-contribution-owner="${item.id}">${options}</select></label></article>`;
  };
  $("#balanceColumns").innerHTML = members.map((member) => {
    const items = currentAnalysis.contributions.filter((item) => (state.assignments[item.id] || item.memberId) === member.id);
    return `<div class="load-column" data-drop-member="${member.id}" style="--member-color:${memberColorHex(member)}"><div class="column-head"><div class="member-avatar avatar-${member.color}">${escapeHtml(member.initial)}</div><div><span>${escapeHtml(member.name)}</span><strong>${simulated.totals[member.id]} 点 · ${Math.round(simulated.shares[member.id])}%</strong></div></div><div class="package-list">${items.map(cardFor).join("") || `<div class="drop-empty">可以把一条具体劳动拖到这里，模拟由此成员承担。</div>`}</div></div>`;
  }).join("");
  $$('[data-contribution-drag]').forEach((handle) => {
    handle.addEventListener("dragstart", (event) => { draggedContributionId = handle.dataset.contributionDrag; const card = handle.closest(".contribution-card"); card.classList.add("dragging"); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", draggedContributionId); event.dataTransfer.setDragImage(card, 24, 24); });
    handle.addEventListener("dragend", () => { draggedContributionId = null; $$(".contribution-card").forEach((card) => card.classList.remove("dragging")); $$("[data-drop-member]").forEach((column) => column.classList.remove("drop-target")); });
  });
  $$('[data-drop-member]').forEach((column) => {
    column.addEventListener("dragover", (event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; column.classList.add("drop-target"); });
    column.addEventListener("dragleave", (event) => { if (!column.contains(event.relatedTarget)) column.classList.remove("drop-target"); });
    column.addEventListener("drop", (event) => { event.preventDefault(); const id = event.dataTransfer.getData("text/plain") || draggedContributionId; column.classList.remove("drop-target"); if (id) assignContribution(id, column.dataset.dropMember); });
  });
  $$('[data-contribution-owner]').forEach((select) => select.addEventListener("change", () => assignContribution(select.dataset.contributionOwner, select.value)));
  $("#actionSummary").innerHTML = changed ? `<strong>已调整 ${changed} 条具体劳动，平衡度从 ${baseline.score}% 变为 ${simulated.score}%。</strong>继续拖动卡片可以比较其他分配方案。` : `<strong>当前平衡度为 ${baseline.score}%。</strong>拖动任意一条具体劳动，查看另一种承担方式下的成员占比和平衡度。`;
}
function assignContribution(id, ownerId) {
  const item = currentAnalysis.contributions.find((contribution) => contribution.id === id); if (!item) return;
  if (ownerId === item.memberId) delete state.assignments[id]; else state.assignments[id] = ownerId;
  saveState(); renderBalanceSimulator();
  const label = currentAnalysis.members.find((member) => member.id === ownerId)?.name;
  showToast(`已模拟将“${shorten(item.text, 12)}”改由${label || "其他成员"}承担。`);
}
function resetSimulation() {
  currentAnalysis.contributions.forEach((item) => delete state.assignments[item.id]); saveState(); renderBalanceSimulator(); showToast("已恢复原始承担情况。");
}

$("#createFamilyButton").addEventListener("click", () => openOnboarding("create"));
$("#joinFamilyButton").addEventListener("click", () => openOnboarding("join"));
$("#demoButton").addEventListener("click", loadDemoFamily);
$("#confirmCreateButton").addEventListener("click", createFamily); $("#confirmJoinButton").addEventListener("click", joinFamily);
$("#joinAnotherButton").addEventListener("click", () => openOnboarding("join"));
$("#leaveFamilyButton").addEventListener("click", openLeaveModal);
$("#cancelLeaveButton").addEventListener("click", closeLeaveModal);
$("#confirmLeaveButton").addEventListener("click", leaveFamily);
$("#leaveModal").addEventListener("click", (event) => { if (event.target === $("#leaveModal")) closeLeaveModal(); });
$("#addTestMemberButton").addEventListener("click", addTestMember);
$("#testMemberName").addEventListener("keydown", (event) => { if (event.key === "Enter") addTestMember(); });
$("#cancelRemoveMemberButton").addEventListener("click", closeRemoveMemberModal);
$("#confirmRemoveMemberButton").addEventListener("click", confirmRemoveMember);
$("#removeMemberModal").addEventListener("click", (event) => { if (event.target === $("#removeMemberModal")) closeRemoveMemberModal(); });
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!$("#leaveModal").classList.contains("hidden")) closeLeaveModal();
  if (!$("#removeMemberModal").classList.contains("hidden")) closeRemoveMemberModal();
});
$("#recordMineButton").addEventListener("click", openRecord); $("#backToFamily").addEventListener("click", () => { renderFamily(); showSection("familySpace"); });
$("#memberInput").addEventListener("input", (event) => $("#analysisPreview").querySelector("strong").textContent = recognizedSummary(event.target.value));
$$('[data-prompt]').forEach((button) => button.addEventListener("click", () => { const field = $("#memberInput"); field.value += `${field.value ? "\n" : ""}${button.dataset.prompt}`; field.focus(); field.dispatchEvent(new Event("input")); }));
$("#submitRecordButton").addEventListener("click", submitRecord); $("#simulateFamilyButton").addEventListener("click", simulateFamilySubmission);
$("#copyCodeButton").addEventListener("click", () => copyInvite("code")); $("#copyLinkButton").addEventListener("click", () => copyInvite("link")); $("#waitingCopyLink").addEventListener("click", () => copyInvite("link"));
$("#viewResultsButton").addEventListener("click", openAnalysisFlow); $("#resultsBack").addEventListener("click", () => { renderFamily(); showSection("familySpace"); });
$("#backFromClarification").addEventListener("click", () => { renderFamily(); showSection("familySpace"); });
$("#applyClarificationButton").addEventListener("click", () => finishClarification(true));
$("#skipClarificationButton").addEventListener("click", () => finishClarification(false));
$("#topicPrev").addEventListener("click", () => $("#topicCarousel").scrollBy({ left: -280, behavior: "smooth" }));
$("#topicNext").addEventListener("click", () => $("#topicCarousel").scrollBy({ left: 280, behavior: "smooth" }));
$("#resetSimulationButton").addEventListener("click", resetSimulation);
$$('[data-nav]').forEach((button) => button.addEventListener("click", () => {
  const target = button.dataset.nav;
  if (target === "join") { openOnboarding("join"); return; }
  if (!state.family) { openOnboarding("create"); return; }
  if (target === "record") openRecord(); else { renderFamily(); showSection("familySpace"); }
}));

const joinCode = new URLSearchParams(location.search).get("join");
if (joinCode) { $("#inviteCodeInput").value = joinCode; openOnboarding("join"); }
else if (state.family) { renderFamily(); showSection("familySpace"); }
