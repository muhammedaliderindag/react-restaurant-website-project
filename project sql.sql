-- --------------------------------------------------------
-- Sunucu:                       127.0.0.1
-- Sunucu sürümü:                10.4.32-MariaDB - mariadb.org binary distribution
-- Sunucu İşletim Sistemi:       Win64
-- HeidiSQL Sürüm:               12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- restaurantdb için veritabanı yapısı dökülüyor
CREATE DATABASE IF NOT EXISTS `restaurantdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `restaurantdb`;

-- tablo yapısı dökülüyor restaurantdb.cart
CREATE TABLE IF NOT EXISTS `cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `fk_cart_user` (`user_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- restaurantdb.cart: ~0 rows (yaklaşık) tablosu için veriler indiriliyor

-- tablo yapısı dökülüyor restaurantdb.menu
CREATE TABLE IF NOT EXISTS `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `image` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- restaurantdb.menu: ~51 rows (yaklaşık) tablosu için veriler indiriliyor
INSERT INTO `menu` (`id`, `name`, `price`, `category`, `image`) VALUES
	(10, 'Mercimek Çorbası', 100.00, 'Çorba', '/uploads/1747192682333-mercimek.webp'),
	(11, 'Ezogelin Çorbası', 100.00, 'Çorba', '/uploads/1747192714611-ezogelin.webp'),
	(12, 'Domates Çorbası', 100.00, 'Çorba', '/uploads/1747192765203-domates.webp'),
	(13, 'Şehriye Çorbası', 100.00, 'Çorba', '/uploads/1747192788937-sehriye.webp'),
	(14, 'Kelle Paça Çorbası', 140.00, 'Çorba', '/uploads/1747192812579-kellepaca.jpg'),
	(15, 'İşkembe Çorbası', 140.00, 'Çorba', '/uploads/1747192830265-iskembe.webp'),
	(16, 'Yayla Çorbası', 100.00, 'Çorba', '/uploads/1747192852959-yayla.jpg'),
	(17, 'Terbiyeli Tavuk Çorbası', 120.00, 'Çorba', '/uploads/1747192870783-terbiyelitavuk.jpeg'),
	(18, 'Arabaşı Çorbası', 130.00, 'Çorba', '/uploads/1747192901749-arabasÄ±.jpg'),
	(19, 'Bamya Çorbası', 130.00, 'Çorba', '/uploads/1747192918689-bamya.jpg'),
	(20, 'Adana Kebap', 270.00, 'Ana Yemek', '/uploads/1747192943578-adanakebap.webp'),
	(21, 'Beyti Kebap', 290.00, 'Ana Yemek', '/uploads/1747192963064-beyti.jpg'),
	(22, 'Cağ Kebabı', 270.00, 'Ana Yemek', '/uploads/1747192983423-cagkebabi.jpg'),
	(23, 'İskender Kebap', 295.00, 'Ana Yemek', '/uploads/1747193008189-iskender.webp'),
	(24, 'Balaban Kebap', 280.00, 'Ana Yemek', '/uploads/1747193040933-balabankebap.jpg'),
	(25, 'Çöp Şiş', 240.00, 'Ana Yemek', '/uploads/1747193057087-cÃ¶psis.jpg'),
	(26, 'Mantı', 175.00, 'Ana Yemek', '/uploads/1747193100018-mantÄ±.jpg'),
	(27, 'İçli Köfte', 120.00, 'Ara Sıcak', '/uploads/1747193134327-iclikofte.webp'),
	(28, 'Karides Güveç', 190.00, 'Ara Sıcak', '/uploads/1747193158546-karidesguvec.webp'),
	(29, 'Lahmacun', 110.00, 'Ara Sıcak', '/uploads/1747193177806-lahmacun.webp'),
	(31, 'Mücver', 65.00, 'Ara Sıcak', '/uploads/1747193219999-mÃ¼cver.jpg'),
	(32, 'Paçanga Böreği', 100.00, 'Ara Sıcak', '/uploads/1747193236570-pacangaboregi.webp'),
	(33, 'Patlıcan Kebabı', 195.00, 'Ara Sıcak', '/uploads/1747193265512-patlÄ±cankebabÄ±.jpg'),
	(34, 'Sigara Böreği', 80.00, 'Ara Sıcak', '/uploads/1747193288058-sigarabÃ¶regi.jpg'),
	(35, 'Soğan Dolması', 145.00, 'Ara Sıcak', '/uploads/1747193308274-sogandolmasÄ±.webp'),
	(36, 'Ayran', 35.00, 'İçecek', '/uploads/1747344079384-ayran.jpg'),
	(37, 'Coca-Cola', 50.00, 'İçecek', '/uploads/1747344178339-coca-cola-original-can-of-coke-330-ml.jpg'),
	(38, 'Pepsi', 50.00, 'İçecek', '/uploads/1747344272649-download.jpg'),
	(39, 'Fanta', 50.00, 'İçecek', '/uploads/1747344290160-fanta.jpg'),
	(40, 'Limonata', 55.00, 'İçecek', '/uploads/1747344311330-limonata.jpg'),
	(41, 'Portakal Suyu', 55.00, 'İçecek', '/uploads/1747344335170-portakalsuyu.jpg'),
	(42, 'Gazoz', 35.00, 'İçecek', '/uploads/1747344764641-4109-kizilay-gazoz-250-ml-kizilay-gazoz-250-ml-kizilay-gazozo.jpg'),
	(43, 'Sprite', 50.00, 'İçecek', '/uploads/1747344785441-velibaba-sprite.jpg'),
	(47, 'Karpuz Çilek Soda', 35.00, 'İçecek', '/uploads/1747345484145-uludag-frutti-karpuz-cilekli-soda-200m-6769a5.webp'),
	(48, 'Limonlu Soda', 35.00, 'İçecek', '/uploads/1747345596622-8690723541236.jpg'),
	(49, 'Elmalı Soda', 35.00, 'İçecek', '/uploads/1747345638552-uludag-frutti-elma-aromali-200ml-6li-zoom-2.webp'),
	(50, 'Soda', 30.00, 'İçecek', '/uploads/1747345737719-download.jpg'),
	(51, 'Çay', 30.00, 'İçecek', '/uploads/1747345873243-images.jpg'),
	(52, 'Su', 30.00, 'İçecek', '/uploads/1747345887873-download.jpg'),
	(53, 'Baklava', 180.00, 'Tatlı', '/uploads/1747346460417-baklava.jpg'),
	(54, 'Künefe', 200.00, 'Tatlı', '/uploads/1747346509893-kÃ¼nefe.jpg'),
	(55, 'Şekerpare', 100.00, 'Tatlı', '/uploads/1747346604111-Åekerpare.jpg'),
	(56, 'Revani', 160.00, 'Tatlı', '/uploads/1747346648708-revani.jpg'),
	(57, 'Sütlaç', 160.00, 'Tatlı', '/uploads/1747346765875-sÃ¼tlaÃ§.jpg'),
	(58, 'Kazandibi', 180.00, 'Tatlı', '/uploads/1747348179505-download.jpg'),
	(59, 'Güllaç', 210.00, 'Tatlı', '/uploads/1747348631240-gullac-tarifi.webp'),
	(60, 'Tiramisu', 270.00, 'Tatlı', '/uploads/1747348763870-kedidilli-tiramisu.webp'),
	(61, 'Cheescake', 180.00, 'Tatlı', '/uploads/1747348838762-limonlu-cheesecake-1-2814.jpg'),
	(62, 'Profiterol ', 200.00, 'Tatlı', '/uploads/1747348877095-cikolata-sosu-ile-profiterol-hamur.jpg'),
	(63, 'Etliekmek', 250.00, 'Ana Yemek', '/uploads/1747349051107-images.jpg'),
	(65, 'Midye Tava', 175.00, 'Ara Sıcak', '/uploads/1747581933790-1747193204534-midyetava.webp');

-- tablo yapısı dökülüyor restaurantdb.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- restaurantdb.orders: ~1 rows (yaklaşık) tablosu için veriler indiriliyor
INSERT INTO `orders` (`id`, `user_id`, `item_id`, `quantity`) VALUES
	(72, 32, 10, 6);

-- tablo yapısı dökülüyor restaurantdb.reservations
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `table_number` int(11) DEFAULT NULL,
  `date_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- restaurantdb.reservations: ~3 rows (yaklaşık) tablosu için veriler indiriliyor
INSERT INTO `reservations` (`id`, `user_id`, `table_number`, `date_time`) VALUES
	(142, 37, 4, '2025-05-18 18:26:36'),
	(143, 37, 16, '2025-05-18 18:26:46'),
	(144, 32, 4, '2025-05-18 18:30:49');

-- tablo yapısı dökülüyor restaurantdb.tables
CREATE TABLE IF NOT EXISTS `tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_number` int(11) DEFAULT NULL,
  `is_reserved` tinyint(1) DEFAULT 0,
  `reserved_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `table_number` (`table_number`),
  KEY `reserved_by` (`reserved_by`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- restaurantdb.tables: ~24 rows (yaklaşık) tablosu için veriler indiriliyor
INSERT INTO `tables` (`id`, `table_number`, `is_reserved`, `reserved_by`) VALUES
	(1, 1, 0, NULL),
	(2, 2, 0, NULL),
	(3, 3, 0, NULL),
	(4, 4, 1, 32),
	(5, 5, 0, NULL),
	(6, 6, 0, NULL),
	(7, 7, 0, NULL),
	(8, 8, 0, NULL),
	(9, 9, 0, NULL),
	(10, 10, 0, NULL),
	(11, 11, 0, NULL),
	(12, 12, 0, NULL),
	(13, 13, 0, NULL),
	(14, 14, 0, NULL),
	(15, 15, 0, NULL),
	(16, 16, 0, NULL),
	(17, 17, 0, NULL),
	(18, 18, 0, NULL),
	(19, 19, 0, NULL),
	(20, 20, 0, NULL),
	(21, 21, 0, NULL),
	(22, 22, 0, NULL),
	(23, 23, 0, NULL),
	(24, 24, 0, NULL);

-- tablo yapısı dökülüyor restaurantdb.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `tc` varchar(11) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `created_time` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- restaurantdb.users: ~3 rows (yaklaşık) tablosu için veriler indiriliyor
INSERT INTO `users` (`id`, `name`, `email`, `tc`, `birth_date`, `password`, `role`, `created_time`) VALUES
	(32, 'admin admin', 'admin@gmail.com', '46151615156', '2000-01-01', '$2b$10$2hPoIOCq1pzI9q/qSQCchOpVnflUaTgVP2zQ7F/raLZq/7odulLzO', 'admin', '2025-05-18 18:49:45'),
	(37, 'user user', 'user@gmail.com', '91165115665', '2000-01-01', '$2b$10$29Vvg9b9OkzhGrLIlvpfmuZJwQGVlEy3FsH9eyVciyR3SWAvYFmQa', 'user', '2025-05-18 18:24:45'),
	(38, 'ahmet faruk', 'ahmetfaruk@gmail.com', '56445646545', '2000-01-01', '$2b$10$W7KGCibsLfAXZKXlun2KLugGOYGa1GDVV0tuAI2T7/srUHcDgXe/G', 'user', '2025-05-18 18:29:45');

-- görünüm yapısı dökülüyor restaurantdb.user_orders
-- VIEW bağımlılık sorunlarını çözmek için geçici tablolar oluşturuluyor
CREATE TABLE `user_orders` (
	`order_id` INT(11) NOT NULL,
	`user_name` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci',
	`item_name` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci',
	`quantity` INT(11) NOT NULL,
	`price` DECIMAL(10,2) NULL,
	`total_price` DECIMAL(20,2) NULL
) ENGINE=MyISAM;

-- tetikleyici yapısı dökülüyor restaurantdb.after_order_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER after_order_insert
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
  INSERT INTO cart (user_id, item_id, quantity)
  VALUES (NEW.user_id, NEW.item_id, NEW.quantity);
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- tetikleyici yapısı dökülüyor restaurantdb.trg_after_menu_delete
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER trg_after_menu_delete
AFTER DELETE ON menu
FOR EACH ROW
BEGIN
  -- Silinen menü öğesinin cart içindeki kayıtlarını temizle
  DELETE FROM cart
  WHERE item_id = OLD.id;

  -- Silinen menü öğesinin orders içindeki kayıtlarını temizle
  DELETE FROM orders
  WHERE item_id = OLD.id;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- tetikleyici yapısı dökülüyor restaurantdb.trg_after_user_delete
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER trg_after_user_delete
AFTER DELETE ON users
FOR EACH ROW
BEGIN
  UPDATE tables
  SET
    is_reserved = 0,
    reserved_by  = NULL
  WHERE reserved_by = OLD.id;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Geçici tablolar temizlenerek final VIEW oluşturuluyor
DROP TABLE IF EXISTS `user_orders`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `user_orders` AS SELECT 
    o.id AS order_id,
    u.name AS user_name,
    m.name AS item_name,
    o.quantity,
    m.price,
    o.quantity * m.price AS total_price
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN menu m ON o.item_id = m.id 
;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
