const fs = require("fs");
const ejs = require("ejs");
const url = require("url");

const fetch = (url) =>
  import("node-fetch").then(({ default: fetch }) => fetch(url));

const restAPIInteraction = require("./../models/RestAPIInteraction");

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

async function getPublicPage(req, res, id) {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    var htmlContent = fs.readFileSync(
      __dirname + "/../views/pages/public.ejs",
      "utf8"
    );

    const queryObject = url.parse(req.url, true).query;
    let noDataQueryObject = true;
    for (prop in queryObject) {
      if (!queryObject[prop] && queryObject[prop] === "") {
        delete queryObject[prop];
      }
    }

    if (queryObject["state"] === "Any") delete queryObject["state"];
    if (queryObject["company"] === "Any Company") delete queryObject["company"];

    let turbinesData;
    if (!queryObject || Object.keys(queryObject).length === 0) {
      turbinesData = await restAPIInteraction.getTurbines();
    } else {
      let query = createServerQueryString(queryObject);
      turbinesData = await restAPIInteraction.filterPublicTurbines(query);
    }
    const chartData = {};
    const turbines = [];

    for (const turbineData of turbinesData) {
      const location = await restAPIInteraction.getLocation(turbineData);
      const newestData = await restAPIInteraction.getTurbineNewData(turbineData._id);
      // const location = 'Not shown yet';
      turbines.push({
        turbineData,
        location,
        newestData
      });

      const allTurbineData = await restAPIInteraction.getTurbineAllData(
        turbineData._id
      );
      let timeLabels = allTurbineData.historicData.map((x) =>
        new Date(x.timeStamp).getTime()
      );
      chartData[turbineData._id + "chart"] = {
        canvasId: turbineData._id + "chart",
        timeLabels: timeLabels,
        data: allTurbineData.historicData.map((x) => x.turbineWear),
        lineTitle: "Periodic Turbine Wear",
        chartName: "Turbine Wear Over Time",
        yAxisLabel: "Time",
        xAxisLabel: "Turbine Wear",
        colorPoints: "rgba(255, 0, 0, 1)",
        colorLine: "rgba(0, 255, 0, 1)",
        colorUnderLine: "rgba(0, 0, 255, 1)",
      };
    }

    const companies = await restAPIInteraction.getAllCompanies();

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "public.ejs",
      turbines,
      chartData,
      companies,
      userId: id,
      queryObject,
    });

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

    let ownedTurbineData;
    
    const queryObject = url.parse(req.url, true).query;
    let noDataQueryObject = true;
    for (prop in queryObject) {
      if (!queryObject[prop] && queryObject[prop] === "") {
        delete queryObject[prop];
      }
    }

    if (queryObject["state"] === "Any") delete queryObject["state"];

    if (!queryObject || Object.keys(queryObject).length === 0) {
      ownedTurbineData = await restAPIInteraction.getOwnedTurbines(id);
    } else {
      let query = createServerQueryString(queryObject);
      ownedTurbineData = await restAPIInteraction.filterPrivateTurbines(
        id,
        query
      );
    }
    const chartData = {};

    for (turbine of ownedTurbineData) {
      const allTurbineData = await restAPIInteraction.getTurbineAllData(
        turbine._id
      );
      let timeLabels = allTurbineData.historicData.map((x) =>
        new Date(x.timeStamp).getTime()
      );
      chartData[turbine._id + "chart"] = {
        canvasId: turbine._id + "chart",
        timeLabels: timeLabels,
        data: allTurbineData.historicData.map((x) => x.turbineWear),
        lineTitle: "Periodic Turbine Wear",
        chartName: "Turbine Wear Over Time",
        yAxisLabel: "Time",
        xAxisLabel: "Turbine Wear",
        colorPoints: "rgba(255, 0, 0, 1)",
        colorLine: "rgba(0, 255, 0, 1)",
        colorUnderLine: "rgba(0, 0, 255, 1)",
      };
    }

    const companies = await restAPIInteraction.getAllCompanies();

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "owned.ejs",
      turbines: ownedTurbineData,
      chartData,
      companies,
      queryObject,
      userId:id
    });

    res.end(htmlRenderized);
  } catch (error) {
    console.log(error.message);
  }
}

function createServerQueryString(queryObject) {
  let query = "?";
  if (queryObject["name"]) {
    query += `name=regex:${queryObject["name"]}&`;
  }
  if (queryObject["state"]) {
    query += `turbineState=${queryObject["state"]}&`;
  }
  if (queryObject["company"]) {
    query += `company=${queryObject["company"]}&`;
  }
  if (queryObject["yearGTE"]) {
    const gte = new Date(Number(queryObject["yearGTE"]), 0);
    query += `constructionYear=gte:${gte.toISOString()}&`;
  }
  if (queryObject["yearLTE"]) {
    const lte = new Date(Number(queryObject["yearLTE"]), 0);
    query += `constructionYear=lte:${lte.toISOString()}`;
  }
  if (query.charAt(query.length - 1) === "&") {
    query = query.substring(0, query.length - 1);
  }

  return query;
}

