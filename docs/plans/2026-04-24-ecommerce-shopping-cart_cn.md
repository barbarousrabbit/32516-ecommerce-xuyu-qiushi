# 电商购物车 — 中文实施计划

> **说明：** 本文档是英文计划 `2026-04-24-ecommerce-shopping-cart.md` 的完整同步翻译，供阅读和理解使用。所有实际编码执行请以英文计划为准。

**目标：** 构建一个功能完整的全栈单页电商应用，包含商品浏览、购物车、JWT 认证、实时搜索和管理员后台，满足 32516 Assignment 2 所有评分要求。

**架构：** React 单页应用（唯一的 `index.html`）通过集中管理的 `services/` 层调用 FastAPI 后端接口。FastAPI 使用 JWT `Depends` 中间件保护路由。MySQL 存储三个核心实体（用户、商品、购物车）。

**技术栈：** React 18 + Vite + React Router v6 · FastAPI · SQLAlchemy · MySQL 8 · python-jose · passlib/bcrypt

---

## 工作量分配（方案 B — 按功能分工）

### Xuyu Zhang（26025395）— UI + 认证 + 购物车 + 项目基础

| 模块 | 负责人 | 涉及文件 |
|------|--------|---------|
| 项目初始化 | Xuyu | `backend/main.py`, `database.py`, `requirements.txt`, `frontend/src/main.jsx`, `App.jsx` |
| 全局 UI 样式 | Xuyu | `frontend/src/index.css`（CSS 变量、配色、响应式断点、通用样式类）|
| 认证（后端） | Xuyu | `backend/auth/jwt.py`, `routers/auth.py`, `models/user.py`, `schemas/user.py` |
| 认证（前端） | Xuyu | `frontend/src/context/AuthContext.jsx`, `services/api.js`, `services/authService.js`, `pages/LoginPage.jsx`, `pages/RegisterPage.jsx` |
| 购物车（后端） | Xuyu | `backend/routers/cart.py`, `models/cart.py`, `schemas/cart.py` |
| 购物车（前端） | Xuyu | `frontend/src/services/cartService.js`, `pages/CartPage.jsx`, `pages/ProfilePage.jsx`, `components/Navbar.jsx` |

### Qiushi Huang（25668904）— 数据库 + 商品 + 管理员

| 模块 | 负责人 | 涉及文件 |
|------|--------|---------|
| 数据库设计 | Qiushi | `database/schema.sql`, `seed.sql` |
| 商品（后端） | Qiushi | `backend/routers/products.py`, `models/product.py`, `schemas/product.py` |
| 商品（前端） | Qiushi | `frontend/src/pages/HomePage.jsx`, `components/ProductCard.jsx`, `hooks/useSearch.js`, `services/productService.js` |
| 管理员（后端） | Qiushi | `backend/routers/users.py` |
| 管理员（前端） | Qiushi | `frontend/src/pages/AdminProductsPage.jsx`, `AdminUsersPage.jsx`, `AdminCartsPage.jsx` |

### 两人共同

| 模块 | 涉及内容 |
|------|---------|
| 收尾与提交 | 任务 11–14：错误处理审查、README 核对、数据库导出、视频录制 |

---

## 评分标准满足情况

| 评分标准 | 满足方式 |
|---------|---------|
| 单页应用（唯一 .html 文件）| Vite 生成唯一 `frontend/index.html`；React Router 处理所有页面跳转 |
| 三个实体的 CRUD | 用户（注册/查看/更新资料/管理员删除）、商品（管理员增删改查 + 公开读取）、购物车（加入/查看/修改数量/删除）|
| JWT + bcrypt | `python-jose` 生成 token；`passlib/bcrypt` 加密密码；token 通过 `Authorization: Bearer` 请求头传递 |
| 实时搜索 | `useSearch` Hook 加 300ms 防抖，每次击键调用 `GET /products?q=` |
| 管理员角色 | `users` 表中 `role` 字段；`require_admin` 依赖保护所有管理员路由 |
| 管理员查看所有购物车 | `GET /cart/all` 返回每位用户的完整购物车 |
| 无硬编码凭证 | 所有密钥写入 `.env`（已加入 .gitignore）；CORS origin 也从 `.env` 读取 |
| 有意义的 commit 记录 | 每个任务一个 commit，使用 `feat:`/`fix:`/`chore:`/`docs:` 前缀 |

