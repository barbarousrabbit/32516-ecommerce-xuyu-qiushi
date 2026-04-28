-- Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
USE ecommerce;

-- Admin user
-- Password: admin123
-- Regenerate this hash before final submission:
--   python -c "from passlib.context import CryptContext; print(CryptContext(schemes=['bcrypt']).hash('admin123'))"
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@shopcart.com',
 '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Ake.7URF15HJN9mhS',
 'admin');

-- Empty shopping cart for the admin account
INSERT INTO shopping_cart (user_id) VALUES (1);

-- 8 sample products (matching Stitch mockup product names and prices)
INSERT INTO products (name, description, price, stock, image_url) VALUES
('Wireless Headphones',
 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
 79.99, 50,
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),

('Mechanical Keyboard',
 'Compact TKL mechanical keyboard with RGB backlighting and blue switches.',
 129.99, 30,
 'https://images.unsplash.com/photo-1595225353618-f5a4e9620e67?w=400'),

('USB-C Hub',
 '7-in-1 USB-C hub: 4K HDMI, 3× USB-A, SD/microSD, 100W PD passthrough.',
 49.99, 100,
 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400'),

('Webcam HD',
 '1080p 30fps webcam with built-in noise-cancelling microphone and privacy cover.',
 59.99, 75,
 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400'),

('Monitor Stand',
 'Adjustable aluminium monitor riser with storage drawer and cable management.',
 39.99, 0,
 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=400'),

('Desk Lamp',
 'LED desk lamp with 3 colour temperatures, 5 brightness levels, and USB charging port.',
 45.00, 20,
 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400'),

('Cable Organizer',
 'Silicone cable management sleeve bundle — keeps your desk tidy in minutes.',
 19.99, 80,
 'https://images.unsplash.com/photo-1589763472885-46dd5b282f52?w=400'),

('Mouse Pad XL',
 'Extended non-slip gaming mouse pad, 900×400 mm, stitched edges.',
 29.99, 40,
 'https://images.unsplash.com/photo-1625948515291-3c63d40dae97?w=400');
