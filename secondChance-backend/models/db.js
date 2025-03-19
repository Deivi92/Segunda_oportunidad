// db.js
require('dotenv').config();  // Carga las variables de entorno desde el archivo .env
const { MongoClient } = require('mongodb');  // Importa MongoClient de mongodb

let url = process.env.MONGO_URL;  // La URL de conexión de MongoDB
let dbInstance = null;  // Variable para almacenar la instancia de la base de datos
const dbName = process.env.MONGO_DB;  // Nombre de la base de datos

// Función para conectar a la base de datos
async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;  // Si ya hay una instancia conectada, la retornamos
    }

    const client = new MongoClient(url);  // Crea un nuevo cliente de MongoDB con la URL de conexión
    await client.connect();  // Realiza la conexión con la base de datos

    // Conecta a la base de datos y almacena la instancia en dbInstance
    dbInstance = client.db(dbName);  

    // Devuelve la instancia de la base de datos para que pueda ser utilizada en otros archivos
    return dbInstance;
}

// Exporta la función para usarla en otros archivos
module.exports = connectToDatabase;
