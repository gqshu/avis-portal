# AVIS 管理系统

## 项目概述

AVIS 管理系统是一个用于管理和监控智能代理的现代化 Web 应用程序。该系统提供了任务编辑、代理部署、监控和分析等功能。

## 在本地构建和测试

### 系统要求

- Node.js 18.0.0 或更高版本
- npm 8.0.0 或更高版本
- 现代浏览器（Chrome, Firefox, Safari, Edge 等）

### 安装步骤

1. 克隆仓库到本地

\`\`\`bash
git clone https://github.com/your-organization/avis-management.git
cd avis-management
\`\`\`

2. 安装依赖包

\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

3. 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

4. 在浏览器中访问应用

打开浏览器并访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

要构建用于生产环境的应用程序，请运行：

\`\`\`bash
npm run build
\`\`\`

构建完成后，可以使用以下命令启动生产服务器：

\`\`\`bash
npm start
\`\`\`

### 运行测试

执行单元测试：

\`\`\`bash
npm test
\`\`\`

执行端到端测试：

\`\`\`bash
npm run test:e2e
\`\`\`

### 项目结构

- `/app` - Next.js 应用路由
- `/components` - React 组件
- `/lib` - 工具函数和类型定义
- `/public` - 静态资源

## 常见问题解答

### Q: 应用无法启动，显示端口被占用
A: 可以通过设置 PORT 环境变量来更改默认端口：
\`\`\`bash
PORT=3001 npm run dev
\`\`\`

### Q: 如何切换语言？
A: 应用右上角有语言切换按钮，支持中文和英文。

## 技术支持

如有任何问题，请联系技术支持团队：support@daiming.com

© 2025 上海岱名科技有限公司
\`\`\`

Now, let's update the login page to add the copyright information:
