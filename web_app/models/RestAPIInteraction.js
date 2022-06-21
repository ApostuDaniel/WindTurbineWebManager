const fetch = (url) =>
  import("node-fetch").then(({ default: fetch }) => fetch(url));

async function getAllCompanies() {
  const data = await fetch(`http://localhost:5000/api/users`);
  const users = await data.json();

  return users.map((user) => user.company);
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
  getAllCompanies,
  getTurbines,
  getOwnedTurbines,
  getTurbine,
  getUser,
  getTurbineNewData,
  getTurbineAllData,
  getNotifications,
  getAlerts,
};
