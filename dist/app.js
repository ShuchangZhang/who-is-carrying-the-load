const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const demoText = {
  a: "这周我给孩子查了三家医院，预约了体检，准备证件，还记着复诊时间。我每天决定晚饭吃什么、看冰箱缺什么并列购物清单。周末出游也是我查天气、找地方、订票和准备孩子的东西。我还提醒交水电费，联系了保洁，并记着给双方父母打电话。",
  b: "这周我请假开车带孩子体检，在医院陪诊并去药房取药。我做了三次晚饭，负责每天洗碗和倒垃圾。周末我开车，搬了露营装备。我还修好了卫生间的水龙头，取了两个快递，给车加油并做了清洁。"
};

const hiddenTasks = {
  health: ["发现需要体检", "比较三家医院", "协调请假时间", "完成预约", "准备证件", "设置提醒", "记录复诊日期", "观察后续情况"],
  meal: ["确认家人时间", "决定吃什么", "查看现有库存", "考虑营养搭配", "列购物清单", "记住忌口", "处理剩余食材", "计划明天早餐"],
  weekend: ["提出备选方案", "查看天气", "比较预算", "预订门票", "规划路线", "准备孩子物品", "确认开放时间", "安排返程晚餐"]
};

const packages = [
  { id: "health", icon: "🩺", name: "孩子健康", detail: "发现 · 预约 · 陪诊 · 跟进", owner: "a", weight: 22 },
  { id: "inventory", icon: "🧻", name: "日用品库存", detail: "检查 · 购买 · 补充 · 归位", owner: "a", weight: 13 },
  { id: "meal", icon: "🍲", name: "一周饮食", detail: "计划 · 采购 · 烹饪 · 善后", owner: "a", weight: 18 },
  { id: "weekend", icon: "⛺", name: "周末安排", detail: "提议 · 预订 · 准备 · 复盘", owner: "a", weight: 15 },
  { id: "bills", icon: "🧾", name: "家庭账单", detail: "核对 · 缴费 · 记录 · 提醒", owner: "a", weight: 10 },
  { id: "car", icon: "🚗", name: "车辆维护", detail: "检查 · 预约 · 送修 · 验收", owner: "b", weight: 12 },
  { id: "repair", icon: "🔧", name: "家庭维修", detail: "发现 · 采购 · 维修 · 清理", owner: "b", weight: 10 }
];

let state = {
  submittedA: false,
  submittedB: false,
  packages: structuredClone(packages)
};

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function scrollToWorkspace() {
  $("#workspace").scrollIntoView({ behavior: "smooth", block: "start" });
}

function addPrompt(event) {
  const card = event.currentTarget.closest(".member-card");
  const textarea = card.querySelector("textarea");
  const phrase = event.currentTarget.dataset.add;
  textarea.value = `${textarea.value}${textarea.value ? "\n" : ""}${phrase}：`;
  textarea.focus();
}

function submitMember(member) {
  const input = $(`#input${member.toUpperCase()}`);
  if (input.value.trim().length < 12) {
    showToast("再多写一点，系统才能发现完整责任。");
    input.focus();
    return;
  }
  state[`submitted${member.toUpperCase()}`] = true;
  const status = $(`#status${member.toUpperCase()}`);
  status.textContent = "已私密提交";
  status.classList.add("done");
  input.disabled = true;
  input.closest(".member-card").querySelectorAll("button").forEach((button) => button.disabled = true);
  input.closest(".member-card").classList.remove("active");

  if (member === "a") {
    const cardB = $("[data-member-card='b']");
    cardB.classList.remove("locked");
    cardB.classList.add("active");
    cardB.querySelectorAll("textarea, button").forEach((control) => control.disabled = false);
    $("#submitB").textContent = "提交我的记录";
    $("#statusB").textContent = "填写中";
    showToast("成员 A 已提交。现在请把设备交给成员 B。");
    $("#inputB").focus();
  }

  if (state.submittedA && state.submittedB) unlockMerge();
}

function unlockMerge() {
  const gate = $("#mergeGate");
  gate.querySelector("strong").textContent = "双方记录已就绪";
  gate.querySelector("p").textContent = "现在可以把两种视角合并成一张完整的家庭劳动地图。";
  gate.querySelector(".gate-icon").textContent = "✓";
  $("#mergeButton").disabled = false;
  $("#mergeButton").textContent = "合并双方视角";
  showToast("双方已提交，合并视角已经解锁。");
}

