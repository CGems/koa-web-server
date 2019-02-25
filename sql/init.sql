DROP DATABASE IF EXISTS `robot`;

CREATE DATABASE `robot` DEFAULT CHARSET UTF8MB4;

USE `robot`;

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT ,
    `roleName` VARCHAR(255) NOT NULL,
    `desc` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    unique roleName_index (`roleName`)
) ENGINE=InnoDB;

INSERT `roles` (`roleName`,`desc`) values
('user', '普通用户'),
('admin', '管理员'),
('superAdmin', '超级管理员');