// Escuchar el submit del formulario
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();   // ⭐ evita que el navegador envíe y recargue

  // ⭐ Obtener los valores de los inputs
  const usuario = document.getElementById('txtusuario').value.trim();
  const password = document.getElementById('txtpass').value.trim();

  // Validación básica
  if (!usuario || !password) {
    alert('Completa todos los campos');
    return;
  }

  try {
    const respuesta = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usuario, password })
    });

    const resultado = await respuesta.json();

    if (respuesta.ok) {
      localStorage.setItem('token', resultado.token);
      localStorage.setItem('username', resultado.username);
      window.location.href = 'dashboard.html';
    } else {
      alert('Error: ' + resultado.error);
    }
  } catch (error) {
    console.error(error);
    alert('No se pudo conectar al servidor');
  }
});