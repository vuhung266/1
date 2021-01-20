import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.prototype.$log = console.log.bind(console)

new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})

Vue.mixin({
  data: function() {
    return {
      get apiBimat() {
        if(localStorage.getItem('masobimat')){
          return localStorage.getItem('masobimat');
        }else{
          this.$router.push({path: '/pages/login'});
          return fail;
        }
      }
    }
  }
});