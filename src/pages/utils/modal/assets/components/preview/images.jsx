import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import bg from "@/assets/images/preview-bg.png";
import "./style.css";

const Images = (props) => {
  const { visible, setVisible, data, index } = props;

  const [src, setSrc] = useState("");

  useEffect(() => {
    if (data.length > 0) {
      console.log(data);
      setSrc(data[index].prev_path);
    }
  }, [data, index]);

  return (
    <Modal
      visible={visible}
      centered
      footer={null}
      maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
      onCancel={() => setVisible(false)}
      wrapClassName="modal-image"
    >
      <div
        style={{
          width: "100%",
          maxHeight: "600px",
          overflow: "hidden",
          textAlign: "center",
          background: `url(${bg})`,
        }}
      >
        <img style={{ maxWidth: "100%", naxHeight: "100%" }} src={src} alt="" />
      </div>
    </Modal>
  );
};

export default Images;
