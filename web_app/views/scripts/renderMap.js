function initMap() {
  const mapDiv = document.getElementById("map");
  const map = new google.maps.Map(mapDiv, {
    zoom: 8,
    center: {lat: 47.397, lng: 27.644}
  });

  let infoWindow = new google.maps.InfoWindow({
    content: "Click the map to get Lat/Lng!",
    position: {lat: 47.397, lng: 27.644},
  });

  infoWindow.open(map);

  map.addListener("click", async mapsMouseEvent => {
    const coords = mapsMouseEvent.latLng.toJSON();
    infoWindow.close();
    
    const lat = coords.lat;
    const lng = coords.lng;

    const weather_api_url = `http://api.weatherapi.com/v1/current.json?key=2407cb95cd0e4b31971101252221306&q=${lat},${lng}&aqi=no`;
    const response = await fetch(weather_api_url);
    const json = await response.json();

    const locat = json.location.country + ', ' + json.location.region + ', ' + json.location.name;
    const wind = json.current.wind_mph;
    const temp = json.current.temp_c;
    const hum = json.current.humidity;

    const alt = await getAltitude(lat, lng);
    // const sol = await getSoilData(lat, lng);
    const sol = 0;

    infoWindow = new google.maps.InfoWindow({
      position: {lat, lng},
    });

    infoWindow.setContent(locat + " " + lat + " " + lng);
    infoWindow.open(map);

    updateAtributes(locat, lat, lng, wind, temp, hum, alt, sol);
  }, {passive: true})
}

async function getSoilData(lat, lng) {
  const elevation_api_url = `https://api.ambeedata.com/soil/latest/by-lat-lng?lat=${lat}&lng=${lng}`;
  const response = await fetch(elevation_api_url, {headers: {
    "x-api-key": "d80201c96c4e7017bd4e5fca3664a217fc4eae84a37f16a376b7406f8f1e16b2",
		"Content-type": "application/json"
  }});
  const json = await response.json();

  return json.data[0].soil_moisture;
}

async function getAltitude(lat, lng) {
  const elevation_api_url = `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`;
  const response = await fetch(elevation_api_url);
  const json = await response.json();

  return json.results[0].elevation;
}

function updateAtributes(locat, lat, lng, wind, temp, hum, alt, sol) {

  var lc = document.getElementById("location");
  var lt = document.getElementById("lat");
  var ln = document.getElementById("lng");
  var wnd = document.getElementById("wind");
  var tmp = document.getElementById("temperature");
  var hm = document.getElementById("humidity");
  var al = document.getElementById("altitude");
  var sl = document.getElementById("soil-moisture");

  lt.innerHTML = lat;
  ln.innerHTML = lng;
  lc.innerHTML = locat;
  wnd.innerHTML = wind;
  tmp.innerHTML = temp;
  hm.innerHTML = hum;
  al.innerHTML = alt;
  sl.innerHTML = sol;
}


window.initMap = initMap;