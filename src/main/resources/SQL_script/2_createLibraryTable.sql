DROP TABLE IF EXISTS 'test'.library;
CREATE TABLE `test`.`library` (
  `id` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NULL,
  `author` VARCHAR(100) NOT NULL,
  `isbn` VARCHAR(20) NOT NULL,
  `printed` INT NOT NULL,
  `readed` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idlibrary_UNIQUE` (`id` ASC),
  UNIQUE INDEX `isbn_UNIQUE` (`isbn` ASC));
