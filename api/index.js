// Importar módulos necesarios
const express = require('express');
const multer = require('multer');

// Inicializar Express y configurar Multer para almacenamiento en memoria
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Variable para almacenar el último frame recibido
let latestFrame = null;

// Endpoint de prueba
app.get('/', (req, res) => {
  res.send('Servidor L-Cam en funcionamiento');
});

// Endpoint para recibir el stream de la ESP32-CAM
app.post('/live-stream', upload.single('file'), (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      console.error('No se recibió un archivo o el archivo está vacío.');
      return res.status(400).send('No se recibió un archivo.');
    }

    // Guardar el frame recibido en la variable latestFrame
    latestFrame = req.file.buffer;

    console.log('Frame recibido correctamente.');
    res.status(200).send('Frame recibido exitosamente.');
  } catch (error) {
    console.error('Error procesando el archivo:', error);
    res.status(500).send('Error interno del servidor.');
  }
});

// Endpoint para obtener el último frame desde la app
app.get('/last-image', (req, res) => {
  if (!latestFrame) {
    return res.status(404).send('No hay transmisión disponible.');
  }

  res.writeHead(200, {
    'Content-Type': 'image/jpeg',
    'Content-Length': latestFrame.length,
  });
  res.end(latestFrame);
});

// Configurar el puerto y escuchar
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
