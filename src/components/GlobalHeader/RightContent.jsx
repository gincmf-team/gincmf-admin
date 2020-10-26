import { Tag, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React from "react";
import { connect } from "umi";
import Avatar from "./AvatarDropdown";
import Notice from "./NoticeIconView";
import styles from "./index.less";

const ENVTagColor = {
  dev: "orange",
  test: "green",
  pre: "#87d068",
};

const GlobalHeaderRight = (props) => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === "dark" && layout === "top") {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <span className={`${styles.action} ${styles.account}`}>
        <DeleteOutlined
          onClick={() => {
            sessionStorage.clear();
            message.success("清理成功！");
          }}
          style={{ fontSize: "15px" }}
        />
      </span>

      {/* <Notice /> */}
      <Avatar menu />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
    </div>
  );
};

export default connect(({ settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
