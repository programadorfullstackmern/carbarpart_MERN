const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator'); // Añade esta línea
const autoController = require('../controllers/autoController');
const autoValidators = require('../validators/autoValidator');
const { handleValidationErrors } = require('../middlewares/validateMiddleware');
const uploadAuto = require('../middlewares/uploadAutoMiddleware');

console.log("*******Rutas para Autos*******");

// Rutas para Autos
router.route('/')
  .get(
    autoValidators.listAutos,
    handleValidationErrors(autoValidators.listAutos),
    autoController.listarAutos
  )
  .post(
    uploadAuto.single('imagen'),
    autoValidators.createAuto,
    handleValidationErrors(autoValidators.createAuto),
    autoController.crearAuto
  );

  router.route('/buscar')
  .get(
    autoValidators.searchAutos,
    handleValidationErrors(autoValidators.searchAutos),
    autoController.buscarAutos
  )

router.route('/:id')
  .get(
    autoValidators.validateId,
    handleValidationErrors(autoValidators.validateId),
    autoController.obtenerAuto
  )
  .put(
    uploadAuto.single('imagen'),
    autoValidators.validateId,
    autoValidators.updateAuto,
    handleValidationErrors([...autoValidators.validateId, ...autoValidators.updateAuto]),
    autoController.actualizarAuto
  )
  .delete(
    autoValidators.validateId,
    handleValidationErrors(autoValidators.validateId),
    autoController.eliminarAuto
  );

// Rutas especializadas para piezas de autos
router.route('/:id/piezas')
  .get(
    autoValidators.validateId,
    handleValidationErrors(autoValidators.validateId),
    autoController.obtenerPiezasAuto
  )
  .post(
    autoValidators.validateId,
    body('piezaId').isMongoId().withMessage('ID de pieza no válido'),
    handleValidationErrors([
      ...autoValidators.validateId,
      body('piezaId').isMongoId().withMessage('ID de pieza no válido')
    ]),
    autoController.agregarPiezaAuto
  )
  .delete(
    autoValidators.validateId,
    body('piezaId').isMongoId().withMessage('ID de pieza no válido'),
    handleValidationErrors([
      ...autoValidators.validateId,
      body('piezaId').isMongoId().withMessage('ID de pieza no válido')
    ]),
    autoController.eliminarPiezaAuto
  );

module.exports = router;