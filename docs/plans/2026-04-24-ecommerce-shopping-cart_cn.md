# 电商购物车 — 中文实施计划

> **说明：** 本文档是英文计划 `2026-04-24-ecommerce-shopping-cart.md` 的完整同步翻译，供阅读和理解使用。所有实际编码执行请参照英文计划。

**目标：** 构建一个完整的全栈单页电商应用，包含商品浏览、购物车管理、JWT 认证、实时搜索和管理员后台，满足 32516 Assignment 2 评分标准的所有要求。

**架构：** React 单页应用（仅一个 `index.html`）通过 `services/` 中集中管理的 fetch 函数与 FastAPI 后端通信。FastAPI 使用 JWT `Depends` 中间件保护路由。MySQL 存储三个核心实体（用户、商品、购物车）。

**技术栈：** React 18 + Vite + React Router v6 · FastAPI · SQLAlchemy · MySQL 8 · python-jose · passlib/bcrypt

**工作量分配（方案 B — 按功能分工）：**

| 任务 | 负责人 | 涉及文件 |
|------|--------|---------|
| 任务 1 — 数据库 Schema + 初始数据 | **Qiushi Huang (25668904)** | `database/` |
| 任务 2 — FastAPI 项目初始化 | **Xuyu Zhang (26025395)** | `backend/main.py`, `database.py`, `requirements.txt` |
| 任务 3 — 用户模型 + JWT 认证 | **Xuyu Zhang (26025395)** | `backend/auth/`, `routers/auth.py`, `models/user.py`, `schemas/user.py` |
| 任务 4a — 商品模型 + 路由 | **Qiushi Huang (25668904)** | `backend/routers/products.py`, `models/product.py`, `schemas/product.py` |
| 任务 4b — 购物车模型 + 路由 | **Xuyu Zhang (26025395)** | `backend/routers/cart.py`, `models/cart.py`, `schemas/cart.py` |
| 任务 4c — 用户管理路由（管理员） | **Qiushi Huang (25668904)** | `backend/routers/users.py` |
| 任务 5 — Vite + React + 路由配置 | **Xuyu Zhang (26025395)** | `frontend/src/main.jsx`, `App.jsx` |
| 任务 6 — AuthContext + 服务层 | **Xuyu Zhang (26025395)** | `frontend/src/context/`, `services/api.js`, `services/authService.js`, `services/cartService.js` |
| 任务 6b — 商品服务层 | **Qiushi Huang (25668904)** | `frontend/src/services/productService.js` |
| 任务 7 — 导航栏 + 登录 + 注册页 | **Xuyu Zhang (26025395)** | `frontend/src/components/Navbar.jsx`, `pages/LoginPage.jsx`, `pages/RegisterPage.jsx` |
| 任务 8 — 首页 + 实时搜索 | **Qiushi Huang (25668904)** | `frontend/src/pages/HomePage.jsx`, `components/ProductCard.jsx`, `hooks/useSearch.js` |
| 任务 9 — 购物车页 + 个人资料页 | **Xuyu Zhang (26025395)** | `frontend/src/pages/CartPage.jsx`, `pages/ProfilePage.jsx` |
| 任务 10 — 管理员页面 | **Qiushi Huang (25668904)** | `frontend/src/pages/Admin*.jsx` |
| 任务 11–15 — 收尾与提交 | **两人共同** | 共同完成 |

**本计划满足的评分标准：**
- 单页应用（只有一个 .html 文件）✓
- 三个实体的完整 CRUD 操作 ✓
- JWT 登录 + bcrypt 密码加密 ✓
- 实时搜索 ✓
- 管理员角色 + 查看所有购物车 ✓
- 全程有意义的 commit 记录 ✓
- 代码中无硬编码凭证 ✓

---

## 第一阶段 — 数据库

### 任务 1：编写数据库 Schema

**涉及文件：**
- 新建：`database/schema.sql`

**第 1 步：编写 schema.sql**

创建四张表：
- `users`：存储用户账号、邮箱、加密密码和角色（user/admin）
- `products`：存储商品名称、描述、价格、库存和图片链接
- `shopping_cart`：每个用户对应一个购物车（一对一关系）
- `cart_items`：购物车内的具体商品条目，记录商品ID和数量

