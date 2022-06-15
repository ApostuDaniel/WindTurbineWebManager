
const fetch = (url) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url))


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
            await updateTurbine(turbine);
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
    }
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

    var newData = {
        windSpeed: getNewWindSpeed(oldWindSpeed, currentWindSpeed),
        turbineWear: oldTurbineWear + 1,
        powerGenerated: oldPowerGenerated + 1,
        eficiency: oldEfficiency + 1
    }

    console.log(JSON.stringify(newData));
}

function getNewWindSpeed(oldWindSpeed, currentWindSpeed) {

}

updateTurbines();