const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Define the upload directory path
const directoryPath = 'public/images';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });


// Get all secondChanceItems
router.get('/', async (req, res, next) => {
    logger.info('/ called');
    try {
        // Step 2: task 1 - Recupera la conexión a la base de datos desde db.js
        const db = await connectToDatabase(); // Conexión a la base de datos

        // Step 2: task 2 - Utiliza el método collection() para recuperar la colección secondChanceItems
        const collection = db.collection("secondChanceItems");

        // Step 2: task 3 - Obtén todos los secondChanceItems usando el método collection.find(). Encadena con toArray()
        const secondChanceItems = await collection.find({}).toArray();

        // Step 2: task 4 - Devuelve los secondChanceItems utilizando el método res.json()
        res.json(secondChanceItems); // Respuesta con los items obtenidos
    } catch (e) {
        // Si ocurre un error, lo registramos y lo pasamos al middleware de errores
        logger.error('Oops, something went wrong', e);
        next(e); // Delegamos el error al siguiente middleware de manejo de errores
    }
});

// Add a new item

// Endpoint: POST /api/secondchance/items
router.post('/', upload.single('file'), async (req, res, next) => {
    try {
        // Tarea 1: Recupera la conexión a la base de datos desde db.js
        const db = await connectToDatabase();

        // Tarea 2: Usa el método collection() para recuperar la colección secondChanceItems
        const collection = db.collection("secondChanceItems");

        // Tarea 3: Crea un nuevo secondChanceItem a partir del cuerpo de la solicitud
        let secondChanceItem = req.body;

        // Tarea 4: Obtén el último id, incrementa en 1 y asígnalo al nuevo secondChanceItem
        const lastItemQuery = await collection.find().sort({ id: -1 }).limit(1);
        await lastItemQuery.forEach(item => {
            secondChanceItem.id = (parseInt(item.id) + 1).toString();
        });
        // Si no hay ningún item previo, asignamos el id "1"
        if (!secondChanceItem.id) {
            secondChanceItem.id = "1";
        }

        // Tarea 5: Establece la fecha actual en el nuevo ítem
        const date_added = Math.floor(new Date().getTime() / 1000);
        secondChanceItem.date_added = date_added;

        // Tarea 7: Sube su imagen al directorio de imágenes
        // Si se envió un archivo, se guarda la ruta en el campo "image" del item
        if (req.file) {
            secondChanceItem.image = req.file.path;
        }

        // Tarea 6: Agrega el secondChanceItem a la base de datos
        const result = await collection.insertOne(secondChanceItem);

        // Responder con el item recién insertado
        res.status(201).json(result.ops[0]);
    } catch (error) {
        next(error); // Manejo de errores
    }
});

// Obtener un segundoChanceItem por ID
router.get('/:id', async (req, res, next) => {
    try {
        // Tarea 2: Acceder a la colección "secondChanceItems"
        const collection = db.collection("secondChanceItems");

        // Tarea 3: Buscar un segundoChanceItem específico por ID
        const secondChanceItem = await collection.findOne({ id: req.params.id });

        // Tarea 4: Verificar si el ítem fue encontrado y devolverlo o devolver un error
        if (!secondChanceItem) {
            return res.status(404).send("secondChanceItem not found");
        }

        // Devolver el segundoChanceItem como un objeto JSON
        res.json(secondChanceItem);
    } catch (e) {
        next(e);  // Si ocurre un error, pasa el error al manejador de errores
    }
});

// Update an existing item
router.put('/:id', async (req, res, next) => {
    try {
        // Tarea 1: Conecta a la base de datos
        const db = await connectToDatabase();
        
        // Tarea 2: Accede a la colección secondChanceItems
        const collection = db.collection("secondChanceItems");

        // Tarea 3: Verifica si el secondChanceItem existe
        const secondChanceItem = await collection.findOne({ id: req.params.id });
        if (!secondChanceItem) {
            return res.status(404).json({ error: "secondChanceItem not found" });
        }

        // Tarea 4: Actualiza los atributos específicos del ítem
        secondChanceItem.category = req.body.category;
        secondChanceItem.condition = req.body.condition;
        secondChanceItem.age_days = req.body.age_days;
        secondChanceItem.description = req.body.description;
        secondChanceItem.age_years = Number((secondChanceItem.age_days / 365).toFixed(1));
        secondChanceItem.updatedAt = new Date();

        // Realiza la actualización en la base de datos
        const updatedItem = await collection.findOneAndUpdate(
            { id: req.params.id },
            { $set: secondChanceItem },
            { returnDocument: 'after' }
        );

        // Tarea 5: Enviar confirmación
        if (updatedItem) {
            return res.status(200).json(updatedItem.value);
        } else {
            return res.status(400).json({ error: "Failed to update the item" });
        }

    } catch (e) {
        next(e);
    }
});
// Delete an existing item
router.delete('/:id', async(req, res,next) => {
    try {
        //Step 6: task 1 - insert code here
        //Step 6: task 2 - insert code here
        //Step 6: task 3 - insert code here
        //Step 6: task 4 - insert code here
    } catch (e) {
        next(e);
    }
});

module.exports = router;
