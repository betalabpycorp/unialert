// Referencias a los elementos del HTML
const inputImagen = document.getElementById('imagen');
const preview = document.getElementById('preview');

// Escuchar cuando el usuario selecciona un archivo
inputImagen.addEventListener('change', (e) => {
  const archivo = e.target.files[0];

  // Si no hay archivo (canceló el selector), ocultamos el preview
  if (!archivo) {
    preview.src = '';
    preview.style.display = 'none';
    return;
  }

  // Validación: solo imágenes
  if (!archivo.type.startsWith('image/')) {
    alert('Solo se permiten imágenes.');
    inputImagen.value = '';
    preview.src = '';
    preview.style.display = 'none';
    return;
  }

  // Validación: tamaño máximo 5 MB
  if (archivo.size > 5 * 1024 * 1024) {
    alert('La imagen no debe superar los 5 MB.');
    inputImagen.value = '';
    preview.src = '';
    preview.style.display = 'none';
    return;
  }

  // Leer el archivo y mostrarlo
  const reader = new FileReader();

  reader.onload = (evento) => {
    preview.src = evento.target.result; // base64
    preview.style.display = 'block';
  };

  reader.readAsDataURL(archivo);
});