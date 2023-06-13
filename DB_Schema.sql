CREATE TABLE `performance_data` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `core` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `task` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` smallint(5) unsigned NOT NULL,
  `request_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_request_id` (`request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
