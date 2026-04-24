# 分工说明 — 电商购物车

> 本文档从英文计划 `2026-04-24-ecommerce-shopping-cart.md` 同步生成，随计划更新而更新。

**项目：** 32516 Internet Programming — Assignment 2
**小组成员：**
- Xuyu Zhang（26025395）— GitHub: barbarousrabbit
- Qiushi Huang（25668904）— GitHub: qiushihuang-beep

---

## 一、分工总览

| 成员 | 负责方向 | 涵盖阶段 |
|------|---------|---------|
| Xuyu Zhang | 项目基础 + 用户认证 + 购物车 | 任务 2、3、4b、5、6、7、9 |
| Qiushi Huang | 数据库 + 商品 + 管理员后台 | 任务 1、4a、4c、6b、8、10 |
| 两人共同 | 收尾、检查、提交 | 任务 11–14 |

---

## 二、Xuyu Zhang（26025395）详细职责

### 2.1 项目基础初始化（任务 2 + 任务 5）

**后端：**
- `backend/requirements.txt` — 所有 Python 依赖包列表
- `backend/database.py` — 数据库连接配置，SQLAlchemy 引擎和 `get_db()` 依赖函数
- `backend/main.py` — FastAPI 应用入口，CORS 配置（从 `.env` 读取，不硬编码），注册四个路由器

**前端：**
- `frontend/src/main.jsx` — React 应用入口，包裹 `BrowserRouter` 和 `AuthProvider`
- `frontend/src/App.jsx` — 路由表，定义所有页面路径和 `PrivateRoute`/`AdminRoute` 守卫
- `frontend/src/index.css` — 全局 CSS 变量和通用样式类（所有组件禁止使用 inline style）

---

### 2.2 用户认证（任务 3）

**后端：**
- `backend/models/user.py` — User ORM 模型（映射 `users` 表）
- `backend/schemas/user.py` — 5 个 Pydantic 数据类：
  - `UserRegister`：含字段长度校验（用户名最短 3 位，密码最短 6 位）
  - `UserLogin`：邮箱 + 密码
  - `UserUpdate`：可选字段，供修改资料时使用
  - `UserOut`：返回给前端的用户信息（不含密码）
  - `Token`：登录/注册成功后返回的 JWT + 用户信息
- `backend/auth/jwt.py` — JWT 全套工具函数：密码哈希、密码验证、生成 token、验证 token（`get_current_user`）、管理员检查（`require_admin`）
- `backend/routers/auth.py` — 注册和登录两个接口；注册时用 `db.flush()` 在同一事务内获取新用户 ID，同步创建空购物车

**前端：**
- `frontend/src/context/AuthContext.jsx` — 全局认证状态；从 `localStorage` 初始化，提供 `login()` 和 `logout()` 方法
- `frontend/src/services/api.js` — 统一 fetch 封装，自动附加 Bearer token，统一错误处理
- `frontend/src/services/authService.js` — 注册和登录接口调用封装
- `frontend/src/pages/LoginPage.jsx` — 登录表单，错误行内显示，成功跳转首页
- `frontend/src/pages/RegisterPage.jsx` — 注册表单，与登录页相同结构

---

### 2.3 购物车（任务 4b + 任务 9）

**后端：**
- `backend/models/cart.py` — `ShoppingCart` 和 `CartItem` 两个 ORM 模型，含关联关系
- `backend/schemas/cart.py` — `CartItemAdd`、`CartItemUpdate`、`CartItemOut`、`CartOut`、`UserCartOut` 五个数据类
- `backend/routers/cart.py` — 5 个接口：查看我的购物车、加入商品（自动合并重复商品）、修改数量（数量≤0自动删除条目）、删除条目、管理员查看所有购物车（含 joinedload 优化）

**前端：**
- `frontend/src/services/cartService.js` — 购物车增删改查及管理员接口封装
- `frontend/src/pages/CartPage.jsx` — 展示购物车列表，支持修改数量和删除，显示总价；错误状态有提示，空购物车有提示
- `frontend/src/pages/ProfilePage.jsx` — 展示当前用户信息，支持通过 `PUT /users/me` 更新用户名或邮箱

---

### 2.4 导航栏（任务 7）

- `frontend/src/components/Navbar.jsx` — 根据登录状态显示不同导航项；admin 用户额外显示 Admin 链接；登出后跳转到登录页

---

## 三、Qiushi Huang（25668904）详细职责

### 3.1 数据库设计（任务 1）

- `database/schema.sql` — 创建 4 张表（`users`、`products`、`shopping_cart`、`cart_items`），含所有外键约束和联合唯一约束
- `database/seed.sql` — 初始管理员账号（任务 12 中替换真实密码哈希）+ 5 件示例商品

---

### 3.2 商品模块（任务 4a + 任务 6b + 任务 8）

