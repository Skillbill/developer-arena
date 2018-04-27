import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import Page404 from '@/components/Page404'
import SignIn from '@/components/SignIn'
import EditContest from '@/components/EditContest'
import Contests from '@/components/Contests'
import Projects from '@/components/Projects'
import store from '@/lib/store'

Vue.use(VueRouter)
const router = new VueRouter({
  base: '/admin',
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home
    },
    {
      name: '404',
      path: '/404',
      component: Page404
    },
    {
      name: 'signIn',
      path: '/sign-in',
      component: SignIn
    },
    {
      name: 'signInWithProvider',
      path: '/sign-in/:email/:providerUsed/:providerToUse',
      component: SignIn,
      props: true
    },
    {
      name: 'editContest',
      path: '/edit-contest/:contestId',
      component: EditContest,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'newContest',
      path: '/new-contest',
      component: EditContest,
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'contests',
      path: '/contests',
      component: Contests,
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'projects',
      path: '/contest/:contestId/projects',
      component: Projects,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '*',
      component: Page404
    }
  ]
})

router.beforeEach((to, from, next) => {
  Vue.$log.info(`router: ${from.fullPath} => ${to.fullPath}`)
  let currentUser = store.state.user
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && (!currentUser || !currentUser.isAdmin)) {
    Vue.$log.info(`router: access denied`)
    next('/')
  } else {
    next()
  }
})

export default router
