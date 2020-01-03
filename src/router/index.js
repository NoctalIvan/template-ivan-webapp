import Vue from 'vue'

import Router from 'vue-router'
import Home from '@/pages/home'
import Login from '@/pages/login'
import Account from '@/pages/account'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login,
            meta: {
                noAuth: true
            }
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Home,
            meta: {
                auth: true
            }
        },
        {
          path: '/account',
          name: 'Account',
          component: Account,
          meta: {
              auth: true
          }
      }
    ]
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    if(!token && to.matched.some(record => record.meta.auth)) {
        next({path: '/'})
        return
    }

    if(token && to.matched.some(record => record.meta.noAuth)) {
        next({path: '/dashboard'})
    }

    next()
})

export default router
