export default {
  namespaced: true,
  state: {
    wechat: '',
    myWechat: '',
    sex: 0
  },
  mutations: {
    SET_WECHAT(state: any, payLoad: any) {
      sessionStorage.setItem('wechat', payLoad);
      state.wechat = payLoad;
    },
    SET_MYWECHAT(state: any, payLoad: any) {
      sessionStorage.setItem('myWechat', payLoad);
      state.myWechat = payLoad;
    },
    SET_SEX(state: any, payLoad: any) {
      sessionStorage.setItem('sex', payLoad);
      state.sex = payLoad;
    }
  },
  getters: {
    getWechat(state: any) {
      if (!state.wechat) {
        state.wechat = sessionStorage.getItem('wechat');
      }
      return state.wechat;
    },
    getMyWechat(state: any) {
      if (!state.myWechat) {
        state.myWechat = sessionStorage.getItem('myWechat');
      }
      return state.myWechat;
    },
    getSex(state: any) {
      if (!state.sex) {
        state.sex = sessionStorage.getItem('sex');
      }
      return state.sex;
    }
  },
  actions: {},
};
