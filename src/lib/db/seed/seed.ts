import "dotenv/config";
import { db } from "../index";
import { companiesTable, usersTable, userCompaniesTable } from "../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const seed = async () => {
    try {
        console.log("Starting seed...");

        let company = await db
            .select()
            .from(companiesTable)
            .where(eq(companiesTable.workspace, "entipedia"))
            .limit(1)
            .then((rows) => rows[0]);

        if (!company) {
            const [entipediaCompany] = await db
                .insert(companiesTable)
                .values({
                    name: "Entipedia",
                    workspace: "entipedia",
                    description: "Entipedia es una empresa de desarrollo de software",
                })
                .returning();

            if (!entipediaCompany) {
                throw new Error("Failed to create company");
            }

            company = entipediaCompany;
        } else {
            return;
        }

        const saltRounds = 10;
        const password1 = await bcrypt.hash("123456", saltRounds);
        const password2 = await bcrypt.hash("123456", saltRounds);
        const password3 = await bcrypt.hash("123456", saltRounds);


        //seed users
        const userEmails = [
            "acabral4224@gmail.com",
            "vielka.ami@google.com",
            "alexander.cruz@gmail.com",
        ];

        const allUsers = await db.select().from(usersTable);
        const existingUsersByEmail = new Map(
            allUsers.map((u) => [u.email, u])
        );

        interface UserToCreate {
            name: string;
            email: string;
            password: string;
            companyId: string;
            emailVerifiedAt: Date;
            verificationToken: string | null;
            verificationTokenExpiresAt: Date | null;
        }
        const usersToCreate: UserToCreate[] = [];
        const usersForCompany: typeof allUsers = [];

        const names = ["Alex Cabrera", "Vielka Ami", "Alexander Cruz"];
        const passwords = [password1, password2, password3];

        userEmails.forEach((email, index) => {
            const existingUser = existingUsersByEmail.get(email);
            if (existingUser) {
                usersForCompany.push(existingUser);
            } else {
                usersToCreate.push({
                    name: names[index],
                    email: email,
                    password: passwords[index],
                    companyId: company.id,
                    emailVerifiedAt: new Date(),
                    verificationToken: null,
                    verificationTokenExpiresAt: null,
                });
            }
        });


        if (usersToCreate.length > 0) {
            const newUsers = await db
                .insert(usersTable)
                .values(usersToCreate)
                .returning();
            usersForCompany.push(...newUsers);
        } else {
            console.log("All users already exist");
        }

        const users = usersForCompany;

        const existingRelations = await db
            .select()
            .from(userCompaniesTable)
            .where(eq(userCompaniesTable.companyId, company.id));

        const existingUserIds = new Set(
            existingRelations.map((r) => r.userId.toString())
        );

        const relationsToCreate = users
            .filter((user) => !existingUserIds.has(user.id))
            .map((user) => ({
                userId: user.id,
                companyId: company.id,
            }));

        if (relationsToCreate.length > 0) {
            await db.insert(userCompaniesTable).values(relationsToCreate);

        } else {
            console.log("All user-company relationships already exist");
        }

        console.log("Seed completed successfully!");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        throw error;
    }
};

seed()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(" Seed process failed:", error);
        process.exit(1);
    });
