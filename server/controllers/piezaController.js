const Pieza = require('../models/Pieza');
const Auto = require('../models/Auto');
const fs = require('fs');
const path = require('path');

const piezaController = {
  // Crear una nueva pieza
  crearPieza: async (req, res) => {
    console.log("------POST ('/') crearPieza------");
    try {
      const piezaData = req.body;
      
      // Si hay archivo subido, actualizar la propiedad imagen
      if (req.file) {
        piezaData.imagen = req.file.filename;
      }

      const nuevaPieza = new Pieza(piezaData);
      await nuevaPieza.save();

      console.log("Pieza Creada: " + "ID--" +  nuevaPieza.id + " Nombre--" + nuevaPieza.nombre + " Descripcion--" + nuevaPieza.descripcion);

      res.status(201).json({
        success: true,
        data: nuevaPieza
      });
    } catch (error) {
      // Eliminar la imagen si hubo error
      if (req.file) {
        fs.unlinkSync(path.join(__dirname, '../public/uploads/piezas', req.file.filename));
      }
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Obtener lista de piezas
  listarPiezas: async (req, res) => {
    console.log("------GET ('/') listarPiezas------");
    try {
      // Construir filtros
      const filtros = {};
      if (req.query.nombre) filtros.nombre = new RegExp(req.query.nombre, 'i');
      if (req.query.categoria) filtros.categoria = req.query.categoria;
      if (req.query.minPrecio) filtros.precio = { $gte: parseFloat(req.query.minPrecio) };
      if (req.query.maxPrecio) {
        filtros.precio = filtros.precio || {};
        filtros.precio.$lte = parseFloat(req.query.maxPrecio);
      }
      if (req.query.enStock === 'true') filtros.stock = { $gt: 0 };

      const piezas = await Pieza.find(filtros)
      .populate('autosCompatibles', 'marca modelo año precio');

      console.log("Piezas(" + piezas.length + ") => Listado(ID): " +
          piezas.map(pieza => (
            pieza.id
          )) 
        );

      res.json({
        success: true,
        count: piezas.length,
        data: piezas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Obtener una pieza por ID
  obtenerPieza: async (req, res) => {
    console.log("------GET ('/:id') obtenerPieza------");
    try {
      const pieza = await Pieza.findById(req.params.id)
        .populate('autosCompatibles', 'marca modelo año precio');

      if (!pieza) {
        return res.status(404).json({
          success: false,
          error: 'Pieza no encontrada'
        });
      }

      console.log("Pieza Obtenida: " + "ID--" +  pieza.id + " Nombre--" + pieza.nombre + " Descripcion--" + pieza.descripcion);

      res.json({
        success: true,
        data: pieza
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Actualizar una pieza
  actualizarPieza: async (req, res) => {
    console.log("------PUT ('/:id') actualizarPieza------");
    try {
      const piezaData = req.body;
            
            // Si hay archivo subido, actualizar la propiedad imagen
            if (req.file) {
              piezaData.imagen = req.file.filename;
              
              // Eliminar la imagen anterior si existe y no es la default
              const pieza = await Pieza.findById(req.params.id);
              if (pieza.imagen && pieza.imagen !== 'no-image.jpg') {
                const oldImagePath = path.join(__dirname, '../public/uploads/piezas', pieza.imagen);
                if (fs.existsSync(oldImagePath)) {
                  fs.unlinkSync(oldImagePath);
                }
              }
            }

      const piezaActualizada = await Pieza.findByIdAndUpdate(
        req.params.id,
        piezaData,
        { new: true, runValidators: true }
      );

      if (!piezaActualizada) {
        return res.status(404).json({
          success: false,
          error: 'Pieza no encontrada'
        });
      }

      console.log("Pieza Actualizada: " + "ID--" +  piezaActualizada.id);

      res.json({
        success: true,
        data: piezaActualizada
      });
    } catch (error) {
      // Eliminar la nueva imagen si hubo error
      if (req.file) {
        fs.unlinkSync(path.join(__dirname, '../public/uploads/piezas', req.file.filename));
      }
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Eliminar una pieza
  eliminarPieza: async (req, res) => {
    console.log("------DELETE ('/:id') eliminarPieza------");
    try {
      // Primero, quitar esta pieza de todos los autos que la referencian
      await Auto.updateMany(
        { piezas: req.params.id },
        { $pull: { piezas: req.params.id } }
      );

      // Luego eliminar la pieza
      const pieza = await Pieza.findByIdAndDelete(req.params.id);

      if (!pieza) {
        return res.status(404).json({
          success: false,
          error: 'Pieza no encontrada'
        });
      }

      // Eliminar la imagen asociada si existe y no es la default
      if (pieza.imagen && pieza.imagen !== 'no-image.jpg') {
        const imagePath = path.join(__dirname, '../public/uploads/piezas', pieza.imagen);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      console.log("Pieza Eliminada: " + "ID--" +  pieza.id);

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

  // Obtener autos compatibles con una pieza
  obtenerAutosCompatibles: async (req, res) => {
    console.log("------GET ('/:id/autos-compatibles') obtenerAutoscompatibles------");
    try {
      const pieza = await Pieza.findById(req.params.id)
        .populate('autosCompatibles', 'marca modelo año precio');

      if (!pieza) {
        return res.status(404).json({
          success: false,
          error: 'Pieza no encontrada'
        });
      }

      console.log("Pieza(ID): " +  pieza.id + "   AutosCompatibles(" + pieza.autosCompatibles.length + ") => Listado(ID): " +
        pieza.autosCompatibles.map(auto => (
          auto.id
          )) 
        );

      res.json({
        success: true,
        count: pieza.autosCompatibles.length,
        data: pieza.autosCompatibles
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Agregar auto compatible a una pieza
  agregarAutoCompatible: async (req, res) => {
    console.log("------POST ('/:id/autos-compatibles') agregarAutocompatible------");
    try {
      const pieza = await Pieza.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { autosCompatibles: req.body.autoId } },
        { new: true }
      ).populate('autosCompatibles', 'marca modelo año precio');

      if (!pieza) {
        return res.status(404).json({
          success: false,
          error: 'Pieza no encontrada'
        });
      }

      console.log("Pieza(ID): " +  pieza.id + "   Auto Agregado(ID): " + req.body.autoId);

      res.json({
        success: true,
        data: pieza.autosCompatibles
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Eliminar auto compatible de una pieza
  eliminarAutoCompatible: async (req, res) => {
    console.log("------DELETE ('/:id/autos-compatibles') eliminarAutocompatible------");
    try {
      const pieza = await Pieza.findByIdAndUpdate(
        req.params.id,
        { $pull: { autosCompatibles: req.body.autoId } },
        { new: true }
      ).populate('autosCompatibles', 'marca modelo año precio');

      if (!pieza) {
        return res.status(404).json({
          success: false,
          error: 'Pieza no encontrada'
        });
      }

      console.log("Pieza(ID): " +  pieza.id + "   AutoCompatible Eliminado(ID): " + req.body.autoId);

      res.json({
        success: true,
        data: pieza.autosCompatibles
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Búsqueda avanzada de piezas (GET)
  buscarPiezas: async (req, res) => {
    console.log("------GET ('/piezas/buscar') busquedaAvanzada------");
    try {
      // Obtener parámetros de req.query y convertirlos
      const {
        texto,
        fraseExacta,
        nombre,
        descripcion,
        categorias,
        marcasCompatibilidad,
        modelosCompatibilidad,
        minPrecio,
        maxPrecio,
        minStock,
        maxStock,
        minAnio,
        maxAnio,
        caracteristicas,
        disponible,
        auto,
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
          { nombre: regex },
          { descripcion: regex },
          { 'caracteristicas.nombre': regex },
          { 'caracteristicas.valor': regex }
        ];
      }

      // Filtros por texto en campos específicos
      if (nombre) {
        filtros.nombre = new RegExp(nombre, 'i');
      }
      if (descripcion) {
        filtros.descripcion = new RegExp(descripcion, 'i');
      }

      // Filtros por arrays (convertir strings separados por comas a arrays)
      if (categorias) {
        filtros.categoria = { $in: categorias.split(',') };
      }
      if (marcasCompatibilidad) {
        filtros.marcaCompatibilidad = { $in: marcasCompatibilidad.split(',') };
      }
      if (modelosCompatibilidad) {
        filtros.modeloCompatibilidad = { $in: modelosCompatibilidad.split(',') };
      }

      // Filtros por rangos
      if (minPrecio || maxPrecio) {
        filtros.precio = {};
        if (minPrecio) filtros.precio.$gte = parseFloat(minPrecio);
        if (maxPrecio) filtros.precio.$lte = parseFloat(maxPrecio);
      }
      if (minStock || maxStock) {
        filtros.stock = {};
        if (minStock) filtros.stock.$gte = parseInt(minStock);
        if (maxStock) filtros.stock.$lte = parseInt(maxStock);
      }
      if (minAnio || maxAnio) {
        filtros.$and = [];
        if (minAnio) filtros.$and.push({ $or: [{ anioMin: { $gte: parseInt(minAnio) } }, { anioMin: null }] });
        if (maxAnio) filtros.$and.push({ $or: [{ anioMax: { $lte: parseInt(maxAnio) } }, { anioMax: null }] });
        if (filtros.$and.length === 0) delete filtros.$and;
      }

      // Filtro por disponibilidad (stock > 0)
      if (disponible === 'true') {
        filtros.stock = { $gt: 0 };
      } else if (disponible === 'false') {
        filtros.stock = 0;
      }

      // Filtro por autos
      if (auto) {
        filtros.autosCompatibles = auto;
      }

      // Filtro por características
      if (caracteristicas) {
        const caracteristicasArray = caracteristicas.split(';').map(c => {
          const [nombre, valor] = c.split(':');
          return { nombre, valor };
        });
        
        filtros.$and = filtros.$and || [];
        caracteristicasArray.forEach(c => {
          filtros.$and.push({
            caracteristicas: {
              $elemMatch: {
                nombre: new RegExp(c.nombre, 'i'),
                valor: new RegExp(c.valor, 'i')
              }
            }
          });
        });
      }

      // Opciones de consulta
      const opciones = {
        populate: 'autosCompatibles'
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
      let piezas = await Pieza.find(filtros, null, opciones);

      // Si es búsqueda full-text, ordenar por score de relevancia
      if (texto) {
        piezas.sort((a, b) => (b._score || 0) - (a._score || 0));
      }

      console.log(`Búsqueda GET realizada. Filtros: ${JSON.stringify(filtros)}. Resultados: ${piezas.length}`);

      res.json({
        success: true,
        count: piezas.length,
        data: piezas
      });
    } catch (error) {
      console.error('Error en búsqueda GET de piezas:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

};

module.exports = piezaController;