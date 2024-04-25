const agregarContacto = () => {
      const nombre = document.getElementById('nombre').value;
      const apellido = document.getElementById('apellido').value;
      const direccion = document.getElementById('direccion').value;
      const telefono = document.getElementById('telefono').value; 
    
      // solicitud POST
      fetch('/api/contactos', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, apellido, direccion, telefono})
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al agregar contacto');
        }
        return response.json();
      })
      .then(data => {
        // limpio formulario
        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
        document.getElementById('direccion').value = '';
        document.getElementById('telefono').value = ''; 
    
        console.log('Contacto agregado:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    };
    // verificar que el formulario de agregar existe antes de agregar el event listener
      const formularioAgregar = document.getElementById('form-agregar');
      if (formularioAgregar) {
          formularioAgregar.addEventListener('submit', event => {
              event.preventDefault(); // Prevenir envío del formulario por defecto
              agregarContacto();
          });
      } else {
          console.error('El formulario de agregar no fue encontrado en el DOM');
    }
  // eliminar contacto 
    document.getElementById('form-eliminar').addEventListener('submit', event => {
      event.preventDefault();

      const id = document.getElementById('idEliminar').value; // id del contacto a eliminar
      if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
        // solicitud DELETE
        fetch(`/api/contactos/${id}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al eliminar contacto');
          }
          return response.json();
        })
        .then(data => {
          // limpio formulario
          document.getElementById('idEliminar').value = '';
          console.log('Contacto eliminado:', data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    });

// actualizar contacto
const formActualizar = document.getElementById('form-actualizar');

formActualizar.addEventListener('submit', event => {
  event.preventDefault(); 

  const id = document.getElementById('idActualizar').value;
  const nombre = document.getElementById('nuevoNombre').value;
  const apellido = document.getElementById('nuevoApellido').value;
  const direccion = document.getElementById('nuevaDireccion').value;
  const nuevoTelefono = document.getElementById('nuevoTelefono').value;

  const datosActualizados = {
    nombre: nombre,
    apellido: apellido,
    direccion: direccion,
    nuevoTelefono: nuevoTelefono
  };

  fetch(`/api/contactos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosActualizados)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al actualizar contacto');
    }
    return response.json();
  })
  .then(data => {
    // limpio formulario
      document.getElementById('nuevoNombre').value = '';
      document.getElementById('nuevoApellido').value = '';
      document.getElementById('nuevaDireccion').value = '';
      document.getElementById('nuevoTelefono').value = ''; 
      document.getElementById('idActualizar').value = '';
    console.log('Contacto actualizado:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

// buscar por ID
document.getElementById('form-buscar').addEventListener('submit', event => {
  event.preventDefault();
  
  const id = document.getElementById('idBuscar').value;

  fetch(`/api/contactos/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al buscar contacto');
      }
      return response.json();
    })
    .then(contacto => {
      document.getElementById('resultado').innerHTML = `
        <h2>Información del contacto</h2>
        <p><strong>Nombre:</strong> ${contacto.nombre}</p>
        <p><strong>Apellido:</strong> ${contacto.apellido}</p>
        <p><strong>Dirección:</strong> ${contacto.direccion}</p>
      `;
      fetch(`/api/telefonos/${id}`) 
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al buscar teléfono');
          }
          return response.json();
        })
        .then(telefono => {
          document.getElementById('resultado').innerHTML += `
            <p><strong>Número:</strong> ${telefono.telefono}</p>
          `;
        })
        .catch(error => {
          console.error('Error al buscar teléfono:', error);
        });
    })
    .catch(error => {
      console.error('Error al buscar contacto:', error);
    });
});

