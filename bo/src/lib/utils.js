import Vue from 'vue'

export function getApiUrl (path) {
  return Vue.$config.serverAddress + '/' + Vue.$config.apiVersion + path
}

export function fromI18n (i18n) {
  let resObj = {}
  i18n.forEach(elem => {
    if (!resObj.hasOwnProperty(elem.language)) {
      resObj[elem.language] = {}
    }
    resObj[elem.language][elem.attribute] = elem.text
  })
  return resObj
}

export function toI18n (obj) {
  let resI18n = []
  Object.keys(obj).forEach(language => {
    Object.keys(obj[language]).forEach(attribute => {
      resI18n.push({
        attribute: attribute,
        language: language,
        text: obj[language][attribute]
      })
    })
  })
  return resI18n
}
