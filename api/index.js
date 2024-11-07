const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

// Configuración y variables
const port = process.env.PORT || 3000;
const liveImagePath = path.join(__dirname, 'last-image.jpg');

// Configurar body-parser para recibir datos binarios en el punto de transmisión
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '10mb' }));

// 1. Verificación: Página simple para confirmar que el servidor está activo
app.get('/', (req, res) => {
  res.send('<h1>Servidor L Cam está funcionando</h1>');
});

// 2. Punto de acceso para transmisión en tiempo real desde la L Cam
app.post('/live-stream', (req, res) => {
  // Guardar los datos recibidos como la última imagen
  fs.writeFileSync(liveImagePath, req.body); // Guardar la imagen en el servidor
  console.log('Imagen de transmisión en vivo recibida');
  res.status(200).send('Imagen recibida');
});

// 3. Punto de acceso para obtener la transmisión en vivo
app.get('/live-stream', (req, res) => {
  // Verificar si existe una imagen de transmisión
  if (fs.existsSync(liveImagePath)) {
    res.sendFile(liveImagePath); // Enviar la imagen guardada a la app
  } else {
    res.status(404).send('No hay transmisión disponible');
  }
});

// Inicializar el servidor
app.listen(port, () => {
  console.log(`Servidor L Cam escuchando en el puerto ${port}`);
});
