import 'babel-polyfill';

require('./bootstrap');

import VModal from 'vue-js-modal'
import Ws from '@adonisjs/websocket-client'
import Vuesax from 'vuesax'

Vue.use(Vuesax, {
    // options here
})

window.ws = Ws('')
ws.connect();
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

window.BasePath = 'http://localhost:55554/';


Vue.use(VModal);

import VueObserveVisibility from 'vue-observe-visibility'


Vue.use(VueObserveVisibility)

import VueCarousel from 'vue-carousel';

Vue.use(VueCarousel);

window.Event = new Vue();

import VueFusionCharts from 'vue-fusioncharts';
import FusionCharts from 'fusioncharts';
import TimeSeries from 'fusioncharts/fusioncharts.timeseries';

// register VueFusionCharts
Vue.use(VueFusionCharts, FusionCharts, TimeSeries);

const jsonify = res => res.json();
const dataFetch = fetch(
  'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/data/line-chart-with-time-axis-data.json'
).then(jsonify);
const schemaFetch = fetch(
  'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/schema/line-chart-with-time-axis-schema.json'
).then(jsonify);

const chart = new Vue({
  el: '#app',
  data: {
    width: '700',
    height: '400',
    type: 'timeseries',
    dataFormat: 'json',
    dataSource: {
      data: null,
      caption: {
        text: 'Sales Analysis'
      },
      subcaption: {
        text: 'Grocery'
      },
      yAxis: [{
        plot: {
          value: 'Grocery Sales Value',
          type: 'line'
        },
        format: {
          prefix: '$'
        },
        title: 'Sale Value'
      }]
    }
  },
  mounted: function() {
    // In this Promise we will create our DataStore and using that we will create a custom DataTable which takes two
    // parameters, one is data another is schema.
    Promise.all([dataFetch, schemaFetch]).then(res => {
      const data = res[0];
      const schema = res[1];
      // First we are creating a DataStore
      const fusionDataStore = new FusionCharts.DataStore();
      // After that we are creating a DataTable by passing our data and schema as arguments
      const fusionTable = fusionDataStore.createDataTable(data, schema);
      // After that we simply mutated our timeseries datasource by attaching the above
      // DataTable into its data property.
      this.dataSource.data = fusionTable;
    });
  }
});
