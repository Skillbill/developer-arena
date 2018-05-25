import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Home from '@/components/Home'
import SignIn from '@/components/SignIn'
import SubmitEntry from '@/components/SubmitEntry'
import Projects from '@/components/Projects'
import Project from '@/components/Project'
import Rules from '@/components/Rules'
import Profile from '@/components/Profile'
import StaticPage from '@/components/StaticPage'

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
        requiresAuth: true,
        requiresEmail: true
      }
    },
    {
      path: '/contest/:contestId/projects',
      name: 'Projects',
      component: Projects
    },
    {
      path: '/contest/:contestId/project/:projectId',
      name: 'Project',
      component: Project
    },
    {
      path: '/rules',
      name: 'Rules',
      component: Rules
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/legal-notice',
      name: 'LegalNotice',
      component: StaticPage,
      meta: {
        md: '/static/pages/[lang]/legal-notice.md'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = store.state.user;
  const currentUserClaims = store.state.userClaims;
  const providerPassword = currentUser && currentUser.providerData[0].providerId === 'password'
  const emailVerified = currentUser && currentUser.emailVerified === true
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresEmail = to.matched.some(record => record.meta.requiresEmail)

  store.commit('removeFeedback');

  if (requiresAuth && (!currentUser || (currentUser && providerPassword && !emailVerified))) {
    next({
      path: '/sign-in',
      query: {
        redirect: to.fullPath
      }
    })
  } else if(requiresEmail && currentUser && currentUserClaims && !currentUser.email && !currentUserClaims.email) {
    next({
      path: '/profile',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    next()
  }
})

export default router