function loadDemo() {
  state.submittedA = false;
  state.submittedB = false;
  $("#inputA").disabled = false;
  $("#inputB").disabled = false;
  $("#inputA").value = demoText.a;
  $("#inputB").value = demoText.b;
  $$(".member-card").forEach((card) => {
    card.classList.remove("locked");
    card.querySelectorAll("button").forEach((button) => button.disabled = false);
  });
  $("#statusA").textContent = "示例已载入";
  $("#statusB").textContent = "示例已载入";
  $("#submitA").textContent = "提交林予的记录";
  $("#submitB").textContent = "提交周然的记录";
  scrollToWorkspace();
  showToast("演示家庭已载入。请依次提交两人的记录。");
}

function mergeViews() {
  $("#results").classList.remove("hidden");
  renderHiddenTasks("health");
  renderPackages();
  setTimeout(() => $("#results").scrollIntoView({ behavior: "smooth", block: "start" }), 80);
}

function renderHiddenTasks(task) {
  const container = $("#hiddenTaskList");
  container.innerHTML = hiddenTasks[task].map((item, index) => `<div class="hidden-task" style="animation-delay:${index * 30}ms">${item}</div>`).join("");
}

function movePackage(id) {
  const item = state.packages.find((pkg) => pkg.id === id);
  item.owner = item.owner === "a" ? "b" : "a";
  renderPackages();
  const ownerName = item.owner === "a" ? "林予" : "周然";
  showToast(`“${item.name}”完整责任已转交给${ownerName}。`);
}

function renderPackages() {
  const a = state.packages.filter((item) => item.owner === "a");
  const b = state.packages.filter((item) => item.owner === "b");
  const render = (items, direction) => items.map((item) => `
    <button class="package-card" data-package="${item.id}">
      <span class="package-icon">${item.icon}</span>
      <div><strong>${item.name}</strong><small>${item.detail}</small></div>
      <span class="arrow">${direction}</span>
    </button>`).join("");
  $("#packagesA").innerHTML = render(a, "→");
  $("#packagesB").innerHTML = render(b, "←");
  $$('[data-package]').forEach((button) => button.addEventListener("click", () => movePackage(button.dataset.package)));

  const loadA = a.reduce((sum, item) => sum + item.weight, 0);
  const loadB = 100 - loadA;
  const score = Math.max(0, Math.round(100 - Math.abs(loadA - loadB) * 1.28));
  $("#loadA").textContent = `${loadA}%`;
  $("#loadB").textContent = `${loadB}%`;
  $("#balanceScore").textContent = score;
  $("#ringScore").textContent = score;
  $(".balance-ring").style.transform = `rotate(${Math.min(18, (score - 42) / 3)}deg)`;

  const difference = Math.abs(loadA - loadB);
  if (difference <= 12) {
    $("#actionSummary").innerHTML = "<strong>现在的责任分布已经比较均衡。</strong>建议保留一周试运行，并在周日用十分钟共同复盘。";
  } else {
    const heavier = loadA > loadB ? "林予" : "周然";
    const lightOwner = loadA > loadB ? "a" : "b";
    const candidate = state.packages.filter((item) => item.owner === lightOwner).sort((x, y) => x.weight - y.weight)[0];
    $("#actionSummary").innerHTML = `<strong>${heavier}仍承担较多心智负担。</strong>${candidate ? `可以继续调整“${candidate.name}”或相近规模的责任包。` : "可以继续转交一个边界清晰的责任包。"}`;
  }
}

function exportPlan() {
  const groups = { a: [], b: [] };
  state.packages.forEach((item) => groups[item.owner].push(`- ${item.name}：${item.detail.replaceAll(" · ", "、")}`));
  const content = `《下周家庭分工约定》\n\n我们约定转交的是完整责任，而不只是最后一步。\n\n林予负责：\n${groups.a.join("\n")}\n\n周然负责：\n${groups.b.join("\n")}\n\n共同复盘时间：本周日晚上 20:30，时长 10 分钟。\n\n这份约定用于帮助我们看见劳动并减少遗漏，不用于评价任何人的价值。`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "下周家庭分工约定.txt";
  link.click();
  URL.revokeObjectURL(url);
  showToast("分工约定已导出。");
}

$("#startButton").addEventListener("click", scrollToWorkspace);
$("#demoButton").addEventListener("click", loadDemo);
$("#submitA").addEventListener("click", () => submitMember("a"));
$("#submitB").addEventListener("click", () => submitMember("b"));
$("#mergeButton").addEventListener("click", mergeViews);
$("#exportButton").addEventListener("click", exportPlan);
$$('[data-add]').forEach((button) => button.addEventListener("click", addPrompt));
$$('[data-task]').forEach((button) => button.addEventListener("click", () => {
  $$('[data-task]').forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderHiddenTasks(button.dataset.task);
}));

renderHiddenTasks("health");
