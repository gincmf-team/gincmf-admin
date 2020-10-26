import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, message } from "antd";
import AssetsModal from "./components/assetsModal/index";

const Index = (props, ref) => {
  const [visible, setVisible] = useState(false);

  const { onOk, multiple } = props;
  const [temp, setTemp] = useState({});
  const [type, setType] = useState("image");

  const modalVisible = (bool, t = "image") => {
    setType(t);
    setVisible(bool);
  };

  useImperativeHandle(ref, () => ({
    modalVisible: (bool, t) => {
      modalVisible(bool, t);
    },
  }));

  const modalOk = () => {
    if (temp.length === 0) {
      message.error("请至少先选择一张图片！");
      return;
    }
    if (onOk) {
      onOk(temp, type);
    }
    modalVisible(false);
  };

  const handleOk = (fileList) => {
    setTemp(fileList);
  };

  return (
    <Modal
      visible={visible}
      onOk={modalOk}
      onCancel={() => {
        setVisible(false);
      }}
      width="50%"
    >
      <AssetsModal
        multiple={multiple}
        type={type}
        visible={visible}
        onOk={handleOk}
      />
    </Modal>
  );
};

export default forwardRef(Index);
