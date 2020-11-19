import React, { useEffect } from 'react';
import { Card, Form, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import { editAccount, getData } from '@/services/user';
import UserForm from './components/UserForm';
import '@/assets/css/style.css';

const Index = (props) => {
    const { currentUser } = props; // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const [form] = Form.useForm();

    const onSubmit = async () => {
        const formValues = form.getFieldsValue();
        window.console.log(formValues);

        const result = await editAccount(currentUser.id, formValues);
        if (result.code === 1) {
            window.console.log(result.msg);
            message.success(result.msg);
        } else {
            message.error(result.msg);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await getData(currentUser.id);
            form.setFieldsValue(result.data);
        };

        fetchData();
    }, []);

    return (
        <PageHeaderWrapper>
            <Card style={{ minHeight: '300px' }}>
                <UserForm form={form} onSubmit={onSubmit} />
            </Card>
        </PageHeaderWrapper>
    );
};

export default connect(({ user, loading }) => ({
    currentUser: user.currentUser,
    loading: loading.models.user,
}))(Index);