**后端：**
- `backend/models/product.py` — Product ORM 模型（映射 `products` 表）
- `backend/schemas/product.py` — `ProductCreate`、`ProductUpdate`（所有字段可选）、`ProductOut` 三个数据类
- `backend/routers/products.py` — 5 个接口：获取商品列表（含 `?q=` 模糊搜索）、获取单个商品、管理员创建、管理员更新（局部更新）、管理员删除

**前端：**
- `frontend/src/services/productService.js` — 商品列表（含搜索参数）、创建、更新、删除接口封装
- `frontend/src/hooks/useSearch.js` — 自定义 Hook；300ms 防抖避免每次击键都请求接口；加载中和错误状态均有处理
- `frontend/src/components/ProductCard.jsx` — 商品卡片：图片、名称、价格、库存状态；"Add to Cart" 按钮（未登录时提示，库存为 0 时禁用）
- `frontend/src/pages/HomePage.jsx` — 搜索框 + 商品网格；加载/错误/空结果三种状态均有提示

---

### 3.3 管理员后台（任务 4c + 任务 10）

**后端：**
- `backend/routers/users.py` — 4 个接口：查看自己资料（`GET /users/me`）、更新自己资料（`PUT /users/me`）、管理员查看所有用户、管理员删除用户

**前端：**
- `frontend/src/pages/AdminProductsPage.jsx` — 商品管理：列表 + 新增表单 + 行内编辑 + 删除确认
- `frontend/src/pages/AdminUsersPage.jsx` — 用户管理：列表 + 删除（不能删除自己）
- `frontend/src/pages/AdminCartsPage.jsx` — 查看所有用户的购物车（只读）

---

## 四、两人共同负责（任务 11–14）

| 任务 | 内容 |
|------|------|
| 任务 11 | 审查所有页面的错误处理和加载状态 |
| 任务 12 | 生成真实 bcrypt 哈希替换 seed.sql 中的占位符 |
| 任务 13 | 最终核对 README（标题、技术栈、目录结构、分工表） |
| 任务 14 | 导出数据库、检查提交清单、录制视频演示 |

---

## 五、协作注意事项

### 依赖顺序
```
Qiushi（任务 1 数据库）
    ↓
Xuyu（任务 2 FastAPI 框架）
    ↓
并行开发：
  Xuyu → 任务 3（认证后端）→ 任务 4b（购物车后端）→ 前端
  Qiushi → 任务 4a（商品后端）→ 任务 4c（用户后端）→ 前端
    ↓
两人共同收尾（任务 11–14）
```

### 接口约定（必须提前对齐）
在各自开始写后端代码之前，双方需确认：
- 所有接口的 URL 路径和 HTTP 方法
- 认证方式（统一使用 `Authorization: Bearer <token>` 请求头）
- 错误响应格式（统一用 `{"detail": "错误信息"}` — FastAPI 默认格式）

### Git 操作规范
- 每完成一个任务提交一次，commit message 必须有意义
- 每个文件第一行必须有 Author 签名
- `.env` 文件绝对不提交

---

## 六、文件归属速查表

| 文件路径 | 负责人 |
|---------|--------|
| `database/schema.sql` | Qiushi |
| `database/seed.sql` | Qiushi |
| `backend/requirements.txt` | Xuyu |
| `backend/database.py` | Xuyu |
| `backend/main.py` | Xuyu |
| `backend/auth/jwt.py` | Xuyu |
| `backend/routers/auth.py` | Xuyu |
| `backend/routers/products.py` | Qiushi |
| `backend/routers/cart.py` | Xuyu |
| `backend/routers/users.py` | Qiushi |
| `backend/models/user.py` | Xuyu |
| `backend/models/product.py` | Qiushi |
| `backend/models/cart.py` | Xuyu |
| `backend/schemas/user.py` | Xuyu |
| `backend/schemas/product.py` | Qiushi |
| `backend/schemas/cart.py` | Xuyu |
| `frontend/src/main.jsx` | Xuyu |
| `frontend/src/App.jsx` | Xuyu |
| `frontend/src/index.css` | Xuyu |
| `frontend/src/context/AuthContext.jsx` | Xuyu |
| `frontend/src/services/api.js` | Xuyu |
| `frontend/src/services/authService.js` | Xuyu |
| `frontend/src/services/productService.js` | Qiushi |
| `frontend/src/services/cartService.js` | Xuyu |
| `frontend/src/hooks/useSearch.js` | Qiushi |
| `frontend/src/components/Navbar.jsx` | Xuyu |
| `frontend/src/components/ProductCard.jsx` | Qiushi |
| `frontend/src/pages/LoginPage.jsx` | Xuyu |
| `frontend/src/pages/RegisterPage.jsx` | Xuyu |
| `frontend/src/pages/HomePage.jsx` | Qiushi |
| `frontend/src/pages/CartPage.jsx` | Xuyu |
| `frontend/src/pages/ProfilePage.jsx` | Xuyu |
| `frontend/src/pages/AdminProductsPage.jsx` | Qiushi |
| `frontend/src/pages/AdminUsersPage.jsx` | Qiushi |
| `frontend/src/pages/AdminCartsPage.jsx` | Qiushi |
