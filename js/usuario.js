document.addEventListener('DOMContentLoaded', function () {

    mostrarSaludo();
    cargarNombreUsuario();

});


/* =========================================
   SALUDO SEGÚN LA HORA DE PARAGUAY
========================================= */

function mostrarSaludo() {

    const elementoSaludo = document.querySelector('.saludo');

    if (!elementoSaludo) {
        return;
    }

    const ahora = new Date();

    const hora = ahora.toLocaleString('es-PY', {
        timeZone: 'America/Asuncion',
        hour: 'numeric',
        hour12: false
    });

    const horaActual = parseInt(hora);

    let saludo;

    if (horaActual >= 5 && horaActual < 12) {

        saludo = 'Buenos días';

    } else if (horaActual >= 12 && horaActual < 19) {

        saludo = 'Buenas tardes';

    } else {

        saludo = 'Buenas noches';

    }

    elementoSaludo.textContent = saludo;
}


/* =========================================
   CARGAR NOMBRE DEL USUARIO
========================================= */

async function cargarNombreUsuario() {

    const elementoNombre =
        document.getElementById('nombre-usuario');

    if (!elementoNombre) {
        return;
    }

    try {

        const respuesta = await fetch(
            '../php/obtener-usuario.php',
            {
                method: 'GET',
                credentials: 'include'
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                datos.error || 'No se pudo obtener el usuario'
            );

        }

        elementoNombre.textContent =
            datos.nombre;

    } catch (error) {

        console.error(
            'Error cargando usuario:',
            error
        );

        elementoNombre.textContent =
            'Usuario';
    }
}