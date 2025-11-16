import { SendWorkspaceInvitationEmailParams } from '@/types/interfaces/mail';
import { APP_BASE_URL, createTransporter, GMAIL_USER, SMTP_FROM_NAME } from './client';


const buildInvitationUrl = (token: string) => {
    const baseUrl = APP_BASE_URL;
    return `${baseUrl}/accept-invitation?token=${encodeURIComponent(token)}`;
};

const buildEmailHtml = (
    workspaceName: string,
    inviterName: string,
    invitationUrl: string
) => `
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
                  ¡Has sido invitado a unirse a ${workspaceName}!
                </h1>
                <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">
                  <strong style="color: #111827;">${inviterName}</strong> te ha invitado a unirte al workspace <strong style="color: #111827;">${workspaceName}</strong> en <strong style="color: #111827;">Entipedia</strong>.
                </p>
                <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #4B5563;">
                  Haz clic en el botón a continuación para aceptar la invitación y comenzar a colaborar. Este enlace expirará en <strong style="color: #111827;">7 días</strong>.
                </p>
                
                <!-- CTA Button -->
                <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                  <tr>
                    <td align="center">
                      <a href="${invitationUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FCD34D 0%, #FBBF24 100%); color: #111827; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                        Aceptar Invitación
                      </a>
                    </td>
                  </tr>
                </table>
                
                <!-- Alternative link -->
                <p style="margin: 0 0 32px 0; font-size: 14px; line-height: 1.6; color: #6B7280; text-align: center;">
                  O copia y pega este enlace en tu navegador:<br />
                  <a href="${invitationUrl}" style="color: #FBBF24; text-decoration: underline; word-break: break-all;">${invitationUrl}</a>
                </p>
                
                <!-- Footer -->
                <div style="border-top: 1px solid #E5E7EB; padding-top: 24px; margin-top: 32px;">
                  <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6B7280;">
                    Si no esperabas esta invitación, puedes ignorar este mensaje de forma segura.
                  </p>
                </div>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="padding: 24px 32px; background-color: #F9FAFB; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="margin: 0; font-size: 12px; color: #6B7280;">
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

const buildEmailText = (
    workspaceName: string,
    inviterName: string,
    invitationUrl: string
) => `
¡Has sido invitado a unirse a ${workspaceName}!

${inviterName} te ha invitado a unirte al workspace ${workspaceName} en Entipedia.

Acepta tu invitación aquí:
${invitationUrl}

Este enlace expirará en 7 días. Si no esperabas esta invitación, puedes ignorar este mensaje de forma segura.
`;

export const sendWorkspaceInvitationEmail = async ({
    email,
    workspaceName,
    inviterName,
    token,
}: SendWorkspaceInvitationEmailParams) => {
    const transporter = createTransporter();

    if (!transporter) {
        const errorMsg =
            'Gmail SMTP no está configurado. Configura las variables de entorno GMAIL_USER y GMAIL_APP_PASSWORD.';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    const invitationUrl = buildInvitationUrl(token);

    try {
        const info = await transporter.sendMail({
            from: `"${SMTP_FROM_NAME}" <${GMAIL_USER}>`,
            to: email,
            subject: `Invitación para unirte a ${workspaceName} en Entipedia`,
            text: buildEmailText(workspaceName, inviterName, invitationUrl),
            html: buildEmailHtml(workspaceName, inviterName, invitationUrl),
        });

        console.log('Workspace invitation email sent successfully:', info.messageId);
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

