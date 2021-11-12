import Vue from 'vue';
import Vuex from 'vuex';
import info from './modules/info';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    transitionName: 'slide-left'
  },
  mutations: {
    SET_TRANSITIONNAME(state: any, payLoad: any) {
      sessionStorage.setItem('transitionName', payLoad);
      state.transitionName = payLoad;
    }
  },
  getters: {
    getTransitionName(state: any) {
      if (!state.transitionName) {
        state.transitionName = sessionStorage.getItem('transitionName');
      }
      return state.transitionName;
    }
  },
  actions: {},
  modules: {
    info
  }
});
