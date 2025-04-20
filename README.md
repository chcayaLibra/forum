# 个人前端项目
个人练习...，类似论坛类网站...

## 前端：
- vue

## 后端：
- node.js
- express
- mysql

## 运行：
前后端分别安装依赖包：
```bash
pnpm i
```
启动前端服务：
```bash
pnpm dev
```
启动后端服务：<br />
导入database.sql<br />
在/backend/server.js中填入：
```js
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '你的密码',
  database: '数据库名'
})
```
命令行启动：
```bash
node server.js
```

### 版本：
version: 1.0.0<br />
初代版本，当前版本内容：<br />
帖子：发布，公开/非公开，删除，收藏，评论，搜索<br />
用户：登录，注册，关注，聊天，编辑个人信息<br />
UI: 浅深切换<br />
问题：一些场景下收藏帖子顺序混乱...<br />

version: 1.0.1<br />
优化了小屏弹窗 -250420
优化了部分页面对小屏的适配 -250420