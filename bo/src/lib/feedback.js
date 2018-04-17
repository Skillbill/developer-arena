import store from '@/lib/store'

const isAdmin = () => {
  store.commit('addFeedback', {
    title: 'Success',
    message: 'You are an admin'
  })
}
const notAdmin = () => {
  store.commit('addFeedback', {
    title: 'Denied',
    message: 'You are not an admin'
  })
}
const contestUpdated = () => {
  store.commit('addFeedback', {
    title: 'Saved',
    message: 'New dates have been saved successfully'
  })
}
const apiError = () => {
  store.commit('addFeedback', {
    title: 'API error',
    message: ''
  })
}

export default {
  isAdmin,
  notAdmin,
  contestUpdated,
  apiError
}