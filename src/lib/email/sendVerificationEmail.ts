import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'Entipedia';

const fallbackBaseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

const APP_BASE_URL =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    fallbackBaseUrl;

const createTransporter = () => {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        return null;
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD,
        },
    });
};

interface SendVerificationEmailParams {
    email: string;
    name: string;
    token: string;
}

const buildVerificationUrl = (token: string) => {
    const baseUrl = APP_BASE_URL.endsWith('/')
        ? APP_BASE_URL.slice(0, -1)
        : APP_BASE_URL;

    return `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
};

const buildEmailHtml = (name: string, verificationUrl: string) => `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
            <!-- Header with yellow accent -->
            <tr>
              <td style="background: linear-gradient(135deg, #FCD34D 0%, #FBBF24 100%); padding: 32px 32px 24px; text-align: center;">
                <img src="${APP_BASE_URL}/images/EntipediaLogoBlack.png" alt="Entipedia" style="height: 40px; object-fit: contain; margin-bottom: 16px;" />
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 32px; background-color: #ffffff;">
                <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #111827; line-height: 1.3;">
                  ¡Hola ${name || '👋'}!
                </h1>
                <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">
                  Gracias por registrarte en <strong style="color: #111827;">Entipedia</strong>. Antes de comenzar, necesitamos confirmar tu correo electrónico.
                </p>
                <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">
                  Haz clic en el botón a continuación para verificar tu cuenta. Este enlace expirará en <strong style="color: #111827;">24 horas</strong> por motivos de seguridad.
                </p>
                
                <!-- CTA Button -->
                <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                  <tr>
                    <td align="center">
                      <a href="${verificationUrl}" style="display: inline-block; background-color: #FCD34D; color: #111827; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; transition: background-color 0.2s;">
                        Confirmar correo
                      </a>
                    </td>
                  </tr>
                </table>
                
                <!-- Alternative link -->
                <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; color: #6B7280; text-align: center;">
                  O copia y pega este enlace en tu navegador:<br>
                  <a href="${verificationUrl}" style="color: #FCD34D; text-decoration: underline; word-break: break-all;">${verificationUrl}</a>
                </p>
                
                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6B7280; padding-top: 24px; border-top: 1px solid #E5E7EB;">
                  Si tú no solicitaste esta cuenta, puedes ignorar este correo de forma segura.
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="padding: 24px 32px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB; text-align: center;">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #6B7280;">
                  © ${new Date().getFullYear()} Entipedia. Todos los derechos reservados.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

const buildEmailText = (name: string, verificationUrl: string) => `
Hola ${name || ''},

Gracias por registrarte en Entipedia. Confirma tu correo para activar tu cuenta:
${verificationUrl}

Este enlace expirará en 24 horas. Si no creaste una cuenta, ignora este mensaje.
`;

export const sendVerificationEmail = async ({
    email,
    name,
    token,
}: SendVerificationEmailParams) => {
    const transporter = createTransporter();

    if (!transporter) {
        const errorMsg =
            'Gmail SMTP no está configurado. Configura las variables de entorno GMAIL_USER y GMAIL_APP_PASSWORD.';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    const verificationUrl = buildVerificationUrl(token);

    try {
        const info = await transporter.sendMail({
            from: `"${SMTP_FROM_NAME}" <${GMAIL_USER}>`,
            to: email,
            subject: 'Confirma tu correo en Entipedia',
            text: buildEmailText(name, verificationUrl),
            html: buildEmailHtml(name, verificationUrl),
        });

        console.log('Email sent successfully:', info.messageId);
        return { MessageId: info.messageId };
    } catch (error) {
        console.error('Gmail SMTP send error:', error);

        if (error instanceof Error) {
            if (error.message.includes('Invalid login')) {
                throw new Error(
                    'Gmail SMTP: Credenciales inválidas. Verifica GMAIL_USER y GMAIL_APP_PASSWORD. Asegúrate de usar una "App Password" de Gmail, no tu contraseña normal.'
                );
            }
            if (error.message.includes('EAUTH')) {
                throw new Error(
                    'Gmail SMTP: Error de autenticación. Verifica que hayas habilitado "Acceso de aplicaciones menos seguras" o uses una "App Password" de Gmail.'
                );
            }
            if (error.message.includes('ECONNECTION') || error.message.includes('ETIMEDOUT')) {
                throw new Error('Gmail SMTP: Error de conexión. Verifica tu conexión a internet.');
            }
        }

        throw error;
    }
};
