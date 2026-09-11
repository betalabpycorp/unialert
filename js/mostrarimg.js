const input = document.getElementById('imagen');
const preview = document.getElementById('preview');

input.addEventListener('change', (e) => {
  const archivo = e.target.files[0];
  if (!archivo) return;

  const reader = new FileReader();
  reader.onload = (evento) => {
    preview.src = evento.target.result;
    preview.style.display = 'block';
    const uploadBox = document.getElementById('upload-box');
    const uploadTexto = uploadBox.querySelector('.upload-texto');

    uploadBox.classList.add('tiene-imagen');
    uploadTexto.textContent = `✅ ${archivo.name}`;
  };
  reader.readAsDataURL(archivo);
});