---

## 第一阶段 — 数据库

### 任务 1 — 数据库 Schema 与初始数据
**负责人：** Qiushi Huang
**文件：** `database/schema.sql`、`database/seed.sql`

**schema.sql — 4 张表：**
- `users`：id、username（唯一）、email（唯一）、password_hash、role 枚举('user','admin')、created_at
- `products`：id、name、description、price DECIMAL(10,2)、stock INT、image_url、created_at、updated_at（ON UPDATE 自动更新）
- `shopping_cart`：id、user_id（外键→users，唯一——每人只有一个购物车，CASCADE 级联删除）
- `cart_items`：id、cart_id（外键→shopping_cart）、product_id（外键→products）、quantity INT、联合唯一(cart_id, product_id)

**seed.sql — 初始数据：**
- 1 个管理员账号（密码哈希占位，任务 12 中替换为真实 bcrypt 哈希）
- 5 个示例商品，使用占位图片 URL

**验证：** 执行 `mysql -u root -p < database/schema.sql`，然后 `SHOW TABLES;` — 应看到 4 张表。

**提交：** `feat: add database schema and seed data`

---

## 第二阶段 — 后端基础

### 任务 2 — FastAPI 项目初始化
**负责人：** Xuyu Zhang
**文件：** `backend/requirements.txt`、`backend/database.py`、`backend/main.py`、`backend/.env`（从 `.env.example` 复制）

**requirements.txt：** fastapi、uvicorn[standard]、sqlalchemy、pymysql、python-dotenv、passlib[bcrypt]、python-jose[cryptography]、python-multipart、email-validator

**database.py：**
- 通过 `python-dotenv` 从 `.env` 读取数据库凭证
- 创建 SQLAlchemy 引擎和 `SessionLocal`
- 定义所有模型继承的 `Base`（DeclarativeBase）
- 提供 `get_db()` 生成器依赖

**main.py：**
- 创建 FastAPI 应用实例
- 配置 CORS — `allow_origins` 从 `CORS_ORIGIN` 环境变量读取（默认值 `http://localhost:5173`）— 绝对不能硬编码
- 注册 4 个路由器：`/auth`、`/users`、`/products`、`/cart`

**.env.example — 必须包含的变量：**
`DB_HOST`、`DB_PORT`、`DB_NAME`、`DB_USER`、`DB_PASSWORD`、`SECRET_KEY`、`ALGORITHM`、`ACCESS_TOKEN_EXPIRE_MINUTES`、`CORS_ORIGIN`

**验证：** `uvicorn main:app --reload` → 打开 `http://localhost:8000/docs` 能看到 Swagger 文档。

**提交：** `chore: set up FastAPI project with DB connection and CORS`

---

### 任务 3 — 用户模型、数据结构和 JWT 认证
**负责人：** Xuyu Zhang
**文件：** `backend/models/user.py`、`backend/schemas/user.py`、`backend/auth/jwt.py`、`backend/routers/auth.py`

**models/user.py：** `users` 表的 SQLAlchemy ORM 映射，包含全部 6 个字段。

**schemas/user.py — 5 个 Pydantic 类：**
- `UserRegister`：username（最短 3 位，最长 50 位）、email（EmailStr 格式验证）、password（最短 6 位）
- `UserLogin`：email、password
- `UserUpdate`：username（可选）、email（可选）— 用于 `PUT /users/me` 修改资料
- `UserOut`：id、username、email、role — 返回给前端（绝不包含密码）
- `Token`：access_token、token_type="bearer"、user（UserOut）

