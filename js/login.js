// ========== USUARIOS VÁLIDOS (edita aquí) ==========
const USUARIOS = [
  { username: 'admin',  password: 'admin1234' },
  { username: 'maria',  password: 'maria123'  },
  { username: 'profe',  password: 'profe123'  }
];

document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const usuario  = document.getElementById('txtusuario').value.trim();
  const password = document.getElementById('txtpass').value.trim();

  // Validación básica
  if (!usuario || !password) {
    alert('Completa todos los campos');
    return;
  }

  // Buscar si el usuario existe y la contraseña coincide
  const user = USUARIOS.find(u => u.username === usuario && u.password === password);

  if (user) {
    // Login correcto → entrar al dashboard
    localStorage.setItem('username', user.username);
    window.location.href = 'dashboard.html';
  } else {
    alert('Usuario o contraseña incorrectos');
  }
});