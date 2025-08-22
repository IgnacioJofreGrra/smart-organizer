<<<<<<< HEAD
const directorio = document.getElementById("rutaDirectorio");
const organizarBtn = document.getElementById("btnOrganizar");
const seleccionarCarpetaBtn = document.getElementById("btnSeleccionar");
const resultado = document.getElementById("resultados");
const revertirBtn = document.getElementById("btnRevertir");
let chart;

organizarBtn.addEventListener("click", async () => {
  // Verificar y reinsertar elementos si no existen antes de organizar
  const resultadosDiv = document.getElementById("resultados");
  if (resultadosDiv) {
    if (!document.getElementById("lista-resultados")) {
      const ul = document.createElement("ul");
      ul.id = "lista-resultados";
      resultadosDiv.appendChild(ul);
      console.log("[DEBUG] Reinserta <ul id='lista-resultados'> en el DOM");
    }
    if (!document.getElementById("grafico")) {
      const canvas = document.createElement("canvas");
      canvas.id = "grafico";
      canvas.width = 400;
      canvas.height = 200;
      canvas.style.marginTop = "2rem";
      resultadosDiv.appendChild(canvas);
      console.log("[DEBUG] Reinserta <canvas id='grafico'> en el DOM");
    }
  }
  console.log("[DEBUG] --- INICIO PROCESO ORGANIZAR ---");
  const ruta = directorio.value.replace(/^"(.*)"$/, "$1").trim();
  console.log("[DEBUG] Ruta ingresada:", ruta);

  if (!ruta) {
    console.warn("[DEBUG] Ruta vacía o inválida");
    console.log("[DEBUG] --- FIN PROCESO ORGANIZAR (ruta inválida) ---");
    return Swal.fire({
      icon: "warning",
      title: "Ruta inválida",
      text: "Por favor ingresa o selecciona una ruta válida."
    });
  }

  try {
    console.log("[DEBUG] Llamando a electronAPI.organizarArchivos");
    const { resumen, duplicados } = await window.electronAPI.organizarArchivos(ruta);
    console.log("[DEBUG] Respuesta organizarArchivos:", { resumen, duplicados });

    Swal.fire({
      icon: "success",
      title: "¡Organización completada!",
      text: "Los archivos fueron organizados correctamente."
    });
    console.log("[DEBUG] Mostrando mensaje de éxito");
    // Limpiar resultados previos
    const listaResultados = document.getElementById("lista-resultados");
    console.log("[DEBUG] Elemento lista-resultados:", listaResultados);
    if (!listaResultados) {
      console.warn("[DEBUG] El elemento 'lista-resultados' no existe en el DOM.");
    } else {
      listaResultados.innerHTML = "";

      // Mostrar resumen por tipo de archivo
      if (resumen && Object.keys(resumen).length > 0) {
        console.log("[DEBUG] Mostrando resumen por tipo de archivo");
        for (const [tipo, size] of Object.entries(resumen)) {
          const li = document.createElement("li");
          li.textContent = `Tipo: ${tipo} - Tamaño total: ${size} bytes`;
          listaResultados.appendChild(li);
        }
      } else {
        console.log("[DEBUG] No se encontraron archivos para organizar");
        const li = document.createElement("li");
        li.textContent = "No se encontraron archivos para organizar.";
        listaResultados.appendChild(li);
      }

      // Mostrar duplicados si existen
      if (duplicados && duplicados.length > 0) {
        console.log("[DEBUG] Mostrando duplicados detectados");
        const li = document.createElement("li");
        li.innerHTML = `<strong>Duplicados detectados:</strong> <ul>${duplicados.map(d => `<li>${d}</li>`).join("")}</ul>`;
        listaResultados.appendChild(li);
      }
    }

    if (window.renderGrafico) {
      console.log("[DEBUG] Llamando a renderGrafico");
      window.renderGrafico(resumen);
    }
    console.log("[DEBUG] --- FIN PROCESO ORGANIZAR (éxito) ---");
  } catch (e) {
    console.error("[DEBUG] Error en organizarArchivos:", e);
    Swal.fire({
      icon: "error",
      title: "Error al organizar",
      text: e.message,
      footer: "Revisa permisos de carpeta o caracteres especiales en la ruta."
    });
    resultado.textContent = "Error: " + e.message;
    console.log("[DEBUG] --- FIN PROCESO ORGANIZAR (error) ---");
  }
});

seleccionarCarpetaBtn.addEventListener("click", async () => {
  const ruta = await window.electronAPI.seleccionarCarpeta();
  if (ruta) {
    directorio.value = ruta;
    Swal.fire({
      icon: "info",
      title: "Carpeta seleccionada",
      text: ruta
    });
  }
});