**第 2 步：应用到 MySQL**
```bash
mysql -u root -p < database/schema.sql
```
预期结果：无报错，`SHOW DATABASES;` 中能看到 `ecommerce` 数据库

**第 3 步：编写初始测试数据**

文件：`database/seed.sql`

插入一个 admin 账号和 5 个示例商品（无线耳机、机械键盘、USB-C 扩展坞、高清摄像头、显示器支架）

**第 4 步：提交代码**
```bash
git add database/
git commit -m "feat: add database schema and seed data"
```

---

## 第二阶段 — 后端基础

### 任务 2：FastAPI 项目初始化

**涉及文件：**
- 新建：`backend/requirements.txt`
- 新建：`backend/database.py`
- 新建：`backend/main.py`
- 新建：`backend/.env`（不提交，从 `.env.example` 复制）

**第 1 步：编写 requirements.txt**

包含以下依赖：fastapi、uvicorn、sqlalchemy、pymysql、python-dotenv、passlib[bcrypt]、python-jose[cryptography]、python-multipart

**第 2 步：安装依赖**
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate   # Windows Git Bash
pip install -r requirements.txt
```

**第 3 步：编写 database.py**

功能：从 `.env` 读取数据库配置，创建 SQLAlchemy 引擎和 Session 工厂，提供 `get_db()` 依赖函数供路由使用

**第 4 步：编写 main.py**

功能：创建 FastAPI 应用实例，配置 CORS（允许前端 `localhost:5173` 访问），注册四个路由模块（auth、users、products、cart）

**第 5 步：验证服务器启动**
```bash
uvicorn main:app --reload
```
预期结果：`Application startup complete`，打开 `http://localhost:8000/docs` 能看到 Swagger 文档

**第 6 步：提交代码**
```bash
git add backend/requirements.txt backend/database.py backend/main.py
git commit -m "chore: set up FastAPI project with DB connection and CORS"
```

---

### 任务 3：用户模型、数据结构和 JWT 认证

**涉及文件：**
- 新建：`backend/models/user.py`
- 新建：`backend/schemas/user.py`
- 新建：`backend/auth/jwt.py`
- 新建：`backend/routers/auth.py`

**第 1 步：编写 models/user.py**

使用 SQLAlchemy 定义 `users` 表对应的 ORM 模型，字段包括：id、username、email、password_hash、role、created_at

**第 2 步：编写 schemas/user.py**

使用 Pydantic 定义：
- `UserRegister`：注册请求体（username + email + password）
- `UserLogin`：登录请求体（email + password）
- `UserOut`：返回给前端的用户信息（不含密码）
- `Token`：登录/注册成功后返回的 JWT token + 用户信息

**第 3 步：编写 auth/jwt.py**

包含以下核心功能：
- `hash_password()`：用 bcrypt 加密密码
- `verify_password()`：验证密码是否匹配
- `create_token()`：生成 JWT token，设置过期时间
- `get_current_user()`：从请求头的 Bearer token 解析当前用户，供路由使用
- `require_admin()`：在 `get_current_user` 基础上额外检查 role === 'admin'

**第 4 步：编写 routers/auth.py**

实现两个接口：
- `POST /auth/register`：注册新用户，哈希密码，自动为新用户创建空购物车，返回 token
- `POST /auth/login`：验证邮箱和密码，返回 token

**第 5 步：在 Swagger 中验证**
- 打开 `http://localhost:8000/docs`
- 测试 `POST /auth/register`：期望返回 201 和 token
- 测试 `POST /auth/login`：期望返回 200 和 token

**第 6 步：提交代码**
```bash
git add backend/models/user.py backend/schemas/user.py backend/auth/jwt.py backend/routers/auth.py
git commit -m "feat: implement JWT register and login with bcrypt"
```

---

### 任务 4：商品和购物车模型 + CRUD 路由

**涉及文件：**
- 新建：`backend/models/product.py`
- 新建：`backend/models/cart.py`
- 新建：`backend/schemas/product.py`
- 新建：`backend/schemas/cart.py`
- 新建：`backend/routers/products.py`
- 新建：`backend/routers/cart.py`
- 新建：`backend/routers/users.py`

**第 1 步：编写 models/product.py**

