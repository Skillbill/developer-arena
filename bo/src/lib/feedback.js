import Vue from 'vue'

const isAdmin = () => {
  Vue.$toastr.success('You are an admin', 'Logged in')
}
const notAdmin = () => {
  Vue.$toastr.error('You are not an admin', 'Denied access')
}
const contestUpdated = () => {
  Vue.$toastr.success('The contest has been modified successfully', 'Saved')
}
const contestCreated = () => {
  Vue.$toastr.success('The contest has been created successfully', 'Saved')
}
const contestDeleted = () => {
  Vue.$toastr.success('The contest has been deleted successfully', 'Saved')
}
const invalidFeilds = () => {
  Vue.$toastr.error('Some feilds are invalid', 'Not saved')
}
const apiError = (error) => {
  Vue.$toastr.error(`status code: ${error.code}, text: ${error.msg}`, 'API error')
}

const apiErrorText = {
  1017: {title: 'Not saved', msg: 'The dates are invalid'},
  1005: {title: 'Not found', msg: 'No deliverable found for this project'}
}

const forApiErrorCode = (code) => {
  if (apiErrorText[code]) {
    Vue.$toastr.error(apiErrorText[code].msg, apiErrorText[code].title)
    return true
  } else {
    return false
  }
}

export default {
  isAdmin,
  notAdmin,
  invalidFeilds,
  contestUpdated,
  contestCreated,
  contestDeleted,
  apiError,
  forApiErrorCode
}
