const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const STORAGE_KEY = "who_cares_family_v2";

const CATEGORIES = {
  health: { name: "健康照护", keywords: ["医院", "体检", "看病", "吃药", "药房", "复诊", "健康", "生病", "医生"], steps: ["发现健康需求", "比较医院与时间", "完成预约", "准备证件", "设置提醒", "现场陪同", "记录医嘱", "后续观察"] },
  meals: { name: "一周饮食", keywords: ["做饭", "顿饭", "晚饭", "早餐", "午饭", "吃什么", "食材", "菜", "烹饪", "外卖"], steps: ["确认家人时间", "决定吃什么", "查看现有食材", "考虑营养与忌口", "列采购清单", "完成烹饪", "处理剩余食材", "计划下一餐"] },
  inventory: { name: "日用品库存", keywords: ["日用品", "库存", "快用完", "采购", "买菜", "购物", "超市", "纸巾", "洗衣液"], steps: ["留意消耗速度", "检查现有库存", "比较购买渠道", "列出清单", "完成购买", "核对遗漏", "分类归位", "预测下次补充"] },
  cleaning: { name: "清洁整理", keywords: ["打扫", "洗碗", "垃圾", "清洁", "保洁", "洗衣", "收拾", "整理", "拖地"], steps: ["发现需要清理", "安排清洁时间", "准备清洁用品", "完成清洁", "分类与归位", "处理垃圾", "检查遗漏", "维持日常秩序"] },
  bills: { name: "家庭账单", keywords: ["账单", "水电", "缴费", "报销", "预算", "房租", "物业", "保险", "费用"], steps: ["记住截止日期", "核对金额", "协调家庭预算", "完成缴费", "保存凭证", "检查扣款", "记录支出", "提醒下个周期"] },
  repair: { name: "家庭维修", keywords: ["维修", "修好", "坏了", "水龙头", "灯泡", "师傅", "安装", "漏水", "家具", "粉刷", "粉刷匠", "油漆", "装修"], steps: ["发现故障", "判断紧急程度", "查找解决办法", "购买配件", "联系维修人员", "现场维修", "清理现场", "检查是否复发"] },
  transport: { name: "出行与车辆", keywords: ["开车", "接送", "加油", "车辆", "洗车", "通勤", "停车", "保养", "车"], steps: ["确认出发时间", "规划路线", "协调接送", "检查车辆状态", "准备随身物品", "现场执行", "处理停车与加油", "安排维护"] },
  children: { name: "孩子成长", keywords: ["孩子", "学校", "老师", "作业", "家长会", "兴趣班", "幼儿园", "辅导", "学习"], steps: ["留意孩子状态", "查看学校通知", "协调家庭时间", "准备材料", "提醒重要节点", "陪伴完成", "与老师沟通", "跟进后续变化"] },
  outings: { name: "家庭活动", keywords: ["周末", "出游", "旅行", "门票", "露营", "订票", "酒店", "天气", "行程"], steps: ["提出备选方案", "确认家人偏好", "查看天气", "比较预算", "完成预订", "准备随身物品", "规划路线", "安排返程"] },
  pets: { name: "宠物照护", keywords: ["宠物", "狗", "猫", "猫砂", "狗粮", "猫粮", "兽医", "疫苗", "铲屎"], patterns: [/遛.*狗/, /喂.*(?:狗|猫)/, /(?:狗|猫).*(?:洗澡|看病|吃药)/], steps: ["留意宠物状态", "安排喂食与活动", "检查食物用品", "遛狗或陪伴活动", "清理排泄与环境", "安排洗护或就医", "设置用药提醒", "持续观察变化"] },
  relationships: { name: "亲友联络", keywords: ["父母", "家人", "老人", "电话", "生日", "礼物", "聚会", "亲戚", "朋友"], steps: ["记住重要日期", "留意亲友情绪", "协调联系时间", "准备礼物", "主动联络", "安排见面", "传达家庭信息", "后续关心"] },
  other: { name: "其他家庭事务", keywords: [], steps: ["发现需要处理", "明确任务边界", "收集必要信息", "安排时间", "完成执行", "告知相关成员", "检查结果", "记录下次提醒"] }
};

