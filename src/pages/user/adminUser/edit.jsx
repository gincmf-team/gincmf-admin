import React, { useEffect, useState } from "react";
import { Card, Form, message } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { editData, getData } from "@/services/user";
import UserForm from "./components/form";
import "@/assets/css/style.css";

const Index = (props) => {
  const { id } = props.match.params;
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);

  const onSubmit = async () => {
    const formValues = form.getFieldsValue();
    window.console.log(formValues);

    const result = await editData(id, formValues);
    if (result.code === 1) {
      window.console.log(result.msg);
      message.success(result.msg);
    } else {
      message.error(result.msg);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData(id);
      form.setFieldsValue(result.data);
      setRoles(result.data.role);
    };

    fetchData();
  }, []);

  return (
    <PageHeaderWrapper>
      <Card style={{ minHeight: "300px" }}>
        <UserForm roles={roles} form={form} onSubmit={onSubmit} />
      </Card>
    </PageHeaderWrapper>
  );
};

export default Index;
