const nodemailer = require("nodemailer");
const Visita = require("../models/visita"); // Asegúrate de que la ruta al modelo sea correcta
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",  // Usando Gmail como servicio de correo
  auth: {
    user: process.env.EMAIL_USER,  // Correo de Gmail
    pass: process.env.EMAIL_PASS   // Contraseña o App Password de Gmail
  }
});

// Función para obtener el contador de visitas desde MongoDB
const getVisitas = async () => {
  try {
    const visita = await Visita.findOne();  // Buscamos el primer documento
    if (!visita) {
      // Si no existe, creamos un nuevo documento
      const newVisita = new Visita({ count: 0 });
      await newVisita.save();
      return newVisita;
    }
    return visita;  // Devolvemos el contador de visitas
  } catch (error) {
    console.error("Error al obtener las visitas:", error);
    return { count: 0 };  // En caso de error, devolvemos un contador por defecto
  }
};

// Función para enviar el reporte de visitas
const enviarReporteVisitas = async () => {
  try {
    const visitas = await getVisitas(); // Obtenemos las visitas desde la base de datos
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
  } catch (error) {
    console.error("Error al enviar el reporte de visitas:", error);
  }
};

// Función para programar el envío diario del informe
function programarEnvio() {
  setInterval(() => {
    console.log("⏰ Enviando informe diario de visitas...");
    enviarReporteVisitas(); 
  }, 24 * 60 * 60 * 1000);  // Enviar cada 24 horas
  console.log("📧 Tarea programada: Envío diario de visitas activado.");
}

module.exports = { enviarReporteVisitas, programarEnvio };