const DOMAINS = {
  daily: { name: "日常生活", categories: ["meals", "inventory", "cleaning"] },
  care: { name: "照护与关系", categories: ["health", "children", "pets", "relationships"] },
  home: { name: "家庭运营", categories: ["bills", "repair", "other"] },
  mobility: { name: "出行与活动", categories: ["transport", "outings"] }
};
const CATEGORY_DOMAIN = Object.fromEntries(Object.entries(DOMAINS).flatMap(([domain, value]) => value.categories.map((category) => [category, domain])));

const ACTIONS = {
  planning: { name: "提前安排", keywords: ["计划", "安排", "查", "选择", "决定", "比较", "预约", "准备", "规划", "订", "列", "找"] },
  reminder: { name: "一直记着", keywords: ["记着", "记得", "提醒", "留意", "关注", "担心", "惦记"] },
  coordination: { name: "联系协调", keywords: ["联系", "沟通", "协调", "确认", "请假", "商量", "通知"] },
  execution: { name: "亲手做", keywords: ["做", "洗", "打扫", "开车", "陪", "修", "取", "买", "送", "接", "完成", "收拾", "倒", "搬", "交", "遛", "盯", "监督", "值守"] },
  followup: { name: "事后跟进", keywords: ["跟进", "复诊", "记录", "观察", "核对", "检查", "复盘", "验收"] }
};

const DEMO_A = "这周我给孩子查了三家医院，预约了体检，准备证件，还一直记着复诊时间。我每天决定晚饭吃什么，查看冰箱缺什么并列购物清单。周末出游也是我查天气、找地方、订票和准备孩子的东西。我还提醒交水电费，联系了保洁，并记着给双方父母打电话。";
const DEMO_B = "这周我请假开车带孩子体检，在医院陪诊并去药房取药。我做了三次晚饭，负责每天洗碗和倒垃圾。周末我开车，搬了露营装备。我还修好了卫生间的水龙头，取了两个快递，给车加油并做了清洁。";
const DEMO_C = "这周我接送孩子上了两次兴趣班，和老师确认了下周的材料。我买了日用品，整理了客厅，还预约师傅检查漏水。";
const DEMO_TEXTS = [DEMO_A, DEMO_B, DEMO_C];
const MEMBER_COLORS = ["a", "b", "c", "d", "e", "f"];
const MEMBER_COLOR_OPTIONS = {
  a: { name: "红笔", hex: "#d24b37" }, b: { name: "蓝笔", hex: "#3557a6" }, c: { name: "绿笔", hex: "#2f8558" },
  d: { name: "紫笔", hex: "#8456ae" }, e: { name: "赭石", hex: "#b57e1f" }, f: { name: "青笔", hex: "#23848c" }
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
    member.customColor ||= MEMBER_COLOR_OPTIONS[member.color]?.hex || MEMBER_COLOR_OPTIONS.a.hex;
    member.initial ||= initials(member.name);
  });
  return saved;
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function initials(name) { return (name || "家").slice(-1); }
function memberColorHex(member) { return member?.customColor || MEMBER_COLOR_OPTIONS[member?.color]?.hex || MEMBER_COLOR_OPTIONS.a.hex; }
function escapeHtml(value = "") { return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }
// 领域只用文字标签，不配图标。
function categoryLabel(key) { return CATEGORIES[key].name; }
function domainLabel(key) { return DOMAINS[key].name; }
function balanceLabel(score) { return score >= 90 ? "基本均衡" : score >= 75 ? "有点偏" : "明显偏向一方"; }
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
  if (/全天候|一整天|整天|全天/.test(sentence)) { score += 6; reasons.push("长时间在场"); breakdown.push("一整天 +6"); }
  else if (/半天/.test(sentence)) { score += 4; reasons.push("半天投入"); breakdown.push("半天 +4"); }
  else if (/\d+\s*小时|[一二三四五六七八九十两]+\s*个?小时/.test(sentence)) { score += 3; reasons.push("明确时长"); breakdown.push("写明了时长 +3"); }
  const daily = sentence.match(/每天(?:\s*(\d+|[一二三四五六七八九十两]+)\s*次)?/);
  const repeat = sentence.match(/(\d+|[一二三四五六七八九十两]+)\s*次/);
  if (daily) {
    const perDay = daily[1] ? parseCount(daily[1]) : 1; const count = perDay * 7; const repeatScore = Math.min(4, Math.max(0, count - 1));
    score += repeatScore; reasons.push(`每周约 ${count} 次`); breakdown.push(`每天 ${perDay} 次，一周约 ${count} 次 +${repeatScore}`);
  } else if (repeat) {
    const count = parseCount(repeat[1]); const repeatScore = Math.min(4, Math.max(0, count - 1)); score += repeatScore; reasons.push(`${count} 次重复`); breakdown.push(`做了 ${count} 次 +${repeatScore}`);
  }
  if (/盯|监督|值守|陪同|来回|搬运|清洁现场|照护/.test(sentence)) { score += 2; reasons.push("持续现场投入"); breakdown.push("一直在场 +2"); }
  if (!reasons.length) {
    if (/预约|联系|确认|安排|查|比较/.test(sentence)) reasons.push("计划与协调");
    else if (actions.includes("execution")) reasons.push("实际执行");
    else reasons.push("持续心智投入");
  }
  const value = Math.max(1, Math.min(12, Math.round(score)));
  return { value, reason: reasons.slice(0, 2).join("、"), breakdown: `${breakdown.join(" + ")}，约 ${value} 分` };
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
  if (text.trim().length < 4) return "写几句之后，这里会列出读到的事。";
  const analysis = analyzeText(text, "preview");
  if (!analysis.sentences.length) return "还没读到具体的事。“什么也没做”这样的话不会算进去。";
  const categories = Object.keys(analysis.categories).slice(0, 4).map(categoryLabel);
  const actionKeys = [...new Set(analysis.sentences.flatMap((sentence) => sentence.actions))];
  return `读到 ${analysis.sentences.length} 件事，关于${categories.join("、")}。有${actionKeys.map((key) => ACTIONS[key].name).join("、")}。`;
}

