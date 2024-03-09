import { asyncRoutes, constantRoutes } from '@/router'
import { getMenus } from '@/api/user'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

export function generateMenu(routes, data) {
  data.forEach(item => {
    // if (item.url != '') {
    const menu = {
      path: item.url ? item.url : item.name,
      component: Layout,
      redirect: '',
      children: [],
      name: item.name,
      meta: {
        title: item.name,
        icon: item.icon
      }
    }
    if (item.children && item.children.length > 0) {
      item.children.forEach(children => {
        const childMenu = {
          path: children.url ? children.url : item.name,
          component: (resolve) => require([`@/views${children.url}`], resolve),
          name: children.name,
          meta: {
            title: children.name,
            icon: children.icon
          }
        }
        menu.children.push(childMenu)
      })
    }
    routes.push(menu)
    // }
  })

  const menu3 = {
    path: '*',
    redirect: '/404',
    hidden: true
  }
  routes.push(menu3)
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const menuData = []
      getMenus(state.token).then(response => {
        const data = response.data
        Object.assign(menuData, data)
        const tempAsyncRoutes = Object.assign([], asyncRoutes)
        generateMenu(tempAsyncRoutes, menuData)
        console.log(tempAsyncRoutes)
        const accessedRoutes = tempAsyncRoutes || []
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
