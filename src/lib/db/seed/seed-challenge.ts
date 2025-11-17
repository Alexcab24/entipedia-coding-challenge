import "dotenv/config";
import { db } from "../index";
import {
    companiesTable,
    usersTable,
    userCompaniesTable,
    clientsTable,
    projectsTable,
} from "../schema";
import { eq } from "drizzle-orm";

const CHALLENGE_EMAIL = "entipedia.challenge@gmail.com";
const DEFAULT_WORKSPACE = "miks-company";

// Datos de clientes para poblar
const CLIENTS_DATA = [
    // Clientes individuales
    { name: "María González", type: "individual" as const, email: "maria.gonzalez@email.com", phone: "+1 (809) 555-0101", value: "25000.00", dateFrom: "2024-01-15", dateTo: "2024-12-31", notes: "Cliente preferencial con varios proyectos en curso." },
    { name: "Carlos Rodríguez", type: "individual" as const, email: "carlos.rodriguez@email.com", phone: "+1 (809) 555-0102", value: "18000.00", dateFrom: "2024-02-01", dateTo: null, notes: "Requiere seguimiento mensual." },
    { name: "Ana Martínez", type: "individual" as const, email: "ana.martinez@email.com", phone: "+1 (809) 555-0103", value: "32000.00", dateFrom: "2024-01-10", dateTo: "2024-06-30", notes: "Cliente corporativo con alta demanda." },
    { name: "Luis Fernández", type: "individual" as const, email: "luis.fernandez@email.com", phone: "+1 (809) 555-0104", value: "15000.00", dateFrom: "2024-03-01", dateTo: "2024-09-30", notes: "Trabaja principalmente en horarios nocturnos." },
    { name: "Laura Sánchez", type: "individual" as const, email: "laura.sanchez@email.com", phone: "+1 (809) 555-0105", value: "22000.00", dateFrom: "2024-01-20", dateTo: null, notes: "Excelente colaboración, siempre puntual." },
    { name: "Roberto Díaz", type: "individual" as const, email: "roberto.diaz@email.com", phone: "+1 (809) 555-0106", value: "19500.00", dateFrom: "2024-02-15", dateTo: "2024-08-15", notes: "Cliente nuevo con potencial de crecimiento." },
    { name: "Carmen López", type: "individual" as const, email: "carmen.lopez@email.com", phone: "+1 (809) 555-0107", value: "28000.00", dateFrom: "2024-01-05", dateTo: null, notes: "Referencia de otros clientes satisfechos." },
    { name: "Juan Pérez", type: "individual" as const, email: "juan.perez@email.com", phone: "+1 (809) 555-0108", value: "16500.00", dateFrom: "2024-03-10", dateTo: "2024-09-10", notes: "Requiere atención especializada." },
    { name: "Sofía Ramírez", type: "individual" as const, email: "sofia.ramirez@email.com", phone: "+1 (809) 555-0109", value: "24000.00", dateFrom: "2024-02-01", dateTo: null, notes: "Cliente activo con múltiples referencias." },
    { name: "Diego Morales", type: "individual" as const, email: "diego.morales@email.com", phone: "+1 (809) 555-0110", value: "21000.00", dateFrom: "2024-01-25", dateTo: "2024-07-25", notes: "Interesado en expandir servicios." },
    { name: "Isabel Torres", type: "individual" as const, email: "isabel.torres@email.com", phone: "+1 (809) 555-0111", value: "19000.00", dateFrom: "2024-03-05", dateTo: null, notes: "Cliente fiel desde hace varios años." },
    { name: "Miguel Herrera", type: "individual" as const, email: "miguel.herrera@email.com", phone: "+1 (809) 555-0112", value: "23000.00", dateFrom: "2024-02-20", dateTo: "2024-10-20", notes: "Excelente para referencias y networking." },

    // Empresas
    { name: "TechSolutions RD", type: "company" as const, email: "contacto@techsolutionsrd.com", phone: "+1 (809) 555-0201", value: "150000.00", dateFrom: "2024-01-01", dateTo: "2024-12-31", notes: "Empresa tecnológica líder en el mercado local. Contrato anual con renovación automática." },
    { name: "Innova Corp", type: "company" as const, email: "ventas@innovacorp.com", phone: "+1 (809) 555-0202", value: "98000.00", dateFrom: "2024-02-01", dateTo: null, notes: "Startup en crecimiento con grandes expectativas de expansión." },
    { name: "Global Business Group", type: "company" as const, email: "info@globalbusiness.com", phone: "+1 (809) 555-0203", value: "125000.00", dateFrom: "2024-01-15", dateTo: "2024-06-30", notes: "Corporación internacional con presencia en múltiples países." },
    { name: "Digital Agency Pro", type: "company" as const, email: "hello@digitalagencypro.com", phone: "+1 (809) 555-0204", value: "87000.00", dateFrom: "2024-03-01", dateTo: "2024-09-30", notes: "Agencia de marketing digital con proyectos creativos innovadores." },
    { name: "Cloud Services Inc", type: "company" as const, email: "contact@cloudservices.com", phone: "+1 (809) 555-0205", value: "110000.00", dateFrom: "2024-01-10", dateTo: null, notes: "Proveedor de servicios en la nube con infraestructura robusta." },
    { name: "Finance Hub", type: "company" as const, email: "info@financehub.com", phone: "+1 (809) 555-0206", value: "135000.00", dateFrom: "2024-02-15", dateTo: "2024-08-15", notes: "Plataforma financiera con alta seguridad y cumplimiento regulatorio." },
    { name: "HealthCare Systems", type: "company" as const, email: "support@healthcaresystems.com", phone: "+1 (809) 555-0207", value: "165000.00", dateFrom: "2024-01-05", dateTo: null, notes: "Sistemas de salud digitales con certificaciones internacionales." },
    { name: "EduTech Solutions", type: "company" as const, email: "contact@edutechsolutions.com", phone: "+1 (809) 555-0208", value: "95000.00", dateFrom: "2024-03-10", dateTo: "2024-12-31", notes: "Tecnología educativa con impacto social positivo." },
    { name: "Green Energy Corp", type: "company" as const, email: "info@greenenergy.com", phone: "+1 (809) 555-0209", value: "142000.00", dateFrom: "2024-02-01", dateTo: null, notes: "Energía renovable con proyectos sostenibles a largo plazo." },
    { name: "RetailMax", type: "company" as const, email: "ventas@retailmax.com", phone: "+1 (809) 555-0210", value: "78000.00", dateFrom: "2024-01-20", dateTo: "2024-07-20", notes: "Cadena de retail con múltiples ubicaciones físicas y digitales." },
];