revertirBtn.addEventListener("click", async () => {
    // Verificar y reinsertar elementos si no existen
    const resultadosDiv = document.getElementById("resultados");
    if (resultadosDiv) {
      if (!document.getElementById("lista-resultados")) {
        const ul = document.createElement("ul");
        ul.id = "lista-resultados";
        resultadosDiv.appendChild(ul);
        console.log("[DEBUG] Reinserta <ul id='lista-resultados'> en el DOM");
      }
      if (!document.getElementById("grafico")) {
        const canvas = document.createElement("canvas");
        canvas.id = "grafico";
        canvas.width = 400;
        canvas.height = 200;
        canvas.style.marginTop = "2rem";
        resultadosDiv.appendChild(canvas);
        console.log("[DEBUG] Reinserta <canvas id='grafico'> en el DOM");
      }
    }
  const ruta = directorio.value.replace(/^"(.*)"$/, "$1").trim();

  if (!ruta) {
    return Swal.fire({
      icon: "warning",
      title: "Ruta inválida",
      text: "Por favor ingresa o selecciona una ruta válida."
    });
  }

  try {
    await window.electronAPI.revertirOrganizacion(ruta);
    Swal.fire({
      icon: "success",
      title: "¡Reversión completada!",
      text: "Los archivos han sido restaurados al directorio raíz."
    });
  // Limpiar solo el contenido de la lista y el gráfico, sin eliminar los elementos base
  const listaResultados = document.getElementById("lista-resultados");
  if (listaResultados) listaResultados.innerHTML = "";
  if (chart) chart.destroy();
  resultado.textContent = "Reversión completada 🔁";
  } catch (e) {
    Swal.fire({
      icon: "error",
      title: "Error al revertir",
      text: e.message
    });
    resultado.textContent = "Error al revertir: " + e.message;
  }
});

