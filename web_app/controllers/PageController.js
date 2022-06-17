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

    const turbineData = await getTurbines();

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "public.ejs",
      turbines: turbineData,
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

    const ownedTurbineData = await getOwnedTurbines(id);

    var htmlRenderized = ejs.render(htmlContent, {
      filename: "owned.ejs",
      turbines: ownedTurbineData,
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
    
    var htmlRenderized = ejs.render(htmlContent, {
      filename: "turbineDetails.ejs",
      turbine: turbineData,
      user: userData,
      turbineData: turbineNewData
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
  const data = await fetch("http://localhost:5000/api/turbines/" + id);
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

  console.log(turbineData);
  return turbineData;
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
  getUnauthorizedPage
};
