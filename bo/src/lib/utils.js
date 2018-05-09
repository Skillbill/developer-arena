
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

export function getEmptyContest () {
  return {
    id: null,
    endPresentation: null,
    endApplying: null,
    endVoting: null,
    state: 'DRAFT',
    i18n: {
      en: {
        title: '',
        description: '',
        rules: ''
      },
      it: {
        title: '',
        description: '',
        rules: ''
      }
    }
  }
}

export function getUserDisplay (user) {
  if (user.displayName) {
    return user.displayName
  } else if (user.customClaims && user.customClaims.email) {
    return user.customClaims.email.replace(/@.*/, '')
  } else if (user.email) {
    return user.email.replace(/@.*/, '')
  } else {
    return user.uid
  }
}

export function getProviderInfo (providerId) {
  let nameLower = providerId.replace(/([.]\w+)$/, '')
  let name = nameLower.charAt(0).toUpperCase() + nameLower.slice(1)
  let icon = /[.]com/.test(providerId) ? `fab fa-${nameLower}` : 'fas fa-envelope'
  return {
    id: providerId,
    nameLower: nameLower,
    name: name,
    providerName: name + 'AuthProvider',
    icon: icon,
    scope: providerId === 'google.com' ? ['https://www.googleapis.com/auth/userinfo.email'] : []
  }
}
