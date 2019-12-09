import axios from 'axios';
import { getStore, setStore } from './storage';
import { router } from '../router/index';
import { Message } from 'iview';
import Cookies from 'js-cookie';


/** 统一请求路径前缀**/
export const basePath = '/baobao-admin';

// 超时设定
axios.defaults.timeout = 15000;

axios.interceptors.request.use(config => {
    return config;
}, err => {
    Message.error('请求超时');
    return Promise.resolve(err);
});

// http response 拦截器
axios.interceptors.response.use(response => {
    if (response.data instanceof Blob) {
        return response;
    }
    const data = response.data;
    // 根据返回的code值来做不同的处理(和后端约定)
    switch (data.code) {
        case 401:
            // 未登录 清除已登录状态
            Cookies.set('userInfo', '');
            setStore('accessToken', '');
            router.push('/login');
            break;
        case 403:
            // 没有权限
            if (data.message !== null) {
                Message.error(data.message);
            } else {
                Message.error("未知错误");
            }
            break;
        case 500:
            // 错误
            if (data.message !== null) {
                Message.error(data.message);
            } else {
                Message.error("未知错误");
            }
            break;
        case 505:
            //未设置操作服务器
            router.push('/baobao/sys/serverManage');
            break;
        default:
            return data;
    }

    return data;
}, (err) => {
    // 返回状态码不为200时候的错误处理
    Message.error(err.toString());
    return Promise.resolve(err);
});

export const getRequest = (url, params) => {
    let accessToken = getStore('accessToken');
    return axios({
        method: 'get',
        url: `${basePath}${url}`,
        params: params,
        headers: {
            'accessToken': accessToken
        }
    });
};

export const postRequest = (url, params) => {
    let accessToken = getStore("accessToken");
    return axios({
        method: 'post',
        url: `${basePath}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accessToken': accessToken
        }
    });
};

export const postReq = (url, params) => {
    let accessToken = getStore("accessToken");
    return axios({
        method: 'get',
        url: `${basePath}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accessToken': accessToken
        }
    });
};


export const putRequest = (url, params) => {
    let accessToken = getStore("accessToken");
    return axios({
        method: 'put',
        url: `${basePath}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accessToken': accessToken
        }
    });
};

export const deleteRequest = (url, params) => {
    let accessToken = ('accessToken');
    return axios({
        method: 'delete',
        url: `${basePath}${url}`,
        params: params,
        headers: {
            'accessToken': accessToken
        }
    });
};

export const uploadFileRequest = (url, params) => {
    let accessToken = getStore('accessToken');
    return axios({
        method: 'post',
        url: `${basePath}${url}`,
        params: params,
        headers: {
            'accessToken': accessToken
        }
    });
};


/** 游戏*/
export const getRequestWithGame = (url, params) => {
    let accessToken = getStore('accessToken');
    return axios({
        method: 'get',
        url: `${basePath}${url}`,
        params: params,
        headers: {
            'accessToken': accessToken
        }
    });
};

export const postRequestWithGame = (url, params) => {
    let accessToken = getStore("accessToken");
    return axios({
        method: 'post',
        url: `${basePath}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accessToken': accessToken
        }
    });
};



export const postRequestWithJson = (url,params) =>{
    let accessToken = getStore("accessToken");
    return axios({
        method: 'post',
        url: `${basePath}${url}`,
        data: params,
        transformRequest: [function (data, headers) {
            if (headers['Content-type'] === 'multipart/form-data') {
                return data;
            } else {
                return JSON.stringify(data);
            }
        }],
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'accessToken': accessToken
        }
    });
}

export const postRequestWithUpload = (url,params) =>{
    let accessToken = getStore("accessToken");
    return axios({
        method: 'post',
        url: `${basePath}${url}`,
        data: params,
        transformRequest: [function (data, headers) {
            return data;
        }],
        headers: {
            'Content-Type': 'multipart/form-data',
            'accessToken': accessToken
        }
    });
}

export const getRequestWithBlob = (url,params) =>{
    let ret = '';
    for (let it in params) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&';
    }
    let accessToken = getStore("accessToken");
    return axios({
        method: 'get',
        url: `${basePath}${url}?${ret}`,
        responseType: 'blob',
        timeout: 500000,
        headers: {
            'accessToken': accessToken,
        }
    });
}