function openOnboarding(mode) {
  showSection("onboarding");
  const joining = mode === "join";
  $("#createPanel").classList.toggle("hidden", joining); $("#joinPanel").classList.toggle("hidden", !joining);
  $("#onboardingTitle").textContent = joining ? "输入家人发给你的邀请码。" : "先给你们的家庭起个名字。";
  $("#onboardingDescription").textContent = joining ? (state.family ? `你现在在“${state.family.name}”。加入新的家庭后，这个浏览器会换到新家庭。` : "加入后，你只需要写你自己的一周。") : "创建后会得到一个邀请码，家人用它在自己的手机上加入。";
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
  showToast(`已离开${familyName}。`);
}

function createFamily() {
  const familyName = $("#familyName").value.trim() || "我们的家";
  const ownerName = $("#ownerName").value.trim() || "我";
  state = { family: { name: familyName, code: makeCode("HM"), ownerId: "a", members: [{ id: "a", name: ownerName, initial: initials(ownerName), role: "owner", status: "draft", text: "", color: "a" }] }, currentMemberId: "a", assignments: {}, clarifications: {}, demo: false };
  saveState(); renderFamily(); showSection("familySpace"); showToast("家庭已创建。");
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
  saveState(); renderFamily(); showSection("familySpace"); showToast("这是演示家庭，周然已经写完了。");
}

