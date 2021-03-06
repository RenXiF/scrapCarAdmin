import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条
import { getToken } from '@/utils/auth' // 获取登录用户信息
import getPageTitle from '@/utils/get-page-title'  //修改title
NProgress.configure({ showSpinner: false }) // 进度条

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
 router.beforeEach(async(to, from, next) => {
  // 加载进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken();
  // console.log(hasToken);
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
		if(store.state.user.menus.length>1){
			next()
		}else{
			try {
				 const { roles } = await store.dispatch('user/getInfo')
                 let routeStatus = store.state.settings.routesRole;
                 if(routeStatus =='reception'){
                    // 基于角色生成可访问路由图
                    const accessRoutes = await store.dispatch('permission/receptionRoutes', roles)
					router.addRoutes(accessRoutes)
                    next({ ...to, replace: true })
                  }
                  if(routeStatus =='all'){
                    const menus = await store.dispatch('user/getMenus')
                    const accessRoutes = await store.dispatch('permission/allRoutes', { menus })
                    router.addRoutes(accessRoutes)
                    next({ ...to, replace: true })
                  }
			}catch (error) {
				await store.dispatch('user/resetToken')
				Message.error(error || 'Has Error')
				next(`/login?redirect=${to.path}`)
				NProgress.done()
			}
		}
    } 
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
     next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
}) 
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
