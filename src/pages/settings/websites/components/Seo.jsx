import React, { useEffect } from "react";
import { Form, Input, Button, Row, Col } from "antd";

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

const { TextArea } = Input;

const Seo = ({ formData, handleSubmit }) => {
  const submit = (values) => {
    // 提交siteInfo的数据
    handleSubmit(values);
  };

  const [form] = Form.useForm();

  useEffect(() => {
    const temp = form.getFieldsValue();
    Object.keys(temp).forEach((key) => {
      temp[key] = formData[key] === undefined ? "" : formData[key];
    });
    form.setFieldsValue(temp);
  }, [formData]);

  return (
    <Row>
      <Col xs={24} md={12}>
        <Form onFinish={submit} form={form} {...formItemLayout}>
          <Form.Item label="SEO标题" name="site_seo_title" required>
            <Input placeholder="" />
          </Form.Item>

          <Form.Item label="SEO关键字" name="site_seo_description" required>
            <Input placeholder="" />
          </Form.Item>

          <Form.Item label="SEO描述" name="site_seo_keywords" required>
            <TextArea rows={4} />
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

export default Seo;