window.renderGrafico = function (resumen) {
  const ctxElem = document.getElementById("grafico");
  if (!ctxElem) {
    console.warn("[DEBUG] El canvas 'grafico' no existe en el DOM.");
    return;
  }
  const ctx = ctxElem.getContext("2d");
  const tipos = Object.keys(resumen);
  const pesos = Object.values(resumen).map(b => +(b / 1024).toFixed(2)); // KB

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: tipos,
      datasets: [{
        label: "Tamaño (KB)",
        data: pesos,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
};
=======
const directorio = document.getElementById("rutaDirectorio");
const organizarBtn = document.getElementById("btnOrganizar");
const seleccionarCarpetaBtn = document.getElementById("btnSeleccionar");
const resultado = document.getElementById("resultados");
const revertirBtn = document.getElementById("btnRevertir");
let chart;

organizarBtn.addEventListener("click", async () => {
  // Verificar y reinsertar elementos si no existen antes de organizar
  const resultadosDiv = document.getElementById("resultados");
  if (resultadosDiv) {
    if (!document.getElementById("lista-resultados")) {
      const ul = document.createElement("ul");
      ul.id = "lista-resultados";
      resultadosDiv.appendChild(ul);
      console.log("[DEBUG] Reinserta <ul id='lista-resultados'> en el DOM");
    }
    if (!document.getElementById("grafico")) {
      const canvas = document.createElement("canvas");
      canvas.id = "grafico";
      canvas.width = 400;
      canvas.height = 200;
      canvas.style.marginTop = "2rem";
      resultadosDiv.appendChild(canvas);
      console.log("[DEBUG] Reinserta <canvas id='grafico'> en el DOM");
    }
  }
  console.log("[DEBUG] --- INICIO PROCESO ORGANIZAR ---");
  const ruta = directorio.value.replace(/^"(.*)"$/, "$1").trim();
  console.log("[DEBUG] Ruta ingresada:", ruta);

  if (!ruta) {
    console.warn("[DEBUG] Ruta vacía o inválida");
    console.log("[DEBUG] --- FIN PROCESO ORGANIZAR (ruta inválida) ---");
    return Swal.fire({
      icon: "warning",
      title: "Ruta inválida",
      text: "Por favor ingresa o selecciona una ruta válida."
    });
  }

  try {
    console.log("[DEBUG] Llamando a electronAPI.organizarArchivos");
    const { resumen, duplicados } = await window.electronAPI.organizarArchivos(ruta);
    console.log("[DEBUG] Respuesta organizarArchivos:", { resumen, duplicados });

    Swal.fire({
      icon: "success",
      title: "¡Organización completada!",
      text: "Los archivos fueron organizados correctamente."
    });
    console.log("[DEBUG] Mostrando mensaje de éxito");
    // Limpiar resultados previos
    const listaResultados = document.getElementById("lista-resultados");
    console.log("[DEBUG] Elemento lista-resultados:", listaResultados);
    if (!listaResultados) {
      console.warn("[DEBUG] El elemento 'lista-resultados' no existe en el DOM.");
    } else {
      listaResultados.innerHTML = "";

      // Mostrar resumen por tipo de archivo
      if (resumen && Object.keys(resumen).length > 0) {
        console.log("[DEBUG] Mostrando resumen por tipo de archivo");
        for (const [tipo, size] of Object.entries(resumen)) {
          const li = document.createElement("li");
          li.textContent = `Tipo: ${tipo} - Tamaño total: ${size} bytes`;
          listaResultados.appendChild(li);
        }
      } else {
        console.log("[DEBUG] No se encontraron archivos para organizar");
        const li = document.createElement("li");
        li.textContent = "No se encontraron archivos para organizar.";
        listaResultados.appendChild(li);
      }

      // Mostrar duplicados si existen
      if (duplicados && duplicados.length > 0) {
        console.log("[DEBUG] Mostrando duplicados detectados");
        const li = document.createElement("li");
        li.innerHTML = `<strong>Duplicados detectados:</strong> <ul>${duplicados.map(d => `<li>${d}</li>`).join("")}</ul>`;
        listaResultados.appendChild(li);
      }
    }

    if (window.renderGrafico) {
      console.log("[DEBUG] Llamando a renderGrafico");
      window.renderGrafico(resumen);
    }
    console.log("[DEBUG] --- FIN PROCESO ORGANIZAR (éxito) ---");
  } catch (e) {
    console.error("[DEBUG] Error en organizarArchivos:", e);
    Swal.fire({
      icon: "error",
      title: "Error al organizar",
      text: e.message,
      footer: "Revisa permisos de carpeta o caracteres especiales en la ruta."
    });
    resultado.textContent = "Error: " + e.message;
    console.log("[DEBUG] --- FIN PROCESO ORGANIZAR (error) ---");
  }
});

seleccionarCarpetaBtn.addEventListener("click", async () => {
  const ruta = await window.electronAPI.seleccionarCarpeta();
  if (ruta) {
    directorio.value = ruta;
    Swal.fire({
      icon: "info",
      title: "Carpeta seleccionada",
      text: ruta
    });
  }
});

revertirBtn.addEventListener("click", async () => {
    // Verificar y reinsertar elementos si no existen
    const resultadosDiv = document.getElementById("resultados");
    if (resultadosDiv) {
      if (!document.getElementById("lista-resultados")) {
        const ul = document.createElement("ul");
        ul.id = "lista-resultados";
        resultadosDiv.appendChild(ul);
        console.log("[DEBUG] Reinserta <ul id='lista-resultados'> en el DOM");
      }
      if (!document.getElementById("grafico")) {
        const canvas = document.createElement("canvas");
        canvas.id = "grafico";
        canvas.width = 400;
        canvas.height = 200;
        canvas.style.marginTop = "2rem";
        resultadosDiv.appendChild(canvas);
        console.log("[DEBUG] Reinserta <canvas id='grafico'> en el DOM");
      }
    }
  const ruta = directorio.value.replace(/^"(.*)"$/, "$1").trim();

  if (!ruta) {
    return Swal.fire({
      icon: "warning",
      title: "Ruta inválida",
      text: "Por favor ingresa o selecciona una ruta válida."
    });
  }

  try {
    await window.electronAPI.revertirOrganizacion(ruta);
    Swal.fire({
      icon: "success",
      title: "¡Reversión completada!",
      text: "Los archivos han sido restaurados al directorio raíz."
    });
  // Limpiar solo el contenido de la lista y el gráfico, sin eliminar los elementos base
  const listaResultados = document.getElementById("lista-resultados");
  if (listaResultados) listaResultados.innerHTML = "";
  if (chart) chart.destroy();
  resultado.textContent = "Reversión completada 🔁";
  } catch (e) {
    Swal.fire({
      icon: "error",
      title: "Error al revertir",
      text: e.message
    });
    resultado.textContent = "Error al revertir: " + e.message;
  }
});

window.renderGrafico = function (resumen) {
  const ctxElem = document.getElementById("grafico");
  if (!ctxElem) {
    console.warn("[DEBUG] El canvas 'grafico' no existe en el DOM.");
    return;
  }
  const ctx = ctxElem.getContext("2d");
  const tipos = Object.keys(resumen);
  const pesos = Object.values(resumen).map(b => +(b / 1024).toFixed(2)); // KB

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: tipos,
      datasets: [{
        label: "Tamaño (KB)",
        data: pesos,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
};
>>>>>>> 175db49a9bfe356904395033af855f200abeda53
