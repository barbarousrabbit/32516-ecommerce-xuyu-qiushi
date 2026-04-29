-- MySQL dump 10.13  Distrib 8.4.9, for Linux (x86_64)
--
-- Host: localhost    Database: ecommerce
-- ------------------------------------------------------
-- Server version	8.4.9

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cart_product` (`cart_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `shopping_cart` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Wireless Headphones','Premium noise-cancelling wireless headphones with 30-hour battery life and foldable design.',79.99,48,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 07:04:05'),(2,'Wireless Earbuds Pro','True wireless earbuds with active noise cancellation, 8-hour playtime, and IPX4 water resistance.',99.99,40,'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(3,'Bluetooth Speaker','Compact portable speaker with 360-degree sound, 12-hour battery, and waterproof IPX6 rating.',65.99,35,'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(4,'Mechanical Keyboard TKL','Tenkeyless mechanical keyboard with tactile brown switches, PBT keycaps, and RGB underglow.',129.99,30,'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(5,'Wireless Mouse','Ergonomic wireless mouse with 4000 DPI sensor, silent clicks, and 60-day battery life.',44.99,60,'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(6,'Gaming Mouse Pad XL','Extended desk mat, 900 x 400 mm, micro-woven surface, anti-slip rubber base, stitched edges.',29.99,45,'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(7,'Keyboard Wrist Rest','Memory foam wrist rest with non-slip base and washable cover to reduce typing fatigue.',27.99,55,'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(8,'USB-C Hub 7-in-1','7-in-1 USB-C hub: 4K HDMI, 3x USB-A, SD/microSD card readers, 100W PD passthrough.',49.99,100,'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(9,'Portable Charger 20000mAh','High-capacity power bank with 65W USB-C PD fast charging and dual USB-A ports.',59.99,45,'https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(10,'External SSD 500GB','Pocket-sized external SSD â€” 1050 MB/s read, USB 3.2 Gen 2, shock-resistant aluminium shell.',79.99,30,'https://images.unsplash.com/photo-1600267204091-5c1ab8b10c02?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(11,'Cable Organizer Kit','Silicone cable management sleeves plus velcro ties â€” keeps your desk tidy in minutes.',19.99,80,'https://images.unsplash.com/photo-1589763472885-46dd5b282f52?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(12,'Adjustable Laptop Stand','Aluminium laptop riser with 6 height settings, ventilation slots, and foldable legs.',54.99,35,'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(13,'Monitor Stand with Drawer','Adjustable aluminium monitor riser with hidden storage drawer and integrated cable clips.',39.99,0,'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(14,'Webcam Full HD 1080p','1080p 30fps webcam with built-in stereo microphone, autofocus, and fold-flat privacy cover.',59.99,75,'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(15,'USB Condenser Microphone','Cardioid condenser mic for streaming, podcasting, and remote work â€” plug-and-play USB-A.',89.99,25,'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(16,'LED Desk Lamp','LED desk lamp with 3 colour temperatures, 5 brightness levels, and built-in USB charging port.',45.00,20,'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(17,'RGB LED Strip 2m','2-metre smart RGB LED strip with app control, music sync mode, and adhesive backing.',24.99,60,'https://images.unsplash.com/photo-1574920162043-b872873f19c8?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(18,'Laptop Sleeve 15 inch','Water-repellent neoprene sleeve for 15-inch laptops with accessory pocket and carry handle.',34.99,50,'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(19,'Phone Desk Stand','Adjustable aluminium phone stand with 270-degree rotation for landscape and portrait viewing.',22.99,0,'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56'),(20,'Screen Privacy Filter 24 inch','24-inch anti-glare privacy screen filter â€” blocks side-angle viewing and reduces blue light.',38.99,20,'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop','2026-04-29 06:51:56','2026-04-29 06:51:56');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopping_cart`
--

DROP TABLE IF EXISTS `shopping_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopping_cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `shopping_cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopping_cart`
--

LOCK TABLES `shopping_cart` WRITE;
/*!40000 ALTER TABLE `shopping_cart` DISABLE KEYS */;
INSERT INTO `shopping_cart` VALUES (1,1,'2026-04-29 06:16:25'),(3,3,'2026-04-29 08:08:19');
/*!40000 ALTER TABLE `shopping_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@shopcart.com','$2b$12$2dbqEp8hj1pGvgudZt6Umu3aZPJ.JE6kQX47qHz8FrAWSogw4pROK','admin','2026-04-29 06:16:25'),(3,'smoketest_role','smoketest_role@example.com','$2b$12$ZTvtWt6pgd7wy0NixawheeRNy2RPKQ8IItdiYsBLLFKqpRn00.Q/O','user','2026-04-29 08:08:19');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-29  9:25:05
