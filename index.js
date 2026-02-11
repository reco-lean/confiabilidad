const photoInput = document.getElementById("photos");
const photoCommentsDiv = document.getElementById("photo-comments");
const componentInput = document.getElementById("component");
const workshop = document.getElementById("workshop");

const components = {
  
  CILINDROS: ["CCUC HIT3600", "CEMP HIT3600", "CLEV HIT5500", "CEMP HIT5500", "CCUC HIT5500", 
      "CACU HIT5500", 
      "CCUC R9150", 
      "CLEV R9150", 
      "CEMP R9150", 
      "CLEV 789CD", 
      "CLEV 793D", 
      "CLEV HIT3600", 
      "SUSF 789CD", 
      "SUST 789CD", 
      "SUSF 793D", 
      "SUST 793D", 
      "SUSF 777", 
      "SUSF 930E", 
      "TGIR HIT3600", 
      "TPRO HIT3600", 
      "TGIR HIT5500", 
      "TPRO HIT5500",
      "ALTE L1350",
      "CDIR L1350",
      "CICV L1350",
      "CLEV L1350",
      "RMOT L1350",
      "CLCU D9T",
      "CICUIZ D9T",
      "CICUD D9T",
      "CIRP D9T",
      "CLRP D9T",
      "CLCU D10T",
      "CICUD D10T",
      "CICUI D10T",
      "CIRPD D10T",
      "CIRPI D10T",
      "CLRPD D10T",
      "CLRPI D10T",
      "CLCU D10T2",
      "CICUD D10T2",
      "CICUI D10T2",
      "CIRPD D10T2",
      "CIRPI D10T2",
      "CLRPD D10T2",
      "CLRPI D10T2",
      "CLCU D11T",
      "CICUD D11T",
      "CICUI D11T",
      "CIRPD D11T",
      "CIRPI D11T",
      "CLRPD D11T",
      "CLRPI D11T",
      "CLCU 834",
      "CICUD 834",
      "CICUI 834",
      "CLCUI 854G",
      "CLCUD 854G",
      "CLCUI 854K",
      "CLCUD 854K",
      "CICUD 854GK",
      "CICUI 854GK"],
  "TREN DE POTENCIA": [
      "TRAN D9T",
      "TRAN D10T",
      "TRAN D11T",
      "TRAN 834",
      "TRAN 631G",
      "TRAN 854GK",
      "MFIN D9T",
      "MFIN D10T",
      "MFIN D11T",
      "MFIN 834",
      "MFIN 631G",
      "MFIN 854GK",
      "MFIN 793D",
      "MFIN 789CD",
      "MFIN 789CD",
      "TRAN 793D",
      "TRAN 789CD",
      "TRAN 16M",
      "CONV 789CD",
      "CONV 793D",
      "TRAN 777",
      "MFIN 777",
      "ALTE 930E",
      "MFIN 930E"
    ],
  MOTORES: ["MOTR 789CD", "MOTR 793D"],
  RODAJE: [],
  SOLDADURA: [],
  "COMPONENTES MENORES":[
    "Mando de circulo 16M",
    "Freno 16M",
    "Freno 16M3",
    "Rotocamara frontal 789/793",
    "Rotocamara trasera 789/793",
    "Ajustador de freno frontal",
    "Ajustador de freno trasero",
    "Freno de parqueo 834",
    "Freno de parqueo 854"
  ]
}

workshop.addEventListener("change", (e) => {
  componentInput.replaceChildren();
  const items = components[e.target.value];
  if(Array.isArray(items) && items.length > 0) {
    for (let i = 0; i < items.length; i++) {
      const option = document.createElement("option");
      option.value = items[i];
      option.text = items[i];
      componentInput.appendChild(option);
    } 
  }
})

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

    Swal.fire({
      title: 'Enviando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const res = await fetch("https://defaultc9a8e948bf0d4f8d9e9d551ac1b45a.48.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/403406fe6985492ca0ff581ed00693f1/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zTK-OlTY3MhKhpJyORGaODDcSJ-ctfbTFFWEUxknq9A", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Error al enviar los datos");


    Swal.close();
    Swal.fire({
      title: "Evidencias registradas con éxito.",
      icon: "success",
    })
    
    e.target.reset();
    photoCommentsDiv.innerHTML = "";
  } catch (err) {
    Swal.close();
    alert("Error: " + err.message);
  }
});



