const Visita = require("../models/visita"); 


const getVisitas = async () => {
  try {
    const visita = await Visita.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    return visita; // Solo devuelve la visita, no envía respuesta
  } catch (error) {
    console.error("Error al obtener o actualizar las visitas:", error);
    throw new Error("Error al obtener o actualizar las visitas");
  }
};

const counter = async (req, res, next) => {
try {
    const visita = await getVisitas(); 
    if (!visita) {
      console.error("No se encontró la visita.");
      return res.status(500).json({ error: "No se encontró la visita." });
    }
    console.log("Visitas antes de incrementar:", visita.count);
    visita.count++;
    console.log("Visitas después de incrementar:", visita.count);
    await visita.save();
    console.log("Contador actualizado correctamente.");
    res.status(200).json(visita); 
  } catch (error) {
    console.error("Error al incrementar el contador:", error);
    res.status(500).json({ error: "Error al incrementar el contador" });
  }
};

const getCounter = async (req, res, next) => {
  try {
    const visita = await getVisitas(); // Obtiene la visita
    res.status(200).json(visita);  // Envía la respuesta con la visita
  } catch (error) {
    console.error("Error al obtener el contador:", error);
    res.status(500).json({ error: "Error al obtener el contador" });
  }
};


module.exports = {
  counter,
  getCounter
};

