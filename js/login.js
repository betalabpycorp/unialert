document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('login-form');

    if (!form) {
        console.error('No se encontró el formulario login-form');
        return;
    }

    form.addEventListener('submit', async (e) => {

        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Completa todos los campos');
            return;
        }

        try {

            const res = await fetch('/UniAlert/php/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await res.json();

            console.log('RESPUESTA DEL SERVIDOR:', data);
            console.log('ESTADO HTTP:', res.status);

            if (!res.ok) {
                alert(data.error || 'Error al iniciar sesión');
                return;
            }

            console.log('LOGIN CORRECTO');
            console.log('Usuario:', data.usuario);
            console.log('Rol:', data.usuario.id_rol);

            if (Number(data.usuario.id_rol) === 1) {

                window.location.href = '/UniAlert/html/dash-tecn.html';

            } else if (Number(data.usuario.id_rol) === 3) {

                window.location.href = '/UniAlert/html/dash-usu.html';

            } else {

                console.error('Rol no reconocido:', data.usuario.id_rol);
                alert('Rol de usuario no reconocido: ' + data.usuario.id_rol);

            }

        } catch (error) {

            console.error('ERROR:', error);
            alert('No se pudo conectar con el servidor');

        }

    });

});