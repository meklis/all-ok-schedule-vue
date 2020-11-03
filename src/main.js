import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VModal from 'vue-js-modal'
import VueConfirmDialog from 'vue-confirm-dialog'
import {GetConfig, GetToken} from "./modules/get-startup-config";
import Api from './modules/server'

Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)
Vue.use(VModal)
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
Vue.config.productionTip = false

function renderAppLoading() {
 document.getElementById('app').innerHTML = `
  <div style="padding-top: 250px; position: fixed; top: 0; left: 0; height: 100%; width: 100%; background:  rgba(0, 0, 0, .1); z-index: 9999">
                <img alt='loading...' style="width: 120px;" src="assets/img/spinner-blue.gif" align="center"><br>
                App is loading...
  </div>
 `;
}

function renderAppError(errMessage) {
  document.getElementById('app').innerHTML = `
     <div style="padding-top: 250px; position: fixed; top: 0; left: 0; height: 100%; width: 100%; background:  rgba(0, 0, 0, .1); z-index: 9999;  color: darkred">
               <div style="font-size: 120%">Возникли ошибки при инициализации календаря, попробуйте перезагрузить страницу</div>
               <div style="font-size: 95%">${errMessage}</div>
               
  </div>
  `;
}
renderAppLoading();
GetConfig().then( conf => {
  console.log("Config success loaded")
  console.log("API url=" + conf.data.apiBaseURL)
  console.log("Get token url=" + conf.data.getTokenURL)
  if(!conf.data) {
    renderAppError('Ошибка чтения конфига')
    return ;
  }
  Vue.prototype.$config = conf.data;
  GetToken(conf.data.getTokenURL).then( token => {
    console.log("userToken="+token.data)
    Vue.prototype.$api = new Api(conf.data.apiBaseURL, token.data)
    new Vue({
      render: h => h(App),
    }).$mount('#app')
  }).catch( e=> {
    console.log(e)
    renderAppError('Ошибка получения токена - ' + e.message)
  })
}).catch( e=> {
  console.log(e)
  renderAppError('Ошибка получения конфига - ' + e.message)
})

