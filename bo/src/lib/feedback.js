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
const invalidFeilds = () => {
  Vue.$toastr.error('Some feilds are invalid', 'Not saved')
}
const invalidDates = () => {
  Vue.$toastr.error('The dates are invalid', 'Not saved')
}
const apiError = (error) => {
  Vue.$toastr.error(`status code: ${error.code}, text: ${error.msg}`, 'API error')
}

export default {
  isAdmin,
  notAdmin,
  invalidFeilds,
  invalidDates,
  contestUpdated,
  contestCreated,
  apiError
}
