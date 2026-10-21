CREATE DATABASE  IF NOT EXISTS `animal_adoption` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `animal_adoption`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: animal_adoption
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adoption_application`
--

DROP TABLE IF EXISTS `adoption_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adoption_application` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `applicant_name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `application_statement` text NOT NULL,
  `status` enum('pending','approved','rejected','reserved') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `animal_id` int NOT NULL,
  PRIMARY KEY (`application_id`),
  UNIQUE KEY `application_id_UNIQUE` (`application_id`),
  KEY `animal_id_idx` (`animal_id`),
  CONSTRAINT `fk_application_animal_id` FOREIGN KEY (`animal_id`) REFERENCES `animal` (`animal_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adoption_application`
--

LOCK TABLES `adoption_application` WRITE;
/*!40000 ALTER TABLE `adoption_application` DISABLE KEYS */;
INSERT INTO `adoption_application` VALUES (16,'Hannan Noor','noorhannan125@gmail.com','+65 86166230','I have experience in taking care of pets and i have a very spacious house so im suitable and knowlegeable to care for a rabbit.','approved','2026-02-06 23:27:54',8),(17,'James Nigel','james2009@gmail.com','83663903','I love hamsters and i have experience in taking care of hamsters in the past','reserved','2026-02-07 00:22:59',14),(18,'Piandao Uncas','piandaothebest@gmail.com','+65 6769 1738','I want to adopt a rabbit because I genuinely adore everything about them, their gentle nature, quirky personalities, and the joy they bring, and I’m committed to giving one a loving, lifelong home.','pending','2026-02-07 03:31:20',33),(19,'Megumi Fushiguro','megumi2008@gmail.com','+65 8762 5617','I have experience in taking care of pets like dogs, snakes, and frogs and I\'m interested in taking care of a rabbit. Thanks','pending','2026-02-08 19:46:11',34);
/*!40000 ALTER TABLE `adoption_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animal`
--

DROP TABLE IF EXISTS `animal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal` (
  `animal_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `age_year` int NOT NULL,
  `breed` varchar(45) NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `temperament` varchar(45) NOT NULL,
  `adoption_status` enum('adopted','reserved','available') NOT NULL,
  `age_month` int NOT NULL DEFAULT '0',
  `species_id` int DEFAULT NULL,
  PRIMARY KEY (`animal_id`),
  UNIQUE KEY `animal_jd_UNIQUE` (`animal_id`),
  KEY `species_id_idx` (`species_id`),
  CONSTRAINT `species_id` FOREIGN KEY (`species_id`) REFERENCES `animal_species` (`species_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal`
--

LOCK TABLES `animal` WRITE;
/*!40000 ALTER TABLE `animal` DISABLE KEYS */;
INSERT INTO `animal` VALUES (8,'Bugs',17,'Black-Tailed Jackrabbit','male','fiesty','adopted',0,1),(9,'Rabbid',7,'English Angora','male','Aggressive','available',2,1),(10,'Tom',6,'Lionhead','male','calm','adopted',6,1),(11,'Crystal',3,'Chinese Hamster','female','fiesty','adopted',4,2),(12,'Aurotas',2,'Syrian Hamster','male','fiesty','available',5,2),(14,'Bartholomew James The Third',3,'European Hamster','male','chloleric','reserved',1,2),(15,'Bandit',3,'Albino','male','Hardy','adopted',7,3),(16,'Dodger',5,'Panda','male','Timid','reserved',9,3),(17,'Noodle',7,'Docile','male','Docile','adopted',2,3),(19,'Noodle',2,'Domestic Ferret','female','curious','available',0,3),(27,'Jack',13,'black-tailed jackrabbit','male','Calm','reserved',11,2),(33,'Judy',4,'European Rabbit','female','Explorative','available',5,1),(34,'John Rabbit',1,'New Zealand White','male','Calm','available',2,1);
/*!40000 ALTER TABLE `animal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animal_images`
--

DROP TABLE IF EXISTS `animal_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `animal_id` int NOT NULL,
  `image_url` text NOT NULL,
  `is_default` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`image_id`),
  UNIQUE KEY `image_id_UNIQUE` (`image_id`),
  KEY `animal_id_idx` (`animal_id`),
  CONSTRAINT `animal_id` FOREIGN KEY (`animal_id`) REFERENCES `animal` (`animal_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal_images`
--

LOCK TABLES `animal_images` WRITE;
/*!40000 ALTER TABLE `animal_images` DISABLE KEYS */;
INSERT INTO `animal_images` VALUES (2,9,'https://cdnb.artstation.com/p/assets/images/images/064/656/817/large/nicolas-age-rabbid-49.jpg?1688460813',1),(3,10,'/images/Bella.jpg',1),(4,11,'/images/Crystal.jpg',1),(5,12,'/images/Auratas.jpg',1),(6,14,'/images/Barry.jpg',1),(7,15,'/images/Bandit.jpg',1),(8,16,'/images/Dodger.jpg',1),(9,17,'/images/Noodle.jpg',1),(10,19,'/images/Buddy.jpg',1),(53,8,'https://jacquesfortierart.com/wp-content/uploads/2023/12/Blog-2023-11-11-Point-Reyes-0092-Black-Tailed-Jackrabbit.jpg',0),(56,8,'https://www.shutterstock.com/shutterstock/photos/2679897043/display_1500/stock-photo-black-tailed-jack-rabbit-hopping-through-a-dry-field-2679897043.jpg',1),(57,27,'https://www.charlotte.providencevets.com/files/providence-animal-hospital-charlotte-are-rabbits-rodents-blog.jpeg',1),(58,27,'https://supremepetfoods.com/wp-content/uploads/2020/11/iStock-694542042-1200px.jpg',0),(69,15,'https://www.shutterstock.com/image-photo/white-albino-ferret-outdoor-portrait-600nw-775041403.jpg',0),(87,9,'/images/rabbid.jpg',0),(88,33,'https://static.wikia.nocookie.net/animaliaencyclopedia/images/3/32/European_Rabbit.webp/revision/latest?cb=20221106043705',1),(89,33,'https://www.environment.nsw.gov.au/sites/default/files/2024-09/rabbit-european-introduced-species-nl.jpg',0),(90,34,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0MTtPItU7KjWOeCRq-whVQw4n3GWBNwtTnw&s',1),(91,34,'https://www.mindenpictures.com/stock-photo-new-zealand-rabbit-oryctolagus-amongst-dandelions-captive-usa-naturephotography-image90034242.html',0);
/*!40000 ALTER TABLE `animal_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animal_species`
--

DROP TABLE IF EXISTS `animal_species`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal_species` (
  `species_id` int NOT NULL AUTO_INCREMENT,
  `species_name` varchar(45) NOT NULL,
  PRIMARY KEY (`species_id`),
  UNIQUE KEY `species_name_UNIQUE` (`species_name`),
  UNIQUE KEY `species_id_UNIQUE` (`species_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal_species`
--

LOCK TABLES `animal_species` WRITE;
/*!40000 ALTER TABLE `animal_species` DISABLE KEYS */;
INSERT INTO `animal_species` VALUES (3,'ferret'),(2,'hamster'),(1,'rabbit');
/*!40000 ALTER TABLE `animal_species` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-08 21:48:18
