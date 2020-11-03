import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VModal from 'vue-js-modal'
import VueConfirmDialog from 'vue-confirm-dialog'
import {GetToken} from "./modules/get-startup-config";
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
Vue.config.productionTip = true

function renderAppLoading() {
 document.getElementById('schedule').innerHTML = `
  <div style="text-align: center; padding-top: 250px; position: fixed; top: 0; left: 0; height: 100%; width: 100%; background:  rgba(0, 0, 0, .1); z-index: 9999">
                <img alt='loading...' style="width: 80px;" src="assets/img/spinner-blue.gif" align="center"><br>
                App is loading...
  </div>
 `;
}

function renderAppError(errMessage) {
  document.getElementById('schedule').innerHTML = `
     <div style="text-align: center; padding-top: 250px; position: fixed; top: 0; left: 0; height: 100%; width: 100%; background:  rgba(0, 0, 0, .1); z-index: 9999;  color: darkred">
               <div style="font-size: 120%">Возникли ошибки при инициализации календаря, попробуйте перезагрузить страницу</div>
               <div style="font-size: 95%">${errMessage}</div>
               
  </div>
  `;
}
renderAppLoading();

const CONF = {
  "apiBaseURL": "https://apiv2.golden.net.ua",
  "getTokenURL": "/users/get_token",
  "calendar": {
    "hourStart": 6,
    "hourEnd": 22,
    "defaultView": "week",
    "dayNames": ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    "startDayOfWeek": 1,
    "visibleWeeksCount": 6,
    "isReadOnly": false
  }
}
let attr = document.getElementById("schedule");
let baseUrl = attr.getAttribute('api-base-url');
if(baseUrl !== null) {
  console.log("api-base-url="+baseUrl)
  CONF.apiBaseURL = baseUrl
}

let getTokenURL = attr.getAttribute('get-token-url');
if(getTokenURL !== null) {
  console.log("get-token-url="+getTokenURL)
  CONF.getTokenURL = getTokenURL
}

let hourStart = attr.getAttribute('hour-start');
if(hourStart !== null) {
  CONF.calendar.hourStart = hourStart
}
let hourEnd = attr.getAttribute('hour-end');
if(hourEnd !== null) {
  CONF.calendar.hourStart = hourEnd
}
let defView = attr.getAttribute('default-view');
if(defView !== null) {
  CONF.calendar.defaultView = defView
}

let isReadOnly = attr.getAttribute('is-read-only');
if(isReadOnly !== null) {
  CONF.calendar.isReadOnly = isReadOnly === 'true' || isReadOnly === '1' ? true : false;
}

Vue.prototype.$config = CONF;
GetToken(CONF.getTokenURL).then( token => {
  console.log("userToken="+token)
  Vue.prototype.$api = new Api(CONF.apiBaseURL, token)
  new Vue({
    render: h => h(App),
  }).$mount('#schedule')
}).catch( e=> {
  console.log(e)
  renderAppError('Ошибка получения токена - ' + e.message)
})