const nodemailer = require("nodemailer");
const Visita = require("../models/visita");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  secure: true,
  pool: true, // ⬅️ Mantiene la conexión activa
  maxConnections: 1,
  maxMessages: 5, // ⬅️ Enviar 5 emails por conexión
  rateLimit: true // ⬅️ Evita bloqueos por enviar rápido
});



const getVisitas = async () => {
  try {
    const visita = await Visita.findOne().sort({ timestamp: -1 });
    if (!visita) {
      const newVisita = new Visita({ count: 0 });
      await newVisita.save();
      return newVisita;
    }
    return visita;
  } catch (error) {
    console.error("❌ Error al obtener las visitas:", error);
    return { count: 0, timestamp: new Date(), location: "Desconocida" };
  }
};

const enviarReporteVisitas = async (ubicacion) => {
  try {
    console.log("📧 Intentando enviar email...");
    
    const visita = await getVisitas();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_DESTINO,
      subject: "📊 Nueva visita a tu Portfolio!!",
      text: `🔥 ¡Nueva visita desde ${ubicacion}! 🔥\n👀 Total visitas: ${visita.count}`
    };

    // ⬇️ Espera 1 segundo antes de enviar para evitar bloqueos
    setTimeout(() => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("❌ Error al enviar el correo:", error);
        } else {
          console.log(`✅ Correo enviado con éxito: ${info.response}`);
        }
      });
    }, 1000); 
  } catch (error) {
    console.error("❌ Error en `enviarReporteVisitas()`:", error);
  }
};



module.exports = { enviarReporteVisitas };


