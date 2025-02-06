const nodemailer = require("nodemailer");
const fs = require("fs");
const cron = require("node-cron");
require("dotenv").config();


const transporter = nodemailer.createTransport({
  service: "gmail",  // Usando Gmail como servicio de correo
  auth: {
    user: process.env.EMAIL_USER,  // Correo de Gmail
    pass: process.env.EMAIL_PASS   // Contraseña o App Password de Gmail
  }
});

// Función para enviar el reporte de visitas
const enviarReporteVisitas = () => {
  const visitas = getVisitas();
  const mailOptions = {
    from: process.env.EMAIL_USER,          // Remitente
    to: process.env.EMAIL_DESTINO,         // Destinatario
    subject: "📊 Informe Diario de Visitas",  // Asunto del correo
    text: `El número de visitas es: ${visitas.count}` // Cuerpo del correo
  };

  // Enviar el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error al enviar el correo: ", error);
    } else {
      console.log("Correo enviado: " + info.response);
    }
  });
};

function getVisitas() {
  const VISITAS_FILE = "visitas.json";
  if (!fs.existsSync(VISITAS_FILE)) return { count: 0 };
  return JSON.parse(fs.readFileSync(VISITAS_FILE, "utf8"));
}

function programarEnvio() {
  setInterval(() => {
    console.log("⏰ Enviando informe diario de visitas...");
    enviarReporteVisitas(); 
  }, 24 * 60 * 60 * 1000);  
  console.log("📧 Tarea programada: Envío diario de visitas activado.");
}

module.exports = { enviarReporteVisitas, programarEnvio };
