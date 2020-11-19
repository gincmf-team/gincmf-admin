import { queryCurrent, query as queryUsers } from '@/services/user';

const UserModel = {
    namespace: 'user',
    state: {
        currentUser: {},
    },
    effects: {
        *fetch(_, { call, put }) {
            const response = yield call(queryUsers);
            yield put({
                type: 'save',
                payload: response,
            });
        },

        *fetchCurrent(_, { call, put }) {
            const response = yield call(queryCurrent);
            yield put({
                type: 'saveCurrentUser',
                payload: response,
            });
        },
    },
    reducers: {
        saveCurrentUser(state, action) {
            let data = {};
            if (action.payload.code === 1) {
                ({ data } = action.payload);
            }
            return { ...state, currentUser: data || {} };
        },

        changeNotifyCount(
            state = {
                currentUser: {},
            },
            action
        ) {
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    notifyCount: action.payload.totalCount,
                    unreadCount: action.payload.unreadCount,
                },
            };
        },
    },
};
export default UserModel;
