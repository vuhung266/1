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
        if($cookies.get('user_data')){
          var bimat1 = $cookies.get('user_data');
          return bimat1.apiKey;
        }
        return 'không có api'
      }
    }
  }
})
