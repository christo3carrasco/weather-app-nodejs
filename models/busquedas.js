const fs = require("fs");
const axios = require("axios");

//Clase Busquedas
class Busquedas {
  historial = [];
  dbPath = "./db/database.json";
  //Constructor
  constructor() {
    this.leerDB();
  }

  //Parametros Mapbox
  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  //Parametros OpenWeather
  get paramsOpenWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  //Método buscar ciudad
  async ciudad(lugar = "") {
    try {
      //Petición http
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox,
      });

      const resp = await instance.get();
      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  //Método buscar clima
  async climaLugar(lat, lon) {
    try {
      //Petición http
      const instance = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: { ...this.paramsOpenWeather, lat, lon },
      });

      const resp = await instance.get();
      const { weather, main } = resp.data;

      return {
        temp: main.temp,
        min: main.temp_min,
        max: main.temp_max,
        desc: weather[0].description,
      };
    } catch (error) {
      console.log(error);
    }
  }

  //Método agregar busqueda al historial
  agregarHistorial(lugar = "") {
    //Excluir duplicados
    if (this.historial.includes(lugar)) {
      return;
    }
    //Limitar a ultimas cinco busquedas
    this.historial = this.historial.splice(0, 4);
    //Agregar al historial
    this.historial.unshift(lugar);
    //Grabar en la DB
    this.guardarDB();
  }

  //Método escribir en la database
  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  //Método leer de la database
  leerDB() {
    if (!fs.existsSync(this.dbPath)) return;
    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);
    this.historial = data.historial;
  }
}

module.exports = Busquedas;
