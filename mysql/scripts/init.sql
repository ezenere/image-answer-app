CREATE DATABASE  IF NOT EXISTS `Anatomy` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `Anatomy`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: Anatomy
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `Answers`
--

DROP TABLE IF EXISTS `Answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Answers` (
  `AnswerId` int NOT NULL AUTO_INCREMENT,
  `AnswerCollection` int NOT NULL,
  `AnswerImage` int NOT NULL,
  `AnswerText` varchar(500) NOT NULL,
  PRIMARY KEY (`AnswerId`),
  UNIQUE KEY `AnswerId_UNIQUE` (`AnswerId`),
  KEY `AnswerImage_FK_idx` (`AnswerImage`),
  KEY `AnswerCollection_FK_idx` (`AnswerCollection`),
  CONSTRAINT `AnswerCollection_FK` FOREIGN KEY (`AnswerCollection`) REFERENCES `Collections` (`CollectionId`),
  CONSTRAINT `AnswerImage_FK` FOREIGN KEY (`AnswerImage`) REFERENCES `CollectionImages` (`ImageId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CollectionImages`
--

DROP TABLE IF EXISTS `CollectionImages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CollectionImages` (
  `ImageId` int NOT NULL AUTO_INCREMENT,
  `ImageCollection` int NOT NULL,
  `ImageAnswers` int NOT NULL DEFAULT '0',
  `ImageIdentifier` varchar(120) NOT NULL,
  `ImageDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ImageId`),
  UNIQUE KEY `ImageId_UNIQUE` (`ImageId`),
  UNIQUE KEY `ImageIdentifier_UNIQUE` (`ImageIdentifier`),
  KEY `ImageCollection_FK_idx` (`ImageCollection`),
  CONSTRAINT `ImageCollection_FK` FOREIGN KEY (`ImageCollection`) REFERENCES `Collections` (`CollectionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Collections`
--

DROP TABLE IF EXISTS `Collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Collections` (
  `CollectionId` int NOT NULL AUTO_INCREMENT,
  `CollectionName` varchar(150) NOT NULL,
  `CollectionDescription` varchar(500) NOT NULL,
  `CollectionQuantity` int NOT NULL DEFAULT '0',
  `CollectionAnswers` int NOT NULL DEFAULT '0',
  `CollectionCreation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`CollectionId`),
  UNIQUE KEY `CollectionId_UNIQUE` (`CollectionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-20 16:43:18
