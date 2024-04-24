const express = require('express');
const router = express.Router();

// Controladores de teléfonos
const {
  agregarTelefono,
  obtenerTelefonos,
  obtenerTelefonoPorId,
  actualizarTelefono,
  eliminarTelefono
} = require('../controllers/telefonos');

// Rutas de teléfonos
router.post('/', agregarTelefono);
router.get('/', obtenerTelefonos);
router.get('/:id', obtenerTelefonoPorId);
router.put('/:id', actualizarTelefono);
router.delete('/:id', eliminarTelefono);

module.exports = router;
