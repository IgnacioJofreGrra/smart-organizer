<<<<<<< HEAD
const fs = require("fs-extra");
const path = require("path");
const crypto = require("crypto");

function hashArchivo(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);

    stream.on("error", reject);
    stream.on("data", chunk => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

async function organizarDirectorio(directorio) {
  if (!await fs.pathExists(directorio)) {
    throw new Error("El directorio no existe");
  }

  const archivos = await fs.readdir(directorio);
  const hashes = new Map();
  const resumen = {};
  const duplicados = []; // ✅ Guardamos duplicados para mostrar en frontend

  for (const archivo of archivos) {
    const archivoPath = path.join(directorio, archivo);

    let stats;
    try {
      stats = await fs.stat(archivoPath);
    } catch (err) {
      console.error(`⚠️ No se pudo acceder a: ${archivoPath} → ${err.message}`);
      continue;
    }

    if (stats.isFile()) {
      try {
        const ext = path.extname(archivo).toLowerCase().slice(1) || "SIN_EXTENSION";
        const carpetaTipo = path.join(directorio, ext.toUpperCase());

        await fs.ensureDir(carpetaTipo);
        const destino = path.join(carpetaTipo, archivo);

        if (archivoPath === destino) continue;

        const hash = await hashArchivo(archivoPath);
        if (hashes.has(hash)) {
          const carpetaDuplicados = path.join(directorio, "DUPLICADOS");
          await fs.ensureDir(carpetaDuplicados);
          await fs.move(archivoPath, path.join(carpetaDuplicados, archivo), { overwrite: true });
          duplicados.push(archivo); // ✅ Registrar duplicado
          console.log(`Duplicado detectado: ${archivo}`);
          continue;
        }

        hashes.set(hash, archivo);
        await fs.move(archivoPath, destino, { overwrite: false });

        resumen[ext.toUpperCase()] = (resumen[ext.toUpperCase()] || 0) + stats.size;
      } catch (err) {
        console.error(`❌ Error procesando archivo ${archivoPath}: ${err.message}`);
      }
    }
  }

  return { resumen, duplicados }; // ✅ Ahora devolvemos ambos
}

async function revertirOrganizacion(directorio) {
  if (!await fs.pathExists(directorio)) {
    throw new Error("El directorio no existe");
  }

  const carpetasTipo = await fs.readdir(directorio, { withFileTypes: true });

  for (const tipo of carpetasTipo) {
    if (!tipo.isDirectory()) continue;

    const rutaTipo = path.join(directorio, tipo.name);
    const subcarpetas = await fs.readdir(rutaTipo, { withFileTypes: true });

    for (const sub of subcarpetas) {
      if (!sub.isDirectory()) continue;

      // Solo detectamos carpetas con formato de fecha para revertir
      if (!/^\d{4}-\d{2}(-\d{2})?$/.test(sub.name)) continue;

      const rutaFecha = path.join(rutaTipo, sub.name);
      const archivos = await fs.readdir(rutaFecha);

      for (const archivo of archivos) {
        const origen = path.join(rutaFecha, archivo);
        const destino = path.join(rutaTipo, archivo);

        try {
          if (!fs.existsSync(destino)) {
            await fs.move(origen, destino);
          }
        } catch (err) {
          console.error(`⚠️ No se pudo mover ${origen}: ${err.message}`);
        }
      }

      const contenidoRestante = await fs.readdir(rutaFecha);
      if (contenidoRestante.length === 0) {
        await fs.remove(rutaFecha);
      }
    }
  }

  return "Reversión completada";
}

module.exports = {
  organizarDirectorio,
  revertirOrganizacion
};
=======
const fs = require("fs-extra");
const path = require("path");
const crypto = require("crypto");

function hashArchivo(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);

    stream.on("error", reject);
    stream.on("data", chunk => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

async function organizarDirectorio(directorio) {
  if (!await fs.pathExists(directorio)) {
    throw new Error("El directorio no existe");
  }

  const archivos = await fs.readdir(directorio);
  const hashes = new Map();
  const resumen = {};
  const duplicados = []; // ✅ Guardamos duplicados para mostrar en frontend

  for (const archivo of archivos) {
    const archivoPath = path.join(directorio, archivo);

    let stats;
    try {
      stats = await fs.stat(archivoPath);
    } catch (err) {
      console.error(`⚠️ No se pudo acceder a: ${archivoPath} → ${err.message}`);
      continue;
    }

    if (stats.isFile()) {
      try {
        const ext = path.extname(archivo).toLowerCase().slice(1) || "SIN_EXTENSION";
        const carpetaTipo = path.join(directorio, ext.toUpperCase());

        await fs.ensureDir(carpetaTipo);
        const destino = path.join(carpetaTipo, archivo);

        if (archivoPath === destino) continue;

        const hash = await hashArchivo(archivoPath);
        if (hashes.has(hash)) {
          const carpetaDuplicados = path.join(directorio, "DUPLICADOS");
          await fs.ensureDir(carpetaDuplicados);
          await fs.move(archivoPath, path.join(carpetaDuplicados, archivo), { overwrite: true });
          duplicados.push(archivo); // ✅ Registrar duplicado
          console.log(`Duplicado detectado: ${archivo}`);
          continue;
        }

        hashes.set(hash, archivo);
        await fs.move(archivoPath, destino, { overwrite: false });

        resumen[ext.toUpperCase()] = (resumen[ext.toUpperCase()] || 0) + stats.size;
      } catch (err) {
        console.error(`❌ Error procesando archivo ${archivoPath}: ${err.message}`);
      }
    }
  }

  return { resumen, duplicados }; // ✅ Ahora devolvemos ambos
}

async function revertirOrganizacion(directorio) {
  if (!await fs.pathExists(directorio)) {
    throw new Error("El directorio no existe");
  }

  const carpetasTipo = await fs.readdir(directorio, { withFileTypes: true });

  for (const tipo of carpetasTipo) {
    if (!tipo.isDirectory()) continue;

    const rutaTipo = path.join(directorio, tipo.name);
    const subcarpetas = await fs.readdir(rutaTipo, { withFileTypes: true });

    for (const sub of subcarpetas) {
      if (!sub.isDirectory()) continue;

      // Solo detectamos carpetas con formato de fecha para revertir
      if (!/^\d{4}-\d{2}(-\d{2})?$/.test(sub.name)) continue;

      const rutaFecha = path.join(rutaTipo, sub.name);
      const archivos = await fs.readdir(rutaFecha);

      for (const archivo of archivos) {
        const origen = path.join(rutaFecha, archivo);
        const destino = path.join(rutaTipo, archivo);

        try {
          if (!fs.existsSync(destino)) {
            await fs.move(origen, destino);
          }
        } catch (err) {
          console.error(`⚠️ No se pudo mover ${origen}: ${err.message}`);
        }
      }

      const contenidoRestante = await fs.readdir(rutaFecha);
      if (contenidoRestante.length === 0) {
        await fs.remove(rutaFecha);
      }
    }
  }

  return "Reversión completada";
}

module.exports = {
  organizarDirectorio,
  revertirOrganizacion
};
>>>>>>> 175db49a9bfe356904395033af855f200abeda53
