const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const STORAGE_KEY = "who_cares_family_v2";

const CATEGORIES = {
  health: { name: "健康照护", icon: "🩺", keywords: ["医院", "体检", "看病", "吃药", "药房", "复诊", "健康", "生病", "医生"], steps: ["发现健康需求", "比较医院与时间", "完成预约", "准备证件", "设置提醒", "现场陪同", "记录医嘱", "后续观察"] },
  meals: { name: "一周饮食", icon: "🍲", keywords: ["做饭", "顿饭", "晚饭", "早餐", "午饭", "吃什么", "食材", "菜", "烹饪", "外卖"], steps: ["确认家人时间", "决定吃什么", "查看现有食材", "考虑营养与忌口", "列采购清单", "完成烹饪", "处理剩余食材", "计划下一餐"] },
  inventory: { name: "日用品库存", icon: "🧻", keywords: ["日用品", "库存", "快用完", "采购", "买菜", "购物", "超市", "纸巾", "洗衣液"], steps: ["留意消耗速度", "检查现有库存", "比较购买渠道", "列出清单", "完成购买", "核对遗漏", "分类归位", "预测下次补充"] },
  cleaning: { name: "清洁整理", icon: "🧹", keywords: ["打扫", "洗碗", "垃圾", "清洁", "保洁", "洗衣", "收拾", "整理", "拖地"], steps: ["发现需要清理", "安排清洁时间", "准备清洁用品", "完成清洁", "分类与归位", "处理垃圾", "检查遗漏", "维持日常秩序"] },
  bills: { name: "家庭账单", icon: "🧾", keywords: ["账单", "水电", "缴费", "报销", "预算", "房租", "物业", "保险", "费用"], steps: ["记住截止日期", "核对金额", "协调家庭预算", "完成缴费", "保存凭证", "检查扣款", "记录支出", "提醒下个周期"] },
  repair: { name: "家庭维修", icon: "🔧", keywords: ["维修", "修好", "坏了", "水龙头", "灯泡", "师傅", "安装", "漏水", "家具"], steps: ["发现故障", "判断紧急程度", "查找解决办法", "购买配件", "联系维修人员", "现场维修", "清理现场", "检查是否复发"] },
  transport: { name: "出行与车辆", icon: "🚗", keywords: ["开车", "接送", "加油", "车辆", "洗车", "通勤", "停车", "保养", "车"], steps: ["确认出发时间", "规划路线", "协调接送", "检查车辆状态", "准备随身物品", "现场执行", "处理停车与加油", "安排维护"] },
  children: { name: "孩子成长", icon: "🎒", keywords: ["孩子", "学校", "老师", "作业", "家长会", "兴趣班", "幼儿园", "辅导", "学习"], steps: ["留意孩子状态", "查看学校通知", "协调家庭时间", "准备材料", "提醒重要节点", "陪伴完成", "与老师沟通", "跟进后续变化"] },
  outings: { name: "家庭活动", icon: "⛺", keywords: ["周末", "出游", "旅行", "门票", "露营", "订票", "酒店", "天气", "行程"], steps: ["提出备选方案", "确认家人偏好", "查看天气", "比较预算", "完成预订", "准备随身物品", "规划路线", "安排返程"] },
  relationships: { name: "亲友联络", icon: "💬", keywords: ["父母", "家人", "老人", "电话", "生日", "礼物", "聚会", "亲戚", "朋友"], steps: ["记住重要日期", "留意亲友情绪", "协调联系时间", "准备礼物", "主动联络", "安排见面", "传达家庭信息", "后续关心"] },
  other: { name: "其他家庭事务", icon: "🏠", keywords: [], steps: ["发现需要处理", "明确任务边界", "收集必要信息", "安排时间", "完成执行", "告知相关成员", "检查结果", "记录下次提醒"] }
};

const ACTIONS = {
  planning: { name: "计划准备", keywords: ["计划", "安排", "查", "选择", "决定", "比较", "预约", "准备", "规划", "订", "列", "找"] },
  reminder: { name: "持续提醒", keywords: ["记着", "记得", "提醒", "留意", "关注", "担心", "惦记"] },
  coordination: { name: "协调沟通", keywords: ["联系", "沟通", "协调", "确认", "请假", "商量", "通知"] },
  execution: { name: "现场执行", keywords: ["做", "洗", "打扫", "开车", "陪", "修", "取", "买", "送", "接", "完成", "收拾", "倒", "搬", "交"] },
  followup: { name: "后续跟进", keywords: ["跟进", "复诊", "记录", "观察", "核对", "检查", "复盘", "验收"] }
};