定义 `products` 表 ORM 模型，字段：id、name、description、price、stock、image_url、created_at、updated_at

**第 2 步：编写 models/cart.py**

定义两个模型：
- `ShoppingCart`：关联 user_id，包含 items 关系
- `CartItem`：关联 cart_id 和 product_id，记录数量；cart_id + product_id 组合唯一（防止重复添加）

**第 3 步：编写 schemas/product.py**

定义：`ProductCreate`（创建）、`ProductUpdate`（更新，所有字段可选）、`ProductOut`（返回给前端）

**第 4 步：编写 schemas/cart.py**

定义：`CartItemAdd`（加入购物车）、`CartItemUpdate`（修改数量）、`CartItemOut`（含完整商品信息）、`CartOut`（整个购物车）、`UserCartOut`（管理员用：用户信息 + 购物车）

**第 5 步：编写 routers/products.py**

实现以下接口：
- `GET /products?q=关键词`：获取商品列表，支持按名称模糊搜索（公开）
- `GET /products/{id}`：获取单个商品（公开）
- `POST /products`：新增商品（仅 admin）
- `PUT /products/{id}`：修改商品（仅 admin）
- `DELETE /products/{id}`：删除商品（仅 admin）

**第 6 步：编写 routers/cart.py**

实现以下接口：
- `GET /cart/me`：查看自己的购物车（需登录）
- `POST /cart/items`：加入商品；若已存在则累加数量（需登录）
- `PUT /cart/items/{id}`：修改数量；数量 ≤ 0 则自动删除该条目（需登录）
- `DELETE /cart/items/{id}`：删除购物车条目（需登录）
- `GET /cart/all`：获取所有用户的购物车（仅 admin）

**第 7 步：编写 routers/users.py**

实现以下接口：
- `GET /users/me`：查看自己的资料（需登录）
- `GET /users`：获取所有用户列表（仅 admin）
- `DELETE /users/{id}`：删除用户（仅 admin）

**第 8 步：在 Swagger 中验证所有路由**

**第 9 步：提交代码**
```bash
git add backend/models/ backend/schemas/ backend/routers/
git commit -m "feat: add product, cart, and user CRUD routes with admin protection"
```

---

## 第三阶段 — 前端基础

### 任务 5：Vite + React 项目初始化 + 路由配置

**涉及文件：**
- 新建：`frontend/`（Vite 脚手架）
- 修改：`frontend/src/main.jsx`
- 新建：`frontend/src/App.jsx`

**第 1 步：创建 React 项目**
```bash
cd frontend
npm create vite@latest . -- --template react
npm install
npm install react-router-dom
```

**第 2 步：编写 main.jsx**

用 `BrowserRouter` 和 `AuthProvider` 包裹整个应用

**第 3 步：编写 App.jsx**

配置所有页面路由：
- `/` → 首页（商品列表）
- `/login` → 登录页
- `/register` → 注册页
- `/cart` → 购物车页（需登录）
- `/profile` → 个人资料页（需登录）
- `/admin/products` → 管理员商品管理（仅 admin）
- `/admin/users` → 管理员用户管理（仅 admin）
- `/admin/carts` → 管理员购物车查看（仅 admin）

用 `PrivateRoute` 组件保护需要登录的页面，用 `AdminRoute` 组件保护管理员页面

**第 4 步：提交代码**
```bash
git add frontend/
git commit -m "chore: scaffold React app with Vite and configure all routes"
```

---

### 任务 6：AuthContext 和 API 服务层

**涉及文件：**
- 新建：`frontend/src/context/AuthContext.jsx`
- 新建：`frontend/src/services/api.js`
- 新建：`frontend/src/services/authService.js`
- 新建：`frontend/src/services/productService.js`
- 新建：`frontend/src/services/cartService.js`

**第 1 步：编写 context/AuthContext.jsx**

用 React Context 管理全局登录状态：
- 初始化时从 `localStorage` 读取已保存的用户信息
- `login(user, token)`：保存 token 和用户到 `localStorage`，更新状态
- `logout()`：清除 `localStorage`，重置状态

**第 2 步：编写 services/api.js**

封装一个通用 `request()` 函数：
- 自动从 `localStorage` 读取 token，加到 `Authorization: Bearer` 请求头
- 统一处理 204 No Content 响应
- 请求失败时抛出错误信息（而不是让页面崩溃）
- 导出 `api.get` / `api.post` / `api.put` / `api.delete` 四个快捷方法

