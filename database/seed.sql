-- Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
USE ecommerce;

-- ── Admin account ──────────────────────────────────────────────────────────────
-- password: admin123  (bcrypt hash, never store plaintext)
INSERT IGNORE INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@shopcart.com',
 '$2b$12$2dbqEp8hj1pGvgudZt6Umu3aZPJ.JE6kQX47qHz8FrAWSogw4pROK',
 'admin');

-- Admin needs a shopping_cart row (one-cart-per-user constraint)
INSERT IGNORE INTO shopping_cart (user_id) SELECT id FROM users WHERE email = 'admin@shopcart.com';

-- ── Products (20 items across 4 categories) ────────────────────────────────────
-- All image URLs verified 200 OK on 2026-04-29.
-- ProductCard renders a branded SVG placeholder if any URL fails at runtime.
INSERT IGNORE INTO products (name, description, price, stock, image_url) VALUES

-- Audio
('Wireless Headphones',
 'Premium noise-cancelling wireless headphones with 30-hour battery life and foldable design.',
 79.99, 50,
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'),

('Wireless Earbuds Pro',
 'True wireless earbuds with active noise cancellation, 8-hour playtime, and IPX4 water resistance.',
 99.99, 40,
 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop'),

('Bluetooth Speaker',
 'Compact portable speaker with 360° sound, 12-hour battery, and waterproof IPX6 rating.',
 65.99, 35,
 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop'),

-- Input Devices
('Mechanical Keyboard TKL',
 'Tenkeyless mechanical keyboard with tactile brown switches, PBT keycaps, and RGB underglow.',
 129.99, 30,
 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=400&h=400&fit=crop'),

('Wireless Mouse',
 'Ergonomic wireless mouse with 4000 DPI sensor, silent clicks, and 60-day battery life.',
 44.99, 60,
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop'),

('Gaming Mouse Pad XL',
 'Extended desk mat, 900 × 400 mm, micro-woven surface, anti-slip rubber base, stitched edges.',
 29.99, 45,
 'https://images.unsplash.com/photo-1778658873261-4479f7f2efdf?w=400&h=400&fit=crop'),

('Keyboard Wrist Rest',
 'Memory foam wrist rest with non-slip base and washable cover — reduces typing fatigue.',
 27.99, 55,
 'https://images.unsplash.com/photo-1657165844621-3e13af9e7f24?w=400&h=400&fit=crop'),

-- Connectivity & Power
('USB-C Hub 7-in-1',
 '7-in-1 USB-C hub: 4K HDMI, 3× USB-A, SD/microSD card readers, 100W PD passthrough.',
 49.99, 100,
 'https://plus.unsplash.com/premium_photo-1764113096548-11270b5febed?w=400&h=400&fit=crop'),

('Portable Charger 20000mAh',
 'High-capacity power bank with 65W USB-C PD fast charging and dual USB-A ports.',
 59.99, 45,
 'https://images.unsplash.com/photo-1566554738544-d962991c3fee?w=400&h=400&fit=crop'),

('External SSD 500GB',
 'Pocket-sized external solid-state drive — 1050 MB/s read, USB 3.2 Gen 2, shock-resistant.',
 79.99, 30,
 'https://images.unsplash.com/photo-1703354521539-177dcce12b4d?w=400&h=400&fit=crop'),

('Cable Organizer Kit',
 'Silicone cable management sleeves + velcro ties — keeps your desk tidy in minutes.',
 19.99, 80,
 'https://images.unsplash.com/photo-1760348213270-7cd00b8c3405?w=400&h=400&fit=crop'),

-- Desk & Display
('Adjustable Laptop Stand',
 'Aluminium laptop riser with 6 height settings, ventilation slots, and foldable legs.',
 54.99, 35,
 'https://images.unsplash.com/photo-1670761301241-7cec3cd6a925?w=400&h=400&fit=crop'),

('Monitor Stand with Drawer',
 'Adjustable aluminium monitor riser with hidden storage drawer and integrated cable clips.',
 39.99, 0,
 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=400&h=400&fit=crop'),

('Webcam Full HD 1080p',
 '1080p 30fps webcam with built-in stereo microphone, autofocus, and fold-flat privacy cover.',
 59.99, 75,
 'https://images.unsplash.com/photo-1614588876378-b2ffa4520c22?w=400&h=400&fit=crop'),

('USB Condenser Microphone',
 'Cardioid condenser mic for streaming, podcasting, and remote work — plug-and-play USB-A.',
 89.99, 25,
 'https://images.unsplash.com/photo-1615821430614-3d7d2685e2f2?w=400&h=400&fit=crop'),

('LED Desk Lamp',
 'LED desk lamp with 3 colour temperatures, 5 brightness levels, and built-in USB charging port.',
 45.00, 20,
 'https://images.unsplash.com/photo-1543512214-4f76e81f8bfc?w=400&h=400&fit=crop'),

('RGB LED Strip 2m',
 '2-metre smart RGB LED strip with app control, music sync mode, and adhesive backing.',
 24.99, 60,
 'https://images.unsplash.com/photo-1572249930263-64fc5bbdb14b?w=400&h=400&fit=crop'),

('Laptop Sleeve 15"',
 'Water-repellent neoprene sleeve for 15-inch laptops with accessory pocket and carry handle.',
 34.99, 50,
 'https://images.unsplash.com/photo-1611461527944-1a718332613b?w=400&h=400&fit=crop'),

('Phone Desk Stand',
 'Adjustable aluminium phone stand with 270° rotation for landscape and portrait viewing.',
 22.99, 0,
 'https://images.unsplash.com/photo-1760443728221-0feabf5a0130?w=400&h=400&fit=crop'),

('Screen Privacy Filter 24"',
 '24-inch anti-glare privacy screen filter — blocks side-angle viewing, reduces blue light.',
 38.99, 20,
 'https://plus.unsplash.com/premium_photo-1680721575441-18d5a0567269?w=400&h=400&fit=crop');
