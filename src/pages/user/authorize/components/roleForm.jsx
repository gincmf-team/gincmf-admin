import React from "react";

import { Form, Input } from "antd";

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

const roleForm = ({ form }) => {
  return (
    <Form form={form} style={{ maxWidth: "500px" }} {...layout} name="basic">
      <Form.Item
        label="角色名称"
        name="name"
        rules={[{ required: true, message: "角色名称不能为空!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="角色描述" name="remark">
        <Input.TextArea rows={4} />
      </Form.Item>
    </Form>
  );
};

export default roleForm;
