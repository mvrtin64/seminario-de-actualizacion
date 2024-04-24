const agregarContacto = () => {
      const nombre = document.getElementById('nombre').value;
      const apellido = document.getElementById('apellido').value;
      const direccion = document.getElementById('direccion').value;
    
      // solicitud POST
      fetch('/api/contactos', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({nombre,apellido,direccion})
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
    

        console.log('Contacto agregado:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    };
      // Verificar si el formulario de agregar existe antes de agregar el event listener
      const formularioAgregar = document.getElementById('form-agregar');
      if (formularioAgregar) {
          formularioAgregar.addEventListener('submit', event => {
              event.preventDefault(); // Prevenir envío del formulario por defecto
              agregarContacto();
          });
      } else {
          console.error('El formulario de agregar no fue encontrado en el DOM');
    }
/*     // Event listener para el formulario de agregar contacto
    document.getElementById('form-agregar').addEventListener('submit', event => {
      event.preventDefault(); // Prevenir envío del formulario por defecto
      agregarContacto();
    }); */
    
    document.getElementById('form-eliminar').addEventListener('click', event => {
      const id = event.target.dataset.id; // Obtener el ID del contacto a eliminar
  
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
          console.log('Contacto eliminado:', data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    });