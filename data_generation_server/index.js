const fetch = (url) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url))

const UPDATE_TIME_DELAY = 5000;

/**
 * Gets all the turbines from the api
 * @returns the array of json objects, representing turbines
 */
async function getTurbines() {
    const turbines_api_url = 'http://localhost:5000/api/turbines';

    const data = await fetch(turbines_api_url);
    const turbines = await data.json();

    return turbines;
}

/**
 * Gets all the turbines and updates the data for each one
 */
async function updateTurbines()
{
    while(1)
    {
        const turbines = await getTurbines();

        for(turbine of turbines) {
            const state = turbine.turbineState;
            if(state === 'Running') {
                await updateTurbine(turbine);
            }
            else {
                await stopTurbine(turbine);
            }
        }

        await new Promise(resolve => setTimeout(resolve, UPDATE_TIME_DELAY));
    }
}

/**
 * Sets all values for the turbine to 0
 * @param {JSON} turbine 
 */
async function stopTurbine(turbine) {
    const id = turbine._id;

    console.log('Turbine old: ');
    console.log(turbine);
    const date = Date.now();
    var newData = {
        "windSpeed": 0,
        "turbineWear": 0,
        "powerGenerated": 0,
        "eficiency": 0,
        "timeStamp": date.valueOf()
    }

    await postNewData(id, newData);
}

/**
 * Updates the data for one single turbine
 * @param {JSON} turbine 
 */
async function updateTurbine(turbine) {
    var newData;
    const id = turbine._id;

    const lat = turbine.latitude;
    const lng = turbine.longitude;
    const turbine_latest_data_api_url = `http://localhost:5000/api/turbines/data/${id}/new`;

    const data = await fetch(turbine_latest_data_api_url);
    const turbineData = await data.json();

    console.log('Turbine old: ');
    console.log(turbineData);

    if(turbineData.message === null) {
        const oldWindSpeed = turbineData.windSpeed;
        const oldTurbineWear = turbineData.turbineWear;
        const oldPowerGenerated = turbineData.powerGenerated;
        const oldEfficiency = turbineData.eficiency;

        const weather_api_url = `http://api.weatherapi.com/v1/current.json?key=2407cb95cd0e4b31971101252221306&q=${lat},${lng}&aqi=no`;
        const response = await fetch(weather_api_url);
        const json = await response.json();

        const currentWindSpeed = json.current.wind_mph;
        const currentTemperature = json.current.temp_c;
        const currentHummidity = json.current.humidity;

        const date = Date.now();
        const newWindSpeed = getNewWindSpeed(oldWindSpeed, currentWindSpeed);
        const newTurbineWear = getNewTurbineWear(oldTurbineWear, newWindSpeed, currentTemperature, currentHummidity);
        const newPowerGenerated = getNewPowerGenerated(oldPowerGenerated, newWindSpeed);
        const newEffieciency = getNewEfficiency(oldEfficiency, oldPowerGenerated, newPowerGenerated);

        newData = {
            "windSpeed": newWindSpeed,
            "turbineWear": newTurbineWear,
            "powerGenerated": newPowerGenerated,
            "eficiency": newEffieciency,
            "timeStamp": date.valueOf()
        }
    } else {
        const weather_api_url = `http://api.weatherapi.com/v1/current.json?key=2407cb95cd0e4b31971101252221306&q=${lat},${lng}&aqi=no`;
        const response = await fetch(weather_api_url);
        const json = await response.json();

        const currentWindSpeed = json.current.wind_mph;
        const currentTemperature = json.current.temp_c;
        const currentHummidity = json.current.humidity;

        const date = Date.now();
        const newWindSpeed = currentWindSpeed;
        const newTurbineWear = 0;
        const newPowerGenerated = currentWindSpeed;
        const newEffieciency = 0.5;

        newData = {
            "windSpeed": newWindSpeed,
            "turbineWear": newTurbineWear,
            "powerGenerated": newPowerGenerated,
            "eficiency": newEffieciency,
            "timeStamp": date.valueOf()
        }
    }

    await postNewData(id, newData);
}

function getNewWindSpeed(oldWindSpeed, currentWindSpeed) {
    return oldWindSpeed + currentWindSpeed / 2;
}

function getNewTurbineWear(oldTurbineWear, windSpeed, temperature, humidity) {
    let newTurbineWear = oldTurbineWear;

    if(windSpeed > 50) {
        newTurbineWear += 0.1;
    }

    if(temperature > 30) {
        newTurbineWear += 0.05;
    }

    if(humidity > 60) {
        newTurbineWear += 0.04;
    }

    return newTurbineWear;
}

function getNewPowerGenerated(oldPowerGenerated, windSpeed) {
    return oldPowerGenerated + windSpeed / 10;
}

function getNewEfficiency(oldEfficiency, oldPowerGenerated, newPowerGenerated) {
    return (newPowerGenerated - oldPowerGenerated > 20) ? oldEfficiency + 0.01 : oldEfficiency - 0.01;
}

async function postNewData(id, newData) {
    console.log('Turbine new: ');
    console.log(newData);
    const turbine_post_new_data_api_url = `http://localhost:5000/turbines/newdata/${id}`;
    const response = await fetch(turbine_post_new_data_api_url, {
        method: "PUT",
        mode: "cors",
        body: JSON.stringify(newData),
        headers: { "Content-Type": "application/json" }
    });

    console.log(response);
}

updateTurbines();