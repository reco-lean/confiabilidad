const photoInput = document.getElementById("photos");
const photoCommentsDiv = document.getElementById("photo-comments");


photoInput.addEventListener("change", () => {

  const files = Array.from(photoInput.files);
  if (files.length > 30) {
    photoCommentsDiv.innerHTML = "";
    photoInput.value = "";
    photoInput.files = null;
    Swal.fire({
      title: "Solo puede subir máximo 30 fotos.",
      icon: "error",
    })
    return;
  }

  photoCommentsDiv.innerHTML = "";
  Array.from(photoInput.files).forEach((file, i) => {
    const block = document.createElement("div");
    block.className = "mt-10 w-full flex flex-col sm:flex-row gap-2";
    block.innerHTML = `
    <img src="${URL.createObjectURL(file)}" alt="preview" class="w-full h-[100px] sm:w-[160px] sm:h-[146px] shrink-0 rounded">
    <textarea required class="w-full h-[66px] text-xs sm:text-base sm:h-full p-3 border-2 border-[#E5E5E5] rounded resize-none focus:outline-none text-[#23231C]" name="comment-${i}" maxlength="220" rows="5" placeholder="COMENTARIO DE LA FOTO."></textarea>
    `;
    photoCommentsDiv.appendChild(block);
  });
});

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]); 
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const files = Array.from(photoInput.files);
  if (files.length === 0) {
    Swal.fire({
      title: "Debe añadir mínimo una foto.",
      icon: "error",
    })
    return;
  }


  const photos = [];
  // Convertir cada archivo a Base64 y armar objeto
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const base64 = await fileToBase64(file);
    const commentField = document.querySelector(`[name="comment-${i}"]`);
    photos.push({
      filename: file.name,
      index: i + 1,
      base64: base64,
      comment: commentField ? commentField.value || null : null
    });
  }

  // Armar payload final
  const payload = {
    orderNumber: e.target.orderNumber.value,
    workshop: e.target.workshop.value,
    model: e.target.component.value,
    orderComment: e.target.orderComment.value.trim(),
    photos: photos
  };

  try {
    const res = await fetch("https://defaultc9a8e948bf0d4f8d9e9d551ac1b45a.48.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/403406fe6985492ca0ff581ed00693f1/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zTK-OlTY3MhKhpJyORGaODDcSJ-ctfbTFFWEUxknq9A", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Error al enviar los datos");

    Swal.fire({
      title: "Evidencias registradas con éxito.",
      icon: "success",
    })
    
    e.target.reset();
    photoCommentsDiv.innerHTML = "";
  } catch (err) {
        alert("Error: " + err.message);
  }
});
