-- Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
USE ecommerce;

-- ── Admin account ──────────────────────────────────────────────────────────────
-- password: admin123  (bcrypt hash, never store plaintext)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@shopcart.com',
 '$2b$12$2dbqEp8hj1pGvgudZt6Umu3aZPJ.JE6kQX47qHz8FrAWSogw4pROK',
 'admin');

-- Admin needs a shopping_cart row (one-cart-per-user constraint)
INSERT INTO shopping_cart (user_id) VALUES (1);

-- ── Products (20 items across 4 categories) ────────────────────────────────────
-- All image URLs verified 200 OK on 2026-04-29.
-- ProductCard renders a branded SVG placeholder if any URL fails at runtime.
INSERT INTO products (name, description, price, stock, image_url) VALUES

-- Audio
('Wireless Headphones',
 'Premium noise-cancelling wireless headphones with 30-hour battery life and foldable design.',
 79.99, 50,
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'),

('Wireless Earbuds Pro',
 'True wireless earbuds with active noise cancellation, 8-hour playtime, and IPX4 water resistance.',
 99.99, 40,
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'),

('Bluetooth Speaker',
 'Compact portable speaker with 360° sound, 12-hour battery, and waterproof IPX6 rating.',
 65.99, 35,
 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop'),

-- Input Devices
('Mechanical Keyboard TKL',
 'Tenkeyless mechanical keyboard with tactile brown switches, PBT keycaps, and RGB underglow.',
 129.99, 30,
 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop'),

('Wireless Mouse',
 'Ergonomic wireless mouse with 4000 DPI sensor, silent clicks, and 60-day battery life.',
 44.99, 60,
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop'),

('Gaming Mouse Pad XL',
 'Extended desk mat, 900 × 400 mm, micro-woven surface, anti-slip rubber base, stitched edges.',
 29.99, 45,
 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop'),

('Keyboard Wrist Rest',
 'Memory foam wrist rest with non-slip base and washable cover — reduces typing fatigue.',
 27.99, 55,
 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop'),

-- Connectivity & Power
('USB-C Hub 7-in-1',
 '7-in-1 USB-C hub: 4K HDMI, 3× USB-A, SD/microSD card readers, 100W PD passthrough.',
 49.99, 100,
 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop'),

('Portable Charger 20000mAh',
 'High-capacity power bank with 65W USB-C PD fast charging and dual USB-A ports.',
 59.99, 45,
 'https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=400&h=400&fit=crop'),

('External SSD 500GB',
 'Pocket-sized external solid-state drive — 1050 MB/s read, USB 3.2 Gen 2, shock-resistant.',
 79.99, 30,
 'https://images.unsplash.com/photo-1600267204091-5c1ab8b10c02?w=400&h=400&fit=crop'),

('Cable Organizer Kit',
 'Silicone cable management sleeves + velcro ties — keeps your desk tidy in minutes.',
 19.99, 80,
 'https://images.unsplash.com/photo-1589763472885-46dd5b282f52?w=400&h=400&fit=crop'),

-- Desk & Display
('Adjustable Laptop Stand',
 'Aluminium laptop riser with 6 height settings, ventilation slots, and foldable legs.',
 54.99, 35,
 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'),

('Monitor Stand with Drawer',
 'Adjustable aluminium monitor riser with hidden storage drawer and integrated cable clips.',
 39.99, 0,
 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=400&h=400&fit=crop'),

('Webcam Full HD 1080p',
 '1080p 30fps webcam with built-in stereo microphone, autofocus, and fold-flat privacy cover.',
 59.99, 75,
 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop'),

('USB Condenser Microphone',
 'Cardioid condenser mic for streaming, podcasting, and remote work — plug-and-play USB-A.',
 89.99, 25,
 'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400&h=400&fit=crop'),

('LED Desk Lamp',
 'LED desk lamp with 3 colour temperatures, 5 brightness levels, and built-in USB charging port.',
 45.00, 20,
 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop'),

('RGB LED Strip 2m',
 '2-metre smart RGB LED strip with app control, music sync mode, and adhesive backing.',
 24.99, 60,
 'https://images.unsplash.com/photo-1574920162043-b872873f19c8?w=400&h=400&fit=crop'),

('Laptop Sleeve 15"',
 'Water-repellent neoprene sleeve for 15-inch laptops with accessory pocket and carry handle.',
 34.99, 50,
 'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400&h=400&fit=crop&crop=bottom'),

('Phone Desk Stand',
 'Adjustable aluminium phone stand with 270° rotation for landscape and portrait viewing.',
 22.99, 0,
 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop&crop=right'),

('Screen Privacy Filter 24"',
 '24-inch anti-glare privacy screen filter — blocks side-angle viewing, reduces blue light.',
 38.99, 20,
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&crop=right');
