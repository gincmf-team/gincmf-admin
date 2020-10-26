import React, { useEffect, useState } from "react";

import { Form, Input, Checkbox, Button } from "antd";
import { getRoles } from "@/services/role";
import { history } from "umi";

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

const UserForm = ({ form, onSubmit, roles }) => {
  const [radioData, setRadioData] = useState([]);

  useEffect(() => {
    async function featchData() {
      const result = await getRoles({ current: 1, pageSize: 999 });

      if (result.code === 1) {
        const { data } = result.data;
        const options = [];

        data.forEach((v) => {
          options.push({ label: v.name, value: v.id });
        });

        setRadioData(options);
      }
    }
    featchData();
  }, []);

  function onChange(checkedValues) {
    window.console.log("checked = ", checkedValues);
  }

  return (
    <Form form={form} style={{ maxWidth: "500px" }} {...layout} name="basic">
      <Form.Item
        label="用户名"
        name="user_login"
        rules={[{ required: true, message: "用户名称不能为空!" }]}
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
            type: "email",
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

      <Form.Item
        name="role_ids"
        label="角色"
        value={roles}
        rules={[
          { required: true, message: "请至少选择一个角色！", type: "array" },
        ]}
      >
        <Checkbox.Group options={radioData} onChange={onChange} />
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