function currentMember() { return state.family?.members.find((member) => member.id === state.currentMemberId); }
function isCurrentAdmin() { return state.family?.ownerId === state.currentMemberId; }
function renderFamily() {
  if (!state.family) return;
  $("#familyDisplayName").textContent = state.family.name; $("#inviteCode").textContent = state.family.code;
  const members = state.family.members; const submitted = members.filter((member) => member.status === "submitted").length;
  $("#memberCount").textContent = `${members.length} 人，最多 6 人`; $("#submittedCount").textContent = submitted;
  $("#memberTotal").textContent = Math.max(2, members.length);
  $("#submissionProgress").style.width = `${Math.round(submitted / Math.max(2, members.length) * 100)}%`;
  $("#submissionLegend").innerHTML = members.map((member) => `<span class="${member.status === "submitted" ? "done" : "waiting"}" style="--member-color:${memberColorHex(member)}"><i></i>${escapeHtml(member.name)}${member.status === "submitted" ? "已提交" : "还没写"}</span>`).join("");
  const admin = isCurrentAdmin();
  const rows = members.map((member) => {
    const isMe = member.id === state.currentMemberId;
    const meta = [member.id === state.family.ownerId ? "管理员" : "", isMe ? "这台设备" : ""].filter(Boolean).join("，");
    const switchButton = state.demo && !isMe ? `<button class="member-action" data-switch-member="${member.id}">切换成他来填</button>` : "";
    const adminButtons = admin && member.id !== state.family.ownerId ? `<button class="member-action" data-transfer-admin="${member.id}">设为管理员</button><button class="member-action danger" data-remove-member="${member.id}">移除</button>` : "";
    const colorPicker = isMe ? `<label class="member-color-picker"><input type="color" value="${memberColorHex(member)}" data-member-custom-color data-color-member="${member.id}" /><span>换一支笔的颜色</span></label>` : "";
    return `<div class="member-row" style="--member-color:${memberColorHex(member)}"><div class="member-avatar">${escapeHtml(member.initial)}</div><div class="member-info"><strong>${escapeHtml(member.name)}${isMe ? "（我）" : ""}</strong>${meta ? `<small>${meta}</small>` : ""}<div class="member-actions">${colorPicker}${switchButton}${adminButtons}</div></div><span class="member-status ${member.status === "submitted" ? "done" : "waiting"}">${member.status === "submitted" ? "已提交" : "还没写"}</span></div>`;
  });
  if (members.length < 2) rows.push(`<div class="member-row empty"><div class="member-avatar">+</div><div class="member-info"><strong>还没有家人加入</strong><small>把邀请码 ${state.family.code} 发给他们</small></div></div>`);
  $("#memberList").innerHTML = rows.join("");
  $("#adminPanel").classList.toggle("hidden", !admin);
  $$('[data-switch-member]').forEach((button) => button.addEventListener("click", () => switchTestMember(button.dataset.switchMember)));
  $$('[data-transfer-admin]').forEach((button) => button.addEventListener("click", () => transferAdmin(button.dataset.transferAdmin)));
  $$('[data-remove-member]').forEach((button) => button.addEventListener("click", () => openRemoveMemberModal(button.dataset.removeMember)));
  $$('[data-member-custom-color]').forEach((input) => input.addEventListener("change", () => updateMemberColor(input.dataset.colorMember, input.value)));
  const mine = currentMember(); $("#recordMineButton").textContent = mine?.status === "submitted" ? "改我写的" : "写我的一周";
  const ready = members.length >= 2 && members.every((member) => member.status === "submitted");
  $("#viewResultsButton").disabled = !ready; $("#viewResultsButton").textContent = ready ? "一起看结果" : "还有人没写完";
  $("#progressCopy").textContent = ready ? "大家都写完了，可以一起看了。" : members.length < 2 ? "至少要两个人才能一起看。先写你自己的。" : "先写你自己的，家人写完后就能一起看。";
}

function updateMemberColor(memberId, color) {
  if (memberId !== state.currentMemberId || !/^#[0-9a-f]{6}$/i.test(color)) return;
  const member = currentMember(); if (!member) return;
  member.customColor = color.toLowerCase(); saveState(); renderFamily(); showToast("颜色已更换。");
}

function addTestMember() {
  if (!isCurrentAdmin()) { showToast("只有管理员可以添加成员。"); return; }
  if (state.family.members.length >= 6) { showToast("一个家庭最多 6 人。"); return; }
  const field = $("#testMemberName"); const fallbackNames = ["陈昕", "赵宁", "韩舟", "许安"];
  const name = field.value.trim() || fallbackNames[state.family.members.length - 2] || `成员${state.family.members.length + 1}`;
  const id = `m${Date.now().toString(36)}`; const index = state.family.members.length;
  state.family.members.push({ id, name, initial: initials(name), role: "member", status: "draft", text: "", color: MEMBER_COLORS[index % MEMBER_COLORS.length] });
  state.currentMemberId = id; state.demo = true; field.value = ""; saveState(); renderFamily(); openRecord();
  showToast(`已添加${name}，现在替他填写。`);
}

function switchTestMember(memberId) {
  const member = state.family.members.find((item) => item.id === memberId); if (!member || !state.demo) return;
  state.currentMemberId = memberId; saveState(); renderFamily(); showToast(`现在替${member.name}填写。`);
}

function transferAdmin(memberId) {
  if (!isCurrentAdmin()) return;
  const member = state.family.members.find((item) => item.id === memberId); if (!member) return;
  state.family.ownerId = memberId; state.family.members.forEach((item) => { item.role = item.id === memberId ? "owner" : "member"; });
  saveState(); renderFamily(); showToast(`${member.name}现在是管理员。`);
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
  closeRemoveMemberModal(); saveState(); renderFamily(); showToast(`已移除${member.name}。`);
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
    questions.push({ type: "detail", context: vague.text, label: "说具体一点", prompt, placeholder });
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
    questions.push({ type: "gap", context: CATEGORIES[key].name, label: "可能漏写了", prompt: `${names.join("、")}提到了“${CATEGORIES[key].name}”。这件事里，你有没有也做过一部分？比如安排、提醒、买东西、亲手做或收尾。`, placeholder: "有的话写下来；没有就留空。" });
  }
  return questions.slice(0, 2);
}

