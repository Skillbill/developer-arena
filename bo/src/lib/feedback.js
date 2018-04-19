import Vue from 'vue'

const isAdmin = () => {
  Vue.$toastr.success('You are an admin', 'Logged in')
}
const notAdmin = () => {
  Vue.$toastr.warning('You are not an admin', 'Denied access')
}
const contestUpdated = () => {
  Vue.$toastr.success('New dates have been saved successfully', 'Saved')
}
const apiError = (error) => {
  Vue.$toastr.error(`status code: ${error.code}, text: ${error.msg}`, 'API error')
}

export default {
  isAdmin,
  notAdmin,
  contestUpdated,
  apiError
}
