import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import Page404 from '@/components/Page404'
import SignIn from '@/components/SignIn'
import EditContest from '@/components/EditContest'
import Contests from '@/components/Contests'
import Projects from '@/components/Projects'
import User from '@/components/User'
import EditJury from '@/components/EditJury'
import EditJudge from '@/components/EditJudge'
import store from '@/lib/store'

Vue.use(VueRouter)

function ensureNumberProp (params, propNames) {
  let res = {}
  Object.keys(params).forEach(key => {
    if (propNames.includes(key) && typeof params[key] === 'string') {
      res[key] = Number(params[key])
    } else {
      res[key] = params[key]
    }
  })
  return res
}

const router = new VueRouter({
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
      props: route => ensureNumberProp(route.params, 'contestId'),
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
      props: route => ensureNumberProp(route.params, 'contestId'),
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'user',
      path: '/user/:userId',
      component: User,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'editJury',
      path: '/edit-jury/:contestId',
      component: EditJury,
      props: route => ensureNumberProp(route.params, 'contestId'),
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'editJudge',
      path: '/edit-judge/:judgeId',
      component: EditJudge,
      props: route => ensureNumberProp(route.params, 'judgeId'),
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'newJudge',
      path: '/new-judge',
      component: EditJudge,
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
