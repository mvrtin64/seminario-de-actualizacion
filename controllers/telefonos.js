const db = require('../db');

const agregarTelefono = (req, res) => {
  const { telefono, id, contacto_id } = req.body;
  const sql = 'INSERT INTO Telefonos (telefono, id, contacto_id) VALUES (?, ?, ?)';
  db.query(sql, [numero, tipo, contacto_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al agregar teléfono', error: err });
    }
    res.status(201).json({ message: 'Teléfono creado correctamente', id: result.insertId });
  });
};

const obtenerTelefonos = (req, res) => {
  const sql = 'SELECT * FROM Telefonos';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener teléfonos', error: err });
    }
    res.json(result);
  });
};

const obtenerTelefonoPorId = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Telefonos WHERE contacto_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener teléfono por id', error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Teléfono no encontrado' });
    }
    res.json(result[0]);
  });
};

const actualizarTelefono = (req, res) => {
  const { id } = req.params;
  const { numero, tipo, contacto_id } = req.body;
  const sql = 'UPDATE Telefonos SET numero = ?, tipo = ?, contacto_id = ? WHERE id = ?';
  db.query(sql, [numero, tipo, contacto_id, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar teléfono', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Teléfono no encontrado' });
    }
    res.json({ message: 'Teléfono actualizado correctamente' });
  });
};

// eliminar un teléfono por id
const eliminarTelefono = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Telefonos WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar teléfono', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Teléfono no encontrado' });
    }
    res.json({ message: 'Teléfono eliminado correctamente' });
  });
};

module.exports = {
  agregarTelefono,
  obtenerTelefonos,
  obtenerTelefonoPorId,
  actualizarTelefono,
  eliminarTelefono
};
