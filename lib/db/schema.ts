import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { clientTypes, fileTypes, projectStatuses } from "./enums/enums";


// (Main table)
export const companiesTable = pgTable("companies", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


// Relations for companies table (main table)
export const companiesRelations = relations(companiesTable, ({ many }) => ({
    users: many(usersTable),
    clients: many(clientsTable),
    files: many(filesTable),
    projects: many(projectsTable),
}));

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    companyId: uuid("company_id").references(() => companiesTable.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const usersRelations = relations(usersTable, ({ one }) => ({
    company: one(companiesTable, {
        fields: [usersTable.companyId],
        references: [companiesTable.id],
    }),
}));



export const clientsTable = pgTable("clients", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    type: clientTypes("type").default("individual").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 255 }).notNull(),
    companyId: uuid("company_id").references(() => companiesTable.id).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const clientsRelations = relations(clientsTable, ({ one }) => ({
    company: one(companiesTable, {
        fields: [clientsTable.companyId],
        references: [companiesTable.id]
    })
}));

export const filesTable = pgTable("files", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    type: fileTypes("type").notNull(),
    url: varchar("url", { length: 255 }).notNull(),
    companyId: uuid("company_id").references(() => companiesTable.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const filesRelations = relations(filesTable, ({ one }) => ({
    company: one(companiesTable, {
        fields: [filesTable.companyId],
        references: [companiesTable.id]
    })
}));

export const projectsTable = pgTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    status: projectStatuses("status").default("active").notNull(),
    companyId: uuid("company_id").references(() => companiesTable.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectsRelations = relations(projectsTable, ({ one }) => ({
    company: one(companiesTable, {
        fields: [projectsTable.companyId],
        references: [companiesTable.id]
    })
}))



