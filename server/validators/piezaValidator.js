const { body, param, query } = require('express-validator');
const Auto = require('../models/Auto');
const Pieza = require('../models/Pieza');

const piezaValidators = {
  // Validaciones para crear una pieza
  createPieza: [
    body('nombre')
      .notEmpty().withMessage('El nombre es requerido')
      .isString().withMessage('El nombre debe ser texto')
      .trim()
      .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres')
      .custom(async (nombre) => {
        const existe = await Pieza.findOne({ nombre });
        if (existe) {
          throw new Error('Esta pieza ya existe');
        }
        return true;
      }),
    
    body('descripcion')
      .notEmpty().withMessage('La descripción es requerida')
      .isString().withMessage('La descripción debe ser texto')
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres'),
    
    body('categoria')
      .notEmpty().withMessage('La categoría es requerida')
      .isIn(['motor', 'suspension', 'frenos', 'electrico', 'carroceria', 'interior', 'exterior', 'otros'])
      .withMessage('Categoría no válida'),
    
    body('marcaCompatibilidad.*')
      .optional()
      .isString().withMessage('Cada marca de compatibilidad debe ser texto'),
      
    body('modeloCompatibilidad.*')
      .optional()
      .isString().withMessage('Cada modelo de compatibilidad debe ser texto'),
      
    body('anioMin')
      .optional()
      .isInt({ min: 1900 }).withMessage('El año mínimo debe ser mayor a 1900'),
      
    body('anioMax')
      .optional()
      .isInt({ min: 1900 }).withMessage('El año máximo debe ser mayor a 1900')
      .custom((value, { req }) => {
        if (req.body.anioMin && value < req.body.anioMin) {
          throw new Error('El año máximo no puede ser menor al año mínimo');
        }
        return true;
      }),
    
    body('precio')
      .notEmpty().withMessage('El precio es requerido')
      .isFloat({ min: 0 }).withMessage('El precio no puede ser negativo'),
      
      body('imagen')
      .optional()
      .custom((value, { req }) => {
        // Validación para cuando no se usa multer (por si acaso)
        if (req.file) {
          return true;
        }
        if (typeof value !== 'string') {
          throw new Error('La imagen debe ser una URL válida o un archivo');
        }
        return true;
      }),
      
    body('stock')
      .optional()
      .isInt({ min: 0 }).withMessage('El stock no puede ser negativo'),
      
    // Validación asíncrona para autos compatibles
    body('autosCompatibles.*')
      .optional()
      .isMongoId().withMessage('ID de auto no válido')
      .custom(async (autoId) => {
        const auto = await Auto.findById(autoId);
        if (!auto) {
          throw new Error(`Auto con ID ${autoId} no existe`);
        }
        return true;
      }),
      
    body('caracteristicas.*.nombre')
      .optional()
      .isString().withMessage('El nombre de la característica debe ser texto'),
      
    body('caracteristicas.*.valor')
      .optional()
      .isString().withMessage('El valor de la característica debe ser texto')
  ],

  // Validaciones para actualizar una pieza
  updatePieza: [
    param('id')
      .isMongoId().withMessage('ID no válido'),
      
    body('nombre')
      .optional()
      .isString().withMessage('El nombre debe ser texto')
      .trim()
      .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres')
      .custom(async (nombre, { req }) => {
        const pieza = await Pieza.findOne({ nombre });
        if (pieza && pieza._id.toString() !== req.params.id) {
          throw new Error('Esta pieza ya existe');
        }
        return true;
      }),
    
    body('imagen')
    .optional()
    .custom((value, { req }) => {
      if (req.file) {
        return true;
      }
      if (typeof value !== 'string') {
        throw new Error('La imagen debe ser una URL válida o un archivo');
      }
      return true;
    }),
    
    // Validación asíncrona para actualización de autos compatibles
    body('autosCompatibles.*')
      .optional()
      .isMongoId().withMessage('ID de auto no válido')
      .custom(async (autoId) => {
        const auto = await Auto.findById(autoId);
        if (!auto) {
          throw new Error(`Auto con ID ${autoId} no existe`);
        }
        return true;
      }),
      
    // ... otras validaciones similares a createPieza pero con .optional()
  ],

  // Validaciones para consultas/filtros
  listPiezas: [
    query('nombre')
      .optional()
      .isString().trim(),
      
    query('categoria')
      .optional()
      .isIn(['motor', 'suspension', 'frenos', 'electrico', 'carroceria', 'interior', 'exterior', 'otros']),
      
    query('minPrecio')
      .optional()
      .isFloat({ min: 0 }),
      
    query('maxPrecio')
      .optional()
      .isFloat({ min: 0 }),
      
    query('enStock')
      .optional()
      .isBoolean(),
      
    query('marcaCompatibilidad')
      .optional()
      .isString(),
      
    query('modeloCompatibilidad')
      .optional()
      .isString()
  ],

  // Validaciones para búsqueda avanzada con GET
  searchPiezas: [
    query('texto')
      .optional()
      .isString().withMessage('El texto de búsqueda debe ser una cadena')
      .trim()
      .isLength({ max: 100 }).withMessage('El texto de búsqueda no puede exceder los 100 caracteres'),
    
    query('fraseExacta')
      .optional()
      .isString().withMessage('La frase exacta debe ser una cadena')
      .trim()
      .isLength({ max: 100 }).withMessage('La frase exacta no puede exceder los 100 caracteres'),
    
    query('nombre')
      .optional()
      .isString().withMessage('El nombre debe ser una cadena')
      .trim(),
    
    query('descripcion')
      .optional()
      .isString().withMessage('La descripción debe ser una cadena')
      .trim(),
    
    query('categorias')
      .optional()
      .isString().withMessage('Las categorías deben ser una cadena separada por comas')
      .custom(value => {
        const categoriasValidas = ["motor", "suspension", "frenos", "electrico", "carroceria", "interior", "exterior", "otros"];
        if (value) {
          return value.split(',').every(cat => categoriasValidas.includes(cat.trim()));
        }
        return true;
      }).withMessage('Categoría no válida'),
    
    query('marcasCompatibilidad')
      .optional()
      .isString().withMessage('Las marcas deben ser una cadena separada por comas'),
    
    query('modelosCompatibilidad')
      .optional()
      .isString().withMessage('Los modelos deben ser una cadena separada por comas'),
    
    query('minPrecio')
      .optional()
      .isFloat({ min: 0 }).withMessage('El precio mínimo no puede ser negativo')
      .custom((minPrecio, { req }) => {
        if (req.query.maxPrecio && parseFloat(minPrecio) > parseFloat(req.query.maxPrecio)) {
          throw new Error('El precio mínimo no puede ser mayor al precio máximo');
        }
        return true;
      }),
    
    query('maxPrecio')
      .optional()
      .isFloat({ min: 0 }).withMessage('El precio máximo no puede ser negativo'),
    
    query('minStock')
      .optional()
      .isInt({ min: 0 }).withMessage('El stock mínimo no puede ser negativo')
      .custom((minStock, { req }) => {
        if (req.query.maxStock && parseInt(minStock) > parseInt(req.query.maxStock)) {
          throw new Error('El stock mínimo no puede ser mayor al stock máximo');
        }
        return true;
      }),
    
    query('maxStock')
      .optional()
      .isInt({ min: 0 }).withMessage('El stock máximo no puede ser negativo'),
    
    query('minAnio')
      .optional()
      .isInt({ min: 1900 }).withMessage('El año mínimo debe ser mayor a 1900')
      .custom((minAnio, { req }) => {
        if (req.query.maxAnio && parseInt(minAnio) > parseInt(req.query.maxAnio)) {
          throw new Error('El año mínimo no puede ser mayor al año máximo');
        }
        return true;
      }),
    
    query('maxAnio')
      .optional()
      .isInt({ min: 1900 }).withMessage('El año máximo debe ser mayor a 1900'),
    
    query('caracteristicas')
      .optional()
      .isString().withMessage('Las características deben ser en formato "nombre:valor;nombre2:valor2"'),
    
    query('disponible')
      .optional()
      .isIn(['true', 'false']).withMessage('Disponible debe ser "true" o "false"'),
    
    query('sortBy')
      .optional()
      .isString().withMessage('El ordenamiento debe ser texto')
      .matches(/^-?[a-zA-Z]+(,-?[a-zA-Z]+)*$/).withMessage('Formato de ordenamiento no válido (ej: precio,-stock)'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('El límite debe ser un número entre 1 y 100')
  ],

  // Validación para operaciones con ID
  validateId: [
    param('id')
      .isMongoId().withMessage('ID no válido')
  ]
};

module.exports = piezaValidators;