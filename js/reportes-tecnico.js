document.addEventListener('DOMContentLoaded', function () {

    console.log('REPORTES TECNICO JS CARGADO');

    cargarReportesTecnico();

});




// =====================================
// CARGAR REPORTES
// =====================================

async function cargarReportesTecnico() {


    const contenedor = document.getElementById('lista-reportes');


    if (!contenedor) {

        console.error('No existe lista-reportes');

        return;

    }



    try {


        const parametros = new URLSearchParams(
            window.location.search
        );


        const estadoFiltro =
            parametros.get('estado') || 'todos';



        cambiarTitulo(estadoFiltro);



        const respuesta = await fetch(

            `../php/obtener-reportes-tecnico.php?estado=${estadoFiltro}`,

            {

                method: "GET",

                credentials: "include"

            }

        );



        const datos = await respuesta.json();



        if (!respuesta.ok || !datos.ok) {

            throw new Error(
                datos.error || 
                "Error cargando reportes"
            );

        }



        const reportes = datos.reportes || [];



        contenedor.innerHTML = "";




        if(reportes.length === 0){


            contenedor.innerHTML = `

                <div class="sin-reportes">

                    <p>
                        No hay reportes en esta categoría.
                    </p>

                </div>

            `;


            return;

        }





        reportes.forEach(reporte => {



            const tarjeta = document.createElement('div');


            tarjeta.className = "tarjeta-reporte";



            const profesor =

                `${reporte.nombre || ''} ${reporte.apellido || ''}`.trim();




            tarjeta.innerHTML = `


            <div class="reporte-superior">


                <div>


                    <span class="tipo-reporte">

                        ${escapeHTML(
                            reporte.tipo || "Sin tipo"
                        )}

                    </span>



                    <h4>

                        Aula:

                        ${escapeHTML(
                            reporte.aula || "Sin aula"
                        )}

                    </h4>


                </div>




                <span class="estado-reporte">

                    ${escapeHTML(
                        reporte.estado
                    )}

                </span>


            </div>





            <div class="datos-profesor">


                <p>

                    <strong>
                    Profesor:
                    </strong>

                    ${escapeHTML(
                        profesor
                    )}

                </p>



                <p>

                    <strong>
                    Correo:
                    </strong>

                    ${escapeHTML(
                        reporte.correo
                    )}

                </p>



            </div>





            <div class="descripcion-reporte">

                ${escapeHTML(
                    reporte.descripcion
                )}

            </div>





            ${
                reporte.imagen

                ?

                `

                <img

                    class="imagen-reporte"

                    src="${obtenerRutaImagen(
                        reporte.imagen
                    )}"

                    onerror="this.style.display='none'"

                >

                `

                :

                ''

            }





            <div class="cambiar-estado">


                <label>

                    Cambiar estado:

                </label>



                <select

                    class="select-estado"

                    data-id="${reporte.id_reporte}"

                >


                    <option value="">

                        Seleccionar

                    </option>



                    <option

                    value="1"

                    ${reporte.id_estado == 1 ? "selected":""}

                    >

                        Pendiente

                    </option>




                    <option

                    value="2"

                    ${reporte.id_estado == 2 ? "selected":""}

                    >

                        En proceso

                    </option>




                    <option

                    value="3"

                    ${reporte.id_estado == 3 ? "selected":""}

                    >

                        Resuelto

                    </option>


                </select>



            </div>





            <div class="fecha-reporte">

                Reportado:

                ${formatearFecha(
                    reporte.fecha_reporte
                )}

            </div>


            `;



            contenedor.appendChild(tarjeta);



        });




        activarCambioEstado();



    } catch(error){


        console.error(
            error
        );


        contenedor.innerHTML = `

            <div class="error-reportes">

                <p>
                    Error cargando reportes
                </p>


                <small>

                    ${escapeHTML(
                        error.message
                    )}

                </small>


            </div>

        `;


    }


}







// =====================================
// CAMBIAR ESTADO
// =====================================


function activarCambioEstado(){



    document
    .querySelectorAll('.select-estado')
    .forEach(select => {



        select.addEventListener(
        'change',

        async function(){



            const idReporte =
                this.dataset.id;



            const nuevoEstado =
                this.value;



            if(!nuevoEstado){

                return;

            }




            try{


                const respuesta = await fetch(

                    "../php/cambiar-estado.php",

                    {

                        method:"POST",

                        headers:{

                            "Content-Type":
                            "application/json"

                        },


                        credentials:"include",


                        body:JSON.stringify({

                            id_reporte:idReporte,

                            id_estado:nuevoEstado

                        })

                    }

                );




                const datos =
                    await respuesta.json();





                if(datos.ok){



                    alert(
                        "Estado actualizado correctamente"
                    );



                    // mantiene la categoría actual

                    cargarReportesTecnico();



                }else{


                    alert(
                        datos.error
                    );


                }





            }catch(error){


                console.error(
                    "Error cambiando estado:",
                    error
                );


            }




        });



    });


}







// =====================================
// TITULOS
// =====================================


function cambiarTitulo(estado){


    const titulo =
    document.getElementById(
        "titulo-reportes"
    );


    const descripcion =
    document.getElementById(
        "descripcion-reportes"
    );



    if(!titulo || !descripcion)

        return;




    switch(estado){


        case "pendiente":


            titulo.textContent =
            "Reportes pendientes";


            descripcion.textContent =
            "Reportes esperando atención.";

        break;




        case "proceso":


            titulo.textContent =
            "Reportes en proceso";


            descripcion.textContent =
            "Reportes que están siendo atendidos.";

        break;




        case "resuelto":


            titulo.textContent =
            "Reportes terminados";


            descripcion.textContent =
            "Reportes solucionados.";

        break;




        default:


            titulo.textContent =
            "Todos los reportes";


            descripcion.textContent =
            "Reportes enviados por profesores.";

    }


}







// =====================================
// IMAGEN
// =====================================


function obtenerRutaImagen(imagen){


    if(!imagen)

        return "";



    imagen =
    imagen.replace(
        "uploads/uploads",
        "uploads"
    );



    if(imagen.startsWith("uploads/"))

        return "../" + imagen;



    return "../uploads/" + imagen;


}







// =====================================
// FECHA
// =====================================


function formatearFecha(fecha){


    if(!fecha)

        return "Sin fecha";



    const f = new Date(fecha);



    if(isNaN(f))

        return fecha;




    return f.toLocaleString(
        "es-PY",
        {

            day:"2-digit",

            month:"2-digit",

            year:"numeric",

            hour:"2-digit",

            minute:"2-digit"

        }

    );


}







// =====================================
// SEGURIDAD HTML
// =====================================


function escapeHTML(texto){


    const div =
    document.createElement("div");


    div.textContent =
    texto ?? "";



    return div.innerHTML;


}