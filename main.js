import Vue from 'vue';
import App from './App';

import tools from 'common/js/index.js';
import http from "common/js/http.js";

Vue.config.productionTip = false;

App.mpType = 'app';
global.tools = tools;
global.http = http;

const app = new Vue({
	...App
})
app.$mount()
