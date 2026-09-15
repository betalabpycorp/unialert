document.addEventListener("DOMContentLoaded", function () {
  cargarReportes(3);
});

async function cargarReportes(estado) {
  const contenedor = document.getElementById("lista-reportes");

  try {
    const respuesta = await fetch(
      `../php/obtener-reportes-estado.php?estado=${estado}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.error || "Error al obtener reportes");
    }

    mostrarReportes(datos.reportes);
  } catch (error) {
    console.error(error);

    contenedor.innerHTML = `

            <div class="error-reportes">

                <p>
                    No se pudieron cargar los reportes.
                </p>

                <small>
                    ${escapeHTML(error.message)}
                </small>

            </div>

        `;
  }
}

function mostrarReportes(reportes) {
  const contenedor = document.getElementById("lista-reportes");

  contenedor.innerHTML = "";

  if (!reportes || reportes.length === 0) {
    contenedor.innerHTML = `

            <div class="sin-reportes">

                <img
                    src="../img/check.png"
                    alt=""
                >

                <p>
                    Todavía no tenés reportes resueltos.
                </p>

            </div>

        `;

    return;
  }

  reportes.forEach(function (reporte) {
    const tarjeta = document.createElement("div");

    tarjeta.className = "tarjeta-reporte";

    const fecha = formatearFecha(reporte.fecha_reporte);

    const estado = reporte.estado || "Resuelto";

    const tipo = reporte.tipo || "Sin tipo";

    let imagen = "";

    if (reporte.imagen) {
      imagen = `

                <img
                    class="imagen-reporte"
                    src="/UniAlert/${escapeHTML(reporte.imagen)}"
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


            ${imagen}


            <div class="fecha-reporte">
                ${fecha}
            </div>

        `;

    contenedor.appendChild(tarjeta);
  });
}

function formatearFecha(fecha) {
  if (!fecha) {
    return "Fecha no disponible";
  }

  const fechaObj = new Date(fecha);

  if (isNaN(fechaObj.getTime())) {
    return fecha;
  }

  return fechaObj.toLocaleString("es-PY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHTML(texto) {
  if (texto === null || texto === undefined) {
    return "";
  }

  return String(texto)
    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");
}
