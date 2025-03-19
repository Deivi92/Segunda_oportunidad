const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
require('dotenv').config();

// Buscar regalos
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(process.env.MONGO_COLLECTION);
        // Inicializar el objeto de consulta
        let query = {};

        // Agregar el filtro de nombre a la consulta si el parámetro de nombre no está vacío
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name, $options: "i" }; // Usando regex para coincidencia parcial, sin distinción de mayúsculas
        }

        // Agregar otros filtros a la consulta
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.condition) {
            query.condition = req.query.condition;
        }
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) };
        }

        const gifts = await collection.find(query).toArray();
        res.json(gifts);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
