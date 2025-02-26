const { enviarReporteVisitas } = require("../config/mailer");
const Visita = require("../models/visita");
const https = require("https");

const getUbicacion = async (ip) => {
  return new Promise((resolve) => {
    if (!ip || ip === "127.0.0.1" || ip === "::1") {
      return resolve("Localhost");
    }

    console.log(`🌍 Obteniendo ubicación para IP: ${ip}`);

    const url = `http://ip-api.com/json/${ip}`;

    const req = https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const locationData = JSON.parse(data);
          if (locationData.status === "fail") {
            return resolve("Desconocida");
          }
          resolve(`${locationData.city || "Desconocida"}, ${locationData.country || "Desconocida"}`);
        } catch (error) {
          console.error("❌ Error procesando ubicación:", error);
          resolve("Desconocida");
        }
      });
    });

    req.on("error", (err) => {
      console.error("❌ Error en la solicitud de ubicación:", err);
      resolve("Desconocida");
    });

    req.setTimeout(5000, () => {
      console.error("⏳ Timeout en la solicitud de ubicación");
      req.destroy();
      resolve("Desconocida");
    });
  });
};

const incrementVisitas = async (ip) => {
  try {
    const ubicacion = await getUbicacion(ip);
    console.log(`📌 Nueva visita desde ${ubicacion}`);

    const visita = await Visita.findOneAndUpdate(
      {},
      {
        $inc: { count: 1 }, // Incrementar el contador sin sobrescribir otros campos
        $set: { timestamp: new Date(), location: ubicacion }, // Guardar la fecha y ubicación
      },
      { new: true, upsert: true }
    );

    return { visita, ubicacion };
  } catch (error) {
    console.error("❌ Error al incrementar el contador en MongoDB:", error.message, error.stack);
    throw new Error("Error al incrementar el contador");
  }
};

const counter = async (req, res) => {
  try {
    console.log("🛂 Verificando autenticación...");
    console.log("🕵️‍♂️ Headers recibidos: ", req.headers);

    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress || req.ip;
    console.log(`🌎 IP detectada: ${ip}`);

    const { visita, ubicacion } = await incrementVisitas(ip);

    try {
      await enviarReporteVisitas(ubicacion);
    } catch (error) {
      console.error("⚠️ Error al enviar el correo de reporte:", error);
    }

    res.status(200).json(visita);
  } catch (error) {
    console.error("❌ ERROR DETALLADO EN EL BACKEND:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Error al incrementar el contador" });
  }
};

const getCounter = async (req, res) => {
  try {
    const visita = await Visita.findOne({});
    res.status(200).json(visita);
  } catch (error) {
    console.error("❌ Error al obtener el contador:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Error al obtener el contador" });
  }
};

module.exports = {
  counter,
  getCounter,
};

