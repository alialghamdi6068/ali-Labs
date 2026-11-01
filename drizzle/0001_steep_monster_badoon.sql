CREATE TABLE `projectReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`versionId` int,
	`reviewerId` int NOT NULL,
	`decision` enum('approved','rejected') NOT NULL,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectReviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`slug` varchar(80) NOT NULL,
	`name` varchar(120) NOT NULL,
	`summary` varchar(220) NOT NULL,
	`description` text,
	`projectType` varchar(40) NOT NULL,
	`iconUrl` varchar(500),
	`loaders` text NOT NULL,
	`gameVersions` text NOT NULL,
	`status` enum('draft','review','approved','rejected') NOT NULL DEFAULT 'draft',
	`downloads` int NOT NULL DEFAULT 0,
	`followers` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`versionNumber` varchar(40) NOT NULL,
	`changelog` text,
	`loaders` text NOT NULL,
	`gameVersions` text NOT NULL,
	`fileKey` varchar(500),
	`fileName` varchar(255),
	`fileSize` int,
	`status` enum('draft','review','approved','rejected') NOT NULL DEFAULT 'draft',
	`downloads` int NOT NULL DEFAULT 0,
	`reviewedBy` int,
	`reviewNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `versions_id` PRIMARY KEY(`id`)
);
