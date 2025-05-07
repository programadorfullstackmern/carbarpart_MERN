//-------------------------------------------------------Importaciones de paquetes, frameworks, etc--------------------------------------------------
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
//-------------------------------------------------------Importaciones de paquetes, frameworks, etc--------------------------------------------------


// -----------------------------------------------Conexión a la base de datos---------------------------------------------------------------------
const connectDB = require('./config/db');
connectDB();
// -------------------------------------------------Conexión a la base de datos---------------------------------------------------------------------


// -----------------------------------------------------Middlewares básicos---------------------------------------------------------------------------
app.use(cors());
app.use(express.json());
// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
// --------------------------------------------------------Middlewares básicos---------------------------------------------------------------------------

// --------------------------------------------------------Importar rutas-------------------------------------------------------------------------------
const autoRoutes = require('./routes/autoRoutes');
const piezaRoutes = require('./routes/piezaRoutes');
// -------------------------------------------------------Importar rutas-------------------------------------------------------------------------------


// ---------------------------------------------------------Rutas principales----------------------------------------------------------------
app.get('/api', (req, res) => {
  console.log("*******GET ('/api') Ruta Principal*******");
  res.json({
    message: 'API de CarBar & Parts',
    endpoints: {
      autos: {
        listar: 'GET /api/autos',
        crear: 'POST /api/autos',
        obtener: 'GET /api/autos/:id',
        actualizar: 'PUT /api/autos/:id',
        eliminar: 'DELETE /api/autos/:id',
        obtenerPiezas: 'GET /api/autos/:id/piezas',
        agregarPiezas: 'POST /api/autos/:id/piezas',
        eliminarPiezas: 'DELETE /api/autos/:id/piezas',
        buscarFullText_marca_modelo_color: 'GET /api/autos/buscar?texto=query',
        buscarFraseExacta_marca_modelo_color: 'GET /api/autos/buscar?fraseExacta=query',
        buscarArraysSeparadosPorComas_marcas_modelos_colores_transmisiones_combustibles: 'GET /api/autos/buscar?marcas=marca1,marca2',
        buscarRangos_Year_Precio_Km: 'GET /api/autos/buscar?minYear=2015&maxYear=2020',
        buscarDisponibilidad: 'GET /api/autos/buscar?disponible=true',
        buscarPorPiezas: 'GET /api/autos/buscar?pieza=piezaId'
      },
      piezas: {
        listar: 'GET /api/piezas',
        crear: 'POST /api/piezas',
        obtener: 'GET /api/piezas/:id',
        actualizar: 'PUT /api/piezas/:id',
        eliminar: 'DELETE /api/piezas/:id',
        obtenerAutosCompatibles: 'GET /api/piezas/:id/autos-compatibles',
        agregarAutosCompatibles: 'POST /api/piezas/:id/autos-compatibles',
        eliminarAutosCompatibles: 'DELETE /api/piezas/:id/autos-compatibles',
        buscarFullText_nombre_descripcion: 'GET /api/piezas/buscar?texto=query',
        buscarFraseExacta_nombre_descripcion: 'GET /api/piezas/buscar?fraseExacta=query',
        buscarArraysSeparadosPorComas_categorias_marcasCompatibilidad_modelosCompatibilidad: 'GET /api/piezas/buscar?categorias=categoria1,categoria2',
        buscarRangos_Precio_Stock_Anio: 'GET /api/piezas/buscar?minPrecio=50&maxPrecio=120',
        buscarDisponibilidad: 'GET /api/piezas/buscar?disponible=true',
        buscarPorAutos: 'GET /api/piezas/buscar?auto=autoId'
      }
    }
  });
});
// ------------------------------------------------------------------Rutas principales----------------------------------------------------------------

// ----------------------------------------------------------------Usar rutas de la API----------------------------------------------------------
app.use('/api/autos', autoRoutes);
app.use('/api/piezas', piezaRoutes);
// ----------------------------------------------------------------Usar rutas de la API---------------------------------------------------------------


// ------------------------------------------------------Manejo de rutas no encontradas (404)----------------------------------------------------------
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado'
  });
});
// ------------------------------------------------------Manejo de rutas no encontradas (404)----------------------------------------------------------


// ------------------------------------------------Middleware de manejo de errores (debe ir después de las rutas)-------------------------------------------
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);
// ------------------------------------------------Middleware de manejo de errores (debe ir después de las rutas)-------------------------------------------


//--------------------------------------------------Inicio del servidor---------------------------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
});
//--------------------------------------------------Inicio del servidor---------------------------------------------------------------------