**auth/jwt.py — 5 个函数：**
- `hash_password(password)` → bcrypt 哈希
- `verify_password(plain, hashed)` → 布尔值
- `create_token(data)` → 带过期时间的 JWT 字符串（过期时间从 env 读取）
- `get_current_user(credentials, db)` → 解析 Bearer token，返回 User 对象，否则抛出 401
- `require_admin(current_user)` → 检查 role=="admin"，否则抛出 403

**routers/auth.py — 2 个接口：**
- `POST /auth/register`（201）：哈希密码 → 保存用户 → 调用 `db.flush()` 获取新用户的 id → 为该用户创建空购物车 → `db.commit()` → 返回 Token
- `POST /auth/login`：验证邮箱和密码 → 返回 Token

> **注意 `db.flush()`：** 在 `db.commit()` 之前调用，目的是在同一个事务内获取新用户的 `id`，从而立刻创建关联的购物车。这是一个非显然操作，必须加注释说明。

**验证：** 在 Swagger 中测试两个接口 → 期望响应中包含 JWT token。

**提交：** `feat: implement JWT register and login with bcrypt`

---

### 任务 4a — 商品模型与 CRUD 路由
**负责人：** Qiushi Huang
**文件：** `backend/models/product.py`、`backend/schemas/product.py`、`backend/routers/products.py`

**models/product.py：** `products` 表的 ORM 映射，包含全部 7 个字段。

**schemas/product.py — 3 个 Pydantic 类：**
- `ProductCreate`：name、description（可选）、price、stock（默认 0）、image_url（可选）
- `ProductUpdate`：所有字段均可选（支持局部更新）
- `ProductOut`：所有字段，包括 id、created_at、updated_at

**routers/products.py — 5 个接口：**
- `GET /products?q=`（公开）：返回所有商品；提供 `q` 参数时，用 `name ILIKE %q%` 过滤（实时搜索的后端实现）
- `GET /products/{id}`（公开）：返回单个商品，不存在则 404
- `POST /products`（仅 admin）：创建商品
- `PUT /products/{id}`（仅 admin）：用 `exclude_unset=True` 做局部更新
- `DELETE /products/{id}`（仅 admin）：删除商品，不存在则 404

**验证：** 在 Swagger 中测试全部 5 个接口；用普通用户 token 访问 POST/PUT/DELETE 时应返回 403。

**提交：** `feat: add product CRUD routes with admin-only write access`

---

### 任务 4b — 购物车模型与路由
**负责人：** Xuyu Zhang
**文件：** `backend/models/cart.py`、`backend/schemas/cart.py`、`backend/routers/cart.py`

**models/cart.py — 2 个 ORM 类：**
- `ShoppingCart`：id、user_id（外键，唯一）、created_at；包含 `items` 关联关系
- `CartItem`：id、cart_id（外键）、product_id（外键）、quantity；包含 `product` 关联关系；联合唯一(cart_id, product_id)

**schemas/cart.py — 5 个 Pydantic 类：**
- `CartItemAdd`：product_id、quantity（默认 1）
- `CartItemUpdate`：quantity（整数）
- `CartItemOut`：id、product（ProductOut）、quantity
- `CartOut`：id、items（CartItemOut 列表）
- `UserCartOut`：user_id、username、cart（CartOut）— 供管理员接口使用

**routers/cart.py — 5 个接口：**
- `GET /cart/me`（需登录）：查询该用户的 `shopping_cart`；如果为 None（例如通过 seed.sql 直接插入的 admin 账号没有购物车行），抛出 `HTTPException(404, "Cart not found")` — 绝不将 None 返回给前端
- `POST /cart/items`（需登录）：加入商品；如果该商品已在购物车中，则累加数量而不是创建重复条目
- `PUT /cart/items/{id}`（需登录）：修改数量；如果数量 ≤ 0，自动删除该条目
- `DELETE /cart/items/{id}`（需登录）：删除购物车条目
- `GET /cart/all`（仅 admin）：用 `joinedload` 预加载关联数据，返回所有用户的购物车（避免 N+1 查询问题）

