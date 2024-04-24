const express = require('express');
const router = express.Router();

// controladores de contactos
const {
  agregarContacto,
  obtenerContactos,
  obtenerContactoPorId,
  actualizarContacto,
  eliminarContacto
} = require('../controllers/contactos');

// rutas de contactos
router.post('/', agregarContacto);
router.get('/', obtenerContactos);
router.get('/:id', obtenerContactoPorId);
router.put('/:id', actualizarContacto);
router.delete('/:id', eliminarContacto);

module.exports = router;