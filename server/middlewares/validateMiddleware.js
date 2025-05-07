const { validationResult } = require('express-validator');

/*Middleware para manejar errores de validació@param {Array} validations - Array de validacione@returns {Function} Middleware de Express
 */
const handleValidationErrors = (validations) => {
  return async (req, res, next) => {
    try {
      // Ejecutar todas las validaciones en paralelo
      await Promise.all(validations.map(validation => validation.run(req)));
      
      // Obtener resultados de validación
      const errors = validationResult(req);
      
      // Si no hay errores, continuar
      if (errors.isEmpty()) {
        return next();
      }

      // Procesar errores
      const errorResponse = {
        success: false,
        errors: {}
      };

      // Agrupar errores por campo
      errors.array().forEach(err => {
        if (!errorResponse.errors[err.param]) {
          errorResponse.errors[err.param] = err.msg;
        }
      });

      return res.status(422).json(errorResponse);
      
    } catch (error) {
      // Manejar errores inesperados durante la validación
      console.error('Error en validación:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno durante la validación'
      });
    }
  };
};

module.exports = {
  handleValidationErrors
};