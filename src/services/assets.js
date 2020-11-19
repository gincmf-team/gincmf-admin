import { authRequest } from '@/utils/request';

export async function getAssets(params) {
    return authRequest('/api/admin/assets', {
        method: 'get',
        params,
    });
}

export async function deleteAssets(id) {
    return authRequest(`/api/admin/assets/${id}`, {
        method: 'DELETE',
    });
}
