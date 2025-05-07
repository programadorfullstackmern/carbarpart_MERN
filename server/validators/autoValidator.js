const { body, param, query } = require('express-validator');
const Pieza = require('../models/Pieza');

const autoValidators = {
  // Validaciones para crear un auto
  createAuto: [
    body('marca')
      .notEmpty().withMessage('La marca es requerida')
      .isString().withMessage('La marca debe ser texto')
      .trim()
      .isLength({ max: 50 }).withMessage('La marca no puede exceder los 50 caracteres'),
    
    body('modelo')
      .notEmpty().withMessage('El modelo es requerido')
      .isString().withMessage('El modelo debe ser texto')
      .trim()
      .isLength({ max: 50 }).withMessage('El modelo no puede exceder los 50 caracteres'),
    
    body('anio')
      .notEmpty().withMessage('El año es requerido')
      .isInt({ min: 1900 }).withMessage('El año debe ser mayor a 1900')
      .isInt({ max: new Date().getFullYear() + 1 }).withMessage(`El año no puede ser mayor a ${new Date().getFullYear() + 1}`),
    
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
      
    body('kilometraje')
      .optional()
      .isInt({ min: 0 }).withMessage('El kilometraje no puede ser negativo'),
      
    body('color')
      .optional()
      .isString().withMessage('El color debe ser texto'),
      
    body('transmision')
      .optional()
      .isIn(['manual', 'automatica', 'semi-automatica']).withMessage('Transmisión no válida'),
      
    body('combustible')
      .optional()
      .isIn(['gasolina', 'diesel', 'electrico', 'hibrido']).withMessage('Combustible no válido'),
      
    body('caracteristicas.*.nombre')
      .optional()
      .isString().withMessage('El nombre de la característica debe ser texto'),
      
    body('caracteristicas.*.valor')
      .optional()
      .isString().withMessage('El valor de la característica debe ser texto'),
      
    body('opcionales.*')
      .optional()
      .isString().withMessage('Cada opcional debe ser texto'),
      
    body('disponible')
      .optional()
      .isBoolean().withMessage('Disponible debe ser verdadero o falso'),
      
    body('ubicacion.ciudad')
      .optional()
      .isString().withMessage('La ciudad debe ser texto'),
      
    body('ubicacion.estado')
      .optional()
      .isString().withMessage('El estado debe ser texto'),
      
    // Validación asíncrona para piezas
    body('piezas.*')
      .optional()
      .isMongoId().withMessage('ID de pieza no válido')
      .custom(async (piezaId) => {
        const pieza = await Pieza.findById(piezaId);
        if (!pieza) {
          throw new Error(`Pieza con ID ${piezaId} no existe`);
        }
        return true;
      })
  ],

  // Validaciones para actualizar un auto
  updateAuto: [
    param('id')
      .isMongoId().withMessage('ID no válido'),
      
    body('marca')
      .optional()
      .isString().withMessage('La marca debe ser texto')
      .trim()
      .isLength({ max: 50 }).withMessage('La marca no puede exceder los 50 caracteres'),
    
    body('modelo')
      .optional()
      .isString().withMessage('El modelo debe ser texto')
      .trim()
      .isLength({ max: 50 }).withMessage('El modelo no puede exceder los 50 caracteres'),
    
    body('anio')
      .optional()
      .isInt({ min: 1900 }).withMessage('El año debe ser mayor a 1900')
      .isInt({ max: new Date().getFullYear() + 1 }).withMessage(`El año no puede ser mayor a ${new Date().getFullYear() + 1}`),
    
    body('precio')
      .optional()
      .isFloat({ min: 0 }).withMessage('El precio no puede ser negativo'),

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
      
    // Validación asíncrona para actualización de piezas  
    body('piezas.*')
      .optional()
      .isMongoId().withMessage('ID de pieza no válido')
      .custom(async (piezaId) => {
        const pieza = await Pieza.findById(piezaId);
        if (!pieza) {
          throw new Error(`Pieza con ID ${piezaId} no existe`);
        }
        return true;
      })
  ],

  // Validaciones para consultas/filtros
  listAutos: [
    query('marca')
      .optional()
      .isString().trim(),
      
    query('modelo')
      .optional()
      .isString().trim(),
      
    query('minYear')
      .optional()
      .isInt({ min: 1900 }),
      
    query('maxYear')
      .optional()
      .isInt({ max: new Date().getFullYear() + 1 }),
      
    query('minPrecio')
      .optional()
      .isFloat({ min: 0 }),
      
    query('maxPrecio')
      .optional()
      .isFloat({ min: 0 }),
      
    query('transmision')
      .optional()
      .isIn(['manual', 'automatica', 'semi-automatica']),
      
    query('combustible')
      .optional()
      .isIn(['gasolina', 'diesel', 'electrico', 'hibrido']),
      
    query('disponible')
      .optional()
      .isBoolean(),
      
    query('ciudad')
      .optional()
      .isString().trim(),
      
    query('estado')
      .optional()
      .isString().trim()
  ],

  // Validaciones para búsqueda avanzada con GET
  searchAutos: [
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
    
    query('marcas')
      .optional()
      .isString().withMessage('Las marcas deben ser una cadena separada por comas')
      .custom(value => {
        if (value) {
          return value.split(',').every(marca => 
            typeof marca === 'string' && marca.trim().length > 0 && marca.trim().length <= 50
          );
        }
        return true;
      }).withMessage('Cada marca debe ser texto válido (max 50 chars)'),
    
    query('modelos')
      .optional()
      .isString().withMessage('Los modelos deben ser una cadena separada por comas')
      .custom(value => {
        if (value) {
          return value.split(',').every(modelo => 
            typeof modelo === 'string' && modelo.trim().length > 0 && modelo.trim().length <= 50
          );
        }
        return true;
      }).withMessage('Cada modelo debe ser texto válido (max 50 chars)'),
    
    query('minYear')
      .optional()
      .isInt({ min: 1900 }).withMessage('El año mínimo debe ser mayor a 1900')
      .custom((minYear, { req }) => {
        if (req.query.maxYear && parseInt(minYear) > parseInt(req.query.maxYear)) {
          throw new Error('El año mínimo no puede ser mayor al año máximo');
        }
        return true;
      }),
    
    query('maxYear')
      .optional()
      .isInt({ max: new Date().getFullYear() + 1 })
      .withMessage(`El año máximo no puede ser mayor a ${new Date().getFullYear() + 1}`),
    
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
    
    query('minKm')
      .optional()
      .isInt({ min: 0 }).withMessage('El kilometraje mínimo no puede ser negativo')
      .custom((minKm, { req }) => {
        if (req.query.maxKm && parseInt(minKm) > parseInt(req.query.maxKm)) {
          throw new Error('El kilometraje mínimo no puede ser mayor al kilometraje máximo');
        }
        return true;
      }),
    
    query('maxKm')
      .optional()
      .isInt({ min: 0 }).withMessage('El kilometraje máximo no puede ser negativo'),
    
    query('colores')
      .optional()
      .isString().withMessage('Los colores deben ser una cadena separada por comas'),
    
    query('transmisiones')
      .optional()
      .isString().withMessage('Las transmisiones deben ser una cadena separada por comas')
      .custom(value => {
        if (value) {
          return value.split(',').every(t => ['manual', 'automatica', 'semi-automatica'].includes(t.trim()));
        }
        return true;
      }).withMessage('Transmisión no válida (valores permitidos: manual, automatica, semi-automatica)'),
    
    query('combustibles')
      .optional()
      .isString().withMessage('Los combustibles deben ser una cadena separada por comas')
      .custom(value => {
        if (value) {
          return value.split(',').every(c => ['gasolina', 'diesel', 'electrico', 'hibrido'].includes(c.trim()));
        }
        return true;
      }).withMessage('Combustible no válido (valores permitidos: gasolina, diesel, electrico, hibrido)'),
    
    query('opcionales')
      .optional()
      .isString().withMessage('Los opcionales deben ser una cadena separada por comas'),
    
    query('disponible')
      .optional()
      .isIn(['true', 'false']).withMessage('Disponible debe ser "true" o "false"'),
    
    query('ciudad')
      .optional()
      .isString().withMessage('La ciudad debe ser texto')
      .trim(),
    
    query('estado')
      .optional()
      .isString().withMessage('El estado debe ser texto')
      .trim(),
    
    query('desdeFecha')
      .optional()
      .isISO8601().withMessage('Fecha desde debe ser una fecha válida (ISO8601)')
      .custom((desdeFecha, { req }) => {
        if (req.query.hastaFecha && new Date(desdeFecha) > new Date(req.query.hastaFecha)) {
          throw new Error('La fecha desde no puede ser mayor a la fecha hasta');
        }
        return true;
      }),
    
    query('hastaFecha')
      .optional()
      .isISO8601().withMessage('Fecha hasta debe ser una fecha válida (ISO8601)'),
    
    query('sortBy')
      .optional()
      .isString().withMessage('El ordenamiento debe ser texto')
      .matches(/^-?[a-zA-Z]+(,-?[a-zA-Z]+)*$/).withMessage('Formato de ordenamiento no válido (ej: campo,-campo2)'),
    
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

module.exports = autoValidators;