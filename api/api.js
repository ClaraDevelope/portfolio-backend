const { enviarReporteVisitas } = require("../config/mailer");
const Visita = require("../models/visita");
const https = require("https");

const getUbicacion = async (ip) => {
  return new Promise((resolve) => {
    if (!ip || ip === "127.0.0.1" || ip === "::1") {
      return resolve("Localhost");
    }

    console.log(`🌍 Obteniendo ubicación para IP: ${ip}`);

    const url = `https://ip-api.com/json/${ip}`; 

    https.get(url, (res) => {
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
          resolve(`${locationData.city}, ${locationData.country}`);
        } catch (error) {
          console.error("❌ Error procesando ubicación:", error);
          resolve("Desconocida");
        }
      });
    }).on("error", (err) => {
      console.error("❌ Error en la solicitud de ubicación:", err);
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
      { $inc: { count: 1 }, timestamp: new Date(), location: ubicacion },
      { new: true, upsert: true }
    );

    return { visita, ubicacion };
  } catch (error) {
    console.error("❌ Error al incrementar el contador:", error);
    throw new Error("Error al incrementar el contador");
  }
};

const counter = async (req, res) => {
  try {
    console.log("🛂 Verificando autenticación...");
    console.log("🕵️‍♂️ Headers recibidos: ", req.headers);

    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
    
    // 🔥 Si `x-forwarded-for` es un array, tomamos la primera IP 🔥
    if (ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    const { visita, ubicacion } = await incrementVisitas(ip);

    await enviarReporteVisitas(ubicacion);
    res.status(200).json(visita);
  } catch (error) {
    console.error("❌ Error al incrementar el contador:", error);
    res.status(500).json({ error: "Error al incrementar el contador" });
  }
};

const getCounter = async (req, res) => {
  try {
    const visita = await Visita.findOne({});
    res.status(200).json(visita);
  } catch (error) {
    console.error("❌ Error al obtener el contador:", error);
    res.status(500).json({ error: "Error al obtener el contador" });
  }
};

module.exports = {
  counter,
  getCounter
};


