# 半岛黄埔军校课程智慧中台（独立管理后台）

这是半岛黄埔军校 AI 智能测评与陪练系统的独立管理后台，用于把原始课程视频和资料加工为可发布的学习内容，并运营课程版本、知识语料和发布记录。

> 当前为产品演示 / 管理后台原型。数据以浏览器本地存储为主；与用户端跨域实时联动需要接入共享后端。

## 后台在做什么

后台围绕“原始课程 → 资料解析 → AI 内容加工 → 审核发布 → 用户端学习”的内容生产链路设计：

1. 运营人员选择课程模块。
2. 上传课程视频和 TXT、Markdown、DOCX、PDF 资料。
3. 系统读取资料文本，生成课程导览与关键节点。
4. 运营人员检查内容并发布。
5. 精彩表达进入语料中心，标注精华点、来源和应用方式。

## 功能模块

### 运营总览

- 课程小节、已上传视频、AI 导览和知识语料概览。
- 内容生产链路、内容质量指标与近期课程状态。

### 课程管理

- 查看课程模块、版本、发布状态和更新时间。
- 为版本回滚、审核流和权限管理预留产品结构。

### 课程上传与内容加工

- 选择课程小节，上传、替换或移除课程视频。
- 上传 TXT、Markdown、DOCX 或 PDF 课程资料。
- 在浏览器端解析资料文本。
- 根据课程知识与资料生成导览和关键节点。
- 未配置模型密钥时使用确定性规则，保证演示可用。

### 精彩语料中心

- 展示语料原文、分类和审核状态。
- 说明精华点：这段表达为什么值得沉淀。
- 说明应用方式：可用于课程、销售话术、陪练反馈或场景题的哪个环节。
- 标注来源、原文定位、适用场景、贡献值和时间。

### 发布记录

- 展示课程版本、发布内容、操作者、状态和发布时间。
- 为正式系统的审计、审批和回滚提供界面基础。

## 技术栈

- Next.js 16、React 19、TypeScript
- Vinext、Vite
- Cloudflare Workers / Wrangler
- Mammoth（DOCX 文本读取）
- PDF.js（PDF 文本读取）
- IndexedDB 与 localStorage（演示数据）

## 本地部署

要求 Node.js `>= 22.13.0` 和 npm。

```bash
git clone https://github.com/alwaysnepenthe/l3-ai-assessment-admin.git
cd l3-ai-assessment-admin
npm ci
npm run dev
```

默认访问：`http://127.0.0.1:5173/`

如果用户端已占用 5173：

```bash
npm run dev -- --port 5174
```

局域网演示：

```bash
npm run dev -- --hostname 0.0.0.0 --port 5174
```

## 构建与生产预览

```bash
npm run build
npm run start
```

`npm run start` 通过 Wrangler 启动生产构建预览，地址以终端输出为准。

## AI 配置

复制 `.env.example` 为 `.env.local`：

```env
AI_API_KEY=
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4.1-mini
```

- 密钥为空时使用规则生成课程导览与关键节点。
- 配置兼容 OpenAI Chat Completions 的服务后优先调用模型。
- 模型调用位于服务端 API；不要提交真实密钥。
- 正式环境应增加超时、重试、限流、日志脱敏、内容审核和结构校验。

## 当前数据边界

独立后台可以单独运行，但数据层仍是演示实现：

- 课程清单通过 `/api/admin/courses` 返回默认数据。
- 发布后的课程清单保存在当前站点 localStorage。
- 视频保存在当前浏览器 IndexedDB。
- 数据不会自动上传到服务器，也不会跨浏览器、跨设备或跨域名共享。

因此，当后台部署在 `admin.example.com`、用户端部署在 `learn.example.com` 时，两者不会因为 localStorage 自动同步。

## 正式连接用户端的建议架构

```text
管理后台 ──管理员鉴权/RBAC──┐
                            ├── 统一课程 API ── 数据库
用户端 ──用户鉴权───────────┘                 ├── 课程与版本
                                             ├── 学习与测评记录
                                             ├── 会话与成长档案
                                             └── 语料与审核记录

管理后台 ───────────────────── 对象存储（视频、资料、语音）
模型服务 ───────────────────── 知识检索、内容加工、陪练反馈
```

建议实施：

1. 建立课程、章节、资源、版本、发布记录、语料和审核任务等服务端数据表。
2. 视频与文档上传到对象存储，数据库只保存元数据和资源地址。
3. 用户端只读取“已发布”版本；后台通过审核与发布接口更新线上版本。
4. 配置管理员身份、角色权限、操作日志和发布审批。
5. 配置统一网关或受控 CORS，不依赖跨域浏览器存储。
6. 为课程与语料建立来源、授权、医疗合规和版本追溯字段。

## 项目结构

```text
app/
  page.tsx                         独立后台入口
  admin-console.tsx                后台页面和交互
  admin.css                        后台视觉样式
  api/admin/courses/route.ts       默认课程清单
  api/admin/courses/upload/        AI/规则内容生成接口
lib/
  client-course-store.ts           浏览器课程与视频存储
  course-file-parser.ts            TXT/MD/DOCX/PDF 解析
  course-content.ts                课程清单与生成规则
  course.ts                        课程知识数据
public/                             静态资源
scripts/                            安装、开发和构建脚本
worker/                             Cloudflare Worker 入口
```

## 常用命令

| 命令            | 用途                |
| --------------- | ------------------- |
| `npm ci`        | 按锁文件安装依赖    |
| `npm run dev`   | 启动开发服务器      |
| `npm run build` | 生成生产构建        |
| `npm run start` | 本地预览生产 Worker |
| `npm run lint`  | 代码检查            |

## 部署与上线检查

项目保留 Vinext、Worker 和 Wrangler 配置。首次部署应为后台创建独立项目，不复用用户端项目 ID。

正式上线前需要：

- 用数据库与对象存储替换浏览器本地数据。
- 接入管理员登录、RBAC、审核发布与审计日志。
- 接入统一课程 API，让用户端只读取已发布版本。
- 为模型调用增加成本控制、降级策略和人工审核。
- 增加文件大小、类型、病毒扫描与解析失败处理。
- 完成课程版权、个人信息和医疗合规审核。

## 相关仓库

- 用户端与完整演示：`alwaysnepenthe/l3-ai-assessment-demo`
- 独立管理后台：`alwaysnepenthe/l3-ai-assessment-admin`