const DEMO_A = "这周我给孩子查了三家医院，预约了体检，准备证件，还一直记着复诊时间。我每天决定晚饭吃什么，查看冰箱缺什么并列购物清单。周末出游也是我查天气、找地方、订票和准备孩子的东西。我还提醒交水电费，联系了保洁，并记着给双方父母打电话。";
const DEMO_B = "这周我请假开车带孩子体检，在医院陪诊并去药房取药。我做了三次晚饭，负责每天洗碗和倒垃圾。周末我开车，搬了露营装备。我还修好了卫生间的水龙头，取了两个快递，给车加油并做了清洁。";
const DEMO_C = "这周我接送孩子上了两次兴趣班，和老师确认了下周的材料。我买了日用品，整理了客厅，还预约师傅检查漏水。";
const DEMO_TEXTS = [DEMO_A, DEMO_B, DEMO_C];
const MEMBER_COLORS = ["a", "b", "c", "d", "e", "f"];

let state = normalizeState(loadState()) || { family: null, currentMemberId: null, assignments: {}, demo: false };
let currentAnalysis = null;
let activeCategory = null;
let pendingRemovalId = null;

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}
function normalizeState(saved) {
  if (!saved?.family?.members?.length) return saved;
  saved.assignments ||= {};
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
  ["hero", "onboarding", "familySpace", "recordSpace", "waitingSpace", "results"].forEach((section) => $(`#${section}`).classList.add("hidden"));
  $(`#${id}`).classList.remove("hidden"); window.scrollTo({ top: 0, behavior: "smooth" });
}

function splitSentences(text) {
  return text.split(/[。！？!?；;，,、\n]+/).map((item) => item.trim()).filter((item) => item.length > 1);
}
function analyzeText(text, memberId) {
  const sentences = splitSentences(text).map((sentence) => {
    const normalized = sentence.replace(/[了着过]/g, "");
    let categories = Object.entries(CATEGORIES).filter(([key, value]) => key !== "other" && value.keywords.some((word) => normalized.includes(word))).map(([key]) => key);
    if (!categories.length) categories = ["other"];
    let actions = Object.entries(ACTIONS).filter(([, value]) => value.keywords.some((word) => normalized.includes(word))).map(([key]) => key);
    if (!actions.length) actions = ["execution"];
    return { text: sentence, categories, actions, memberId };
  });
  const categories = {};
  sentences.forEach((sentence) => sentence.categories.forEach((key) => {
    if (!categories[key]) categories[key] = { score: 0, mental: 0, execution: 0, sentences: [], actions: {} };
    const bucket = categories[key]; bucket.sentences.push(sentence.text);
    sentence.actions.forEach((action) => {
      bucket.actions[action] = (bucket.actions[action] || 0) + 1;
      const mental = action === "planning" || action === "reminder" || action === "coordination" || action === "followup";
      bucket.score += mental ? 3 : 2; bucket.mental += mental ? 3 : 0; bucket.execution += mental ? 0 : 2;
    });
  }));
  const mental = Object.values(categories).reduce((sum, item) => sum + item.mental, 0);
  const execution = Object.values(categories).reduce((sum, item) => sum + item.execution, 0);
  return { sentences, categories, mental, execution, total: mental + execution };
}

function recognizedSummary(text) {
  if (text.trim().length < 4) return "开始输入后，这里会显示识别到的劳动类型。";
  const analysis = analyzeText(text, "preview");
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
  state = { family: null, currentMemberId: null, assignments: {}, demo: false };
  localStorage.removeItem(STORAGE_KEY);
  history.replaceState({}, "", location.pathname);
  closeLeaveModal();
  showSection("hero");
  showToast(`已离开“${familyName}”，本地家庭记录已清除。`);
}

