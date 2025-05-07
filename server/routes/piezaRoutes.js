const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator'); // Añade esta línea
const piezaController = require('../controllers/piezaController');
const piezaValidators = require('../validators/piezaValidator');
const { handleValidationErrors } = require('../middlewares/validateMiddleware');
const uploadPieza = require('../middlewares/uploadPiezaMiddleware');

console.log("*******Rutas para Piezas*******");

// Rutas para Piezas
router.route('/')
  .get(
    piezaValidators.listPiezas,
    handleValidationErrors(piezaValidators.listPiezas),
    piezaController.listarPiezas
  )
  .post(
    uploadPieza.single('imagen'),
    piezaValidators.createPieza,
    handleValidationErrors(piezaValidators.createPieza),
    piezaController.crearPieza
  );

router.route('/buscar')
  .get(
    piezaValidators.searchPiezas,
    handleValidationErrors(piezaValidators.searchPiezas),
    piezaController.buscarPiezas
  )

router.route('/:id')
  .get(
    piezaValidators.validateId,
    handleValidationErrors(piezaValidators.validateId),
    piezaController.obtenerPieza
  )
  .put(
    uploadPieza.single('imagen'),
    piezaValidators.validateId,
    piezaValidators.updatePieza,
    handleValidationErrors([...piezaValidators.validateId, ...piezaValidators.updatePieza]),
    piezaController.actualizarPieza
  )
  .delete(
    piezaValidators.validateId,
    handleValidationErrors(piezaValidators.validateId),
    piezaController.eliminarPieza
  );

// Rutas de compatibilidad con autos
router.route('/:id/autos-compatibles')
  .get(
    piezaValidators.validateId,
    handleValidationErrors(piezaValidators.validateId),
    piezaController.obtenerAutosCompatibles
  )
  .post(
    piezaValidators.validateId,
    body('autoId').isMongoId().withMessage('ID de auto no válido'),
    handleValidationErrors([
      ...piezaValidators.validateId,
      body('autoId').isMongoId().withMessage('ID de auto no válido')
    ]),
    piezaController.agregarAutoCompatible
  )
  .delete(
    piezaValidators.validateId,
    body('autoId').isMongoId().withMessage('ID de auto no válido'),
    handleValidationErrors([
      ...piezaValidators.validateId,
      body('autoId').isMongoId().withMessage('ID de auto no válido')
    ]),
    piezaController.eliminarAutoCompatible
  );

module.exports = router;