import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
    onMenuClick = (event) => {
        const { key } = event;

        if (key === 'logout') {
            const { dispatch } = this.props;

            if (dispatch) {
                dispatch({
                    type: 'login/logout',
                });
            }

            return;
        }

        history.push(`/account/${key}`);
    };

    getAvatar = (url) => {
        let avatar = url;

        if (url === '') {
            avatar =
                'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
        }

        return avatar;
    };

    render() {
        const {
            currentUser = {
                avatar: '',
                name: '',
            },
            menu,
        } = this.props;
        const menuHeaderDropdown = (
            <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
                {menu && (
                    <Menu.Item key="settings">
                        <SettingOutlined />
                        个人设置
                    </Menu.Item>
                )}
                {menu && <Menu.Divider />}

                <Menu.Item key="logout">
                    <LogoutOutlined />
                    退出登录
                </Menu.Item>
            </Menu>
        );
        return currentUser && currentUser.user_login ? (
            <HeaderDropdown overlay={menuHeaderDropdown}>
                <span className={`${styles.action} ${styles.account}`}>
                    <Avatar
                        size="small"
                        className={styles.avatar}
                        src={this.getAvatar(currentUser.avatar)}
                        alt="avatar"
                    />
                    <span className={`${styles.name} anticon`}>{currentUser.name}</span>
                </span>
            </HeaderDropdown>
        ) : (
            <span className={`${styles.action} ${styles.account}`}>
                <Spin
                    size="small"
                    style={{
                        marginLeft: 8,
                        marginRight: 8,
                    }}
                />
            </span>
        );
    }
}

export default connect(({ user }) => ({
    currentUser: user.currentUser,
}))(AvatarDropdown);
