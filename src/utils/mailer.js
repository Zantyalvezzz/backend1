import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter
  .verify()
  .then(() => console.log("Conexión con Gmail OK"))
  .catch((err) => console.error("Error en conexión con Gmail:", err));

export const sendRecoveryEmail = async (email, token) => {
  try {
    const recoveryLink = `http://localhost:${process.env.PORT}/reset-password?token=${token}`;

    const res = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Recuperación de contraseña",
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Haz click en el siguiente botón para restablecer tu contraseña:</p>
        <a href="${recoveryLink}">
          <button>Restablecer contraseña</button>
        </a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    console.log("Correo enviado correctamente");
    return res;
  } catch (e) {
    console.error(`Error enviando correo: ${e.message}`);
    throw new Error("No se pudo enviar el correo de recuperación");
  }
};
