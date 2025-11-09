import { pgEnum } from "drizzle-orm/pg-core";

export const clientTypes = pgEnum("client_types", ["individual", "company"]);
export const projectStatuses = pgEnum("project_statuses", ["active", "inactive", "completed", "cancelled"]);
export const fileTypes = pgEnum("file_types", ["pdf", "image", "video", "audio", "document", "other"]);