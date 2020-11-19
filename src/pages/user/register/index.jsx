import { Form, Input, Row, Col, Button, message, Checkbox } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'umi';
import { MobileTwoTone, LockTwoTone, MailTwoTone } from '@ant-design/icons';
import { getCaptcha } from '@/services/captcha.js';
import { register } from './service.js';
import styles from './style.less';

const Index = () => {
    const [read, setRead] = useState(false);
    const [count, setCount] = useState(120);
    const [timing, setTiming] = useState(false); // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props tabUtil

    const onGetCaptcha = useCallback(async (mobile) => {
        const result = await getCaptcha({ mobile });

        if (result.code === 0) {
            message.error(result.msg);
            return;
        }

        message.success(result.msg);
        setTiming(true);
    }, []);

    const onFinish = async (values) => {
        if (!read) {
            message.error('请先同意注册协议');
            return;
        }

        const result = await register(values);

        if (result.code === 0) {
            message.error(result.msg);
            return;
        }
        message.success(result.msg);
    };

    useEffect(() => {
        let interval = 0;
        if (timing) {
            interval = window.setInterval(() => {
                setCount((preSecond) => {
                    if (preSecond <= 1) {
                        setTiming(false);
                        clearInterval(interval); // 重置秒数
                        return 120;
                    }
                    return preSecond - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timing]);

    return (
        <div className={styles.main}>
            <h3>注册</h3>

            <Form onFinish={onFinish}>
                <Form.Item name="mobile" rules={[{ required: true, message: '请输入手机号！' }]}>
                    <Input
                        size="large"
                        prefix={<MobileTwoTone className={styles.prefixIcon} />}
                        placeholder="请输入手机号"
                    />
                </Form.Item>

                <Form.Item shouldUpdate noStyle>
                    {({ getFieldValue }) => (
                        <Row gutter={0}>
                            <Col span={16}>
                                <Form.Item
                                    name="sms_code"
                                    rules={[{ required: true, message: '请输入手机验证码！' }]}
                                >
                                    <Input
                                        prefix={<MailTwoTone className={styles.prefixIcon} />}
                                        size="large"
                                        placeholder="请输入手机验证码"
                                    />
                                </Form.Item>
                            </Col>
                            <Col style={{ textAlign: 'right' }} span={8}>
                                <Button
                                    disabled={timing}
                                    className={styles.getCaptcha}
                                    size="large"
                                    onClick={() => {
                                        const value = getFieldValue('mobile');
                                        if (value === undefined || value === '') {
                                            message.error('手机号不能为空！');
                                        } else {
                                            onGetCaptcha(value);
                                        }
                                    }}
                                >
                                    {timing ? `${count} 秒` : '获取验证码'}
                                </Button>
                            </Col>
                        </Row>
                    )}
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入要设置的密码！' }]}
                >
                    <Input.Password
                        size="large"
                        prefix={<LockTwoTone className={styles.prefixIcon} />}
                        placeholder="请输入要设置的密码"
                    />
                </Form.Item>

                <Form.Item
                    name="repass"
                    rules={[{ required: true, message: '请确认您设置的密码！' }]}
                >
                    <Input.Password
                        size="large"
                        prefix={<LockTwoTone className={styles.prefixIcon} />}
                        placeholder="请确认您设置的密码"
                    />
                </Form.Item>

                <div>
                    <Checkbox checked={read} onChange={(e) => setRead(e.target.checked)}>
                        我已经同意<a>《注册协议》</a>
                    </Checkbox>
                </div>

                <Form.Item>
                    <Button size="large" type="primary" htmlType="submit" className={styles.submit}>
                        立即注册
                    </Button>
                </Form.Item>

                <div className={styles.other}>
                    <Link className={styles.register} to="/user/login">
                        使用已有账号登录
                    </Link>
                </div>
            </Form>
        </div>
    );
};

export default Index;