**第 3 步：编写 services/authService.js**

封装注册和登录接口调用

**第 4 步：编写 services/productService.js**

封装商品列表查询（含搜索参数）、创建、更新、删除接口

**第 5 步：编写 services/cartService.js**

封装查看购物车、加入商品、修改数量、删除条目、管理员查看所有购物车接口

**第 6 步：提交代码**
```bash
git add frontend/src/context/ frontend/src/services/
git commit -m "feat: add AuthContext and centralised API service layer"
```

---

## 第四阶段 — 前端页面

### 任务 7：导航栏 + 登录页 + 注册页

**涉及文件：**
- 新建：`frontend/src/components/Navbar.jsx`
- 新建：`frontend/src/pages/LoginPage.jsx`
- 新建：`frontend/src/pages/RegisterPage.jsx`

**第 1 步：编写 components/Navbar.jsx**

根据登录状态显示不同导航项：
- 未登录：显示「Login」和「Register」链接
- 已登录（普通用户）：显示「Cart」、用户名、「Logout」
- 已登录（admin）：额外显示金色的「Admin」链接

**第 2 步：编写 pages/LoginPage.jsx**

表单包含邮箱和密码输入框，提交后：
- 调用 `authService.login()`
- 成功：调用 `AuthContext.login()` 保存状态，跳转到首页
- 失败：在表单上方显示错误信息（红色文字，不跳转、不白屏）

**第 3 步：编写 pages/RegisterPage.jsx**

与登录页结构相同，调用 `authService.register()`，字段：用户名 + 邮箱 + 密码

**第 4 步：在浏览器中验证**

登录成功后跳转到 `/`；出错时显示行内错误提示（不出现白屏）

**第 5 步：提交代码**
```bash
git add frontend/src/components/Navbar.jsx frontend/src/pages/LoginPage.jsx frontend/src/pages/RegisterPage.jsx
git commit -m "feat: add Navbar, LoginPage, and RegisterPage"
```

---

### 任务 8：首页 + 实时搜索

**涉及文件：**
- 新建：`frontend/src/pages/HomePage.jsx`
- 新建：`frontend/src/components/ProductCard.jsx`
- 新建：`frontend/src/hooks/useSearch.js`

**第 1 步：编写 hooks/useSearch.js**

自定义 Hook，核心逻辑：
- 用 `useState` 管理搜索词和商品列表
- 用 `useEffect` 监听搜索词变化，加 300ms 防抖（避免每次击键都请求接口）
- 请求失败时设置友好的错误信息（不崩溃）

**第 2 步：编写 components/ProductCard.jsx**

展示单个商品：图片、名称、描述、价格、库存状态、「Add to Cart」按钮：
- 未登录点击按钮：提示「请先登录」
- 已登录点击：调用 `cartService.addToCart()`，成功显示「Added!」绿色提示
- 库存为 0：按钮 disabled

**第 3 步：编写 pages/HomePage.jsx**

页面布局：搜索框 + 商品卡片网格（flex wrap）：
- 搜索框 `onChange` 直接更新 `useSearch` 的 query
- 加载中显示 `Loading...`
- 无结果显示 `No products found.`
- 请求失败显示红色错误信息

**第 4 步：在浏览器中验证实时搜索**

在搜索框输入关键词，商品列表应即时更新，无需点击搜索按钮，无需刷新页面

**第 5 步：提交代码**
```bash
git add frontend/src/hooks/useSearch.js frontend/src/components/ProductCard.jsx frontend/src/pages/HomePage.jsx
git commit -m "feat: add HomePage with live search and ProductCard"
```

---

### 任务 9：购物车页 + 个人资料页

**涉及文件：**
- 新建：`frontend/src/pages/CartPage.jsx`
- 新建：`frontend/src/pages/ProfilePage.jsx`

**第 1 步：编写 pages/CartPage.jsx**

功能：
- 页面加载时调用 `cartService.getMyCart()` 获取购物车
- 每行显示：商品图片、名称、单价、数量输入框、「Remove」按钮
- 修改数量：调用 `cartService.updateCartItem()`
- 删除条目：调用 `cartService.removeCartItem()`
- 底部显示购物车总价
- 空购物车显示 `Your cart is empty.`

