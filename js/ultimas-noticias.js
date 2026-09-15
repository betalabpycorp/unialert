document.addEventListener('DOMContentLoaded', () => {

    cargarMisReportes();

});


// ==========================================
// OBTENER LOS ÚLTIMOS REPORTES
// ==========================================

async function cargarMisReportes() {

    const contenedor =
        document.getElementById('ultimas-noticias');

    if (!contenedor) return;

    try {

        const respuesta = await fetch(
            '/UniAlert/php/obtener-mis-reportes.php',
            {
                method: 'GET',
                credentials: 'include'
            }
        );

        const data = await respuesta.json();

        console.log('Mis reportes:', data);

        if (!respuesta.ok) {

            throw new Error(
                data.error || 'No se pudieron obtener los reportes'
            );
        }

        mostrarReportes(data.reportes || []);

    } catch (error) {

        console.error(
            'Error al cargar reportes:',
            error
        );

        contenedor.innerHTML = `
            <div class="sin-reportes">
                <p>No se pudieron cargar tus reportes.</p>
            </div>
        `;
    }
}


// ==========================================
// MOSTRAR REPORTES
// ==========================================

function mostrarReportes(reportes) {

    const contenedor =
        document.getElementById('ultimas-noticias');

    if (!contenedor) return;

    contenedor.innerHTML = '';

    // No hay reportes
    if (reportes.length === 0) {

        contenedor.innerHTML = `
            <div class="sin-reportes">
                <img
                    src="../img/alert.png"
                    alt="Sin reportes"
                >

                <p>Aún no has realizado ningún reporte.</p>
            </div>
        `;

        return;
    }

    // Mostrar máximo 5
    reportes.slice(0, 5).forEach(reporte => {

        const tarjeta =
            document.createElement('div');

        tarjeta.classList.add('tarjeta-reporte');

        // Formatear fecha
        const fecha =
            formatearFecha(reporte.fecha_reporte);

        // Estado
        const estado =
            reporte.estado || 'Pendiente';

        // Imagen
        let imagenHTML = '';

        if (reporte.imagen) {

            imagenHTML = `
                <img
                    src="/UniAlert/${reporte.imagen}"
                    alt="Imagen del reporte"
                    class="imagen-reporte"
                >
            `;
        }

        tarjeta.innerHTML = `

            <div class="reporte-cabecera">

                <div>

                    <span class="tipo-reporte">
                        ${escapeHTML(reporte.tipo)}
                    </span>

                    <h4>
                        ${escapeHTML(reporte.aula)}
                    </h4>

                </div>

                <span class="estado-reporte">
                    ${escapeHTML(estado)}
                </span>

            </div>

            <p class="descripcion-reporte">
                ${escapeHTML(reporte.descripcion)}
            </p>

            ${imagenHTML}

            <div class="reporte-fecha">
                ${fecha}
            </div>

        `;

        contenedor.appendChild(tarjeta);

    });
}


// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(fecha) {

    if (!fecha) return '';

    const fechaObj = new Date(fecha);

    return fechaObj.toLocaleString('es-PY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}


// ==========================================
// EVITAR HTML INYECTADO
// ==========================================

function escapeHTML(texto) {

    if (!texto) return '';

    return texto
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}