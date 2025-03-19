/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');
const path = require('path');

const connectToDatabase = require('./models/db');
const {loadData} = require("./util/import-mongo/index");

const app = express();
app.use("*",cors());
const port = 3060;

// Conectar a MongoDB; solo hacemos esto una vez
connectToDatabase().then(() => {
    pinoLogger.info('Conectado a la DB');
})
    .catch((e) => console.error('Error al conectar a la DB', e));


app.use(express.json());

// Archivos de rutas
const secondChanceRoutes = require('./routes/secondChanceItemsRoutes');
const searchRoutes = require('./routes/searchRoutes');
const pinoHttp = require('pino-http');
const logger = require('./logger');
const authRoutes = require('./routes/authRoutes');

app.use(pinoHttp({ logger }));
app.use(express.static(path.join(__dirname, 'public')));

// Usar Rutas
app.use('/api/secondchance/items', secondChanceRoutes);
app.use('/api/secondchance/search', searchRoutes);
app.use('/api/auth', authRoutes);

// Manejador de Errores Global
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Error Interno del Servidor');
});

app.get("/",(req,res)=>{
    res.send("Dentro del servidor")
})

app.listen(port, () => {
    console.log(`Servidor en ejecución en el puerto ${port}`);
});
