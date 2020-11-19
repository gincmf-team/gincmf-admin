import React from 'react';
import { Card, Form, message } from 'antd';
import { history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { addData } from '@/services/user';
import UserForm from './components/form';
import '@/assets/css/style.css';

const Index = () => {
    const [form] = Form.useForm();

    const onSubmit = async () => {
        const formValues = form.getFieldsValue();
        window.console.log(formValues);
        const result = await addData(formValues);
        if (result.code === 1) {
            window.console.log(result.msg);
            message.success(result.msg);
            history.push(`/user_manage/admin_user/edit/${result.data.id}`);
        } else {
            message.error(result.msg);
        }
    };

    return (
        <PageHeaderWrapper>
            <Card style={{ minHeight: '300px' }}>
                <UserForm form={form} onSubmit={onSubmit} />
            </Card>
        </PageHeaderWrapper>
    );
};

export default Index;
