require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { programarEnvio, enviarReporteVisitas } = require("./mailer");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
const VISITAS_FILE = "visitas.json";

app.use(express.json());

app.get("/api/v1/contador", (req, res) => {
    let visitas = getVisitas();
    visitas.count++;
    fs.writeFileSync(VISITAS_FILE, JSON.stringify(visitas));
    res.json(visitas);
});

app.get("/api/v1/contador/get", (req, res) => {
    res.json(getVisitas());
});
app.use("*", (req, res) => {
    return res.status(404).json({ message: "Ruta no encontrada" });
});

function getVisitas() {
    if (!fs.existsSync(VISITAS_FILE)) return { count: 0 };
    return JSON.parse(fs.readFileSync(VISITAS_FILE, "utf8"));
}

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    programarEnvio(); 
});
