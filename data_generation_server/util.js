
function getNewWindSpeed(oldWindSpeed, currentWindSpeed) {
    return (oldWindSpeed + currentWindSpeed) / 2;
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
    return (newPowerGenerated - oldPowerGenerated > 5) ? (oldEfficiency <= 0.9 ? oldEfficiency + 0.01 : 1) : oldEfficiency - 0.001;
}

module.exports = { getNewWindSpeed, getNewTurbineWear, getNewPowerGenerated, getNewEfficiency };