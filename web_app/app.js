const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const PageController = require("./controllers/PageController");
const {parseCookies} =require("./utils");
const PORT = process.env.port || 5001;

const server = http.createServer((req, res) => {
  
  try {
    
    if (req.url === "/pages") {
      PageController.getLandingPage(req, res);
    } else if (req.url === "/pages/public") {
      PageController.getPublicPage(req, res);
    } else if (req.url ==="/pages/owned") {
      const cookies = parseCookies(req);  
    const id = cookies.user_id;
  console.log(cookies.user_id);
      PageController.getPrivatePage(req, res, id);
    } else if (req.url === "/pages/createTurbine") {
      PageController.getCreateTurbinePage(req, res);
    } else if (req.url === "/pages/login") {
      PageController.getLoginPage(req, res);
    } else if (req.url === "/pages/register") {
      PageController.getRegisterPage(req, res);
    } else if (req.url === "/unauthorized") {
      PageController.getUnauthorizedPage(req, res);
    } else if (req.url.match(/\/pages\/turbineDetails\/\w+$/)) {
      const id = req.url.split("/")[3];
      PageController.getTurbineDetailsPage(req, res, id);
    } else {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>404 NOT FOUND</h1>");
    }
  } catch (error) {
    console.log(error);
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route Not Found" }));
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
