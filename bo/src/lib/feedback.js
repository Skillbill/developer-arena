import Vue from 'vue'

const isAdmin = () => {
  Vue.$toastr.success('You are an admin', 'Logged in')
}
const notAdmin = () => {
  Vue.$toastr.warning('You are not an admin', 'Limited access')
}
const contestUpdated = () => {
  Vue.$toastr.success('The contest has been modified successfully', 'Contest modified')
}
const contestCreated = () => {
  Vue.$toastr.success('The contest has been created successfully', 'Contest created')
}
const contestDeleted = () => {
  Vue.$toastr.success('The contest has been deleted successfully', 'Contest deleted')
}
const projectDeleted = () => {
  Vue.$toastr.success('The project has been deleted successfully', 'Project deleted')
}
const projectPreviewCreated = () => {
  Vue.$toastr.success(`The preview has been created`, 'Preview created')
}
const projectPreviewDeleted = () => {
  Vue.$toastr.success('The preview has been deleted successfully', 'Preview deleted')
}
const invalidFeilds = () => {
  Vue.$toastr.error('Some feilds are invalid', 'Not saved')
}
const offline = () => {
  Vue.$toastr.error('No response received from the API back-end', 'Offline')
}
const apiError = (error) => {
  Vue.$toastr.error(error.msg, `API error n°${error.code}`)
}

const apiErrorText = {
  5001: {title: 'Internal server error', msg: 'The database is not reachable'},
  4306: {title: 'Not saved', msg: 'The dates are invalid'},
  4404: {title: 'Not found', msg: 'No deliverable found for this project'},
  4104: {title: 'Wrong token', msg: 'The current back-end does not accept fake users'}
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
  projectDeleted,
  projectPreviewCreated,
  projectPreviewDeleted,
  offline,
  apiError,
  forApiErrorCode
}
