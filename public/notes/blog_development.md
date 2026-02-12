# 博客网站搭建

<!-- [tag]: Web Application、Vite -->

<!-- [description]: 记录Blog网站搭建所用工具及流程 -->

使用Vite构建，通过GitHub Pages部署。

## 🚀 部署到 GitHub Pages (3 分钟)

### 1. 准备仓库

- 在 GitHub 上创建一个名为 `your-username.github.io` 的公开仓库。
- 如果不是个人主页（例如作为项目文档），仓库名可以是 `my-blog`。

### 2. 推送代码

将本地代码推送到 GitHub：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 3. 配置 GitHub Pages 设置

1. 进入 GitHub 仓库的 **Settings** 选项卡。
2. 侧边栏点击 **Pages**。
3. 在 **Build and deployment > Source** 处，选择 **"Deploy from a branch"**。
4. 现在，每次你在 **gh-pages** 分支 `git push` 代码，网站都会自动更新。

### 4. 关于路径 (重要)

- 如果你的网址是 `username.github.io` (User Page)，无需额外配置。
- 如果你的网址是 `username.github.io/my-blog/` (Project Page)，请在 `vite.config.ts` 中设置 `base: '/my-blog/'`。

## 📁 笔记管理说明

- **Markdown**: 将 `.md` 文件放入根目录的 `/public/notes/` 文件夹。
- **PDF**: 将 `.pdf` 文件放入根目录的 `/public/notes/` 文件夹。
- **元数据**: 使用 `scripts/generate-registry.js` 自动化脚本同步更新 `registry.ts` 中的列表

## 🛠 开发环境

```bash
npm install     # 安装依赖
npm run dev     # 本地预览
npm run build   # 手动构建
npm run deploy  # 部署到github仓库
```
