const http = require('http');
const fetch = (url) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url))

const PORT = process.env.PORT | 5002;

const server = http.createServer((req, res) => {
    try {
        const turbines = getTurbines();
        console.log(JSON.stringify(turbines));
    } catch (err) {
        console.log(err);
    }
})

async function getTurbines() {
    const data = await fetch('http://localhost:5000/api/turbines');
    const turbines = await data.json();

    return turbines;
}

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));