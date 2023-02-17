const axios = require("axios").default;
const logger = require("./../../services/logger");

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEWTECURL
    : process.env.NEWTECMOCKURL; //POSTMAN MOCK SERVER
const prodNTDisabled =
  !process.env.NTREST_HABILITADO || process.env.NODE_ENV !== "production";
axios.defaults.headers.common.Authorization = process.env.NEWTECBASICAUTH;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
const instance = axios.create({
  baseURL: baseURL,
  timeout: process.env.NEWTECTIMEOUT || 10000,
});

/**
 * Obtiene el JSON del modem desde el hub Newtec
 * @param {Number} newtecId systemID del Newtec
 * @returns {Promise<{status:Number, message:String, data:JSON}>}
 */
async function getModem(newtecId) {
  // if(prodNTDisabled){
  //     logger.apiwarn(`No se solicito modem ${newtecId} por control`);
  //     return {status:500, message:`No se solicito modem ${newtecId} por control`};
  // }
  try {
    const resGet = await instance.get(`/modem/${newtecId}`);
    logger.silly(`Newtec reponde a get:/modem/${newtecId}`);
    return {
      status: 200,
      message: `Se recupero informacion del NT para el modem ${newtecId}`,
      data: resGet.data,
    };
  } catch (err) {
    logger.apierror(
      `No se pudo recuperar informacion del modem ${newtecId}\n${err}`
    );
    return {
      status: 500,
      message: `No se pudo recuperar informacion del modem ${newtecId}`,
      cause: err,
    };
  }
}

/**
 * Actualiza el service profile en el hub Newtec
 * @param {Number} systemId
 * @param {Number} idServiceProfile
 * @returns
 */
async function actualizarNivelServicio(systemId, idServiceProfile) {
  if (prodNTDisabled) {
    logger.apiwarn(`No se actualizo nivel de servicio ${systemId} por control`);
    return {
      status: 500,
      message: `No se actualizo nivel de servicio ${systemId} por control`,
    };
  }
  logger.debug(
    `NTREST: Inicia peticion para cambiar nivel de servicio modem ${systemId} a ${idServiceProfile}`
  );
  try {
    const resGet = await instance.get("/modem/" + systemId);
    logger.silly(`Newtec reponde a get:/modem/${systemId}`);
    resGet.data["serviceProfileId"]["systemId"] = idServiceProfile;
    const peticion = resGet.data;
    logger.silly(
      "Nuevo service profile a" + resGet.data["serviceProfileId"]["systemId"]
    );
    const resPut = await instance.put("modem/" + systemId, peticion);
    logger.debug("NTREST-actualizarNivelServicio a modem " + systemId);
    return {
      status: 200,
      message: "Se actualizo el perfil",
      data: resPut.data,
    };
  } catch (err) {
    logger.apierror(
      "No se pudo actualizar el nivel de servicio del modem " + err
    );
    return { status: 500, message: "No se pudo bloquear el modem", cause: err };
  }
}

/**
 * Bloquea el modem desde el hub Newtec
 * @param {Number} systemId
 * @returns
 */
async function bloquearModem(systemId) {
  if (prodNTDisabled) {
    return {
      status: 500,
      message: `No se bloqueo el modem ${systemId} por control`,
    };
  }
  logger.info("NTREST: Inicia peticion para bloquear modem " + systemId);
  instance
    .post("/modem/" + systemId + "/lock")
    .then((res) => {
      logger.apiinfo("NTREST-bloquearModem: " + JSON.stringify(res.data));
      return res.data;
    })
    .catch((err) => {
      logger.apierror("No se pudo bloquear el modem" + err);
      return {
        status: 500,
        message: "No se pudo bloquear el modem ",
        cause: err,
      };
    });
}

/**
 * Desbloquea el modem desde el hub Newtec
 * @param {Number} systemId
 * @returns
 */
async function desbloquearModem(systemId) {
  if (prodNTDisabled) {
    return {
      status: 500,
      message: `No se desbloqueo el modem ${systemId} por control`,
    };
  }
  logger.info("NTREST: Inicia peticion para desbloquear modem " + systemId);
  instance
    .delete("/modem/" + systemId + "/lock")
    .then((res) => {
      logger.apiinfo("NTREST-desbloquearModem: " + JSON.stringify(res.data));
      return res.data;
    })
    .catch((err) => {
      logger.apierror("No se pudo desbloquear el modem" + err);
      return {
        status: 500,
        message: "No se pudo desbloquear el modem",
        cause: err,
      };
    });
}

/**
 * NOT TESTED:Provisiona un modem en el hub Newtec con un JSON: {name, mac}
 * @param {*} modemJson
 * @returns
 */
async function crearModem(modemJson) {
  if (prodNTDisabled) {
    return { status: 500, message: `No se creo el modem por control` };
  }
  logger.info(
    `NTREST: Inicia peticion para crear modem ${modemJson["description"]}`
  );
  try {
    //TODO: Implementar schema checker
    const resPut = await instance.put(
      "modem/" + systemId,
      JSON.stringify(modemJson)
    );
    logger.apiinfo("NTREST-crearModem: " + JSON.stringify(resPut.data));
    return resPut.data;
  } catch (err) {
    logger.apierror("No se pudo crear el modem" + err);
    return { status: 500, message: "No se pudo crear el modem", cause: err };
  }
}

/**
 * NOT TESTED -> Crea modems en base a un array de JSONs con {name, mac}
 * @param {Array} infoModems
 * @returns
 */
async function provisionarModems(infoModems) {
  if (prodNTDisabled) {
    return { status: 500, message: `No se crearon los modems por control` };
  }
  //Asumimos infoModems llega como array de JSONs
  if (Array.isArray(infoModems)) {
    logger.error("infoModems debe ser un array");
    return;
  }
  try {
    return await Promise.all(
      infoModems.map(async (modemJson) => await crearModem(modemJson))
    );
  } catch (err) {
    logger.error("No se pudo provisionar modems " + err);
  }
}

module.exports = {
  provisionarModems,
  crearModem,
  bloquearModem,
  desbloquearModem,
  actualizarNivelServicio,
  getModem,
};
