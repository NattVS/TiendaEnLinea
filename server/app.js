const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const dataFilePath = path.join(__dirname, 'items.json');

/**
 * Función: readDataFromFile
 * Descripción: Lee los datos desde un archivo JSON ubicado en el directorio especificado
 * por la constante `dataFilePath`.
 * 
 * @return {Array|Object} - Retorna los datos parseados del archivo JSON,
 * permitiendo su uso como objeto o arreglo en la aplicación.
 */
const readDataFromFile = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

/**
 * Función: writeDataToFile
 * Descripción: Escribe datos en el archivo JSON ubicado en el directorio especificado 
 * por la constante `dataFilePath`, sobrescribiendo el contenido actual.
 * 
 * @param {Array|Object} data - Datos que se escribirán en el archivo JSON.
 */
const writeDataToFile = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Inicializa los items desde el archivo
let items = readDataFromFile();

/**
 * Endpoint: GET /api/items
 * Método: GET - Obtener todos los items
 * Descripción: Este endpoint retorna todos los elementos disponibles.
 * 
 * Estructura de datos de la respuesta del endpoint GET /api/items
 * 
 * @response {Array} items - Lista de items.
 * @item {Object} item - Objeto que representa un item.
 * @item {number} item.id - Identificador único del item.
 * @item {string} item.name - Nombre del item.
 * @item {string} item.description - Descripción del item.
 */
app.get('/api/items', (req, res) => {
    res.json(items);
});

/**
 * Endpoint: POST /api/items
 * Método: POST - Crear un nuevo item
 * Descripción: Este endpoint recibe datos en el cuerpo de la solicitud y agrega un nuevo item a la lista.
 * 
 * Estructura de datos para la solicitud y respuesta del endpoint POST /api/items
 * 
 * @request {Object} newItem - Objeto que representa un nuevo item a crear.
 * @request {string} newItem.name - Nombre del nuevo item.
 * @request {string} newItem.description - Descripción del nuevo item.
 * 
 * @response {Object} response - Respuesta del servidor.
 * @response {string} response.message - Mensaje de éxito.
 * @response {Object} response.item - Objeto que representa el item creado.
 */
app.post('/api/items', (req, res) => {
    const newItem = req.body;
    items.push(newItem);
    writeDataToFile(items);
    res.status(201).json({
        message: 'Item creado exitosamente',
        item: newItem,
    });
});

/**
 * Endpoint: PUT /api/items/:id
 * Metodo: PUT - Actualizar un item existente
 * Descripción: Este endpoint actualiza los datos de un item existente según el id proporcionado.
 * 
 * Estructura de datos para la solicitud y respuesta del endpoint PUT /api/items/:id
 * 
 * @param {number} id - Identificador del item a actualizar.
 * @request {Object} updatedItem - Objeto que representa los nuevos datos del item.
 * @request {string} updatedItem.name - Nuevo nombre del item.
 * @request {string} updatedItem.description - Nueva descripción del item.
 * 
 * @response {Object} response - Respuesta del servidor.
 * @response {string} response.message - Mensaje de éxito.
 * @response {Object} response.item - Objeto que representa el item actualizado.
 */
app.put('/api/items/:id', (req, res) => {
    const { id } = req.params;
    const updatedItem = req.body;
    const itemId = parseInt(id, 10);
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
        items[itemIndex] = { id: itemId, ...updatedItem };
        writeDataToFile(items); // Guarda los cambios en el archivo
        res.json({
            message: 'Item actualizado exitosamente',
            item: items[itemIndex],
        });
    } else {
        res.status(404).json({ message: 'Item no encontrado' });
    }
});

/**
 * Endpoint: DELETE /api/items/:id
 * Metodo: DELETE - Eliminar un item
 * Descripcion: Este endpoint elimina un item de la lista según el id proporcionado.
 * 
 * Estructura de datos para la respuesta del endpoint DELETE /api/items/:id
 * 
 * @param {number} id - Identificador del item a eliminar.
 * 
 * @response {Object} response - Respuesta del servidor.
 * @response {string} response.message - Mensaje de éxito o error.
 */
app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;
    const itemId = parseInt(id, 10);
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
        items.splice(itemIndex, 1);
        writeDataToFile(items); 
        res.status(200).json({ message: 'Item eliminado exitosamente' });
    } else {
        res.status(404).json({ message: 'Item no encontrado' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});