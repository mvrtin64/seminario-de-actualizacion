const express = require('express');
const router = express.Router();

// Controladores de contactos
const {
  agregarContacto,
  obtenerContactos,
  obtenerContactoPorId,
  actualizarContacto,
  eliminarContacto
} = require('../controllers/contactos');

// Rutas de contactos
router.post('/', agregarContacto);
router.get('/', obtenerContactos);
router.get('/:id', obtenerContactoPorId);
router.put('/:id', actualizarContacto);
router.delete('/:id', eliminarContacto);

module.exports = router;