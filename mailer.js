require("dotenv").config();
const fs = require("fs");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

function obtenerVisitas() {
  try {
    const data = fs.readFileSync("visitas.json", "utf8");
    const visitas = JSON.parse(data);
    return visitas.count || 0;
  } catch (error) {
    console.error("Error leyendo el archivo de visitas:", error);
    return 0;
  }
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function enviarReporteVisitas() {
  const totalVisitas = obtenerVisitas();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_DESTINO,
    subject: "📊 Informe diario de visitas al portfolio",
    text: `El portfolio ha recibido ${totalVisitas} visitas hasta ahora.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar el email:", error);
    } else {
      console.log("Email enviado:", info.response);
    }
  });
}
function programarEnvio() {
  cron.schedule("0 9 * * *", () => {
    console.log("⏰ Enviando informe diario de visitas...");
    enviarReporteVisitas();
  });
  console.log("📧 Tarea programada: Envío diario de visitas activado.");
}

module.exports = { programarEnvio, enviarReporteVisitas };
