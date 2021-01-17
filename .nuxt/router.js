import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from '@nuxt/ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _e37835ea = () => interopDefault(import('../pages/layout' /* webpackChunkName: "" */))
const _0bdce300 = () => interopDefault(import('../pages/home' /* webpackChunkName: "" */))
const _6ff7c568 = () => interopDefault(import('../pages/login' /* webpackChunkName: "" */))
const _2a42dbe8 = () => interopDefault(import('../pages/profile' /* webpackChunkName: "" */))
const _a14e9c78 = () => interopDefault(import('../pages/settings' /* webpackChunkName: "" */))
const _fb15e964 = () => interopDefault(import('../pages/editor' /* webpackChunkName: "" */))
const _110d1f35 = () => interopDefault(import('../pages/article' /* webpackChunkName: "" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _e37835ea,
    children: [{
      path: "",
      component: _0bdce300,
      name: "home"
    }, {
      path: "/login",
      component: _6ff7c568,
      name: "login"
    }, {
      path: "/register",
      component: _6ff7c568,
      name: "register"
    }, {
      path: "/profile/:username/:favorites?",
      component: _2a42dbe8,
      name: "profile"
    }, {
      path: "/settings",
      component: _a14e9c78,
      name: "settings"
    }, {
      path: "/editor/:slug?",
      component: _fb15e964,
      name: "editor"
    }, {
      path: "/article/:slug",
      component: _110d1f35,
      name: "article"
    }]
  }],

  fallback: false
}

function decodeObj(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = decode(obj[key])
    }
  }
}

export function createRouter () {
  const router = new Router(routerOptions)

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    const r = resolve(to, current, append)
    if (r && r.resolved && r.resolved.query) {
      decodeObj(r.resolved.query)
    }
    return r
  }

  return router
}
