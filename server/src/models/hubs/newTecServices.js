const dateFormat = require("dateformat");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
require('dotenv').config();

const fechaDescarga = new Date(); //Format date to '202106070445'
fechaDescarga.setHours(fechaDescarga.getHours()+4);
fechaDescarga.setMinutes(fechaDescarga.getMinutes() - fechaDescarga.getMinutes()%5)
let fileName = dateFormat(fechaDescarga, "yyyymmddHHMM");
downloadByURL(process.env.NT_TRAFFIC_URL_TEST.replace("$date", fileName));



//downloadByURL("http://172.17.11.135/remote-gui/ABE-HM1/localhost/mc/performance/performance_202106070445.csv");
function downloadTrafficData(nombreArchivo){ //throws WsExceptionService {
    if (nombreArchivo.length() !== 12){
        throw "El archivo debe tener el formato yyyyMMddHHmm";
    }
    let resource = process.env.NT_TRAFFIC_URL.replace("$date", nombreArchivo);

    let content = downloadByURL(resource);
    try {
        let anio = nombreArchivo.substring(0,4);
        let dia = nombreArchivo.substring(0,8);
        let rutaFinal = AppData.getInstance().getString(DataKeyNewtecService.WSNTS_RUTA_TRAFFIC) +
            anio + "/" + dia + "/" + file + ".csv";
        UtilsFile.writeTextFile(content, rutaFinal);
    } catch (e) {
        if(e instanceof IOException) {
            LOGGER.error("Error al escribir en ruta " + nombreArchivo);
            throw new WsExceptionService(500, "Error al escribir en ruta " + nombreArchivo);
        }
        else{
            LOGGER.error('Error inesperado al escribir en ruta ${nombreArchivo}');
            throw 'Error inesperado al escribir en ruta ${nombreArchivo}';
        }
    }
}

/**Lee una url y la retorna como texto*/
function downloadByURL(url) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.setRequestHeader("Authorization", "Basic " +
        Buffer.from(process.env.NT_USERNAME+":"+process.env.NT_PASSWORD).toString('base64'));
    request.send(null);
    request.onreadystatechange = function(){
        logger.verbose(request.status);
        if(request.readyState === 4 && request.status === 200){
            let type = request.getResponseHeader('Content-Type');
            if(type.indexOf("text") !==1){
                logger.debug('Se descargaron ' + request.responseText.split(process.env.NT_TRAFFIC_SEPARATOR).length + ' registros de ' + url);
                return request.responseText;
            }
        }
        return "";
    }
    // BufferedReader httpResponseReader = null;
    // try {
    //     // Connect to the web server endpoint
    //     URL serverUrl = new URL(AppData.getInstance().getString(DataKeyNewtecService.WSNTS_SERVER_TRAFFIC) + url);
    //     HttpURLConnection urlConnection = (HttpURLConnection) serverUrl.openConnection();
    //     urlConnection.setConnectTimeout(60000);
    //     urlConnection.setReadTimeout(60000);
    //     // Set HTTP method as GET
    //     urlConnection.setRequestMethod("GET");
    //     // Include the HTTP Basic Authentication payload
    //     urlConnection.addRequestProperty("Authorization", "Basic " + AppData.getInstance().getString(DataKeyNewtecService.WSNTS_AUTH));
    //     int resp = urlConnection.getResponseCode();
    //     // Read response from web server, which will trigger HTTP Basic Authentication request to be sent.
    //     httpResponseReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
    //     String lineRead;
    //     StringBuilder ret = new StringBuilder();
    //     int lines = 0;
    //     while((lineRead = httpResponseReader.readLine()) != null) {
    //         ret.append(lineRead).append("\n");
    //         lines++;
    //     }
    //     if (resp == 206 && lines > 5){
    //         LOGGER.warn("Obtvo ResponseCode 206, pero al obtener m�s de 5 filas, procesar� de todas formas!!!!");
    //         resp = 200;
    //     }
    //     if (resp != 200){
    //         throw new WsExceptionService(resp, "ResponseCode: " + resp + " for URL: " + url);
    //     }
    //     return ret.toString();
    // } catch (WsExceptionService ioe) {
    //     throw ioe;
    // } catch (Exception ioe) {
    //     throw new WsExceptionService(300, "Error al conectarse a " + AppData.getInstance().getString(DataKeyNewtecService.WSNTS_SERVER_TRAFFIC) + url + ": " + ioe.getMessage());
    // } finally {
    //     if (httpResponseReader != null) {
    //         try {
    //             httpResponseReader.close();
    //         } catch (IOException ioe) {
    //             // Close quietly
    //         }
    //     }
    // }
}