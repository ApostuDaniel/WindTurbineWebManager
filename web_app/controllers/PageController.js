const fs = require("fs");
const ejs = require("ejs");

const fetch = (url) =>
  import("node-fetch").then(({ default: fetch }) => fetch(url));

async function getLandingPage(req, res) {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    var htmlContent = fs.readFileSync(
      __dirname + "/../views/pages/landing.ejs",
      "utf8"
    );

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "landing.ejs",
    });

    res.end(htmlRenderized);
  } catch (error) {
    console.log(error.message);
  }
}

async function getPublicPage(req, res) {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    var htmlContent = fs.readFileSync(
      __dirname + "/../views/pages/public.ejs",
      "utf8"
    );

    const turbineData = await getTurbines()
    const chartData = {}

    for (turbine of turbineData) {
      const allTurbineData = await getTurbineAllData(turbine._id)
      let timeLabels = allTurbineData.historicData.map((x) =>
        new Date(x.timeStamp).getTime()
      )
      chartData[turbine._id + 'chart'] = {
        canvasId: turbine._id + 'chart',
        timeLabels: timeLabels,
        data: allTurbineData.historicData.map((x) => x.turbineWear),
        lineTitle: 'Periodic Turbine Wear',
        chartName: 'Turbine Wear Over Time',
        yAxisLabel: 'Time',
        xAxisLabel: 'Turbine Wear',
        colorPoints: 'rgba(255, 0, 0, 1)',
        colorLine: 'rgba(0, 255, 0, 1)',
        colorUnderLine: 'rgba(0, 0, 255, 1)',
      }
    }

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "public.ejs",
      turbines: turbineData,
      chartData,
    })

    res.end(htmlRenderized);
  } catch (error) {
    console.log(error.message);
  }
}

async function getPrivatePage(req, res, id) {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    var htmlContent = fs.readFileSync(
      __dirname + "/../views/pages/owned.ejs",
      "utf8"
    );

    const ownedTurbineData = await getOwnedTurbines(id);
    const chartData = {}

    for (turbine of ownedTurbineData) {
      const allTurbineData = await getTurbineAllData(turbine._id)
      let timeLabels = allTurbineData.historicData.map((x) =>
        new Date(x.timeStamp).getTime()
      )
      chartData[turbine._id + 'chart'] = {
        canvasId: turbine._id + 'chart',
        timeLabels: timeLabels,
        data: allTurbineData.historicData.map((x) => x.turbineWear),
        lineTitle: 'Periodic Turbine Wear',
        chartName: 'Turbine Wear Over Time',
        yAxisLabel: 'Time',
        xAxisLabel: 'Turbine Wear',
        colorPoints: 'rgba(255, 0, 0, 1)',
        colorLine: 'rgba(0, 255, 0, 1)',
        colorUnderLine: 'rgba(0, 0, 255, 1)',
      }
    }

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "owned.ejs",
      turbines: ownedTurbineData,
      chartData
    });

    res.end(htmlRenderized);
  } catch (error) {
    console.log(error.message);
  }
}

async function getLoginPage(req, res) {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    var htmlContent = fs.readFileSync(
      __dirname + "/../views/pages/login.ejs",
      "utf8"
    );

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "login.ejs",
    });

    res.end(htmlRenderized);
  } catch (error) {
    console.log(error.message);
  }
}

async function getUserDetailsPage(req, res) {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    var htmlContent = fs.readFileSync(
      __dirname + "/../views/pages/userDetails.ejs",
      "utf8"
    );

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "userDetails.ejs",
    });

    res.end(htmlRenderized);
  } catch (error) {
    console.log(error.message);
  }
}

async function getRegisterPage(req, res) {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    var htmlContent = fs.readFileSync(
      __dirname + "/../views/pages/register.ejs",
      "utf8"
    );

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "register.ejs",
    });

    res.end(htmlRenderized);
  } catch (error) {
    console.log(error.message);
  }
}

async function getNotificationsPage(req, res, id) {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    var htmlContent = fs.readFileSync(
      __dirname + "/../views/pages/notifications.ejs",
      "utf8"
    );

    const nots = await getNotifications(id);
    const alts = await getAlerts(id);

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "notifications.ejs",
      notifications: nots,
      alerts: alts,
    });

    res.end(htmlRenderized);
  } catch (error) {
    console.log(error.message);
  }
}

async function getCreateTurbinePage(req, res) {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    var htmlContent = fs.readFileSync(
      __dirname + "/../views/pages/createTurbine.ejs",
      "utf8"
    );

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "createTurbine.ejs",
    });
    res.end(htmlRenderized);
  } catch (error) {
    console.log(error.message);
  }
}

