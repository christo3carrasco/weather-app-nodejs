require("dotenv").config();
const {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

//Main
const main = async () => {
  const busquedas = new Busquedas();
  let opt = "";

  //Menu
  do {
    opt = await inquirerMenu();
    switch (opt) {
      case 1:
        //Mostrar mensaje
        const termino = await leerInput("Ciudad:");
        //Buscar lugares
        const lugares = await busquedas.ciudad(termino);
        //Seleccionar lugar
        const id = await listarLugares(lugares);
        if (id === "0") continue;
        const lugarSel = lugares.find((lugar) => lugar.id === id);
        //Guardar DB
        busquedas.agregarHistorial(lugarSel.nombre);
        //Clima
        const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
        //Mostrar resultados
        console.clear();
        console.log("\nInformación de la ciudad\n".green);
        console.log("Ciudad:", lugarSel.nombre.green);
        console.log("Lat:", lugarSel.lat);
        console.log("Lng:", lugarSel.lng);
        console.log("Temperatura:", clima.temp);
        console.log("Mínima:", clima.min);
        console.log("Máxima:", clima.max);
        console.log("Estado:", clima.desc.green);
        break;
      //Historial
      case 2:
        busquedas.historial.forEach((lugar, i) => {
          const id = `${i + 1}.`.green;
          console.log(`${id} ${lugar}`);
        });
        break;
    }
    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
