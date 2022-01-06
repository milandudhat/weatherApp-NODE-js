const http = require('http');
const fs = require('fs');
var requests = require('requests');
const { emitKeypressEvents } = require('readline');

const mainfile = fs.readFileSync('index.html', 'utf-8');
// console.log(mainfile);
const replaceVal = (tempvalue, origvalue) => {

    origvalue.main.temp = parseFloat(origvalue.main.temp - 273.15). toFixed(2)
    origvalue.main.temp_min = parseFloat(origvalue.main.temp_min - 273.15). toFixed(2)
    origvalue.main.temp_max = parseFloat(origvalue.main.temp_max - 273.15). toFixed(2)

    let temperature = tempvalue.replace('{%tempvalue%}', origvalue.main.temp)
    temperature = temperature.replace('{%tempmin%}', origvalue.main.temp_min)
    temperature = temperature.replace('{%tempmax%}', origvalue.main.temp_max)
    temperature = temperature.replace('{%location%}', origvalue.name)
    temperature = temperature.replace('{%country%}', origvalue.sys.country)
    temperature = temperature.replace('{%tempstatus%}', origvalue.weather[0].main)

    return temperature;


};

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=surat&appid=825a744eff7a90f38312217d5859d499')

            .on("data", (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                // console.log(arrData[0].main.temp);
                const realTimeData = arrData
                  .map((val) => replaceVal(mainfile, val))
                  .join("");
                res.write(realTimeData);
                // console.log(realTimeData);
              })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end()
                // console.log('end');
            });
    }
})


server.listen(5500, '127.0.0.1', () => {
    console.log('Server listen on port - 5500');

})