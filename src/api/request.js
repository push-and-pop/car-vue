// import axios from 'axios';

// const api = axios.create({
//     // process.env.NODE_ENV === 'development' 来判断是否开发环境
//     // easy-mock服务挂了，暂时不使用了
//     // baseURL: 'apis://www.easy-mock.com/mock/592501a391470c0ac1fab128',
//     timeout: 5000
// });

// api.interceptors.request.use(
//     config => {
//         if (config.method == "POST") {
//             //todo
//         }
//         return config;
//     },
//     error => {
//         console.log(error);
//         return Promise.reject();
//     }
// );

// api.interceptors.response.use(
//     response => {
//         if (response.status === 200) {
//             return response.data;
//         } else {
//             Promise.reject();
//         }
//     },
//     error => {
//         console.log(error);
//         return Promise.reject();
//     }
// );


// export default api;


import axios from "axios";
//import qs from "qs";

// axios.defaults.baseURL = ''  //正式
axios.defaults.baseURL = 'http://localhost:9090' //测试

//post请求头
axios.defaults.headers.post["Content-Type"] = 'application/x-www-form-urlencoded';
//允许跨域携带cookie信息
axios.defaults.withCredentials = true;
//设置超时
axios.defaults.timeout = 15000;

axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        return Promise.resolve(response)
        // if (response.status == 200) {
        //     return Promise.resolve(response);
        // } else {
        //     return Promise.reject(response);
        // }
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
);

/**
     * @param {String} url 
     * @param {Object} data 
     * @returns Promise
     */
export function post(url, data) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url,
            data: data,
        })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                console.log(err)
                reject(err)
            });
    })
};

export function get(url, data) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url,
            params: data,
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
};