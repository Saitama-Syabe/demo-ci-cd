// Petit serveur local, sans dépendance, pour ouvrir l'application dans le navigateur.
// Lancement : npm start, puis http://localhost:3000

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = fileURLToPath(new URL("../src/", import.meta.url));
const PORT = Number(process.env.PORT ?? 3000);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
};

createServer(async (requete, reponse) => {
  const chemin = requete.url === "/" ? "/index.html" : decodeURIComponent(requete.url.split("?")[0]);
  const fichier = normalize(join(RACINE, chemin));
  if (!fichier.startsWith(normalize(RACINE))) {
    reponse.writeHead(403).end();
    return;
  }
  try {
    const contenu = await readFile(fichier);
    reponse.writeHead(200, { "Content-Type": TYPES[extname(fichier)] ?? "application/octet-stream" });
    reponse.end(contenu);
  } catch {
    reponse.writeHead(404).end("Introuvable");
  }
}).listen(PORT, () => {
  console.log(`Application disponible sur http://localhost:${PORT}`);
});