**验证：** 依次加入商品、查看购物车、修改数量、删除商品 — 全部通过 Swagger 验证。

**提交：** `feat: add shopping cart CRUD routes`

---

### 任务 4c — 用户路由（资料 + 管理员）
**负责人：** Qiushi Huang
**文件：** `backend/routers/users.py`

**routers/users.py — 4 个接口：**
- `GET /users/me`（需登录）：返回当前用户的资料
- `PUT /users/me`（需登录）：允许用户更新自己的 username 或 email；用 `exclude_unset=True` 支持局部更新
- `GET /users`（仅 admin）：返回所有用户列表
- `DELETE /users/{id}`（仅 admin）：删除指定用户，不存在则 404；如果 `user_id == current_user.id`，抛出 `HTTPException(400, "Cannot delete yourself")` — 防止管理员删除自己的账号

**验证：** 用普通 token 测试资料读取和更新；用 admin token 测试列表和删除。

**提交：** `feat: add user profile and admin user management routes`

---

## 第三阶段 — 前端基础

### 任务 5 — Vite + React 初始化、路由与全局样式
**负责人：** Xuyu Zhang
**文件：** `frontend/` 脚手架、`main.jsx`、`App.jsx`、`index.css`

**初始化命令：**
```bash
cd frontend
npm create vite@latest . -- --template react
npm install react-router-dom
```

**main.jsx：** 用 `<BrowserRouter>` 和 `<AuthProvider>` 包裹整个应用，使每个组件都能访问路由和认证状态。

**App.jsx — 路由表：**
- `/` → `HomePage`（公开）
- `/login` → `LoginPage`（公开）
- `/register` → `RegisterPage`（公开）
- `/cart` → `CartPage`（需登录 — `PrivateRoute` 包裹）
- `/profile` → `ProfilePage`（需登录）
- `/admin/products` → `AdminProductsPage`（需 admin 角色 — `AdminRoute` 包裹）
- `/admin/users` → `AdminUsersPage`（需 admin 角色）
- `/admin/carts` → `AdminCartsPage`（需 admin 角色）

**PrivateRoute：** 如果 `user` 为 null → 跳转到 `/login`；否则渲染子组件。

**AdminRoute：** 如果 `user.role !== 'admin'` → 跳转到 `/`；否则渲染子组件。

**兜底路由（catch-all）：** 在路由表最后加 `<Route path="*" element={<Navigate to="/" replace />} />`，防止访问未知 URL 时出现空白页面。

**index.css — CSS 变量，确保全站样式一致（所有组件使用 CSS 类，禁止写 inline style）：**
- 定义变量：`--primary: #2563eb`、`--primary-dark: #1d4ed8`、`--danger: #dc2626`、`--text: #111827`、`--text-secondary: #6b7280`、`--bg: #f9fafb`、`--border: #e5e7eb`、`--radius: 8px`、`--shadow: 0 1px 3px rgba(0,0,0,0.1)`
- 基础样式：body 字体（Inter 或系统字体）、box-sizing border-box、button/input 样式重置
- 通用样式类：`.container`（最大宽度 1200px，居中）、`.card`、`.btn`、`.btn-danger`、`.form-group`、`.error-msg`、`.loading`
- 响应式断点：最低支持 768px（平板）和 1280px（桌面）；商品网格用 `grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))` 自动适配不同屏幕

**验证：** `npm run dev` → `http://localhost:5173` 无报错加载。

**提交：** `chore: scaffold React app with Vite, configure routes and global CSS`

---

### 任务 6 — AuthContext 与 API 服务层
**负责人：** Xuyu Zhang
**文件：** `frontend/src/context/AuthContext.jsx`、`services/api.js`、`services/authService.js`、`services/cartService.js`

