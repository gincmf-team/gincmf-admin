/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';

import { stringify } from 'querystring';

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = (error) => {
    const { response } = error;

    if (response && response.status) {
        const errorText = codeMessage[response.status] || response.statusText;
        const { status, url } = response;
        notification.error({
            message: `请求错误 ${status}: ${url}`,
            description: errorText,
        });
    } else if (!response) {
        notification.error({
            description: '您的网络发生异常，无法连接服务器',
            message: '网络异常',
        });
    }

    return response;
};
/**
 * 配置request请求时的默认参数
 */

export const request = extend({
    errorHandler,
    // 默认错误处理
    credentials: 'include', // 默认请求是否带上cookie
    requestType: 'form',
    noToken: true,
});

export async function getRefresh(token) {
    return request(
        `/api/oauth/refresh?grant_type=refresh_token&refresh_token=${token.refresh_token}`,
        {
            method: 'post',
        }
    );
}

/**
 * 配置oAuth请求时的默认参数
 */
export const authRequest = extend({
    errorHandler,
    // 默认错误处理
    credentials: 'include', // 默认请求是否带上cookie
    requestType: 'form',
});

authRequest.interceptors.request.use(async (url, options) => {
    const temp = { ...options };
    if (!temp.noToken) {
        let token = localStorage.getItem('token');
        if (token) {
            token = JSON.parse(token);
            temp.headers = {
                Authorization: `Bearer ${token.access_token}`,
            };
        }
    }

    return {
        url,
        options: {
            ...temp,
        },
    };
});

let refreshFlag = true;
authRequest.interceptors.response.use(async (response) => {
    const data = await response.clone().json();
    if (data && data.code === 400) {
        // 检查token
        const redirect = window.location.href;
        const queryString = stringify({
            redirect,
        });

        let token = localStorage.getItem('token');

        if (token) {
            token = JSON.parse(token);

            if (token.expiry) {
                const current = new Date().getTime();
                const expiry = new Date(token.expiry).getTime();
                // 如果失效获取refresh token
                if (current >= expiry) {
                    window.console.log('失效了');
                    // 获取新token
                    if (refreshFlag) {
                        refreshFlag = false;
                        const refresh = await getRefresh(token);

                        if (refresh.error) {
                            localStorage.removeItem('token');
                        } else {
                            localStorage.setItem('token', JSON.stringify(refresh));
                            window.location.href = redirect;
                            return false;
                        }
                    }
                }
            }
        }

        window.location.href = `/user/login?${queryString}`;
    }
    return response;
});
