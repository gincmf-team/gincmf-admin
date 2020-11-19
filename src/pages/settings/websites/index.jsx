import React, { useState, useEffect, useReducer } from "react";
import { Card, message, Spin } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { getSettings, setSettings } from "@/services/settings";
import SiteInfo from "./components/SiteInfo";
import Seo from "./components/Seo";
import Other from "./components/Other";

const tabList = [
  {
    key: "tab1",
    tab: "网站信息",
  },
  {
    key: "tab2",
    tab: "SEO三要素",
  },
  {
    key: "tab3",
    tab: "其他设置",
  },
];

const Websites = () => {
  const [key, setKey] = useState("tab1");

  const [spinning, setSpinning] = useState(true);

  const [data, dispatch] = useReducer((state, action) => {
    return { ...state, status: action.status, ...action.data };
  }, {});

  useEffect(() => {
    getSettings().then((res) => {
      if (res.code === 1) {
        dispatch({
          status: "init",
          data: JSON.parse(res.data.option_value),
        });
      } else {
        message.error(res.msg);
      }
      setSpinning(false);
    });
  }, []);

  useEffect(() => {
    if (data.status === "submit") {
      const params = { ...data };

      params.open_registration = params.open_registration ? 1 : 0;
      delete params.status;

      setSettings(params).then((res) => {
        if (res.code === 1) {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
      });
    }
  }, [data]);

  function onTabChange(tab) {
    setKey(tab);
  }

  function handleSubmit(values) {
    dispatch({ status: "submit", data: values });
  }

  const contentList = {
    tab1: <SiteInfo formData={data} handleSubmit={handleSubmit} />,
    tab2: <Seo formData={data} handleSubmit={handleSubmit} />,
    tab3: <Other formData={data} handleSubmit={handleSubmit} />,
  };

  return (
    <Spin tip="Loading..." spinning={spinning}>
      <PageHeaderWrapper>
        <Card
          tabList={tabList}
          activeTabKey={key}
          onTabChange={(tab) => {
            onTabChange(tab);
          }}
        >
          {contentList[key]}
        </Card>
      </PageHeaderWrapper>
    </Spin>
  );
};

export default Websites;