// Datos de proyectos para poblar
const PROJECTS_DATA = [
    // Proyectos activos
    { name: "Sistema de Gestión ERP", description: "Desarrollo completo de un sistema de planificación de recursos empresariales con módulos de inventario, contabilidad y recursos humanos.", status: "active" as const, priority: "high" as const },
    { name: "Plataforma E-commerce", description: "Marketplace completo con carrito de compras, pasarelas de pago y sistema de recomendaciones basado en IA.", status: "active" as const, priority: "urgent" as const },
    { name: "App Móvil iOS/Android", description: "Aplicación móvil multiplataforma para gestión de tareas y productividad personal con sincronización en la nube.", status: "active" as const, priority: "medium" as const },
    { name: "Dashboard Analítico", description: "Panel de control con visualizaciones interactivas y reportes en tiempo real para toma de decisiones empresariales.", status: "active" as const, priority: "high" as const },
    { name: "API RESTful", description: "Servicios API RESTful con documentación completa, autenticación JWT y rate limiting para integración con terceros.", status: "active" as const, priority: "medium" as const },
    { name: "Sistema de Reservas", description: "Plataforma web para gestión de reservas y citas con calendario interactivo y notificaciones por email y SMS.", status: "active" as const, priority: "medium" as const },
    { name: "Portal de Clientes", description: "Portal autogestionado donde los clientes pueden ver sus facturas, actualizar datos y solicitar soporte.", status: "active" as const, priority: "low" as const },
    { name: "Integración de Pagos", description: "Implementación de múltiples pasarelas de pago con procesamiento seguro y manejo de webhooks.", status: "active" as const, priority: "high" as const },
    { name: "Sistema de Inventario", description: "Control de inventario en tiempo real con alertas de stock bajo y generación automática de órdenes de compra.", status: "active" as const, priority: "urgent" as const },
    { name: "Herramienta de Reportes", description: "Generador de reportes personalizables con exportación a PDF, Excel y CSV con plantillas personalizables.", status: "active" as const, priority: "low" as const },
    { name: "App de Delivery", description: "Aplicación móvil para pedidos de comida a domicilio con seguimiento en tiempo real y sistema de calificaciones.", status: "active" as const, priority: "high" as const },
    { name: "Portal Educativo", description: "Plataforma de aprendizaje en línea con cursos, evaluaciones y certificaciones digitales.", status: "active" as const, priority: "medium" as const },

    // Proyectos completados
    { name: "Sitio Web Corporativo", description: "Diseño y desarrollo de sitio web responsive con CMS integrado y optimización SEO.", status: "completed" as const, priority: "medium" as const },
    { name: "Sistema de Facturación", description: "Sistema completo de facturación electrónica con integración a hacienda y generación de comprobantes fiscales.", status: "completed" as const, priority: "high" as const },
    { name: "App de Clima", description: "Aplicación móvil para pronóstico del tiempo con widgets y notificaciones de alertas meteorológicas.", status: "completed" as const, priority: "low" as const },
    { name: "Plataforma de Blog", description: "CMS para blog personalizado con editor WYSIWYG, comentarios y sistema de categorías.", status: "completed" as const, priority: "low" as const },
    { name: "Sistema de Nómina", description: "Software de cálculo de nómina con manejo de deducciones, bonificaciones y generación de reportes legales.", status: "completed" as const, priority: "high" as const },
    { name: "Chat en Vivo", description: "Sistema de chat en tiempo real con soporte para múltiples agentes y historial de conversaciones.", status: "completed" as const, priority: "medium" as const },
    { name: "App de Fitness", description: "Aplicación para seguimiento de entrenamientos con planes personalizados y estadísticas de progreso.", status: "completed" as const, priority: "medium" as const },
    { name: "Dashboard de Métricas", description: "Panel de métricas y KPIs con gráficos interactivos y exportación de datos.", status: "completed" as const, priority: "low" as const },

    // Proyectos inactivos
    { name: "Proyecto Piloto IA", description: "Investigación y desarrollo de funcionalidades de inteligencia artificial para automatización de procesos.", status: "inactive" as const, priority: "medium" as const },
    { name: "App de Red Social", description: "Red social especializada en networking profesional con funcionalidades de mensajería y grupos.", status: "inactive" as const, priority: "low" as const },
    { name: "Sistema de CRM Avanzado", description: "CRM con pipeline de ventas, automatización de marketing y análisis predictivo.", status: "inactive" as const, priority: "high" as const },
    { name: "Plataforma de Streaming", description: "Plataforma de streaming de video con transcodificación y CDN integrado.", status: "inactive" as const, priority: "medium" as const },
    { name: "App de Gestión Financiera", description: "Aplicación para control de gastos personales con análisis de presupuesto y metas financieras.", status: "inactive" as const, priority: "low" as const },

    // Proyectos cancelados
    { name: "Proyecto Blockchain", description: "Implementación de blockchain para trazabilidad de productos en cadena de suministro.", status: "cancelled" as const, priority: "high" as const },
    { name: "App de Realidad Aumentada", description: "Aplicación móvil con funcionalidades de realidad aumentada para visualización de productos.", status: "cancelled" as const, priority: "medium" as const },
    { name: "Sistema Legacy Modernización", description: "Migración de sistema legacy a arquitectura moderna con microservicios.", status: "cancelled" as const, priority: "high" as const },
    { name: "Plataforma de Trading", description: "Plataforma de trading en línea con gráficos avanzados y análisis técnico.", status: "cancelled" as const, priority: "urgent" as const },
];

