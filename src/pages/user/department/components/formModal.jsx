import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Modal, Form, Input, message, Select, Radio } from "antd";
import { history } from "umi";
import { addData, getData, editData } from "@/services/department";

const { Option } = Select;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const FormModal = (props, ref) => {
  const { formOk } = props;
  const [editId, setEditId] = useState(0);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    open: (id = 0) => {
      setEditId(id);
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  useEffect(() => {
    const featchData = async () => {
      const result = await getData(editId);
      if (result.code === 1) {
        const temp = result.data;
        form.setFieldsValue(temp);
      } else {
        message.error(result.error);
      }
    };

    if (editId !== 0) {
      featchData();
    }
  }, [editId]);

  const onCancel = () => {
    setEditId(0);
    form.resetFields();
    setVisible(false);
  };

  const onOk = async () => {
    const param = form.getFieldsValue();
    let result = [];
    if (editId === 0) {
      result = await addData(param);
    } else {
      result = await editData(editId, param);
    }

    if (result.code === 1) {
      message.success(result.msg);
      onCancel();
      if (formOk) {
        formOk(result);
      }
    } else {
      message.error(result.msg);
    }
  };

  return (
    <Modal
      title="添加项目"
      centered
      visible={visible}
      destroyOnClose
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form form={form} preserve={false} {...layout}>
        <Form.Item
          label="部门名称"
          name="level"
          initialValue={0}
          rules={[{ required: true, message: "部门名称不能为空!" }]}
        >
          <Select>
            <Option value={0}>请选择</Option>
            <Option value={1}>一级部门</Option>
            <Option value={2}>二级部门</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="部门名称"
          name="name"
          rules={[{ required: true, message: "部门名称不能为空!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="部门名称" name="remark">
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="状态" name="status" initialValue={1}>
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default forwardRef(FormModal);
