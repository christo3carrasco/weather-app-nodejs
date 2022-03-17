const inquirer = require("inquirer");
require("colors");

//Preguntas menu
const preguntas = [
  {
    type: "list",
    name: "opcion",
    message: "¿Qué desea hacer?",
    choices: [
      {
        value: 1,
        name: `${"1.".red} Buscar ciudad`,
      },
      {
        value: 2,
        name: `${"2.".red} Historial`,
      },
      {
        value: 0,
        name: `${"0.".red} Salir`,
      },
    ],
  },
];

//Menu
const inquirerMenu = async () => {
  console.clear();
  console.log("=========================".america);
  console.log("  Seleccione una opción".green);
  console.log("=========================\n".america);

  const { opcion } = await inquirer.prompt(preguntas);
  return opcion;
};

//Espera
const pausa = async () => {
  const pause = {
    type: "input",
    name: "enter",
    message: `Presione ${"ENTER".green} para continuar.`,
  };
  console.log("\n");
  await inquirer.prompt(pause);
};

//Leer entrada
const leerInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor.";
        }
        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
};

//Listar lugares
const listarLugares = async (lugares = []) => {
  const choices = lugares.map((lugar, i) => {
    const id = `${i + 1}.`.green;
    return {
      value: lugar.id,
      name: `${id} ${lugar.nombre}`,
    };
  });
  choices.unshift({
    value: "0",
    name: "0.".green + " Cancelar",
  });
  const preguntas = [
    {
      type: "list",
      name: "id",
      message: "Seleccione lugar:",
      choices,
    },
  ];
  const { id } = await inquirer.prompt(preguntas);
  return id;
};

//Confirmar selección
const confirmar = async (message) => {
  const question = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];
  const { ok } = await inquirer.prompt(question);
  return ok;
};

module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
  confirmar,
};
