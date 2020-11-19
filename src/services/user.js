import { request, authRequest } from '@/utils/request';

export async function query() {
    return request('/api/users');
}
export async function queryCurrent() {
    return authRequest('/api/currentUser');
}
export async function queryNotices() {
    return authRequest('/api/admin/notices');
}

export async function getDatas(params) {
    return authRequest('/api/admin/user', {
        method: 'GET',
        params,
    });
}

export async function getData(id, params) {
    return authRequest(`/api/admin/user/${id}`, {
        method: 'GET',
        params,
    });
}

export async function addData(params) {
    return authRequest('/api/admin/user', {
        method: 'POST',
        data: params,
    });
}

export async function editData(id, params) {
    return authRequest(`/api/admin/user/${id}`, {
        method: 'POST',
        data: params,
    });
}

export async function editAccount(id, params) {
    return authRequest(`/api/admin/account/${id}`, {
        method: 'POST',
        data: params,
    });
}