function openClarification() {
  const member = currentMember(); if (!member) return;
  const questions = buildClarificationQuestions(member);
  $("#clarificationMemberName").textContent = member.name;
  $("#clarificationPromptCount").textContent = questions.length === 0 ? "写得很清楚了。" : questions.length === 1 ? "再补充一个细节。" : "再补充两个细节。";
  $("#clarificationList").innerHTML = questions.length ? questions.map((question, index) => `<article class="clarification-card"><span>${question.label}</span><h3>${escapeHtml(question.prompt)}</h3><textarea data-clarification-answer="${index}" data-context="${escapeHtml(question.context)}" placeholder="${escapeHtml(question.placeholder)}"></textarea></article>`).join("") : `<article class="clarification-card complete"><h3>你写得已经很清楚了，不用再补充。</h3></article>`;
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
  state.clarifications[member.id] = member.text; state.assignments = {}; saveState(); renderResults(); showSection("results"); showToast("补充好了。");
}

function openAnalysisFlow() {
  const member = currentMember();
  if (member && state.clarifications[member.id] === member.text) { renderResults(); showSection("results"); }
  else openClarification();
}

function submitRecord() {
  const text = $("#memberInput").value.trim();
  if (text.length < 4) { showToast("至少写一件你做过的事。"); return; }
  const member = currentMember(); member.text = text; member.status = "submitted"; state.assignments = {}; delete state.clarifications[member.id]; saveState(); renderFamily();
  const ready = state.family.members.length >= 2 && state.family.members.every((item) => item.status === "submitted");
  if (ready) {
    openClarification(); showToast("已提交。");
  }
  else { showSection("waitingSpace"); showToast("已提交。"); }
}

function simulateFamilySubmission() {
  if (state.family.members.length < 2) state.family.members.push({ id: "b", name: "周然", initial: "然", role: "member", status: "submitted", text: DEMO_B, color: "b" });
  state.family.members.forEach((member, index) => {
    if (member.id !== state.currentMemberId && member.status !== "submitted") { member.status = "submitted"; member.text ||= DEMO_TEXTS[index % DEMO_TEXTS.length]; }
  });
  saveState(); renderFamily();
  openClarification(); showToast("其他人也提交了。");
}

async function copyInvite(kind = "link") {
  if (!state.family) return;
  const link = `${location.origin}${location.pathname}?join=${encodeURIComponent(state.family.code)}`;
  const value = kind === "code" ? state.family.code : link;
  try { await navigator.clipboard.writeText(value); showToast(kind === "code" ? "邀请码已复制。" : "邀请链接已复制。"); }
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
  $("#analysisFamilyName").textContent = `${state.family.name}，本周`;
  const baseline = balanceFor({});
  const byShare = [...currentAnalysis.members].sort((a, b) => baseline.shares[b.id] - baseline.shares[a.id]);
  const top = byShare[0]; const topShare = Math.round(baseline.shares[top.id]);
  const ideal = 100 / currentAnalysis.members.length;
  const totalMental = currentAnalysis.analyses.reduce((sum, item) => sum + item.data.mental, 0);
  const totalVisible = currentAnalysis.analyses.reduce((sum, item) => sum + item.data.execution, 0);
  const topOf = (field) => [...currentAnalysis.analyses].sort((a, b) => b.data[field] - a.data[field])[0];
  const mentalTop = topOf("mental"); const visibleTop = topOf("execution");
  const mentalShare = totalMental ? Math.round(mentalTop.data.mental / totalMental * 100) : 0;
  const visibleShare = totalVisible ? Math.round(visibleTop.data.execution / totalVisible * 100) : 0;
  const balanced = topShare - ideal < 5;
  // 先说最值得注意的一件事：总量是否失衡，或者总量差不多、但看不见的那部分集中在一个人身上。
  $("#headlineInsight").textContent = !balanced
    ? `这周${top.name}承担得多一些，大约占全家的 ${topShare}%。`
    : mentalShare >= 70
      ? `总量差不多，但看不见的那部分，${mentalShare >= 85 ? "几乎" : "大多"}在${mentalTop.member.name}身上。`
      : "这周你们分担得差不多。";
  const parts = [];
  if (totalMental) parts.push(`提前安排、一直记着、事后跟进这些看不见的事，${mentalTop.member.name}占了 ${mentalShare}%`);
  if (totalVisible) parts.push(`亲手做完、大家看得见的事，${visibleTop.member.name}占了 ${visibleShare}%`);
  $("#headlineDetail").textContent = parts.length ? `${parts.join("；")}。` : "";
  $("#shareStrip").innerHTML = `<div class="share-bar">${currentAnalysis.members.map((member) => `<i style="--member-color:${memberColorHex(member)};flex-grow:${baseline.shares[member.id]}"></i>`).join("")}</div><div class="share-legend">${currentAnalysis.members.map((member) => `<span style="--member-color:${memberColorHex(member)}"><i></i>${escapeHtml(member.name)} ${Math.round(baseline.shares[member.id])}%</span>`).join("")}</div>`;
  activeDomain = currentAnalysis.domains[0] || "home";
  activeTopic = currentAnalysis.topics.find((topic) => topic.domain === activeDomain)?.id || "other";
  renderRawRecords(); renderDomainTabs(); renderIceberg(activeDomain); renderTopicCarousel(); renderComparison(activeTopic); renderBalanceSimulator();
}

