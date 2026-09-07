import "dotenv/config"
import { algoliasearch } from "algoliasearch";
import { readFile } from "node:fs/promises";

const app_id = process.env.VITE_ALGOLIA_APPLICATION_ID
const write_api_key = process.env.VITE_ALGOLIA_WRITE_API_KEY
if (!app_id) console.error("Variable de entorno faltante: VITE_ALGOLIA_APPLICATION_ID")
if (!write_api_key) console.error("Variable de entorno faltante: VITE_ALGOLIA_WRITE_API_KEY")

const index_name = "laboratorio_2"
const client = algoliasearch(app_id, write_api_key);

/**
 * Lee y parsea el archivo JSON con los records a indexar
 * Si el record no tiene objectID automaticamente se le asigna uno
 * Asigna automaticamente la cantidad disponible de productos segun el canal de venta
 * @returns Array de records
 * @throws {Error} Si el archivo no contiene un array válido
 */
async function get_records() {
  const content = await readFile("data/records.json", "utf-8")
  const records = JSON.parse(content)
  if (!Array.isArray(records)) {
    throw new Error("El JSON debe ser un array de objetos")
  }
  return records
}

/**
 * Sube los records al índice de Algolia
 */
async function seed_algolia() {
  const records = await get_records();
  const { taskID } = await client.saveObjects({
    indexName: index_name,
    objects: records,
  })
}

/**
 * Ejecuta el seed y maneja errores
 */
seed_algolia().catch((Error) => {
  console.error("Error al poblar el indice:", Error);
  process.exit(1);
});
