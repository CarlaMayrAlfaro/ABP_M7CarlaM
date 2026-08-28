import app, { initDatabase } from "./src/app.js";

import yargs from "yargs";
import chalk from "chalk";

const puertoMin = 3000;
const puertoMax = 3010;

const argv = yargs(process.argv.slice(2))
  .option("p", {
    alias: "puerto",
    demandOption: true,
    default: 3000,
    describe: `Ingresa el puerto para levantar el servidor entre [${puertoMin} y ${puertoMax}]`,
    type: "number",
  })
  .parse();

let puerto = argv.puerto;

if (puerto < puertoMin || puerto > puertoMax) {
  console.log(
    chalk.red(
      `❌ Debe seleccionar un puerto dentro del rango: [${puertoMin} - ${puertoMax}]`
    )
  );

  process.exit(1);
}

try {
  await initDatabase();

  app.listen(puerto, () => {
    console.log(
      `Servidor escuchando en http://localhost:${puerto}`
    );
  });
} catch (error) {
  console.error(
    "❌ No se pudo iniciar la aplicación:",
    error.message
  );

  process.exit(1);
}