**AuthContext.jsx：**
- 从 `localStorage` 初始化 `user` 状态（刷新页面后保持登录）
- `login(userData, token)`：将 token 和用户信息保存到 `localStorage`，更新状态
- `logout()`：清除 `localStorage`，重置状态
- 导出 `useAuth()` hook，方便任意组件调用

**api.js — 统一 fetch 封装：**
- `request(method, path, body)`：自动从 `localStorage` 读取 token，设置 `Authorization: Bearer` 请求头
- 处理 204 No Content 响应（返回 null）
- 请求失败时抛出含 `data.detail` 的 `Error` — 保证错误明确暴露，不静默失败
- 导出 `api.get`、`api.post`、`api.put`、`api.delete`
- 基础 URL 从 `import.meta.env.VITE_API_URL` 读取 — 绝不硬编码

**authService.js：** `register(data)`、`login(data)` — 封装 `api.post` 的简单调用

**cartService.js：** `getMyCart()`、`addToCart(productId, qty)`、`updateCartItem(itemId, qty)`、`removeCartItem(itemId)`、`getAllCarts()`

**提交：** `feat: add AuthContext and centralised API service layer`

---

### 任务 6b — 商品服务层
**负责人：** Qiushi Huang
**文件：** `frontend/src/services/productService.js`

**productService.js：** `getProducts(q)` — 提供搜索词时自动添加 `?q=` 参数；`createProduct(data)`、`updateProduct(id, data)`、`deleteProduct(id)`

**提交：** `feat: add product service layer`

---

## 第四阶段 — 前端页面

### 任务 7 — 导航栏 + 登录页 + 注册页
**负责人：** Xuyu Zhang
**文件：** `components/Navbar.jsx`、`pages/LoginPage.jsx`、`pages/RegisterPage.jsx`

**Navbar.jsx：**
- 通过 `useAuth()` 读取 `user` 状态
- 未登录：显示 Login 和 Register 链接
- 已登录（普通用户）：显示 Cart、用户名（链接到 Profile）、Logout 按钮
- 已登录（admin）：额外显示 Admin 链接
- `handleLogout()`：调用 `logout()` 后跳转到 `/login`

**LoginPage.jsx：**
- 受控表单：邮箱 + 密码字段
- 提交时：调用 `authService.login()` → 成功则调用 `AuthContext.login()` 并跳转到 `/`
- 失败时：在表单下方内联显示错误信息（红色文字，不跳转、不白屏）
- 提供跳转到 `/register` 的链接

**RegisterPage.jsx：**
- 与登录页结构相同；字段：用户名 + 邮箱 + 密码
- 注册成功后调用 `AuthContext.login()` 并跳转到 `/`

**验证：** 登录成功后跳转到 `/`；密码错误时显示行内错误提示；不出现白屏。

**提交：** `feat: add Navbar, LoginPage, and RegisterPage`

---

### 任务 8 — 首页与实时搜索
**负责人：** Qiushi Huang
**文件：** `pages/HomePage.jsx`、`components/ProductCard.jsx`、`hooks/useSearch.js`

**useSearch.js（自定义 Hook）：**
- 状态：`query`、`products`、`loading`、`error`
- `useEffect` 监听 `query` 变化：设置 300ms `setTimeout` 后再调用 `getProducts(query)`（防抖，避免每次击键都请求接口）
- 重新渲染时用 `clearTimeout` 清理定时器
- API 失败时设置友好的错误信息 — 不向 UI 抛出异常

**ProductCard.jsx：**
- 展示：商品图片、名称、描述、价格、库存状态（绿色"X in stock" / 红色"Out of stock"）
- "Add to Cart" 按钮：库存为 0 时禁用（disabled）
- 未登录时点击：行内显示"Please login"提示
- 加入成功：显示"Added!"反馈 2 秒后消失
- 加入失败：行内显示错误信息

