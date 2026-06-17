CREATE TABLE `copilot_usage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` varchar(128) NOT NULL,
	`usageDay` varchar(10) NOT NULL,
	`count` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `copilot_usage_id` PRIMARY KEY(`id`)
);