async function getTurbineDetailsPage(req, res, id) {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    var htmlContent = fs.readFileSync(
      __dirname + "/../views/pages/turbineDetails.ejs",
      "utf8"
    );

    const turbineData = await getTurbine(id);
    const userData = await getUser(turbineData.userId);
    const turbineNewData = await getTurbineNewData(id);
    const allTurbineData = await getTurbineAllData(id)

    const timeLabels = allTurbineData.historicData.map((x) =>
      new Date(x.timeStamp).getTime()
    );

    const chartData = {};
    chartData["stateChart"] = {
      canvasId: "stateChart",
      timeLabels,
      data: allTurbineData.historicData.map((x) => x.turbineWear),
      lineTitle: "Periodic Turbine Wear",
      chartName: "Turbine Wear Over Time",
      yAxisLabel: "Time",
      xAxisLabel: "Turbine Wear",
      colorPoints: "rgba(255, 0, 0, 1)",
      colorLine: "rgba(0, 255, 0, 1)",
      colorUnderLine: "rgba(0, 0, 255, 1)",
    };

    chartData["windChart"] = {
      canvasId: "windChart",
      timeLabels,
      data: allTurbineData.historicData.map((x) => x.windSpeed),
      lineTitle: "Measured Wind Speed",
      chartName: "Wind Speed",
      yAxisLabel: "Time",
      xAxisLabel: "Wind Speed (km/h)",
      isAsccendingGreen: false,
    };

    chartData["energyChart"] = {
      canvasId: "energyChart",
      timeLabels,
      data: allTurbineData.historicData.map((x) => x.powerGenerated),
      lineTitle: "Generated Energy",
      chartName: "Total Generated Energy",
      yAxisLabel: "Time",
      xAxisLabel: "Energy Generated (kw)",
      colorPoints: "rgba(255, 0, 0, 1)",
      colorLine: "rgba(0, 255, 0, 1)",
      colorUnderLine: "rgba(0, 0, 255, 1)",
    };

    chartData["efficiencyChart"] = {
      canvasId: "efficiencyChart",
      timeLabels,
      data: allTurbineData.historicData.map((x) => x.eficiency),
      lineTitle: "Efficiency",
      chartName: "Measured Efficiency",
      yAxisLabel: "Time",
      xAxisLabel: "Turbine Efficiency (0 to 1)",
      isAsccendingGreen: true,
    };

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "turbineDetails.ejs",
      turbine: turbineData,
      user: userData,
      turbineData: turbineNewData,
      chartData
    });
    res.end(htmlRenderized);
  } catch (error) {
    console.log(error.message);
  }
}

async function getUnauthorizedPage(req, res) {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    var htmlContent = fs.readFileSync(
      __dirname + "/../views/pages/unauthorized.ejs",
      "utf8"
    );

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "unauthorized.ejs",
    });
    res.end(htmlRenderized);
  } catch (error) {
    console.log(error.message);
  }
}

async function getResetPassPage(req, res) {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    var htmlContent = fs.readFileSync(
      __dirname + "/../views/pages/resetPassword.ejs",
      "utf8"
    );

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "resetPassword.ejs",
    });

    res.end(htmlRenderized);
  } catch (error) {
    console.log(error.message);
  }
}

async function getTurbines() {
  const data = await fetch("http://localhost:5000/api/turbines/public");
  const turbineData = await data.json();

  return turbineData;
}

async function getOwnedTurbines(id) {
  const data = await fetch("http://localhost:5000/api/turbines/private/" + id);
  const ownedTurbineData = await data.json();

  return ownedTurbineData;
}

async function getTurbine(id) {
  const data = await fetch(`http://localhost:5000/api/turbines/${id}`);
  const turbine = await data.json();

  return turbine;
}

async function getUser(id) {
  const data = await fetch("http://localhost:5000/api/users/" + id);
  const user = await data.json();

  return user;
}

async function getTurbineNewData(id) {
  const data = await fetch(`http://localhost:5000/api/turbines/data/${id}/new`);
  const turbineData = await data.json();

  return turbineData;
}

async function getTurbineAllData(id) {
  const data = await fetch(`http://localhost:5000/api/turbines/data/${id}`);
  const turbineData = await data.json();

  return turbineData;
}

async function getNotifications(id) {
  const data = await fetch(
    `http://localhost:5000/api/users/${id}/notifications`
  );
  const notifications = await data.json();

  return notifications;
}

async function getAlerts(id) {
  const data = await fetch(`http://localhost:5000/api/users/${id}/alerts`);
  const alerts = await data.json();

  return alerts;
}

module.exports = {
  getPublicPage,
  getPrivatePage,
  getLoginPage,
  getLandingPage,
  getOwnedTurbines,
  getRegisterPage,
  getCreateTurbinePage,
  getTurbineDetailsPage,
  getUnauthorizedPage,
  getResetPassPage,
  getUserDetailsPage,
  getNotificationsPage,
};