**HomePage.jsx：**
- 搜索框绑定 `useSearch` 的 `setQuery`
- 用 flex-wrap 网格渲染 `products.map(p => <ProductCard .../>)`
- `loading === true` 时显示"Loading..."
- 加载失败时显示错误信息
- 结果为空且不在加载时显示"No products found."

**验证：** 在搜索框输入关键词 → 商品列表即时更新，不需要点击搜索按钮，不刷新页面。

**提交：** `feat: add HomePage with live search and ProductCard`

---

### 任务 9 — 购物车页与个人资料页
**负责人：** Xuyu Zhang
**文件：** `pages/CartPage.jsx`、`pages/ProfilePage.jsx`

**CartPage.jsx：**
- 页面加载时调用 `getMyCart()` → 渲染购物车条目
- 每行显示：商品图片、名称、单价、数量输入框（min=1）、Remove 按钮
- 修改数量：调用 `updateCartItem(itemId, newQty)` → 更新显示
- 点击 Remove：调用 `removeCartItem(itemId)` → 重新加载购物车
- 底部右侧显示购物车总价（所有 `price × quantity` 之和）
- 空购物车：显示"Your cart is empty."
- 错误状态：行内显示错误信息，不出现白屏

**ProfilePage.jsx：**
- 页面加载时调用 `GET /users/me` → 显示用户名、邮箱、角色
- 提供编辑表单，允许通过 `PUT /users/me` 更新用户名或邮箱
- 更新成功：刷新显示的数据并显示"Profile updated!"提示
- 更新失败：行内显示错误信息

**验证：** 在首页加入商品 → 进入购物车页查看和修改；在资料页更新用户名。

**提交：** `feat: add CartPage and ProfilePage with edit support`

---

### 任务 10 — 管理员页面
**负责人：** Qiushi Huang
**文件：** `pages/AdminProductsPage.jsx`、`pages/AdminUsersPage.jsx`、`pages/AdminCartsPage.jsx`

**AdminProductsPage.jsx：**
- 页面加载时获取所有商品
- 表格：id、名称、价格、库存、操作（编辑 / 删除）
- "Add Product"表单：name、description、price、stock、image_url 字段 → 调用 `createProduct()`
- 编辑：每行的行内编辑模式 → 点击保存调用 `updateProduct(id, data)`
- 删除：确认后调用 `deleteProduct(id)`
- 所有操作失败时行内显示错误信息（不白屏）

**AdminUsersPage.jsx：**
- 页面加载时获取所有用户（`GET /users`）
- 表格：id、用户名、邮箱、角色
- 每行有删除按钮 → 调用 `DELETE /users/{id}` → 刷新列表
- 禁止删除自己的账号（对比 AuthContext 中的 `user.id`）

**AdminCartsPage.jsx：**
- 页面加载时获取所有购物车（`getAllCarts()`）
- 每位用户显示：用户名、商品数量、购物车总价、可展开的商品列表
- 只读视图（无修改操作）

**三个页面共同规则：** 每个 API 调用都用 try/catch 包裹，失败时显示错误信息，绝不出现白屏。

**提交：** `feat: add Admin pages for products, users, and cart management`

---

## 第五阶段 — 收尾与提交

### 任务 11 — 错误处理与加载状态审核
**负责人：** 两人共同

检查每个页面和组件：
- 所有 `fetch` 调用都在 `try/catch` 内，且有用户可见的错误信息 ✓
- 每个异步操作在等待期间都有加载提示
- 没有任何页面在 API 失败时显示空白/白屏
- `PrivateRoute` 和 `AdminRoute` 能正确重定向 — 未登录访问受保护 URL 时验证

**提交：** `fix: ensure all pages handle API errors and loading states`

---

### 任务 12 — 生成真实管理员密码哈希
**负责人：** Qiushi Huang

在 Python 中运行以下命令生成真实的 bcrypt 哈希：
```bash
python3 -c "from passlib.context import CryptContext; print(CryptContext(schemes=['bcrypt']).hash('admin123'))"
```
将输出的哈希值替换 `database/seed.sql` 中的占位符 → 重新导入数据。

