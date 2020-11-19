import React, { useState, useReducer } from 'react';
import { Card, Form, Row, Col, Button, message } from 'antd';
import { history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { addPortalCategory } from '@/services/portalCategory';
import Basic from './components/Basic';
import Seo from './components/Seo';
import Tpl from './components/Tpl';

const buttonWrapperCol = {
    xs: {
        offset: 0,
    },
    md: {
        offset: 2,
    },
};

const Add = (props) => {
    const { pid } = props.history.location.query;
    const [form] = Form.useForm();
    const [cardActive, setCardActive] = useState('basic');

    const [formData, dispatch] = useReducer((state, action) => {
        const temState = [...state];
        Object.keys(action).forEach((key) => {
            temState[key] = action[key];
        });

        return state;
    }, {});

    const tabListNoTitle = [
        {
            key: 'basic',
            tab: '基本设置',
        },
        {
            key: 'seo',
            tab: 'SEO设置',
        },
        {
            key: 'tpl',
            tab: '模板设置',
        },
    ];

    // 初始化获取层级关系

    const onFormChange = () => {
        dispatch(form.getFieldsValue());
    };

    const onSubmit = async () => {
        window.console.log('values', formData);

        const result = await addPortalCategory(formData);

        if (result.code === 1) {
            message.success(result.msg);
            history.push(`/portal/category/edit/${result.data.id}`);
        } else {
            message.error(result.msg);
        }
    };

    const contentListNoTitle = {
        basic: <Basic onFormChange={onFormChange} pid={pid} form={form} />,
        seo: <Seo onFormChange={onFormChange} form={form} />,
        tpl: <Tpl onFormChange={onFormChange} form={form} />,
    };

    return (
        <PageHeaderWrapper
            onBack={() => {
                history.push('/portal/category');
            }}
        >
            <Card
                tabList={tabListNoTitle}
                activeTabKey={cardActive}
                onTabChange={(key) => {
                    setCardActive(key);
                }}
            >
                {contentListNoTitle[cardActive]}

                <Row>
                    <Col {...buttonWrapperCol}>
                        <Button onClick={onSubmit} type="primary">
                            保存
                        </Button>
                    </Col>
                </Row>
            </Card>
        </PageHeaderWrapper>
    );
};

export default Add;
