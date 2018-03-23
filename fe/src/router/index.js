import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Home from '@/components/Home'
import SignIn from '@/components/SignIn'
import SubmitEntry from '@/components/SubmitEntry'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignIn
    },
    {
      path: '/submit-entry',
      name: 'SubmitEntry',
      component: SubmitEntry,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const providerPassword = currentUser && currentUser.providerData[0].providerId === 'password'
  const emailVerified = currentUser && currentUser.emailVerified === true
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && (!currentUser || (currentUser && providerPassword && !emailVerified))) {
    next({
      path: 'sign-in',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    next()
  }
})

export default router
