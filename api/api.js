const { enviarReporteVisitas } = require("../config/mailer");
const Visita = require("../models/visita");
const axios = require("axios");

const getUbicacion = async (ip) => {
  try {
    if (ip === "127.0.0.1" || ip === "::1") {
      return "Localhost"; // Si la IP es local
    }
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return `${response.data.city}, ${response.data.country}`;
  } catch (error) {
    console.error("Error obteniendo ubicación:", error);
    return "Desconocida";
  }
};

const incrementVisitas = async (ip) => {
  try {
    const ubicacion = await getUbicacion(ip);
    const visita = await Visita.findOneAndUpdate(
      {},
      { $inc: { count: 1 }, timestamp: new Date(), location: ubicacion },
      { new: true, upsert: true }
    );
    return { visita, ubicacion };
  } catch (error) {
    console.error("Error al incrementar el contador:", error);
    throw new Error("Error al incrementar el contador");
  }
};

const counter = async (req, res, next) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const { visita, ubicacion } = await incrementVisitas(ip);
    console.log(`📌 Nueva visita desde ${ubicacion}`);
    
    await enviarReporteVisitas(ubicacion); // Enviamos el email con la ubicación

    res.status(200).json(visita);
  } catch (error) {
    console.error("Error al incrementar el contador:", error);
    res.status(500).json({ error: "Error al incrementar el contador" });
  }
};

const getCounter = async (req, res, next) => {
  try {
    const visita = await Visita.findOne({});
    res.status(200).json(visita);
  } catch (error) {
    console.error("Error al obtener el contador:", error);
    res.status(500).json({ error: "Error al obtener el contador" });
  }
};

module.exports = {
  counter,
  getCounter
};