**第 2 步：编写 pages/ProfilePage.jsx**

调用 `GET /users/me` 显示用户名、邮箱、角色

**第 3 步：提交代码**
```bash
git add frontend/src/pages/CartPage.jsx frontend/src/pages/ProfilePage.jsx
git commit -m "feat: add CartPage and ProfilePage"
```

---

### 任务 10：管理员页面

**涉及文件：**
- 新建：`frontend/src/pages/AdminProductsPage.jsx`
- 新建：`frontend/src/pages/AdminUsersPage.jsx`
- 新建：`frontend/src/pages/AdminCartsPage.jsx`

**AdminProductsPage（商品管理）**：列出所有商品 + 新增表单 + 编辑 + 删除按钮

**AdminUsersPage（用户管理）**：列出所有用户（ID、用户名、邮箱、角色）+ 删除按钮

**AdminCartsPage（购物车查看）**：列出所有用户及其购物车内容和总价

每个页面：API 失败时显示错误信息（不出现白屏）

**提交代码：**
```bash
git add frontend/src/pages/Admin*.jsx
git commit -m "feat: add Admin pages for products, users, and cart management"
```

---

## 第五阶段 — 收尾与提交

### 任务 11：错误处理与加载状态

- 检查所有页面的 API 调用是否都有 try-catch（上面各步骤已完成，逐一核查）
- 为加载时间较长的 fetch 添加 loading 状态提示
- 确保没有任何页面在 API 失败时出现白屏
- 验证 `AdminRoute` 能正确将非管理员用户重定向到首页

**提交代码：**
```bash
git commit -m "fix: ensure all API failures show user-friendly error messages"
```

---

### 任务 12：生成真实 admin 密码哈希 + 完善初始数据

```bash
cd backend
python3 -c "from passlib.context import CryptContext; print(CryptContext(schemes=['bcrypt']).hash('admin123'))"
```
复制输出的哈希值 → 替换 `database/seed.sql` 中的占位符 → 重新导入数据

**提交代码：**
```bash
git add database/seed.sql
git commit -m "chore: update seed data with real bcrypt admin password hash"
```

---

### 任务 13：补全 README 工作量分配部分

在 `README.md` 的 Workload Allocation 表格中填写每位成员实际负责的文件列表

```bash
git add README.md
git commit -m "docs: complete README with final workload allocation"
```

---

### 任务 14：导出数据库 + 最终检查

```bash
mysqldump -u root -p ecommerce > database/schema_export.sql
```

**最终检查清单（来自 CLAUDE.md）：**
- [ ] 整个项目中只有一个 `.html` 文件（`frontend/index.html`）
- [ ] 三个实体的增删改查全部正常工作
- [ ] JWT 登录/注销正常；受保护路由能正确重定向未登录用户
- [ ] 实时搜索在输入时即时过滤商品
- [ ] admin 能在 `/admin/carts` 查看所有用户的购物车
- [ ] 没有 `.env` 文件被提交（执行 `git status` 确认）
- [ ] 所有 commit 信息有意义

```bash
git add database/schema_export.sql
git commit -m "chore: add final database export for submission"
```

---

### 任务 15：录制视频演示（≤3 分钟）

**演示脚本：**
1. 展示首页商品列表，在搜索框输入关键词 → 列表即时过滤
2. 注册新用户 → 跳转到首页
3. 添加 2-3 件商品到购物车 → 进入购物车页 → 修改数量 → 删除一件商品
4. 退出登录 → 用 admin 账号登录 → 进入管理员后台 → 展示商品 CRUD → 展示所有购物车

在 Canvas 提交：GitHub 仓库链接 + 视频链接

---

## 整体进度总结

| 阶段 | 任务 | 预计时间 |
|------|------|---------|
| 数据库 | 任务 1 | 1天 |
| 后端基础 | 任务 2-3 | 2天 |
| 后端 CRUD | 任务 4 | 2天 |
| 前端基础 | 任务 5-6 | 2天 |
| 前端页面 | 任务 7-10 | 4天 |
| 收尾提交 | 任务 11-15 | 2天 |
| **合计** | **15个任务** | **约13天** |