export const seedChallenge = async () => {
    try {
        console.log("Starting seed for challenge account...");

        const user = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, CHALLENGE_EMAIL))
            .limit(1)
            .then((rows) => rows[0]);

        if (!user) {
            throw new Error(`User ${CHALLENGE_EMAIL} not found. Please create the user first.`);
        }

        console.log("User found:", user.email);

        const userCompanyRelation = await db
            .select()
            .from(userCompaniesTable)
            .where(eq(userCompaniesTable.userId, user.id))
            .limit(1)
            .then((rows) => rows[0]);

        let company;

        if (userCompanyRelation) {
           
            company = await db
                .select()
                .from(companiesTable)
                .where(eq(companiesTable.id, userCompanyRelation.companyId))
                .limit(1)
                .then((rows) => rows[0]);

            if (!company) {
                throw new Error(`Company not found for user ${CHALLENGE_EMAIL}.`);
            }
            console.log("Company found:", company.name, `(${company.workspace})`);
        } else {
           
            console.log("Creating new workspace for user...");

           
            const existingCompany = await db
                .select()
                .from(companiesTable)
                .where(eq(companiesTable.workspace, DEFAULT_WORKSPACE))
                .limit(1)
                .then((rows) => rows[0]);

            if (existingCompany) {
                company = existingCompany;
                console.log("Using existing workspace:", company.name, `(${company.workspace})`);
            } else {
                const [newCompany] = await db
                    .insert(companiesTable)
                    .values({
                        name: "Sublyt Company",
                        workspace: DEFAULT_WORKSPACE,
                        description: "Empresa de desarrollo de software y soluciones tecnológicas innovadoras",
                    })
                    .returning();

                if (!newCompany) {
                    throw new Error("Failed to create company");
                }

                company = newCompany;
                console.log("Workspace created:", company.name, `(${company.workspace})`);
            }

         
            await db.insert(userCompaniesTable).values({
                userId: user.id,
                companyId: company.id,
                role: "owner",
            });
            console.log("User-company relationship created");
        }




        const existingClients = await db
            .select()
            .from(clientsTable)
            .where(eq(clientsTable.companyId, company.id));

        const existingClientEmails = new Set(existingClients.map((c) => c.email));

        const clientsToCreate = CLIENTS_DATA.filter(
            (client) => !existingClientEmails.has(client.email)
        ).map((client) => ({
            name: client.name,
            type: client.type,
            email: client.email,
            phone: client.phone,
            companyId: company.id,
            value: client.value,
            dateFrom: client.dateFrom || null,
            dateTo: client.dateTo || null,
            notes: client.notes || null,
        }));

        if (clientsToCreate.length > 0) {
            await db.insert(clientsTable).values(clientsToCreate);
            console.log(`Created ${clientsToCreate.length} clients`);
        } else {
            console.log("Clients already exist");
        }

        const existingProjects = await db
            .select()
            .from(projectsTable)
            .where(eq(projectsTable.companyId, company.id));

        const existingProjectNames = new Set(existingProjects.map((p) => p.name));

        const projectsToCreate = PROJECTS_DATA.filter(
            (project) => !existingProjectNames.has(project.name)
        ).map((project) => ({
            name: project.name,
            description: project.description || null,
            status: project.status,
            priority: project.priority,
            companyId: company.id,
        }));

        if (projectsToCreate.length > 0) {
            await db.insert(projectsTable).values(projectsToCreate);
            console.log(`Created ${projectsToCreate.length} projects`);
        } else {
            console.log("Projects already exist");
        }

        console.log("Seed completed successfully!");

    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
};


if (require.main === module) {
    seedChallenge()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error("Seed process failed:", error);
            process.exit(1);
        });
}

