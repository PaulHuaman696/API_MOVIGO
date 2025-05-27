require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const vehicleRoutes = require("./src/routes/vehicles");
const ratingRoutes = require("./src/routes/ratings");
const userRoutes = require("./src/routes/users");
const tripRoutes = require("./src/routes/trips");
const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(express.json());

// Rutas base
app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.use("/api/vehicles", vehicleRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);

app.listen(PORT, () => {
  console.log(`Servidor arrancado en puerto ${PORT}`);
});
