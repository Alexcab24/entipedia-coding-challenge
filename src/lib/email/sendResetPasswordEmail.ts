import { APP_BASE_URL, createTransporter, GMAIL_USER, SMTP_FROM_NAME } from "./client";

interface SendResetPasswordEmailParams {
    email: string;
    name: string;
    token: string;
}

const buildResetUrl = (token: string) => {
    const baseUrl = APP_BASE_URL.endsWith('/')
        ? APP_BASE_URL.slice(0, -1)
        : APP_BASE_URL;

    return `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
};

const buildEmailHtml = (name: string, resetUrl: string) => `
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
                  Restablecer contraseña
                </h1>
                <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">
                  Hola <strong style="color: #111827;">${name || ''}</strong>,
                </p>
                <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">
                  Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong style="color: #111827;">Entipedia</strong>.
                </p>
                <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">
                  Haz clic en el botón a continuación para crear una nueva contraseña. Este enlace expirará en <strong style="color: #111827;">1 hora</strong> por motivos de seguridad.
                </p>
                
                <!-- CTA Button -->
                <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                  <tr>
                    <td align="center">
                      <a href="${resetUrl}" style="display: inline-block; background-color: #FCD34D; color: #111827; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; transition: background-color 0.2s;">
                        Restablecer contraseña
                      </a>
                    </td>
                  </tr>
                </table>
                
                <!-- Alternative link -->
                <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; color: #6B7280; text-align: center;">
                  O copia y pega este enlace en tu navegador:<br>
                  <a href="${resetUrl}" style="color: #FCD34D; text-decoration: underline; word-break: break-all;">${resetUrl}</a>
                </p>
                
                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6B7280; padding-top: 24px; border-top: 1px solid #E5E7EB;">
                  Si tú no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña no será modificada.
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

const buildEmailText = (name: string, resetUrl: string) => `
Hola ${name || ''},

Recibimos una solicitud para restablecer la contraseña de tu cuenta en Entipedia.

Haz clic en el siguiente enlace para crear una nueva contraseña:
${resetUrl}

Este enlace expirará en 1 hora. Si no solicitaste este cambio, ignora este mensaje.
`;

export const sendResetPasswordEmail = async ({
    email,
    name,
    token,
}: SendResetPasswordEmailParams) => {
    const transporter = createTransporter();

    if (!transporter) {
        const errorMsg =
            'Gmail SMTP no está configurado. Configura las variables de entorno GMAIL_USER y GMAIL_APP_PASSWORD.';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    const resetUrl = buildResetUrl(token);

    try {
        const info = await transporter.sendMail({
            from: `"${SMTP_FROM_NAME}" <${GMAIL_USER}>`,
            to: email,
            subject: 'Restablecer tu contraseña en Entipedia',
            text: buildEmailText(name, resetUrl),
            html: buildEmailHtml(name, resetUrl),
        });

        console.log('Reset password email sent successfully:', info.messageId);
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