function renderRawRecords() {
  $("#rawRecordGrid").innerHTML = currentAnalysis.members.map((member) => `<article class="raw-record-card" style="--member-color:${memberColorHex(member)}"><strong>${escapeHtml(member.name)}</strong><p>${escapeHtml(member.text)}</p></article>`).join("");
}

function renderDomainTabs() {
  $("#categoryTabs").innerHTML = currentAnalysis.domains.map((key) => `<button role="tab" aria-selected="${key === activeDomain}" class="${key === activeDomain ? "active" : ""}" data-domain="${key}">${domainLabel(key)}</button>`).join("");
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
  const chip = (item, marked) => `<span class="ice-item" style="--member-color:${memberColorHex(item.member)}" title="${escapeHtml(item.text)}"><b>${escapeHtml(item.member.name)}</b>${marked ? `<mark>${escapeHtml(shorten(item.text, 16))}</mark>` : escapeHtml(shorten(item.text, 16))}</span>`;
  const zone = (list, limit, marked, emptyText) => {
    if (!list.length) return `<span class="empty">${emptyText}</span>`;
    const rest = list.length - limit;
    return list.slice(0, limit).map((item) => chip(item, marked)).join("") + (rest > 0 ? `<span class="ice-more">还有 ${rest} 件，见下方</span>` : "");
  };
  $("#visibleTaskList").innerHTML = zone(visible, 4, false, "这一类里，没人写到亲手做的事。");
  $("#hiddenTaskList").innerHTML = zone(hidden, 9, true, "这一类里，没人写到安排、记着或跟进的事。");
}

function renderTopicCarousel() {
  const topics = currentAnalysis.topics.filter((topic) => topic.domain === activeDomain);
  $("#topicCarousel").innerHTML = topics.map((topic) => `<button role="tab" aria-selected="${topic.id === activeTopic}" class="${topic.id === activeTopic ? "active" : ""}" data-topic="${topic.id}">${categoryLabel(topic.id)}</button>`).join("");
  $$('[data-topic]').forEach((button) => button.addEventListener("click", () => { activeTopic = button.dataset.topic; renderTopicCarousel(); renderComparison(activeTopic); }));
}

function scoreDetails(item) {
  return `<details class="score"><summary>${item.effort.value} 分</summary><p>${item.effort.breakdown}</p></details>`;
}

