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
});

// Función para obtener el contador de visitas desde MongoDB
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
    console.error("Error al obtener las visitas:", error);
    return { count: 0, timestamp: new Date(), location: "Desconocida" };
  }
};

// Función para enviar el correo con la visita registrada
const enviarReporteVisitas = async (ubicacion) => {
  try {
    const visita = await getVisitas();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_DESTINO, 
      subject: "📊 Nueva visita a tu Portfolio!!",
      text: `El número de visitas es: ${visita.count}
      📅 Fecha y hora: ${new Date().toLocaleString()}
      📍 Ubicación: ${ubicacion}`
    };

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

module.exports = { enviarReporteVisitas };
