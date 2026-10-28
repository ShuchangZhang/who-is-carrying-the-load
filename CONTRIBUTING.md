# Contributing / 协作说明

## 中文

这是一个私有概念项目。提交修改前，请先确认改动与以下产品原则一致：分析任务结构而不是评价家庭成员；成员只替自己填写；合并前保护个人原始记录；所有自动分析结果都允许用户检查和修改。

建议从独立分支提交改动，并在提交信息中说明用户问题、实现方式和验证结果。涉及交互变化时，请同时检查桌面端与手机端。涉及分析规则时，请至少准备两组不同文本，确认结果会随输入变化。

提交前可以运行：

```bash
node --check dist/app.js
python3 -m http.server 4173 --directory dist
```

## English

This is a private concept project. Before contributing, make sure the change follows these product principles: analyze task structures rather than judging family members; let members enter only their own work; protect raw entries before aggregation; and allow users to review and correct automated analysis.

Work on a dedicated branch and describe the user problem, implementation, and verification in the commit message or pull request. Test interaction changes on both desktop and mobile layouts. For analysis-rule changes, use at least two distinct input samples and confirm that the output changes accordingly.

Before submitting, run:

```bash
node --check dist/app.js
python3 -m http.server 4173 --directory dist
```
