import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class FormGenerico extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    archivosCargados: { type: Array }
  };

  constructor() {
    super();
    this.archivosCargados = [];
  }

  // Buena práctica: Limpiar las URLs en memoria cuando el componente se destruye
  disconnectedCallback() {
    super.disconnectedCallback();
    this._limpiarPreviews();
  }

  // Función para liberar la memoria de las URLs temporales
  _limpiarPreviews() {
    this.archivosCargados.forEach(item => {
      if (item.preview) {
        URL.revokeObjectURL(item.preview);
      }
    });
  }

  _handleFileChange(e) {
    const files = Array.from(e.target.files);
    
    if (files.length > 30) {
      Swal.fire('Error', 'Máximo 30 fotos permitidas', 'error');
      e.target.value = '';
      this._limpiarPreviews();
      this.archivosCargados = [];
      return;
    }

    // Limpiamos las vistas previas anteriores (si el usuario vuelve a seleccionar fotos)
    this._limpiarPreviews();

    // Mapeamos los archivos para guardar el File original y generar su URL de vista previa
    this.archivosCargados = files.map(file => ({
      file: file,
      preview: URL.createObjectURL(file)
    }));
  }

  render() {
    return html`
      <div class="mt-4 border-t-2 border-dashed border-gray-300 pt-4">
        <textarea id="genComment" rows="3" class="w-full p-3 border rounded mb-4 uppercase" placeholder="COMENTARIO GENERAL DE LA OT"></textarea>
        
        <div class="border p-4 rounded bg-gray-50">
          <label class="block font-bold mb-2">SUBIR FOTOS (MÁX 30):</label>
          <input type="file" id="genPhotos" multiple accept=".jpg,.jpeg,.png" class="mb-4" @change="${this._handleFileChange}">
          
          <div id="genPhotosContainer" class="flex flex-col gap-4">
            ${this.archivosCargados.map(item => html`
              <div class="flex flex-col sm:flex-row gap-4 border p-3 rounded bg-white generic-photo-item items-center sm:items-start shadow-sm">
                
                <!-- VISTA PREVIA DE LA IMAGEN -->
                <div class="shrink-0">
                  <img src="${item.preview}" alt="${item.file.name}" class="w-24 h-24 object-cover rounded border border-gray-200">
                </div>
                
                <!-- INFORMACIÓN Y COMENTARIO -->
                <div class="flex flex-col w-full gap-2">
                  <p class="text-xs text-gray-500 font-bold truncate w-full" title="${item.file.name}">${item.file.name}</p>
                  <input type="text" class="p-2 border rounded w-full text-sm uppercase photo-comment focus:ring focus:ring-blue-200 focus:outline-none" placeholder="Comentario de esta foto..." required>
                </div>

              </div>
            `)}
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('form-generico', FormGenerico);