**提交：** `chore: replace seed admin password with real bcrypt hash`

---

### 任务 13 — 最终 README 核对
**负责人：** 两人共同

验证以下 3 项评分内容是否完整且最新：
1. 项目标题 + 描述（这个网站解决了什么问题）
2. 技术栈 + 运行方法 + 依赖项
3. 目录结构说明 + 工作量分配表（文件级别）

**提交：** `docs: finalise README for submission`

---

### 任务 14 — 数据库导出 + 最终提交检查
**负责人：** 两人共同

导出数据库：
```bash
mysqldump -u root -p ecommerce > database/ecommerce_export.sql
git add database/ecommerce_export.sql
git commit -m "chore: add database export for submission"
```

**提交前最终检查清单：**
- [ ] 整个项目中只有一个 `.html` 文件（`frontend/index.html`）
- [ ] 三个实体的全部 4 种 CRUD 操作正常工作（users、products、cart）
- [ ] 用户可以更新自己的资料（`PUT /users/me`）
- [ ] JWT 登录/登出正常；受保护路由能正确重定向未登录用户
- [ ] 实时搜索在输入时即时过滤商品 — 不需要点击搜索按钮
- [ ] 管理员可以在 `/admin/carts` 查看所有用户的购物车
- [ ] 没有 `.env` 文件被提交 — 执行 `git status` 确认
- [ ] 所有 commit 信息有意义（`feat:`、`fix:`、`chore:`、`docs:` 前缀）
- [ ] 每个源码文件第一行都有 `// Authors:` / `# Authors:` 签名

**视频演示脚本（≤ 3 分钟）：**
1. 首页：展示商品列表 → 在搜索框输入关键词 → 列表即时过滤
2. 注册新用户 → 跳转到首页
3. 添加 2–3 件商品到购物车 → 进入购物车页 → 修改数量 → 删除一件商品
4. 进入个人资料页 → 更新用户名
5. 退出登录 → 用 admin 账号登录 → 管理员商品页（展示增删改）→ 管理员用户页 → 管理员购物车页（查看所有人的购物车）

> ⚠️ 录制时不要展示：源代码、终端窗口、数据库内容 — 只展示浏览器界面。

---

## Q&A 备考（Week 12 Tutorial）

导师会针对你个人负责的功能提问，务必能清晰解释。

**Xuyu（认证 + 购物车）准备以下问题：**
- 为什么用 `useState` 管理表单状态，而用 `useContext` 管理认证状态？
- JWT 的原理是什么 — token 里存了什么？它保存在浏览器的哪里？
- 为什么在注册路由里要用 `db.flush()` 而不是直接 `db.commit()`？
- 如果有人不带 token 访问 `/cart/me` 会发生什么？

**Qiushi（商品 + 管理员 + 数据库）准备以下问题：**
- 为什么用 `ILIKE` 做商品搜索？`%q%` 是什么意思？
- 为什么 `cart_items` 表要设置 `UNIQUE(cart_id, product_id)` 联合唯一约束？
- `joinedload` 是什么，为什么在 `GET /cart/all` 中使用它？
- `require_admin` 依赖是如何工作的？

---

## 开发时间线

| 阶段 | 任务 | 目标时间 |
|------|------|---------|
| 数据库 | 任务 1 | 第 1 周（5月1日前）|
| 后端基础 | 任务 2–3 | 第 1–2 周（5月8日前）|
| 后端 CRUD | 任务 4a–4c | 第 2 周（5月8日前）|
| 前端基础 | 任务 5–6b | 第 2–3 周（5月15日前）|
| 前端页面 | 任务 7–10 | 第 3–4 周（5月19日前）|
| 收尾提交 | 任务 11–14 | 第 5 周（5月24日前）|
| **Week 12 Tutorial 演示** | 已完成 50% 以上 | **约 5月19日** |