// async function getPrivatePage(req, res, id) { -- duplicate????
//   try {
//     res.writeHead(200, { "Content-Type": "text/html" });
//     var htmlContent = fs.readFileSync(
//       __dirname + "/../views/pages/owned.ejs",
//       "utf8"
//     );

//     const queryObject = url.parse(req.url, true).query;
//     let noDataQueryObject = true;
//     for (prop in queryObject) {
//       if (!queryObject[prop] && queryObject[prop] === "") {
//         delete queryObject[prop];
//       }
//     }

//     if (queryObject["state"] === "Any") delete queryObject["state"];

//     let ownedTurbineData;
//     if (!queryObject || Object.keys(queryObject).length === 0) {
//       ownedTurbineData = await restAPIInteraction.getOwnedTurbines(id);
//     } else {
//       let query = createServerQueryString(queryObject);
//       ownedTurbineData = await restAPIInteraction.filterPrivateTurbines(
//         id,
//         query
//       );
//     }

//     const chartData = {};

//     for (turbine of ownedTurbineData) {
//       const allTurbineData = await restAPIInteraction.getTurbineAllData(
//         turbine._id
//       );
//       let timeLabels = allTurbineData.historicData.map((x) =>
//         new Date(x.timeStamp).getTime()
//       );
//       chartData[turbine._id + "chart"] = {
//         canvasId: turbine._id + "chart",
//         timeLabels: timeLabels,
//         data: allTurbineData.historicData.map((x) => x.turbineWear),
//         lineTitle: "Periodic Turbine Wear",
//         chartName: "Turbine Wear Over Time",
//         yAxisLabel: "Time",
//         xAxisLabel: "Turbine Wear",
//         colorPoints: "rgba(255, 0, 0, 1)",
//         colorLine: "rgba(0, 255, 0, 1)",
//         colorUnderLine: "rgba(0, 0, 255, 1)",
//       };
//     }

//     var htmlRenderized = ejs.render(htmlContent, {
//       filename: "owned.ejs",
//       turbines: ownedTurbineData,
//       chartData,
//       queryObject,
//     });

//     res.end(htmlRenderized);
//   } catch (error) {
//     console.log(error.message);
//   }
// }

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

    const notifications = await restAPIInteraction.getNotifications(id);
    const alerts = await restAPIInteraction.getAlerts(id);
    const notificationsWithNames = [];
    const alertsWithNames = [];

    for (notification of notifications) {
      const buyer = await restAPIInteraction.getUser(notification.idBuyer);
      const seller = await restAPIInteraction.getUser(notification.idSeller);
      const turbine = await restAPIInteraction.getTurbine(
        notification.idTurbine
      );
      if (seller._id === id) {
        notificationsWithNames.push({
          buyer: buyer,
          seller: seller,
          turbine: turbine,
          id: notification._id,
        });
      }
    }

    for (alert of alerts) {
      const user = await restAPIInteraction.getUser(alert.idUser);
      const turbine = await restAPIInteraction.getTurbine(alert.idTurbine);
      alertsWithNames.push({
        user: user,
        turbine: turbine,
        id: alert._id,
        timeStamp: alert.timeStamp,
      });
    }

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "notifications.ejs",
      notifications: notificationsWithNames,
      alerts: alertsWithNames,
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

async function getTurbineDetailsPage(req, res, id, userId) {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    var htmlContent = fs.readFileSync(
      __dirname + "/../views/pages/turbineDetails.ejs",
      "utf8"
    );

    const turbineData = await restAPIInteraction.getTurbine(id);

    if (userId !== turbineData.userId) {
      getUnauthorizedPage(req, res);
      return;
    }

    const userData = await restAPIInteraction.getUser(turbineData.userId);
    const turbineNewData = await restAPIInteraction.getTurbineNewData(id);
    const allTurbineData = await restAPIInteraction.getTurbineAllData(id);

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
      chartData,
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

async function getDocumentaionPage(req, res) {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    var htmlContent = fs.readFileSync(
      __dirname + "/../views/pages/scholarlyDoc.ejs",
      "utf8"
    );

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "scholaryDoc.ejs",
    });

    res.end(htmlRenderized);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  getPublicPage,
  getPrivatePage,
  getLoginPage,
  getLandingPage,
  getRegisterPage,
  getCreateTurbinePage,
  getTurbineDetailsPage,
  getUnauthorizedPage,
  getResetPassPage,
  getUserDetailsPage,
  getNotificationsPage,
  getDocumentaionPage
};