function createFamily() {
  const familyName = $("#familyName").value.trim() || "我们的家";
  const ownerName = $("#ownerName").value.trim() || "我";
  state = { family: { name: familyName, code: makeCode("HM"), ownerId: "a", members: [{ id: "a", name: ownerName, initial: initials(ownerName), role: "owner", status: "draft", text: "", color: "a" }] }, currentMemberId: "a", assignments: {}, demo: false };
  saveState(); renderFamily(); showSection("familySpace"); showToast("家庭空间已创建，可以邀请家人加入了。");
}

function joinFamily() {
  const code = $("#inviteCodeInput").value.trim().replace(/\s/g, "").toUpperCase();
  const name = $("#joinName").value.trim();
  if (code.length < 6 || !name) { showToast("请填写完整邀请码和你的称呼。"); return; }
  state = { family: { name: code === "SG4826" ? "松果之家" : "我们的家", code, ownerId: "a", members: [{ id: "a", name: "林予", initial: "予", role: "owner", status: "submitted", text: DEMO_A, color: "a" }, { id: "b", name, initial: initials(name), role: "member", status: "draft", text: "", color: "b" }] }, currentMemberId: "b", assignments: {}, demo: true };
  saveState(); renderFamily(); showSection("familySpace"); showToast(`你已加入“${state.family.name}”。`);
}

function loadDemoFamily() {
  state = { family: { name: "松果之家", code: "SG4826", ownerId: "a", members: [{ id: "a", name: "林予", initial: "予", role: "owner", status: "draft", text: DEMO_A, color: "a" }, { id: "b", name: "周然", initial: "然", role: "member", status: "submitted", text: DEMO_B, color: "b" }] }, currentMemberId: "a", assignments: {}, demo: true };
  saveState(); renderFamily(); showSection("familySpace"); showToast("演示家庭已载入。周然已在自己的设备上提交。");
}