function renderComparison(topicId) {
  const topic = currentAnalysis.topics.find((item) => item.id === topicId);
  if (!topic) return;
  const memberCount = new Set(topic.contributions.map((item) => item.memberId)).size;
  const totalEffort = topic.contributions.reduce((sum, item) => sum + item.effort.value, 0);
  $("#compareCategory").textContent = topic.name;
  $("#compareBadge").textContent = memberCount > 1 ? `${memberCount} 个人都写到了，一共 ${totalEffort} 分` : `只有一个人写到，${totalEffort} 分`;
  $("#voiceList").innerHTML = currentAnalysis.members.map((member) => {
    const items = topic.contributions.filter((item) => item.memberId === member.id);
    const lines = items.length ? `<ul>${items.map((item) => `<li><p>“${escapeHtml(item.text)}”</p><span>${item.actions.map((action) => ACTIONS[action].name).join("、")}</span>${scoreDetails(item)}</li>`).join("")}</ul>` : `<p class="empty">没有写到这件事。</p>`;
    return `<div class="voice-card" style="--member-color:${memberColorHex(member)}"><strong>${escapeHtml(member.name)}</strong>${lines}</div>`;
  }).join("");
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
  $("#currentBalanceScore").innerHTML = `${balanceLabel(baseline.score)}<small>${baseline.score} / 100</small>`;
  $("#simulatedBalanceScore").innerHTML = changed ? `${balanceLabel(simulated.score)}<small>${simulated.score} / 100</small>` : `<span class="muted">还没调整</span>`;
  const delta = simulated.score - baseline.score;
  $("#balanceDelta").textContent = !changed ? "" : delta === 0 ? "整体没有变化" : delta > 0 ? `更均衡了 ${delta} 分` : `更偏了 ${-delta} 分`;
  $("#balanceDelta").className = delta > 0 ? "positive" : delta < 0 ? "negative" : "";
  $("#burdenBars").innerHTML = members.map((member) => {
    const before = Math.round(baseline.shares[member.id]); const after = Math.round(simulated.shares[member.id]);
    return `<div class="burden-row" style="--member-color:${memberColorHex(member)}"><span>${escapeHtml(member.name)}</span><div><em style="width:${simulated.shares[member.id]}%"></em></div><small>${changed && before !== after ? `${before}% 变成 ${after}%` : `${after}%`}</small></div>`;
  }).join("");
  const cardFor = (item) => {
    const owner = state.assignments[item.id] || item.memberId;
    const options = members.map((member) => `<option value="${member.id}"${owner === member.id ? " selected" : ""}>${escapeHtml(member.name)}</option>`).join("");
    const original = owner !== item.memberId ? `<small class="original-owner">原本是${escapeHtml(item.member.name)}做的</small>` : "";
    return `<li class="contribution-card${owner !== item.memberId ? " moved" : ""}" data-contribution-card="${item.id}"><span class="package-handle" draggable="true" data-contribution-drag="${item.id}" title="拖到另一个人那里" aria-hidden="true"></span><div class="contribution-main"><strong>${escapeHtml(item.text)}</strong><small>${categoryLabel(item.fineCategory)}</small>${original}</div>${scoreDetails(item)}<label class="contribution-owner"><span class="visually-hidden">交给谁</span><select data-contribution-owner="${item.id}">${options}</select></label></li>`;
  };
  $("#balanceColumns").innerHTML = members.map((member) => {
    const items = currentAnalysis.contributions.filter((item) => (state.assignments[item.id] || item.memberId) === member.id);
    return `<div class="load-column" data-drop-member="${member.id}" style="--member-color:${memberColorHex(member)}"><div class="column-head"><strong>${escapeHtml(member.name)}</strong><span>${items.length} 件，${simulated.totals[member.id]} 分</span></div>${items.length ? `<ul class="package-list">${items.map(cardFor).join("")}</ul>` : `<p class="drop-empty">把一件事拖到这里，就是交给${escapeHtml(member.name)}。</p>`}</div>`;
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
  $("#actionSummary").textContent = changed ? `已经换了 ${changed} 件事。` : "";
}
function assignContribution(id, ownerId) {
  const item = currentAnalysis.contributions.find((contribution) => contribution.id === id); if (!item) return;
  if (ownerId === item.memberId) delete state.assignments[id]; else state.assignments[id] = ownerId;
  saveState(); renderBalanceSimulator();
  const label = currentAnalysis.members.find((member) => member.id === ownerId)?.name;
  showToast(`“${shorten(item.text, 12)}”交给了${label || "其他人"}。`);
}
function resetSimulation() {
  currentAnalysis.contributions.forEach((item) => delete state.assignments[item.id]); saveState(); renderBalanceSimulator(); showToast("已恢复原样。");
}

$("#createFamilyButton").addEventListener("click", () => openOnboarding("create"));
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
