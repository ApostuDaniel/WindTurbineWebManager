
const fetch = (url) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url))

async function getTurbines() {
    const data = await fetch('http://localhost:5000/api/turbines');
    const turbines = await data.json();

    return turbines;
}

async function updateTurbines()
{
    while(1)
    {
        const turbines = await getTurbines();

        for(turbine of turbines) {
            await updateTurbine(turbine);
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

async function updateTurbine(turbine) {
    const lat = turbine.latitude;
    const lng = turbine.longitude;

    const weather_api_url = `http://api.weatherapi.com/v1/current.json?key=2407cb95cd0e4b31971101252221306&q=${lat},${lng}&aqi=no`;
    const response = await fetch(weather_api_url);
    const json = await response.json();

    const locat = json.location.country + ', ' + json.location.region + ', ' + json.location.name;
    const wind = json.current.wind_mph;
    const temp = json.current.temp_c;
    const hum = json.current.humidity;

    console.log(locat);
}

updateTurbines();