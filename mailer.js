require("dotenv").config();
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const Visita = require("./models/visita");

const obtenerVisitas = async () => {
  try {
    console.time("Visitas Query");
    const visita = await Visita.findOne(); // Buscamos el primer documento en la colección
    console.timeEnd("Visitas Query");

    if (!visita) {
      // Si no encontramos ningún documento, creamos uno nuevo
      const newVisita = new Visita({ count: 0 });
      await newVisita.save();
      return newVisita;
    }
    return visita;
  } catch (error) {
    console.error("Error al obtener las visitas:", error);
    throw new Error("Error al obtener las visitas");
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function enviarReporteVisitas() {
  try {
    const visita = await obtenerVisitas();  // Esperamos a obtener la visita
    const totalVisitas = visita.count;  // Obtenemos el contador de visitas

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
  } catch (error) {
    console.error("Error al obtener las visitas para el correo:", error);
  }
}

function programarEnvio() {
  cron.schedule("0 9 * * *", () => {
    console.log("⏰ Enviando informe diario de visitas...");
    enviarReporteVisitas();
  });
  console.log("📧 Tarea programada: Envío diario de visitas activado.");
}

module.exports = { programarEnvio, enviarReporteVisitas };
