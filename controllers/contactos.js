const db = require('../db');

const agregarContacto = (req, res) => {
  const { nombre, apellido, direccion, telefono } = req.body;
  const sqlContacto = 'INSERT INTO Contactos (nombre, apellido, direccion) VALUES (?, ?, ?)';
  db.query(sqlContacto, [nombre, apellido, direccion], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al agregar contacto', error: err });
    }
    const contactoId = result.insertId;
    const sqlTelefono = 'INSERT INTO Telefonos (telefono, contacto_id) VALUES (?, ?)';
    db.query(sqlTelefono, [telefono, contactoId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error al agregar teléfono', error: err });
      }
      res.status(201).json({ message: 'Contacto creado correctamente', id: contactoId });
    });
  });
};

const obtenerContactos = (req, res) => {
  const sql = 'SELECT * FROM Contactos';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener contactos', error: err });
    }
    res.json(result);
  });
};

const obtenerContactoPorId = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Contactos WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener contacto por id', error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }
    res.json(result[0]);
  });
};

const actualizarContacto = (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, direccion } = req.body;
  const nuevoTelefono = req.body.nuevoTelefono;

  // actualizar contacto
  const sqlContacto = 'UPDATE Contactos SET nombre = ?, apellido = ?, direccion = ? WHERE id = ?';
  db.query(sqlContacto, [nombre, apellido, direccion, id], (errContacto, resultContacto) => {
    if (errContacto) {
      return res.status(500).json({ message: 'Error al actualizar contacto', error: errContacto });
    }

    const sqlTelefono = 'UPDATE Telefonos SET telefono = ? WHERE contacto_id = ?';
    db.query(sqlTelefono, [nuevoTelefono, id], (errTelefono, resultTelefono) => {
      if (errTelefono) {
        return res.status(500).json({ message: 'Error al actualizar teléfono', error: errTelefono });
      }

      if (resultContacto.affectedRows === 0) {
        return res.status(404).json({ message: 'Contacto no encontrado' });
      }

      res.json({ message: 'Contacto y teléfono actualizados correctamente' });
    });
  });
};


const eliminarContacto = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Contactos WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar contacto', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }
    res.json({ message: 'Contacto eliminado correctamente' });
  });
};

module.exports = {
  agregarContacto,
  obtenerContactos,
  obtenerContactoPorId,
  actualizarContacto,
  eliminarContacto
};
