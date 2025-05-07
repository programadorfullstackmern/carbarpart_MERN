const Auto = require('../models/Auto');
const Pieza = require('../models/Pieza');
const fs = require('fs');
const path = require('path');

const autoController = {
  // Crear un nuevo auto con imagen
  crearAuto: async (req, res) => {
    try {
      const autoData = req.body;
      
      // Si hay archivo subido, actualizar la propiedad imagen
      if (req.file) {
        autoData.imagen = req.file.filename;
      }

      const nuevoAuto = new Auto(autoData);
      await nuevoAuto.save();

      res.status(201).json({
        success: true,
        data: nuevoAuto
      });
    } catch (error) {
      // Eliminar la imagen si hubo error
      if (req.file) {
        fs.unlinkSync(path.join(__dirname, '../public/uploads/autos', req.file.filename));
      }
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Obtener lista de autos
  listarAutos: async (req, res) => {
    console.log("------GET ('/') listarAutos------");
    try {
      // Construir filtros basados en query params
      const filtros = {};
      if (req.query.marca) filtros.marca = req.query.marca;
      if (req.query.modelo) filtros.modelo = req.query.modelo;
      if (req.query.minYear) filtros.anio = { $gte: parseInt(req.query.minYear) };
      if (req.query.maxYear) {
        filtros.anio = filtros.anio || {};
        filtros.anio.$lte = parseInt(req.query.maxYear);
      }
      if (req.query.disponible) filtros.disponible = req.query.disponible === 'true';

      const autos = await Auto.find(filtros)
        .populate('piezas', 'nombre descripcion categoria precio')
        .populate('ubicacion.ciudad ubicacion.estado');

        console.log("Autos(" + autos.length + ") => Listado(ID): " +
          autos.map(auto => (
            auto.id
          )) 
        );

      res.json({
        success: true,
        count: autos.length,
        data: autos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Obtener un auto por ID
  obtenerAuto: async (req, res) => {
    console.log("------GET ('/:id') obtenerAuto------");
    try {
      const auto = await Auto.findById(req.params.id)
        .populate('piezas', 'nombre descripcion categoria precio')

      if (!auto) {
        return res.status(404).json({
          success: false,
          error: 'Auto no encontrado'
        });
      }

      console.log("Auto Obtenido: " + "ID--" +  auto.id + " Marca--" + auto.marca + " Modelo--" + auto.modelo);

      res.json({
        success: true,
        data: auto
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Actualizar un auto con imagen
  actualizarAuto: async (req, res) => {
    try {
      const autoData = req.body;
      
      // Si hay archivo subido, actualizar la propiedad imagen
      if (req.file) {
        autoData.imagen = req.file.filename;
        
        // Eliminar la imagen anterior si existe y no es la default
        const auto = await Auto.findById(req.params.id);
        if (auto.imagen && auto.imagen !== 'no-image.jpg') {
          const oldImagePath = path.join(__dirname, '../public/uploads/autos', auto.imagen);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      const autoActualizado = await Auto.findByIdAndUpdate(
        req.params.id,
        autoData,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        data: autoActualizado
      });
    } catch (error) {
      // Eliminar la nueva imagen si hubo error
      if (req.file) {
        fs.unlinkSync(path.join(__dirname, '../public/uploads/autos', req.file.filename));
      }
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Eliminar un auto (y su imagen)
  eliminarAuto: async (req, res) => {
    try {
      const auto = await Auto.findByIdAndDelete(req.params.id);

      if (!auto) {
        return res.status(404).json({
          success: false,
          error: 'Auto no encontrado'
        });
      }

      // Eliminar la imagen asociada si existe y no es la default
      if (auto.imagen && auto.imagen !== 'no-image.jpg') {
        const imagePath = path.join(__dirname, '../public/uploads/autos', auto.imagen);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      res.json({
        success: true,
        data: {}
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Obtener piezas de un auto
  obtenerPiezasAuto: async (req, res) => {
    console.log("------GET ('/:id/piezas') obtenerPiezasAuto------");
    try {
      const auto = await Auto.findById(req.params.id).populate('piezas', 'nombre descripcion categoria precio');

      if (!auto) {
        return res.status(404).json({
          success: false,
          error: 'Auto no encontrado'
        });
      }

      console.log("Auto(ID): " +  auto.id + "   Piezas(" + auto.piezas.length + ") => Listado(ID): " +
        auto.piezas.map(pieza => (
          pieza.id
          )) 
        );

      res.json({
        success: true,
        count: auto.piezas.length,
        data: auto.piezas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Agregar pieza a un auto
  agregarPiezaAuto: async (req, res) => {
    console.log("------POST ('/:id/piezas') agregarPiezaAuto------");
    try {
      const auto = await Auto.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { piezas: req.body.piezaId } },
        { new: true }
      ).populate('piezas', 'nombre descripcion categoria precio');

      if (!auto) {
        return res.status(404).json({
          success: false,
          error: 'Auto no encontrado'
        });
      }

      console.log("Auto(ID): " +  auto.id + "   Pieza Agregada(ID): " + req.body.piezaId);

      res.json({
        success: true,
        data: auto.piezas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Eliminar pieza de un auto
  eliminarPiezaAuto: async (req, res) => {
    console.log("------DELETE ('/:id/piezas') eliminarPiezaAuto------");
    try {
      const auto = await Auto.findByIdAndUpdate(
        req.params.id,
        { $pull: { piezas: req.body.piezaId } },
        { new: true }
      ).populate('piezas', 'nombre descripcion categoria precio');

      if (!auto) {
        return res.status(404).json({
          success: false,
          error: 'Auto no encontrado'
        });
      }

      console.log("Auto(ID): " +  auto.id + "   Pieza Eliminada(ID): " + req.body.piezaId);

      res.json({
        success: true,
        data: auto.piezas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Búsqueda avanzada de autos (ahora con GET)
  buscarAutos: async (req, res) => {
    console.log("------GET ('/buscar') buscarAutos------");
    try {
      // Obtener parámetros de req.query y convertirlos a los tipos adecuados
      const {
        texto,
        fraseExacta,
        marcas,
        modelos,
        minYear,
        maxYear,
        minPrecio,
        maxPrecio,
        minKm,
        maxKm,
        colores,
        transmisiones,
        combustibles,
        opcionales,
        disponible,
        pieza,
        ciudad,
        estado,
        desdeFecha,
        hastaFecha,
        sortBy,
        limit
      } = req.query;

      // Construir el objeto de filtros
      const filtros = {};

      // Búsqueda full-text o por frase exacta
      if (texto) {
        filtros.$text = { $search: texto };
      } else if (fraseExacta) {
        const regex = new RegExp(fraseExacta.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
        filtros.$or = [
          { marca: regex },
          { modelo: regex },
          { color: regex },
          { 'ubicacion.ciudad': regex },
          { 'ubicacion.estado': regex }
        ];
      }

      // Filtros por arrays (convertir strings separados por comas a arrays)
      if (marcas) {
        filtros.marca = { $in: marcas.split(',') };
      }
      if (modelos) {
        filtros.modelo = { $in: modelos.split(',') };
      }
      if (colores) {
        filtros.color = { $in: colores.split(',') };
      }
      if (transmisiones) {
        filtros.transmision = { $in: transmisiones.split(',') };
      }
      if (combustibles) {
        filtros.combustible = { $in: combustibles.split(',') };
      }
      if (opcionales) {
        filtros.opcionales = { $all: opcionales.split(',') };
      }

      // Filtros por rangos
      if (minYear || maxYear) {
        filtros.anio = {};
        if (minYear) filtros.anio.$gte = parseInt(minYear);
        if (maxYear) filtros.anio.$lte = parseInt(maxYear);
      }
      if (minPrecio || maxPrecio) {
        filtros.precio = {};
        if (minPrecio) filtros.precio.$gte = parseFloat(minPrecio);
        if (maxPrecio) filtros.precio.$lte = parseFloat(maxPrecio);
      }
      if (minKm || maxKm) {
        filtros.kilometraje = {};
        if (minKm) filtros.kilometraje.$gte = parseInt(minKm);
        if (maxKm) filtros.kilometraje.$lte = parseInt(maxKm);
      }

      // Filtros por ubicación
      if (ciudad) filtros['ubicacion.ciudad'] = ciudad;
      if (estado) filtros['ubicacion.estado'] = estado;

      // Filtro por disponibilidad
      if (disponible) {
        filtros.disponible = disponible === 'true';
      }

      // Filtro por piezas
      if (pieza) {
        filtros.piezas = pieza;
      }

      // Filtros por fechas
      if (desdeFecha || hastaFecha) {
        filtros.createdAt = {};
        if (desdeFecha) filtros.createdAt.$gte = new Date(desdeFecha);
        if (hastaFecha) filtros.createdAt.$lte = new Date(hastaFecha);
      }

      // Opciones de consulta
      const opciones = {
        populate: 'piezas'
      };

      // Ordenamiento
      if (sortBy) {
        opciones.sort = sortBy.split(',').map(field => {
          if (field.startsWith('-')) {
            return [field.substring(1), -1];
          }
          return [field, 1];
        });
      }

      // Límite de resultados
      if (limit) {
        opciones.limit = parseInt(limit);
      }

      // Ejecutar la consulta
      let autos = await Auto.find(filtros, null, opciones);

      // Si es búsqueda full-text, ordenar por score de relevancia
      if (texto) {
        autos.sort((a, b) => (b._score || 0) - (a._score || 0));
      }

      console.log(`Búsqueda GET realizada. Filtros: ${JSON.stringify(filtros)}. Resultados: ${autos.length}`);

      res.json({
        success: true,
        count: autos.length,
        data: autos
      });
    } catch (error) {
      console.error('Error en búsqueda GET:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
};

module.exports = autoController;