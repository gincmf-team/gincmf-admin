import React, { useState, useEffect, useReducer } from 'react';
import { Card, Form, Row, Col, Button, message } from 'antd';
import { history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { updatePortalCategory, getPortalCategory } from '@/services/portalCategory';
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

const Edit = (props) => {
    const { id } = props.match.params;
    const [form] = Form.useForm();
    const [cardActive, setCardActive] = useState('basic');

    const [formData, dispatch] = useReducer((state, action) => {
        const tempState = [...state];
        Object.keys(action).forEach((key) => {
            let val = action[key];
            if (key === 'parent_id') {
                val = action[key].toString();
            }
            tempState[key] = val;
        });
        return { ...state };
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

    // 初始化获取编辑内容
    useEffect(() => {
        const featchData = async () => {
            const result = await getPortalCategory(id);
            if (result.code === 1) {
                dispatch(result.data);
            }
        };

        featchData();
    }, []);

    const onFormChange = () => {
        dispatch(form.getFieldsValue());
    };

    const onSubmit = async () => {
        window.console.log('values', formData);

        const result = await updatePortalCategory(formData.id, formData);
        console.log('result', result);

        if (result.code === 1) {
            message.success(result.msg);
        } else {
            message.error(result.msg);
        }
    };

    const contentListNoTitle = {
        basic: <Basic onFormChange={onFormChange} formData={formData} form={form} />,
        seo: <Seo onFormChange={onFormChange} formData={formData} form={form} />,
        tpl: <Tpl onFormChange={onFormChange} formData={formData} form={form} />,
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
                    console.log(key);
                    setCardActive(key);
                }}
            >
                {contentListNoTitle[cardActive]}

                <Row>
                    <Col {...buttonWrapperCol}>
                        <Button onClick={onSubmit} type="primary">
                            更新
                        </Button>
                    </Col>
                </Row>
            </Card>
        </PageHeaderWrapper>
    );
};

export default Edit;
