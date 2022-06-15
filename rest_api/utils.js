const fs = require('fs')

function getRequestData(req) {
  return new Promise((resolve, reject) => {
    try {
      let body = ''

      req.on('data', (chunk) => {
        body += chunk.toString()
      })

      req.on('end', () => {
        resolve(body)
      })
    } catch (error) {
      reject(error)
    }
  })
}

function validateJSON(textJson) {
  try {
    const json = JSON.parse(textJson)
    return json
  } catch (error) {
    return null
  }
}

function verificareCNP(cnp) {
  let cnpArr = []
  for (let i = 0; i < cnp.length; i++) {
    cnpArr.push(Number(cnp[i]))
  }

  let control =
    (cnpArr[0] * 2 +
      cnpArr[1] * 7 +
      cnpArr[2] * 9 +
      cnpArr[3] * 1 +
      cnpArr[4] * 4 +
      cnpArr[5] * 6 +
      cnpArr[6] * 3 +
      cnpArr[7] * 5 +
      cnpArr[8] * 8 +
      cnpArr[9] * 2 +
      cnpArr[10] * 7 +
      cnpArr[11] * 9) %
    11

  if (control === 10) {
    control = 1
  }

  return control === cnpArr[12]
}

function extractDateFromCNP(cnp) {
  let year = cnp.substring(1, 3)
  let month = Number(cnp.substring(3, 5)) - 1
  let day = Number(cnp.substring(5, 7))

  if (Number(year) <= new Date().getFullYear - 2000) {
    year = Number('20' + year)
  } else {
    year = Number(year)
  }

  return new Date(year, month, day)
}

module.exports = {
  getRequestData,
  validateJSON,
  verificareCNP,
  extractDateFromCNP,
}