function currentMember() { return state.family?.members.find((member) => member.id === state.currentMemberId); }
function isCurrentAdmin() { return state.family?.ownerId === state.currentMemberId; }
function renderFamily() {
  if (!state.family) return;
  $("#familyDisplayName").textContent = state.family.name; $("#inviteCode").textContent = state.family.code;
  const members = state.family.members; const submitted = members.filter((member) => member.status === "submitted").length;
  $("#memberCount").textContent = `${members.length} / 6`; $("#submittedCount").textContent = submitted;
  $("#progressRing").querySelector("span").textContent = `/ ${Math.max(2, members.length)}`;
  const admin = isCurrentAdmin();
  const rows = members.map((member) => {
    const role = member.id === state.family.ownerId ? `<span class="role-badge">管理员</span>` : "";
    const switchButton = state.demo && member.id !== state.currentMemberId ? `<button class="member-action" data-switch-member="${member.id}">切换测试视角</button>` : "";
    const adminButtons = admin && member.id !== state.family.ownerId ? `<button class="member-action" data-transfer-admin="${member.id}">设为管理员</button><button class="member-action danger" data-remove-member="${member.id}">移除</button>` : "";
    return `<div class="member-row"><div class="member-avatar avatar-${member.color}">${escapeHtml(member.initial)}</div><div class="member-info"><strong>${escapeHtml(member.name)}${member.id === state.currentMemberId ? "（我）" : ""}${role}</strong><small>${member.id === state.currentMemberId ? "当前设备" : "通过邀请链接加入"}</small><div class="member-actions">${switchButton}${adminButtons}</div></div><span class="member-status ${member.status === "submitted" ? "done" : "waiting"}">${member.status === "submitted" ? "本周已提交" : "等待记录"}</span></div>`;
  });
  if (members.length < 2) rows.push(`<div class="member-row"><div class="member-avatar" style="background:#d9ded9;color:#80918b">+</div><div><strong>等待家人加入</strong><small>发送邀请码 ${state.family.code}</small></div><span class="member-status">尚未加入</span></div>`);
  $("#memberList").innerHTML = rows.join("");
  $("#adminPanel").classList.toggle("hidden", !admin);
  $$('[data-switch-member]').forEach((button) => button.addEventListener("click", () => switchTestMember(button.dataset.switchMember)));
  $$('[data-transfer-admin]').forEach((button) => button.addEventListener("click", () => transferAdmin(button.dataset.transferAdmin)));
  $$('[data-remove-member]').forEach((button) => button.addEventListener("click", () => openRemoveMemberModal(button.dataset.removeMember)));
  const mine = currentMember(); $("#recordMineButton").textContent = mine?.status === "submitted" ? "修改我的记录" : "记录我的一周";
  const ready = members.length >= 2 && members.every((member) => member.status === "submitted");
  $("#viewResultsButton").disabled = !ready; $("#viewResultsButton").textContent = ready ? "查看共同劳动地图" : "等待其他成员";
  $("#progressCopy").textContent = ready ? "所有成员已经完成，本周共同视角现已解锁。" : "你可以先完成自己的记录，系统会在其他成员提交后通知你。";
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

function submitRecord() {
  const text = $("#memberInput").value.trim();
  if (text.length < 15) { showToast("再多写一点，系统才能识别完整责任。"); return; }
  const member = currentMember(); member.text = text; member.status = "submitted"; state.assignments = {}; saveState(); renderFamily();
  const ready = state.family.members.length >= 2 && state.family.members.every((item) => item.status === "submitted");
  if (ready) { renderResults(); showSection("results"); showToast("记录已提交，共同劳动地图已更新。"); }
  else { showSection("waitingSpace"); showToast("你的记录已提交，正在等待家人。"); }
}

function simulateFamilySubmission() {
  if (state.family.members.length < 2) state.family.members.push({ id: "b", name: "周然", initial: "然", role: "member", status: "submitted", text: DEMO_B, color: "b" });
  state.family.members.forEach((member, index) => {
    if (member.id !== state.currentMemberId && member.status !== "submitted") { member.status = "submitted"; member.text ||= DEMO_TEXTS[index % DEMO_TEXTS.length]; }
  });
  saveState(); renderFamily(); renderResults(); showSection("results"); showToast("家人的演示记录已同步，共同视角已生成。");
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
  const categoryKeys = [...new Set(analyses.flatMap((item) => Object.keys(item.data.categories)))].sort((a, b) => analyses.reduce((sum, item) => sum + (item.data.categories[b]?.score || 0) - (item.data.categories[a]?.score || 0), 0));
  const shared = categoryKeys.filter((key) => analyses.filter((item) => item.data.categories[key]).length >= 2);
  const packages = categoryKeys.map((key) => {
    const scores = analyses.map((item) => item.data.categories[key]?.score || 0); const ownerIndex = scores.indexOf(Math.max(...scores));
    return { id: key, name: CATEGORIES[key].name, icon: CATEGORIES[key].icon, detail: CATEGORIES[key].steps.slice(0, 4).join(" · "), weight: Math.max(8, scores.reduce((sum, value) => sum + value, 0)), owner: state.assignments[key] || members[ownerIndex].id };
  });
  return { members, analyses, categoryKeys, shared, packages };
}

function renderResults() {
  currentAnalysis = buildCombinedAnalysis();
  if (currentAnalysis.members.length < 2) return;
  $("#analysisFamilyName").textContent = `${state.family.name} · 本周共同视角`;
  $("#sharedMetric").innerHTML = `${currentAnalysis.shared.length}<small>类</small>`;
  $("#taskMetric").innerHTML = `${currentAnalysis.analyses.reduce((sum, item) => sum + item.data.sentences.length, 0)}<small>项</small>`;
  $("#packageMetric").innerHTML = `${currentAnalysis.packages.length}<small>组</small>`;
  const totalMental = currentAnalysis.analyses.reduce((sum, item) => sum + item.data.mental, 0) || 1;
  const totalVisible = currentAnalysis.analyses.reduce((sum, item) => sum + item.data.execution, 0) || 1;
  const heavier = [...currentAnalysis.analyses].sort((a, b) => b.data.mental - a.data.mental)[0];
  const mentalShare = Math.round(heavier.data.mental / totalMental * 100); const visibleShare = Math.round(heavier.data.execution / totalVisible * 100);
  $("#headlineInsight").innerHTML = `${escapeHtml(heavier.member.name)}承担了 <b>${visibleShare}%</b> 的可见执行，同时承担了 <b>${mentalShare}%</b> 的计划、提醒与协调。`;
  const unique = currentAnalysis.categoryKeys.filter((key) => !currentAnalysis.shared.includes(key));
  $("#headlineDetail").textContent = unique.length ? `还没有形成共同视角的领域包括：${unique.slice(0, 3).map((key) => CATEGORIES[key].name).join("、")}。` : "成员记录高度重合，可以直接进入责任调整。";
  activeCategory = currentAnalysis.shared[0] || currentAnalysis.categoryKeys[0] || "other";
  renderRawRecords(); renderCategoryTabs(); renderIceberg(activeCategory); renderComparison(activeCategory); renderPackages();
}

function renderRawRecords() {
  $("#rawRecordGrid").innerHTML = currentAnalysis.members.map((member) => `<article class="raw-record-card"><div class="raw-record-head"><span class="member-avatar avatar-${member.color}">${escapeHtml(member.initial)}</span><div><strong>${escapeHtml(member.name)}</strong><small>${member.id === state.family.ownerId ? "家庭管理员" : "家庭成员"}</small></div></div><p>${escapeHtml(member.text)}</p></article>`).join("");
}

function renderCategoryTabs() {
  $("#categoryTabs").innerHTML = currentAnalysis.categoryKeys.map((key) => `<button class="${key === activeCategory ? "active" : ""}" data-category="${key}">${CATEGORIES[key].icon} ${CATEGORIES[key].name}</button>`).join("");
  $$('[data-category]').forEach((button) => button.addEventListener("click", () => { activeCategory = button.dataset.category; renderCategoryTabs(); renderIceberg(activeCategory); renderComparison(activeCategory); }));
}
function shorten(text, max = 23) { return text.length > max ? `${text.slice(0, max)}…` : text; }
function renderIceberg(key) {
  const visible = currentAnalysis.analyses.flatMap((item) => (item.data.categories[key]?.sentences || []).slice(0, 2).map((text) => ({ text, name: item.member.name })));
  $("#visibleTaskList").innerHTML = visible.length ? visible.map((item) => `<span class="ice-item"><b>${escapeHtml(item.name)}</b> · ${escapeHtml(shorten(item.text, 18))}</span>`).join("") : `<span class="ice-item">没有识别到可见执行</span>`;
  const actionsSeen = new Set(currentAnalysis.analyses.flatMap((item) => Object.keys(item.data.categories[key]?.actions || {})));
  const steps = CATEGORIES[key].steps.filter((step, index) => actionsSeen.size > 2 || index < 6).slice(0, 7);
  $("#hiddenTaskList").innerHTML = steps.map((step) => `<span class="ice-item">${step}</span>`).join("");
}

function renderComparison(key) {
  const mentions = currentAnalysis.analyses.filter((item) => item.data.categories[key]);
  $("#compareCategory").textContent = CATEGORIES[key].name;
  $("#compareBadge").textContent = mentions.length >= 2 ? `${mentions.length} 位成员提到，关注环节各有不同` : "只出现在一位成员的记录中";
  $("#voiceList").innerHTML = currentAnalysis.analyses.map((item, index) => {
    const info = item.data.categories[key];
    return `<div class="voice-card voice-${index % 2 ? "b" : "a"}"><div class="mini-avatar avatar-${item.member.color}">${escapeHtml(item.member.initial)}</div><div class="voice-copy"><strong>${escapeHtml(item.member.name)}</strong><p>${info ? `“${escapeHtml(info.sentences[0])}。”` : "我的记录中没有提到这件事。"}</p></div></div>`;
  }).join("");
  const chain = [{ name: "发现需求", action: "reminder" }, { name: "计划准备", action: "planning" }, { name: "现场执行", action: "execution" }, { name: "后续跟进", action: "followup" }];
  const ownerFor = (action) => {
    const counts = currentAnalysis.analyses.map((item) => ({ name: item.member.name, count: item.data.categories[key]?.actions[action] || 0 }));
    const max = Math.max(...counts.map((item) => item.count)); if (!max) return "待确认";
    const leaders = counts.filter((item) => item.count === max); return leaders.length > 1 ? "共同" : leaders[0].name;
  };
  $("#responsibilityChain").innerHTML = chain.map((item, index) => `<div class="chain-item"><span>${index + 1}</span><p>${item.name}</p><small>${ownerFor(item.action)}</small></div>${index < chain.length - 1 ? '<i class="chain-line"></i>' : ''}`).join("");
}

function renderPackages() {
  const members = currentAnalysis.members; const packages = currentAnalysis.packages.map((pkg) => ({ ...pkg, owner: state.assignments[pkg.id] || pkg.owner }));
  const total = packages.reduce((sum, item) => sum + item.weight, 0) || 1;
  const loads = Object.fromEntries(members.map((member) => [member.id, packages.filter((item) => item.owner === member.id).reduce((sum, item) => sum + item.weight, 0)]));
  $("#balanceColumns").innerHTML = members.map((member) => {
    const memberPackages = packages.filter((item) => item.owner === member.id);
    const cards = memberPackages.map((item) => `<button class="package-card" data-package="${item.id}"><span class="package-icon">${item.icon}</span><div><strong>${item.name}</strong><small>${item.detail}</small></div><span class="arrow">→</span></button>`).join("") || `<div class="member-status">暂无责任包</div>`;
    return `<div class="load-column"><div class="column-head"><div class="member-avatar avatar-${member.color}">${escapeHtml(member.initial)}</div><div><span>${escapeHtml(member.name)}</span><strong>${Math.round(loads[member.id] / total * 100)}%</strong></div></div><div class="package-list">${cards}</div></div>`;
  }).join("");
  $$('[data-package]').forEach((button) => button.addEventListener("click", () => movePackage(button.dataset.package)));
  const ideal = 100 / members.length; const shares = members.map((member) => ({ member, value: loads[member.id] / total * 100 })).sort((a, b) => b.value - a.value);
  const averageGap = shares.reduce((sum, item) => sum + Math.abs(item.value - ideal), 0) / members.length;
  const score = Math.max(0, Math.round(100 - averageGap * 2)); $("#balanceScore").textContent = score;
  if (averageGap <= 8) $("#actionSummary").innerHTML = `<strong>当前完整责任分布已经比较均衡。</strong>建议试运行一周，再共同复盘实际感受。`;
  else { const heavier = shares[0].member; const candidate = packages.filter((item) => item.owner === heavier.id).sort((a, b) => a.weight - b.weight)[0]; $("#actionSummary").innerHTML = `<strong>${escapeHtml(heavier.name)}仍承担较多完整责任。</strong>${candidate ? `可以先尝试完整转交“${candidate.name}”。` : "可以先选择一个边界清晰的责任包。"}`; }
}
function movePackage(id) {
  const members = currentAnalysis.members; const pkg = currentAnalysis.packages.find((item) => item.id === id); const owner = state.assignments[id] || pkg.owner;
  const next = members[(members.findIndex((member) => member.id === owner) + 1) % members.length]; state.assignments[id] = next.id;
  saveState(); renderPackages(); showToast(`“${pkg.name}”完整责任已转交给“${next.name}”。`);
}

function exportPlan() {
  if (!currentAnalysis) return; const groups = Object.fromEntries(currentAnalysis.members.map((member) => [member.id, []]));
  currentAnalysis.packages.forEach((pkg) => { const owner = state.assignments[pkg.id] || pkg.owner; groups[owner].push(`- ${pkg.name}：${pkg.detail.replaceAll(" · ", "、")}`); });
  const sections = currentAnalysis.members.map((member) => `${member.name}负责：\n${groups[member.id].join("\n") || "- 待共同确认"}`).join("\n\n");
  const content = `《${state.family.name}下周家庭分工约定》\n\n我们约定转交的是完整责任，而不只是最后一步。\n\n${sections}\n\n这份约定用于帮助我们看见劳动并减少遗漏，不用于评价任何人的价值。`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `${state.family.name}-下周分工约定.txt`; link.click(); URL.revokeObjectURL(url); showToast("分工约定已导出。");
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
$("#viewResultsButton").addEventListener("click", () => { renderResults(); showSection("results"); }); $("#resultsBack").addEventListener("click", () => { renderFamily(); showSection("familySpace"); });
$("#exportButton").addEventListener("click", exportPlan);
$$('[data-nav]').forEach((button) => button.addEventListener("click", () => {
  const target = button.dataset.nav;
  if (target === "join") { openOnboarding("join"); return; }
  if (!state.family) { openOnboarding("create"); return; }
  if (target === "record") openRecord(); else { renderFamily(); showSection("familySpace"); }
}));

const joinCode = new URLSearchParams(location.search).get("join");
if (joinCode) { $("#inviteCodeInput").value = joinCode; openOnboarding("join"); }
else if (state.family) { renderFamily(); showSection("familySpace"); }
