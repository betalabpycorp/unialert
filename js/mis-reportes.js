document.addEventListener('DOMContentLoaded', function () {
    cargarTodosMisReportes();
});


async function cargarTodosMisReportes() {

    const contenedor =
        document.getElementById('lista-mis-reportes');

    if (!contenedor) {
        console.error('No existe #lista-mis-reportes');
        return;
    }

    try {

        const respuesta = await fetch(
            '../php/obtener-mis-reportes.php',
            {
                method: 'GET',
                credentials: 'include'
            }
        );

        const texto = await respuesta.text();

        console.log('Mis reportes:', texto);

        let datos;

        try {
            datos = JSON.parse(texto);
        } catch (error) {

            console.error(
                'El servidor no devolvió JSON:',
                texto
            );

            throw new Error(
                'Respuesta inválida del servidor.'
            );
        }

        if (!respuesta.ok) {
            throw new Error(
                datos.error ||
                'No se pudieron obtener los reportes'
            );
        }

        mostrarTodosLosReportes(datos.reportes);

    } catch (error) {

        console.error(
            'Error cargando mis reportes:',
            error
        );

        contenedor.innerHTML = `
            <div class="error-reportes">
                <p>No se pudieron cargar tus reportes.</p>
                <small>${escapeHTML(error.message)}</small>
            </div>
        `;
    }
}


function mostrarTodosLosReportes(reportes) {

    const contenedor =
        document.getElementById('lista-mis-reportes');

    contenedor.innerHTML = '';

    if (!reportes || reportes.length === 0) {

        contenedor.innerHTML = `
            <div class="sin-reportes">

                <img
                    src="../img/alert.png"
                    alt=""
                >

                <p>
                    Todavía no realizaste ningún reporte.
                </p>

            </div>
        `;

        return;
    }


    reportes.forEach(function (reporte) {

        const tarjeta =
            document.createElement('div');

        tarjeta.className =
            'tarjeta-reporte';


        const fecha =
            formatearFecha(
                reporte.fecha_reporte
            );


        const estado =
            reporte.estado ||
            'Pendiente';


        const tipo =
            reporte.tipo ||
            'Sin tipo';


        let imagen = '';


        if (reporte.imagen) {

            imagen = `
                <img
                    class="imagen-reporte"
                    src="/UniAlert/${escapeHTML(
                        reporte.imagen
                    )}"
                    alt="Imagen del reporte"
                >
            `;
        }


        tarjeta.innerHTML = `

            <div class="reporte-superior">

                <div>

                    <span class="tipo-reporte">
                        ${escapeHTML(tipo)}
                    </span>

                    <h4>
                        ${escapeHTML(
                            reporte.aula
                        )}
                    </h4>

                </div>


                <span class="estado-reporte">
                    ${escapeHTML(estado)}
                </span>

            </div>


            <p class="descripcion-reporte">
                ${escapeHTML(
                    reporte.descripcion
                )}
            </p>


            ${imagen}


            <div class="fecha-reporte">
                Reportado el: ${fecha}
            </div>

        `;


        contenedor.appendChild(tarjeta);

    });
}


function formatearFecha(fecha) {

    if (!fecha) {
        return 'Fecha no disponible';
    }

    const fechaObj = new Date(fecha);

    if (isNaN(fechaObj.getTime())) {
        return fecha;
    }

    return fechaObj.toLocaleString(
        'es-PY',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    );
}


function escapeHTML(texto) {

    if (
        texto === null ||
        texto === undefined
    ) {
        return '';
    }

    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}