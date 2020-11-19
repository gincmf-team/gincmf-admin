import React from 'react';

import { Form, Input, Button } from 'antd';
import { history } from 'umi';

const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 16,
    },
};

const UserForm = ({ form, onSubmit }) => {
    return (
        <Form form={form} style={{ maxWidth: '500px' }} {...layout} name="basic">
            <Form.Item
                label="用户名"
                name="user_login"
                rules={[{ required: true, message: '用户名称不能为空!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item label="密码" name="user_pass">
                <Input.Password placeholder="******" />
            </Form.Item>

            <Form.Item
                label="邮箱"
                name="user_email"
                rules={[
                    {
                        type: 'email',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item label="手机号" name="mobile">
                <Input />
            </Form.Item>

            <Form.Item label="真实姓名" name="user_realname">
                <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4 }}>
                <Button
                    onClick={() => {
                        if (onSubmit) {
                            onSubmit();
                        }
                    }}
                    className="mr-1"
                    type="primary"
                >
                    确定
                </Button>
                <Button onClick={() => history.goBack()}>返回</Button>
            </Form.Item>
        </Form>
    );
};

export default UserForm;
