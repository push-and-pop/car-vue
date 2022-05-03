import { createStore } from 'vuex'

export default createStore({
    state: {
        tagsList: [],
        collapse: false,
        userInfo: {},
        token: localStorage.getItem('car_token') ? localStorage.getItem('car_token') : ''
    },
    mutations: {
        delTagsItem(state, data) {
            state
                .tagsList
                .splice(data.index, 1);
        },
        setTagsItem(state, data) {
            state
                .tagsList
                .push(data)
        },
        clearTags(state) {
            state.tagsList = []
        },
        closeTagsOther(state, data) {
            state.tagsList = data;
        },
        closeCurrentTag(state, data) {
            for (let i = 0, len = state.tagsList.length; i < len; i++) {
                const item = state.tagsList[i];
                if (item.path === data.$route.fullPath) {
                    if (i < len - 1) {
                        data
                            .$router
                            .push(state.tagsList[i + 1].path);
                    } else if (i > 0) {
                        data
                            .$router
                            .push(state.tagsList[i - 1].path);
                    } else {
                        data
                            .$router
                            .push("/");
                    }
                    state
                        .tagsList
                        .splice(i, 1);
                    break;
                }
            }
        },
        // 侧边栏折叠
        handleCollapse(state, data) {
            state.collapse = data;
        },
        setUserInfo(state, data) {
            state.userInfo = data
            console.log(state.userInfo)
        },
        changeLogin(state, token) {
            state.token = token;
            localStorage.setItem('car_token', token);
        },
        loginOut(state) {
            state.token = null;
            localStorage.removeItem('car_token');
        },
        enterPark(state, data) {
            state.userInfo.ParkId = data;
            console.log("parkid: ", state.userInfo.ParkId)
        },
        addMoney(state,data){
            state.userInfo.Account+=data
        },
        subMoney(state,data){
            state.userInfo.Account-=data
        },
        setMoney(state,data){
            state.userInfo.Account=data
        },
    
    },
    actions: {},
    modules: {}
})