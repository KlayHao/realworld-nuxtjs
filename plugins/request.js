import axios from 'axios';

export const request = axios.create({
    baseURL: 'https://conduit.productionready.io/'
})

// 通过插件机制， 获取app 上下文
// 插件导出函数，必须是默认成员
export default ({store}) => {
    // 请求拦截器
    // 任何请求都要经过拦截器
    // 可以在请求拦截器中，处理一些公共处理，
    request.interceptors.request.use(function (config) {
        // console.log("interceptors")
        const {user} = store.state;
        if (user && user.token) {
            config.headers.Authorization = `Token ${user.token}`;
        }
        return config;
    }, function (err) {
        // 如果请求失败，请求还没发出去
        return Promise.reject(err);
    })

    // 响应拦截器
}