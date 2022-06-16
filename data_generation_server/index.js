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
    const id = turbine._id;
    const turbine_latest_data_api_url = `http://localhost:5000/api/turbines/data/${id}/new`;

    const data = await fetch(turbine_latest_data_api_url);
    const turbineData = await data.json();

    console.log(turbineData);

    const lat = turbine.latitude;
    const lng = turbine.longitude;
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
    var newData = {
        "windSpeed": newWindSpeed,
        "turbineWear": newTurbineWear,
        "powerGenerated": newPowerGenerated,
        "eficiency": oldEfficiency + 1,
        "timeStamp": date.valueOf()
    }

    await postNewData(id, newData);
}

function getNewWindSpeed(oldWindSpeed, currentWindSpeed) {
    return oldWindSpeed + currentWindSpeed / 2;
}

function getNewTurbineWear(oldTurbineWear, windSpeed, temperature, humidity) {
    let newTurbineWear = oldTurbineWear;

    if(windSpeed > 50) {
        newTurbineWear += 0.3;
    }

    if(temperature > 30) {
        newTurbineWear += 0.1;
    }

    if(humidity > 60) {
        newTurbineWear += 0.2;
    }

    return newTurbineWear;
}

function getNewPowerGenerated(oldPowerGenerated, windSpeed) {
    return oldPowerGenerated + windSpeed;
}

// function getNewEfficiency() {
//     reutrn 
// }

async function postNewData(id, newData) {
    console.log(JSON.stringify(newData));
    // const turbine_post_new_data_api_url = `http://localhost:5000/turbines/newdata/${id}`;
    // await fetch(turbine_post_new_data_api_url, {
    //     method: "POST",
    //     body: JSON.stringify(newData),
    //     headers: { "Content-Type": "application/json" }
    // });
}

updateTurbines();