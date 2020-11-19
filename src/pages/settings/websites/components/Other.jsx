import React, { useEffect } from "react";
import { Form, Input, Switch, Button, Row, Col } from "antd";

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

const Other = ({ formData, handleSubmit }) => {
  const submit = (values) => {
    window.console.log(values);
    // 提交other的数据
    handleSubmit(values);
  };

  const [form] = Form.useForm();

  useEffect(() => {
    const temp = form.getFieldsValue();
    Object.keys(temp).forEach((key) => {
      temp[key] = formData[key] === undefined ? "" : formData[key];
    });

    if (temp.open_registration) {
      temp.open_registration = 1;
    } else {
      temp.open_registration = 0;
    }

    form.setFieldsValue(temp);
  }, [formData]);

  return (
    <Row>
      <Col span={12}>
        <Form onFinish={submit} form={form} {...formItemLayout}>
          <Form.Item
            name="open_registration"
            label="开启登录注册"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item label="静态CDN地址">
            <Input />
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

export default Other;
