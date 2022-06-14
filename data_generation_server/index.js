
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
            const id = turbine._id;
            console.log(id);
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

updateTurbines();