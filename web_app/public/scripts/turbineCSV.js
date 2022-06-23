async function downloadTurbinesCSV(userId){
  const previousLink = document.getElementById('downloadLink')
  if(previousLink != null){previousLink.parentNode.removeChild()}
  const endpoint = "http://localhost:5000/api/turbines/private/" + userId + "/csv"
  const data = await fetch(endpoint)
  const csvData = await data.blob()
  let a = document.createElement("a")
  a.style.display = 'none'
  a.setAttribute('id', 'downloadLink')
  a.href = window.URL.createObjectURL(csvData)
  a.download = "turbines" + userId
  a.click()
}