document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('form-reporte');

    if (!form) return;


    // ==========================================
    // CARGAR TIPOS DE PROBLEMA DESDE LA BD
    // ==========================================

    fetch('/UniAlert/php/obtener-catalogo.php', {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => {

            if (!response.ok) {
                throw new Error('No se pudieron obtener los tipos');
            }

            return response.json();
        })

        .then(data => {

            const select = document.getElementById('id_tipo');

            if (!select) return;

            select.innerHTML =
                '<option value="">Seleccione un tipo</option>';

            if (!data.tipos || !Array.isArray(data.tipos)) {
                throw new Error('La respuesta no contiene tipos');
            }

            data.tipos.forEach(tipo => {

                const option = document.createElement('option');

                option.value = tipo.id_tipo;
                option.textContent = tipo.nombre;

                select.appendChild(option);
            });
        })

        .catch(error => {

            console.error(
                'Error al cargar los tipos:',
                error
            );

            const select = document.getElementById('id_tipo');

            if (select) {

                select.innerHTML =
                    '<option value="">Error al cargar los tipos</option>';
            }
        });


    // ==========================================
    // ENVIAR REPORTE
    // ==========================================

    form.addEventListener('submit', async (e) => {

        e.preventDefault();


        // Obtener datos del formulario

        const aula =
            document.getElementById('aula').value.trim();

        const id_tipo =
            document.getElementById('id_tipo').value;

        const descripcion =
            document.getElementById('descripcion').value.trim();

        const imagenInput =
            document.getElementById('imagen');


        // ==========================================
        // VALIDAR CAMPOS
        // ==========================================

        if (!aula || !id_tipo || !descripcion) {

            alert('Completa todos los campos obligatorios.');

            return;
        }


        // ==========================================
        // CREAR FORMDATA
        // ==========================================

        const formData = new FormData();

        formData.append('aula', aula);
        formData.append('id_tipo', id_tipo);
        formData.append('descripcion', descripcion);


        // ==========================================
        // AGREGAR IMAGEN SI EXISTE
        // ==========================================

        if (imagenInput && imagenInput.files.length > 0) {

            formData.append(
                'imagen',
                imagenInput.files[0]
            );
        }


        // ==========================================
        // ENVIAR AL SERVIDOR
        // ==========================================

        try {

            const res = await fetch(
                '/UniAlert/php/guardar-reporte.php',
                {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }
            );


            // ==========================================
            // OBTENER RESPUESTA
            // ==========================================

            const data = await res.json();

            console.log(
                'Respuesta del servidor:',
                data
            );

            // MOSTRAR ERROR COMPLETO
            console.log(
                'ERROR COMPLETO:',
                data.detalle
            );


            // ==========================================
            // ERROR DEL SERVIDOR
            // ==========================================

            if (!res.ok) {

                alert(
                    data.error ||
                    'Error al enviar el reporte'
                );

                console.error(
                    'Error:',
                    data
                );

                return;
            }


            // ==========================================
            // REPORTE ENVIADO CORRECTAMENTE
            // ==========================================

            alert(
                '✅ Reporte enviado correctamente'
            );


            // Limpiar formulario

            form.reset();


            // Ocultar vista previa

            const preview =
                document.getElementById('preview');

            if (preview) {

                preview.style.display = 'none';
            }


            // ==========================================
            // VOLVER AL DASHBOARD
            // ==========================================

            setTimeout(() => {

                window.location.href =
                    '/UniAlert/html/dash-usu.html';

            }, 1000);

        } catch (error) {

            console.error(
                'Error de conexión:',
                error
            );

            alert(
                'No se pudo conectar con el servidor.'
            );
        }

    });

});