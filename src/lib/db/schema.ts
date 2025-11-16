import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, text, timestamp, numeric, date } from "drizzle-orm/pg-core";
import { clientTypes, fileTypes, projectPriorities, invitationStatuses, workspaceRoles } from "./enums/enums";

//Tables
// (Main table)
export const companiesTable = pgTable("companies", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    workspace: varchar("workspace", { length: 255 }).notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    companyId: uuid("company_id").references(() => companiesTable.id),
    emailVerifiedAt: timestamp("email_verified_at"),
    verificationToken: varchar("verification_token", { length: 255 }),
    verificationTokenExpiresAt: timestamp("verification_token_expires_at"),
    resetPasswordToken: varchar("reset_password_token", { length: 255 }),
    resetPasswordTokenExpiresAt: timestamp("reset_password_token_expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const userCompaniesTable = pgTable("user_companies", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => usersTable.id).notNull(),
    companyId: uuid("company_id").references(() => companiesTable.id).notNull(),
    role: workspaceRoles("role").default("member").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workspaceInvitationsTable = pgTable("workspace_invitations", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    companyId: uuid("company_id").references(() => companiesTable.id).notNull(),
    invitedBy: uuid("invited_by").references(() => usersTable.id).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    status: invitationStatuses("status").default("pending").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    acceptedAt: timestamp("accepted_at"),
});


export const clientsTable = pgTable("clients", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    type: clientTypes("type").default("individual").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 255 }).notNull(),
    companyId: uuid("company_id").references(() => companiesTable.id).notNull(),
    value: numeric("value", { precision: 15, scale: 2 }),
    dateFrom: date("date_from"),
    dateTo: date("date_to"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const filesTable = pgTable("files", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    type: fileTypes("type").notNull(),
    url: varchar("url", { length: 255 }).notNull(),
    key: varchar("key", { length: 255 }).notNull(),
    companyId: uuid("company_id").references(() => companiesTable.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectsTable = pgTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    status: text("status").default("active").notNull(),
    priority: projectPriorities("priority").default("medium").notNull(),
    companyId: uuid("company_id").references(() => companiesTable.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});



//Relaciones 


// Relations for companies table (main table)
export const companiesRelations = relations(companiesTable, ({ many }) => ({
    usersCompanies: many(userCompaniesTable),
    clients: many(clientsTable),
    files: many(filesTable),
    projects: many(projectsTable),
    invitations: many(workspaceInvitationsTable),
}));


export const usersRelations = relations(usersTable, ({ many }) => ({
    userCompanies: many(userCompaniesTable),
}));

export const userCompaniesRelations = relations(userCompaniesTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [userCompaniesTable.userId],
        references: [usersTable.id],
    }),
    company: one(companiesTable, {
        fields: [userCompaniesTable.companyId],
        references: [companiesTable.id],
    }),
}));

export const workspaceInvitationsRelations = relations(workspaceInvitationsTable, ({ one }) => ({
    company: one(companiesTable, {
        fields: [workspaceInvitationsTable.companyId],
        references: [companiesTable.id],
    }),
    inviter: one(usersTable, {
        fields: [workspaceInvitationsTable.invitedBy],
        references: [usersTable.id],
    }),
}));

export const clientsRelations = relations(clientsTable, ({ one }) => ({
    company: one(companiesTable, {
        fields: [clientsTable.companyId],
        references: [companiesTable.id]
    })
}));

export const filesRelations = relations(filesTable, ({ one }) => ({
    company: one(companiesTable, {
        fields: [filesTable.companyId],
        references: [companiesTable.id]
    })
}));

export const projectsRelations = relations(projectsTable, ({ one }) => ({
    company: one(companiesTable, {
        fields: [projectsTable.companyId],
        references: [companiesTable.id]
    })
}))
