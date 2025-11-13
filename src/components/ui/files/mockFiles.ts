export type FileType = 'pdf' | 'image' | 'video' | 'audio' | 'document' | 'other';

export interface File {
    id: string;
    name: string;
    description: string | null;
    type: FileType;
    url: string;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
}

export const mockFiles: File[] = [
    {
        id: '1',
        name: 'Propuesta_Comercial_2024.pdf',
        description: 'Propuesta comercial para el cliente ABC Corp. Incluye presupuesto detallado y cronograma de implementación.',
        type: 'pdf',
        url: 'https://ejemplo.com/archivos/propuesta-comercial-2024.pdf',
        companyId: 'mock-company-id',
        createdAt: new Date('2024-01-15T10:30:00'),
        updatedAt: new Date('2024-01-15T10:30:00'),
    },
    {
        id: '2',
        name: 'Logo_Empresa_Final.png',
        description: 'Versión final del logo corporativo en alta resolución. Formato PNG con fondo transparente.',
        type: 'image',
        url: 'https://ejemplo.com/archivos/logo-empresa-final.png',
        companyId: 'mock-company-id',
        createdAt: new Date('2024-01-20T14:20:00'),
        updatedAt: new Date('2024-01-20T14:20:00'),
    },
    {
        id: '3',
        name: 'Presentacion_Producto.mp4',
        description: 'Video promocional del nuevo producto. Duración: 3 minutos. Incluye demostración de características principales.',
        type: 'video',
        url: 'https://ejemplo.com/archivos/presentacion-producto.mp4',
        companyId: 'mock-company-id',
        createdAt: new Date('2024-02-01T09:15:00'),
        updatedAt: new Date('2024-02-01T09:15:00'),
    },
    {
        id: '4',
        name: 'Contrato_Servicios.docx',
        description: 'Plantilla de contrato de servicios estándar. Revisar términos y condiciones antes de usar.',
        type: 'document',
        url: 'https://ejemplo.com/archivos/contrato-servicios.docx',
        companyId: 'mock-company-id',
        createdAt: new Date('2024-02-05T11:45:00'),
        updatedAt: new Date('2024-02-05T11:45:00'),
    },
    {
        id: '5',
        name: 'Podcast_Episodio_12.mp3',
        description: 'Episodio 12 del podcast semanal. Tema: Tendencias de marketing digital 2024. Invitado especial: Juan Pérez.',
        type: 'audio',
        url: 'https://ejemplo.com/archivos/podcast-episodio-12.mp3',
        companyId: 'mock-company-id',
        createdAt: new Date('2024-02-10T16:30:00'),
        updatedAt: new Date('2024-02-10T16:30:00'),
    },
    {
        id: '6',
        name: 'Manual_Usuario_v2.1.pdf',
        description: 'Manual de usuario actualizado con las nuevas funcionalidades. Versión 2.1 incluye guía de troubleshooting.',
        type: 'pdf',
        url: 'https://ejemplo.com/archivos/manual-usuario-v2.1.pdf',
        companyId: 'mock-company-id',
        createdAt: new Date('2024-02-12T08:00:00'),
        updatedAt: new Date('2024-02-12T08:00:00'),
    },
    {
        id: '7',
        name: 'Banner_Promocional_Web.jpg',
        description: null,
        type: 'image',
        url: 'https://ejemplo.com/archivos/banner-promocional-web.jpg',
        companyId: 'mock-company-id',
        createdAt: new Date('2024-02-15T13:20:00'),
        updatedAt: new Date('2024-02-15T13:20:00'),
    },
    {
        id: '8',
        name: 'Tutorial_Configuracion.mp4',
        description: 'Tutorial paso a paso para configurar el sistema. Incluye capturas de pantalla y explicaciones detalladas.',
        type: 'video',
        url: 'https://ejemplo.com/archivos/tutorial-configuracion.mp4',
        companyId: 'mock-company-id',
        createdAt: new Date('2024-02-18T10:10:00'),
        updatedAt: new Date('2024-02-18T10:10:00'),
    },
    {
        id: '9',
        name: 'Política_Privacidad.txt',
        description: 'Documento de política de privacidad actualizado según GDPR. Última revisión: Febrero 2024.',
        type: 'document',
        url: 'https://ejemplo.com/archivos/politica-privacidad.txt',
        companyId: 'mock-company-id',
        createdAt: new Date('2024-02-20T15:45:00'),
        updatedAt: new Date('2024-02-20T15:45:00'),
    },
    {
        id: '10',
        name: 'Jingle_Publicitario.wav',
        description: 'Jingle publicitario para campaña de radio. Duración: 30 segundos. Versión master sin comprimir.',
        type: 'audio',
        url: 'https://ejemplo.com/archivos/jingle-publicitario.wav',
        companyId: 'mock-company-id',
        createdAt: new Date('2024-02-22T09:30:00'),
        updatedAt: new Date('2024-02-22T09:30:00'),
    },
    {
        id: '11',
        name: 'Reporte_Financiero_Q1_2024.pdf',
        description: 'Reporte financiero del primer trimestre 2024. Incluye análisis de ingresos, gastos y proyecciones.',
        type: 'pdf',
        url: 'https://ejemplo.com/archivos/reporte-financiero-q1-2024.pdf',
        companyId: 'mock-company-id',
        createdAt: new Date('2024-02-25T11:00:00'),
        updatedAt: new Date('2024-02-25T11:00:00'),
    },
    {
        id: '12',
        name: 'Iconos_App_Set_Completo.svg',
        description: 'Set completo de iconos para la aplicación móvil. Formato vectorial SVG. Incluye variantes en diferentes tamaños.',
        type: 'image',
        url: 'https://ejemplo.com/archivos/iconos-app-set-completo.svg',
        companyId: 'mock-company-id',
        createdAt: new Date('2024-02-28T14:15:00'),
        updatedAt: new Date('2024-02-28T14:15:00'),
    },
];

