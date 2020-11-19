import { request } from '@/utils/request';

export async function fakeAccountLogin(params) {
    return request('/api/oauth/token', {
        method: 'POST',
        data: params,
    });
}

export async function tenantLogin(params) {
    return request('/api/tenant/token', {
        method: 'POST',
        data: params,
    });
}

export async function getFakeCaptcha(mobile) {
    return request(`/api/login/captcha?mobile=${mobile}`);
}
