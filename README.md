# 谁在操心？｜Who's Carrying the Load?

> 让家庭中看得见的执行与看不见的计划、提醒、协调和跟进，都能被共同看见。
>
> Make both visible chores and invisible planning, reminding, coordinating, and follow-up work visible to the whole family.

[在线演示 / Live Demo](https://shared-mental-load-demo.vocalfield4096.chatgpt.site)

## 中文介绍

“谁在操心”是一款家庭隐形劳动可视化概念产品。家庭成员通过邀请码或邀请链接加入同一个家庭空间，在各自的设备上独立记录自己一周承担的事情。所有成员提交后，系统会合并不同视角，识别劳动类型、认知差异和完整责任链，并帮助家庭重新分配整组责任，而不是只转交最后一个执行步骤。

### 核心功能

- **独立成员入口。** 用户可以创建家庭空间并生成邀请码或邀请链接，受邀成员只进入自己的记录页面，也可以随时加入其他家庭或离开当前家庭。
- **本地文本分析。** 浏览器内的中文规则引擎会识别健康照护、饮食、清洁、账单、孩子成长等家庭领域，以及计划、提醒、协调、执行和跟进等劳动类型。
- **动态劳动冰山。** 用户输入会真实改变水面上的可见执行，以及水面下的计划、提醒和持续责任。
- **双视角对照。** 系统直接引用双方的原始记录，展示同一家庭领域中不同成员关注的环节。
- **完整责任包。** 用户可以把包含发现、计划、执行和跟进的整组责任转交给另一位成员，并实时查看平衡度变化。
- **分工约定导出。** 调整完成后可以导出下一周的家庭分工文本。

### 快速开始

本项目是无构建步骤的纯前端应用，不需要安装依赖。进入项目目录后运行任意静态文件服务器即可：

```bash
python3 -m http.server 4173 --directory dist
```

然后访问 `http://localhost:4173`。

也可以直接打开 `dist/index.html`，但使用本地服务器可以获得更稳定的浏览器行为。

### 项目结构

```text
.
├── dist/
│   ├── assets/
│   │   └── iceberg-gouache.png
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── .openai/
│   └── hosting.json
├── CONTRIBUTING.md
├── LICENSE
├── NOTICE.md
└── README.md
```

### 技术说明与限制

当前版本完全运行在浏览器中，用户记录存储于 `localStorage`，不会上传到服务器。自由文本分析由本地规则引擎完成，不依赖外部 AI API，因此可以作为纯前端作品迁移到 REDcowork 等平台。

邀请码、邀请链接和独立成员页面已经包含完整的产品交互，但当前版本没有后端数据库，因此不同手机之间不会真正实时同步数据。正式产品需要增加身份认证、家庭成员关系、云端存储和实时同步服务。

### 后续路线

- 增加真实的跨设备家庭空间和实时同步。
- 增加端到端加密及更细粒度的成员可见范围。
- 将本地规则分析升级为隐私友好的模型分析，同时保留人工确认与修改能力。
- 支持每周趋势、责任轮换和家庭复盘提醒。
- 增加更多家庭结构、室友和照护场景。

## English

**Who's Carrying the Load?** is a concept product for visualizing invisible household labor. Family members join a shared household through an invite code or link and independently describe what they handled during the week on their own devices. Once everyone submits, the app combines their perspectives, identifies labor categories and responsibility gaps, and helps the household reassign complete responsibility bundles rather than isolated final tasks.

### Key features

- **Independent member entry.** Create a household, generate an invite code or link, give every member a private input flow, and let users join another household or leave the current one at any time.
- **Local text analysis.** A browser-based Chinese rules engine detects household domains and distinguishes planning, reminding, coordinating, execution, and follow-up work.
- **Dynamic labor iceberg.** User input directly changes the visible tasks above water and the mental load shown below the surface.
- **Two-perspective comparison.** The product quotes each member's original wording to reveal different views of the same household domain.
- **Complete responsibility bundles.** Reassign an entire chain of discovery, planning, execution, and follow-up while watching the balance score update.
- **Exportable weekly agreement.** Download a plain-text household responsibility plan after reaching an agreement.

### Run locally

This is a buildless static web application with no dependencies to install:

```bash
python3 -m http.server 4173 --directory dist
```

Then open `http://localhost:4173`.

### Architecture and limitations

The current version runs entirely in the browser. Household records are stored in `localStorage` and are never uploaded. Text analysis is performed by a local rules engine with no external AI API, which keeps the prototype portable to frontend-only platforms.

The invite-code, invite-link, and independent member flows are implemented as a product prototype. Because this version has no backend database, separate phones do not yet share data in real time. A production version would require authentication, household membership, persistent cloud storage, and synchronization.

### Roadmap

- Real cross-device household spaces and live synchronization.
- End-to-end encryption and granular visibility controls.
- Privacy-preserving model analysis with human review and correction.
- Weekly trends, responsibility rotation, and reflection reminders.
- Support for roommates, caregivers, and additional household structures.

## Privacy

This prototype does not send household entries to a server. Avoid entering sensitive personal information when using a modified or externally hosted copy whose behavior you have not reviewed.

## License

This repository is private and proprietary. All rights are reserved. See [LICENSE](LICENSE) for details.
