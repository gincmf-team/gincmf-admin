import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
    namespace: 'login',
    state: {
        status: undefined,
    },
    effects: {
        *login({ payload }, { call, put }) {
            const response = yield call(fakeAccountLogin, payload);

            yield put({
                type: 'changeLoginStatus',
                payload: response,
            }); // Login successfully

            if (response.code !== 0) {
                // 保存当前用户token
                localStorage.setItem('token', JSON.stringify(response));
                const urlParams = new URL(window.location.href);

                // 配置常量
                // eslint-disable-next-line no-undef
                const globalPath = PUBLIC_PATH;

                const params = getPageQuery();
                let { redirect } = params;

                if (redirect) {
                    const redirectUrlParams = new URL(redirect);

                    if (redirectUrlParams.origin === urlParams.origin) {
                        redirect = redirect.substr(urlParams.origin.length);

                        if (redirect.match(/^\/.*#/)) {
                            redirect = redirect.substr(redirect.indexOf('#') + 1);
                        }

                        // 过滤二级目录路径
                        redirect = `/${redirect.substr(globalPath.length)}`;
                    } else {
                        window.location.href = '/';
                        return;
                    }
                }

                history.replace(redirect || '/');
            }
        },

        logout() {
            const { redirect } = getPageQuery(); // Note: There may be security issues, please note

            if (window.location.pathname !== '/user/login' && !redirect) {
                history.replace({
                    pathname: '/user/login',
                    search: stringify({
                        redirect: window.location.href,
                    }),
                });
            }
        },
    },
    reducers: {
        changeLoginStatus(state, { payload }) {
            setAuthority(payload.currentAuthority);
            return { ...state, status: payload.status, type: payload.type };
        },
    },
};
export default Model;
