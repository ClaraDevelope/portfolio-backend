const Visita = require("../models/visita"); // Asegúrate de tener la ruta correcta al modelo


const getVisitas = async () => {
  try {
    const visita = await Visita.findOne(); // Buscamos el primer documento en la colección
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


const counter = async (req, res) => {
  try {
    let visita = await getVisitas(); // Obtenemos las visitas

    console.log("Visitas antes de incrementar:", visita.count); // Muestra el contador antes de incrementar

    visita.count++; // Incrementa el contador

    console.log("Visitas después de incrementar:", visita.count); // Muestra el contador después de incrementar

    // Guardamos el contador actualizado en la base de datos
    await visita.save();

    console.log("Contador actualizado correctamente.");
    res.json(visita); // Respondemos con el contador actualizado
  } catch (error) {
    console.error("Error al incrementar el contador:", error);
    res.status(500).json({ error: "Error al incrementar el contador" });
  }
};

const getCounter = async (req, res) => {
  try {
    const visita = await getVisitas();
    res.json(visita); // Respondemos con el contador actual
  } catch (error) {
    console.error("Error al obtener el contador:", error);
    res.status(500).json({ error: "Error al obtener el contador" });
  }
};

module.exports = {
  counter,
  getCounter
};

