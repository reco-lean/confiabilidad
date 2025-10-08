document.addEventListener("DOMContentLoaded", function () {
  

    const componente = document.getElementById("componente");
    const modelo = document.getElementById("modelo");
    const ot = document.getElementById("ot");
    const comentario = document.getElementById("comentario");
    const btnEnviar = document.getElementById("btnEnviar");
    const spinner = document.getElementById("spinner");
    const inputFotos = document.getElementById("fotos"); // input multiple de fotos

    const form = document.getElementById("form");
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        let isValid = true;

        if (componente.value.trim() === "") {
            mostrarError(componente, "El campo número de componente es obligatorio.");
            isValid = false;
        } else {
            limpiarError(componente);
        }

        if (modelo.value.trim() === "") {
            mostrarError(modelo, "El campo modelo es obligatorio.");
            isValid = false;
        } else {
            limpiarError(modelo);
        }

        if (ot.value.trim() === "") {
            mostrarError(ot, "La OT es obligatoria.");
            isValid = false;
        } else {
            limpiarError(ot);
        }

        if (isValid) {
            // Procesar fotos
            let fotos = "";
            if (inputFotos.files.length > 0) {
                // Validar máximo 30 fotos
                if (inputFotos.files.length > 30) {
                    Swal.fire({
                        icon: "error",
                        title: "Demasiadas fotos",
                        text: "Solo puedes subir máximo 30 imágenes en formato JPG."
                    });
                    throw new Error("Máximo 30 fotos permitidas");
                }

                // Validar formato de cada archivo
                for (let i = 0; i < inputFotos.files.length; i++) {
                    const file = inputFotos.files[i];
                    if (!file.type.includes("jpeg")) {
                        Swal.fire({
                            icon: "error",
                            title: "Formato inválido",
                            text: "Solo se permiten imágenes en formato .JPG"
                        });
                        throw new Error("Formato no permitido");
                    }
                }

                // Convertir a base64
                const base64Array = await Promise.all(
                    Array.from(inputFotos.files).map(file => {
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result.split(",")[1]);
                            reader.onerror = err => reject(err);
                            reader.readAsDataURL(file);
                        });
                    })
                );
                fotos = base64Array.join(" "); // concatenar con espacio
            }

            const json = {
                componente: componente.value,
                compcode: modelo.value,
                ot: ot.value,
                comentario: comentario.value,
                fotos: fotos
            };

            btnEnviar.disabled = true;
            spinner.style.display = "inline-block";

            const response = await fetch("https://defaultc9a8e948bf0d4f8d9e9d551ac1b45a.48.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/403406fe6985492ca0ff581ed00693f1/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zTK-OlTY3MhKhpJyORGaODDcSJ-ctfbTFFWEUxknq9A", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(json)
            });

            if (!response.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Algo salió mal!"
                }).then(() => {
                    if (response.status === 403) salir();
                    else window.location.reload();
                });
            } else {
                Swal.fire({
                    title: "Caso registrado!",
                    icon: "success",
                }).then(() => window.location.reload());
            }
        }
    });

    function mostrarError(input, mensaje) {
        limpiarError(input);
        const error = document.createElement("div");
        error.className = "text-danger mt-1";
        error.innerText = mensaje;
        input.classList.add("is-invalid");
        input.parentElement.appendChild(error);
    }

    function limpiarError(input) {
        input.classList.remove("is-invalid");
        const errorMensaje = input.parentElement.querySelector(".text-danger");
        if (errorMensaje) {
            errorMensaje.remove();
        }
    }
});

