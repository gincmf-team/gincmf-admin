import React, { useState, useEffect } from "react";
import { Tree, Card, Form, Button, message } from "antd";
import { history } from "umi";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { getAuthorize } from "@/services/authorize";
import { getData, editData } from "@/services/authAccess";
import RoleForm from "./components/RoleForm";
import "@/assets/css/style.css";

const Index = (props) => {
  const roleId = props.match.params.id;

  const [treeData, setTreeData] = useState([]);

  const [values, setValues] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    async function featchData() {
      const result = await getAuthorize(roleId);
      if (result.code === 1) {
        window.console.log(result)
        setTreeData(result.data);
      }

      const accResult = await getData(roleId);
      if (accResult.code === 1) {
        window.console.log(accResult);
        form.setFieldsValue({
          name: accResult.data.name,
          remark: accResult.data.remark,
        });

        setValues(accResult.data.access);
      }
    }

    featchData();
  }, []);

  const onSelect = (selectedKeys, info) => {
    window.console.log("selected", selectedKeys, info);
  };

  const onCheck = (checkedKeys, info) => {
    window.console.log("onCheck", checkedKeys, info);
    setValues(checkedKeys);
  };

  // 提交
  const onSubmit = async () => {
    const formValues = form.getFieldsValue();
    window.console.log(formValues, values);

    const result = await editData(roleId, {
      ...formValues,
      role_access: values,
    });

    window.console.log(result);

    if (result.code === 1) {
      message.success(result.msg);
    }
  };

  return (
    <PageHeaderWrapper>
      <Card style={{ minHeight: "300px" }}>
        <RoleForm form={form} />

        <Tree
          className="mb-3"
          checkable
          checkedKeys={values}
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={treeData}
        />

        <Button
          onClick={() => {
            onSubmit();
          }}
          className="mr-1"
          type="primary"
        >
          确定
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </Card>
    </PageHeaderWrapper>
  );
};

export default Index;
