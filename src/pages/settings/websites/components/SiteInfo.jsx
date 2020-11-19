import React, { useEffect } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};

const buttonWrapperCol = {
    xs: {
        offset: 0,
    },
    md: {
        span: 16,
        offset: 4,
    },
};

const SiteInfo = ({ formData, handleSubmit }) => {
    const submit = (values) => {
        // 提交siteInfo的数据
        handleSubmit(values);
    };

    const [form] = Form.useForm();

    useEffect(() => {
        const temp = form.getFieldsValue();
        Object.keys(temp).forEach((key) => {
            temp[key] = formData[key] === undefined ? '' : formData[key];
        });
        form.setFieldsValue(temp);
    }, [formData]);

    return (
        <Row>
            <Col xs={24} md={12}>
                <Form {...formItemLayout} form={form} onFinish={submit}>
                    <Form.Item
                        label="网站名称"
                        name="site_name"
                        rules={[
                            {
                                required: true,
                                message: '网站名称不能为空!',
                            },
                        ]}
                    >
                        <Input placeholder="" />
                    </Form.Item>

                    <Form.Item label="后台入口加密" name="admin_password">
                        <Input placeholder="" />
                    </Form.Item>

                    <Form.Item label="ICP备" name="site_icp">
                        <Input placeholder="" />
                    </Form.Item>
                    <Form.Item label="公网安备" name="site_gwa">
                        <Input placeholder="" />
                    </Form.Item>
                    <Form.Item
                        label="站长邮箱"
                        name="site_admin_email"
                        rules={[
                            {
                                pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                                message: '邮箱格式不正确!',
                            },
                            {
                                max: 50,
                                message: '邮箱长度过长!',
                            },
                        ]}
                    >
                        <Input placeholder="" />
                    </Form.Item>
                    <Form.Item label="统计代码" name="site_analytics">
                        <Input.TextArea placeholder="" />
                    </Form.Item>
                    <Form.Item wrapperCol={buttonWrapperCol}>
                        <Button htmlType="submit" type="primary">
                            保存
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default SiteInfo;
